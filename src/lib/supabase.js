import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tcblwrhrgeaxfpcvmema.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYmx3cmhyZ2VheGZwY3ZtZW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzIxMTIsImV4cCI6MjA1NjM0ODExMn0.8bqwiq5uNZqA6aOxFAox4RsJ3SvJ1XyFmSKf2QWkuDQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getPageData(pageSlug = 'home') {
  const { data, error } = await supabase
    .from('page_content')
    .select('title, meta_description, content')
    .eq('slug', pageSlug)
    .single();
  
  if (error) {
    console.error(`Error fetching page data for ${pageSlug}:`, error);
    return {
      title: pageSlug === 'home' ? 'Hello World' : `${pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1)} Page`,
      meta_description: `Default meta description for ${pageSlug} page`,
      content: `Welcome to the ${pageSlug} page!`
    };
  }
  
  return data;
}
