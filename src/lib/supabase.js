import { createClient } from '@supabase/supabase-js';
import { optimizedFetch, clearCache } from './supabase-sync-fix.js';

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Optimized function to fetch libraries with caching
 */
export async function getLibraries(options = {}) {
  const cacheKey = `libraries-${JSON.stringify(options)}`;
  
  return optimizedFetch(cacheKey, async () => {
    let query = supabase
      .from('ui_libraries')
      .select('*');
    
    if (options.framework) {
      query = query.eq('framework', options.framework);
    }
    
    if (options.tags) {
      query = query.contains('tags', options.tags);
    }
    
    if (options.sort) {
      query = query.order(options.sort.field, { ascending: options.sort.ascending });
    } else {
      query = query.order('name', { ascending: true });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching libraries:', error);
      throw error;
    }
    
    return data;
  }, { ttl: 300000 }); // 5 minute cache
}

/**
 * Invalidate cache when data changes
 */
export function invalidateLibraryCache() {
  clearCache('libraries-');
}

// Export other database functions with similar optimizations
