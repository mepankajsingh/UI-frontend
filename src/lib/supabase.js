import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tcblwrhrgeaxfpcvmema.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYmx3cmhyZ2VheGZwY3ZtZW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzIxMTIsImV4cCI6MjA1NjM0ODExMn0.8bqwiq5uNZqA6aOxFAox4RsJ3SvJ1XyFmSKf2QWkuDQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Get page content from the database
export async function getPageData(slug) {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return {
      title: 'Page Not Found',
      content: 'The requested page could not be found.'
    };
  }
  
  return data;
}

// Get all frameworks with their stats
export async function getAllFrameworks() {
  const { data, error } = await supabase
    .from('frameworks')
    .select(`
      *,
      tags:framework_tags(tag_id(id, name, slug))
    `)
    .order('name');
  
  if (error) {
    console.error('Error fetching frameworks:', error);
    return [];
  }
  
  return data;
}

// Get a specific framework by slug
export async function getFrameworkBySlug(slug) {
  const { data, error } = await supabase
    .from('frameworks')
    .select(`
      *,
      tags:framework_tags(tag_id(id, name, slug))
    `)
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching framework ${slug}:`, error);
    return null;
  }
  
  return data;
}

// Get all libraries for a specific framework
export async function getLibrariesByFramework(frameworkId) {
  const { data, error } = await supabase
    .from('libraries')
    .select(`
      *,
      tags:library_tags(tag_id(id, name, slug))
    `)
    .eq('framework_id', frameworkId)
    .order('github_stars', { ascending: false });
  
  if (error) {
    console.error(`Error fetching libraries for framework ${frameworkId}:`, error);
    return [];
  }
  
  return data;
}

// Get a specific library by slug
export async function getLibraryBySlug(slug) {
  const { data, error } = await supabase
    .from('libraries')
    .select(`
      *,
      framework:framework_id(id, name, slug, title),
      tags:library_tags(tag_id(id, name, slug))
    `)
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching library ${slug}:`, error);
    return null;
  }
  
  return data;
}

// Get all tags
export async function getAllTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
  
  return data;
}

// Get libraries by tag
export async function getLibrariesByTag(tagId) {
  const { data, error } = await supabase
    .from('library_tags')
    .select(`
      library_id(
        *,
        framework:framework_id(id, name, slug, title)
      )
    `)
    .eq('tag_id', tagId);
  
  if (error) {
    console.error(`Error fetching libraries for tag ${tagId}:`, error);
    return [];
  }
  
  return data.map(item => item.library_id);
}

// Search libraries by name or description
export async function searchLibraries(query) {
  const { data, error } = await supabase
    .from('libraries')
    .select(`
      *,
      framework:framework_id(id, name, slug, title),
      tags:library_tags(tag_id(id, name, slug))
    `)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('github_stars', { ascending: false });
  
  if (error) {
    console.error(`Error searching libraries for "${query}":`, error);
    return [];
  }
  
  return data;
}
