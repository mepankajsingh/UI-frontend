-- Create the page_content table
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data for multiple pages
INSERT INTO page_content (slug, title, meta_description, content)
VALUES 
  (
    'home',
    'Hello from Supabase!',
    'A dynamic hello page powered by Supabase and Astro with ISR on Netlify',
    'Welcome to this hello page! This content is being loaded dynamically from Supabase. You can update this content in your Supabase database and the changes will be reflected here thanks to Incremental Static Regeneration (ISR) on Netlify.'
  ),
  (
    'about',
    'About Our Project',
    'Learn about our Astro SPA with Supabase integration',
    'This is an example of a Single Page Application built with Astro and Supabase. The content for each page is stored in a Supabase database and loaded dynamically. The application uses client-side routing to provide a smooth SPA experience while maintaining the benefits of server-side rendering and ISR.'
  ),
  (
    'contact',
    'Contact Us',
    'Get in touch with our team',
    'Have questions or feedback? Use the form below to get in touch with us. We''d love to hear from you!'
  );
