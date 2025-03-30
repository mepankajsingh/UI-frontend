import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tcblwrhrgeaxfpcvmema.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYmx3cmhyZ2VheGZwY3ZtZW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzIxMTIsImV4cCI6MjA1NjM0ODExMn0.8bqwiq5uNZqA6aOxFAox4RsJ3SvJ1XyFmSKf2QWkuDQ';

// Create client with optimized options
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Cache-Control': 'max-age=300' // 5 minute cache
    },
  },
  db: {
    schema: 'public',
  },
});

// Function to get page content from the database
export async function getPageData(slug) {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching page data:', error);
      return {
        title: 'About UI Library Directory',
        content: 'Welcome to the UI Library Directory, your go-to resource for finding the perfect UI component library for your JavaScript projects.'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPageData:', error);
    return {
      title: 'About UI Library Directory',
      content: 'Welcome to the UI Library Directory, your go-to resource for finding the perfect UI component library for your JavaScript projects.'
    };
  }
}
