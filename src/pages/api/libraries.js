import { supabase } from '../../lib/supabase';

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const start = parseInt(url.searchParams.get('start') || '0');
    const end = parseInt(url.searchParams.get('end') || '19');
    const sortBy = url.searchParams.get('sortBy') || 'popular';
    
    // Determine sort field and direction
    let sortField = 'github_stars';
    let sortDirection = 'desc';
    
    switch (sortBy) {
      case 'latest':
        sortField = 'last_update';
        break;
      case 'components':
        sortField = 'total_components';
        break;
      case 'downloads':
        sortField = 'npm_downloads';
        break;
      case 'name':
        sortField = 'name';
        sortDirection = 'asc';
        break;
      case 'popular':
      default:
        sortField = 'github_stars';
        break;
    }
    
    // Get libraries with pagination
    const { data: libraries, count: totalLibraries, error } = await supabase
      .from('libraries')
      .

select(`
        *,
        frameworks:library_frameworks(
          is_primary,
          framework_id(id, name, slug)
        ),
        tags:library_tags(tag_id(id, name, slug)),
        labels:library_labels(
          label_id(id, name, color, text_color)
        )
      `, { count: 'exact' })
      .order(sortField, { ascending: sortDirection === 'asc' })
      .range(start, end);
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify({ 
      libraries: libraries || [],
      total: totalLibraries || 0
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
