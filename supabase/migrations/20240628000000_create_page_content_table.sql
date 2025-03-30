-- Create page_content table for storing dynamic page content
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data for the about page
INSERT INTO page_content (slug, title, content)
VALUES (
  'about',
  'About UI Library Directory',
  '<p>Welcome to UI Library Directory, your comprehensive resource for discovering and comparing UI component libraries for JavaScript frameworks.</p>
  
  <p>Our mission is to help developers find the perfect UI components for their projects, saving time and effort in the research process.</p>
  
  <h2>What We Offer</h2>
  
  <ul>
    <li>Curated collection of UI libraries for popular JavaScript frameworks</li>
    <li>Detailed information about each library including features, popularity, and compatibility</li>
    <li>Easy comparison between different libraries</li>
    <li>Up-to-date information on the latest releases and trends</li>
  </ul>
  
  <h2>Our Team</h2>
  
  <p>We are a group of passionate developers who understand the challenges of finding the right tools for web development projects. Our team constantly researches and updates our directory to ensure you have access to the most current and relevant information.</p>
  
  <h2>Get Involved</h2>
  
  <p>We welcome contributions from the community! If you know of a UI library that should be included in our directory or have suggestions for improving our platform, please reach out through our contact page.</p>'
) ON CONFLICT (slug) DO UPDATE 
SET title = EXCLUDED.title, 
    content = EXCLUDED.content,
    updated_at = NOW();
