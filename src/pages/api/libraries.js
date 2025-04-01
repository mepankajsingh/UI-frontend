import { supabase } from '../../lib/supabase';

export async function GET({ request }) {
  try {
    // Parse URL and query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const itemsPerPage = parseInt(url.searchParams.get('limit') || '20', 10);
    const sortBy = url.searchParams.get('sort') || 'name';
    const framework = url.searchParams.get('framework') || '';
    const theme = url.searchParams.get('theme') || '';
    const pricing = url.searchParams.get('pricing') || '';
    const stars = url.searchParams.get('stars') || '';
    
    // Build query
    let query = supabase
      .from('libraries')
      .select(`
        *,
        frameworks:library_frameworks(
          is_primary,
          framework_id(id, name, slug)
        ),
        tags:library_tags(tag_id(id, name, slug)),
        labels:library_labels(
          label_id(id, name, color, text_color)
        )
      `, { count: 'exact' });
    
    // Apply filters
    if (framework && framework !== 'all') {
      query = query.contains('frameworks.framework_id.slug', [framework]);
    }
    
    if (theme && theme !== 'all') {
      query = query.eq('styling', theme);
    }
    
    if (pricing && pricing !== 'all') {
      query = query.eq('pricing', pricing);
    }
    
    if (stars && stars !== 'all') {
      let minStars = 0;
      switch (stars) {
        case '1000+':
          minStars = 1000;
          break;
        case '5000+':
          minStars = 5000;
          break;
        case '10000+':
          minStars = 10000;
          break;
      }
      query = query.gte('github_stars', minStars);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'latest':
        query = query.order('last_update', { ascending: false });
        break;
      case 'components':
        query = query.order('total_components', { ascending: false });
        break;
      case 'downloads':
        query = query.order('npm_downloads', { ascending: false });
        break;
      case 'popular':
        query = query.order('github_stars', { ascending: false });
        break;
      default:
        query = query.order('name');
    }
    
    // Apply pagination
    const from = (page - 1) * itemsPerPage;
    const to = page * itemsPerPage - 1;
    query = query.range(from, to);
    
    // Execute query
    const { data: libraries, count, error } = await query;
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      libraries, 
      totalCount: count,
      page,
      totalPages: Math.ceil(count / itemsPerPage)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
