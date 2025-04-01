import { supabase } from '../../lib/supabase';

export async function get({ request }) {
  try {
    const url = new URL(request.url);
    const frameworkSlug = url.searchParams.get('frameworkSlug');
    const start = parseInt(url.searchParams.get('start') || '0');
    const end = parseInt(url.searchParams.get('end') || '19');
    
    if (!frameworkSlug) {
      return new Response(JSON.stringify({ 
        error: 'Framework slug is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // First get the framework ID from the slug
    const { data: framework, error: frameworkError } = await supabase
      .from('frameworks')
      .select('id')
      .eq('slug', frameworkSlug)
      .single();
    
    if (frameworkError || !framework) {
      return new Response(JSON.stringify({ 
        error: 'Framework not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Then get libraries for this framework with pagination
    const { data: libraryRelations, error: librariesError } = await supabase
      .from('library_frameworks')
      .select(`
        library_id,
        is_primary,
        libraries:library_id(
          *,
          frameworks:library_frameworks(
            is_primary,
            framework_id(id, name, slug)
          ),
          tags:library_tags(tag_id(id, name, slug)),
          labels:library_labels(
            label_id(id, name, color, text_color)
          )
        )
      `)
      .eq('framework_id', framework.id)
      .range(start, end);
    
    if (librariesError) {
      return new Response(JSON.stringify({ 
        error: 'Error fetching libraries' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Extract the actual library objects and filter out any nulls
    const libraries = libraryRelations
      ? libraryRelations
          .map(item => item.libraries)
          .filter(library => library !== null)
      : [];
    
    return new Response(JSON.stringify({ 
      libraries 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
