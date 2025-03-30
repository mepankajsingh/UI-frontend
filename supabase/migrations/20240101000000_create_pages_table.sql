-- Create pages table for storing page content
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  meta_description TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data for home page
INSERT INTO pages (slug, title, meta_description, content)
VALUES (
  'home',
  'Welcome to Our Website',
  'This is the home page of our Next.js website with Supabase integration',
  '<p>Welcome to our website! This is the home page content pulled from Supabase.</p><p>This content can be edited directly in the Supabase database.</p>'
);

-- Insert initial data for about page
INSERT INTO pages (slug, title, meta_description, content)
VALUES (
  'about',
  'About Our Company',
  'Learn more about our company, team, and mission',
  '<p>This is the about page content pulled from Supabase.</p><p>Here you can add information about your company, team members, mission statement, and more.</p><p>All of this content is stored in and served from your Supabase database.</p>'
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
