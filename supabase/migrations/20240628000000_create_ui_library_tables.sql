-- Drop existing tables if they exist
DROP TABLE IF EXISTS page_content;

-- Create frameworks table
CREATE TABLE IF NOT EXISTS frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  icon_url TEXT,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT,
  installation_command TEXT,
  github_url TEXT,
  npm_url TEXT,
  docs_url TEXT,
  npm_downloads INTEGER DEFAULT 0,
  github_stars INTEGER DEFAULT 0,
  github_forks INTEGER DEFAULT 0,
  latest_version TEXT,
  last_update TIMESTAMP WITH TIME ZONE,
  type TEXT CHECK (type IN ('frontend', 'backend', 'full-stack')),
  rendering_type TEXT CHECK (rendering_type IN ('csr', 'ssg', 'ssr', 'mixed')),
  language TEXT CHECK (language IN ('javascript', 'typescript', 'mixed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create libraries table
CREATE TABLE IF NOT EXISTS libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  icon_url TEXT,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT,
  pricing TEXT CHECK (pricing IN ('free', 'freemium', 'paid')),
  gallery_images JSONB DEFAULT '[]'::jsonb,
  customization TEXT CHECK (customization IN ('high', 'moderate', 'low')),
  installation_command TEXT,
  framework_id UUID REFERENCES frameworks(id),
  github_url TEXT,
  npm_url TEXT,
  github_stars INTEGER DEFAULT 0,
  github_forks INTEGER DEFAULT 0,
  latest_version TEXT,
  last_update TIMESTAMP WITH TIME ZONE,
  npm_downloads INTEGER DEFAULT 0,
  styling TEXT CHECK (styling IN ('styled', 'unstyled')),
  total_components INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create framework_tags junction table
CREATE TABLE IF NOT EXISTS framework_tags (
  framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (framework_id, tag_id)
);

-- Create library_tags junction table
CREATE TABLE IF NOT EXISTS library_tags (
  library_id UUID REFERENCES libraries(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (library_id, tag_id)
);

-- Insert sample data for frameworks
INSERT INTO frameworks (name, slug, title, icon_url, meta_title, meta_description, description, website_url, installation_command, github_url, npm_url, docs_url, npm_downloads, github_stars, github_forks, latest_version, last_update, type, rendering_type, language)
VALUES 
  (
    'React', 
    'react', 
    'React UI Libraries', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png', 
    'React UI Libraries - Find the Best UI Components', 
    'Discover the best React UI libraries and component collections for your next project', 
    'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently update the DOM when data changes.', 
    'https://reactjs.org', 
    'npm install react react-dom', 
    'https://github.com/facebook/react', 
    'https://www.npmjs.com/package/react', 
    'https://reactjs.org/docs', 
    15000000, 
    200000, 
    40000, 
    '18.2.0', 
    '2023-06-01', 
    'frontend', 
    'csr', 
    'javascript'
  ),
  (
    'Vue', 
    'vue', 
    'Vue UI Libraries', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png', 
    'Vue UI Libraries - Find the Best UI Components', 
    'Discover the best Vue UI libraries and component collections for your next project', 
    'Vue.js is a progressive JavaScript framework for building user interfaces. Unlike monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable.', 
    'https://vuejs.org', 
    'npm install vue', 
    'https://github.com/vuejs/vue', 
    'https://www.npmjs.com/package/vue', 
    'https://vuejs.org/guide', 
    8000000, 
    200000, 
    32000, 
    '3.3.4', 
    '2023-05-15', 
    'frontend', 
    'csr', 
    'javascript'
  ),
  (
    'Angular', 
    'angular', 
    'Angular UI Libraries', 
    'https://angular.io/assets/images/logos/angular/angular.svg', 
    'Angular UI Libraries - Find the Best UI Components', 
    'Discover the best Angular UI libraries and component collections for your next project', 
    'Angular is a platform and framework for building single-page client applications using HTML and TypeScript. It implements core and optional functionality as a set of TypeScript libraries that you import into your applications.', 
    'https://angular.io', 
    'npm install @angular/core @angular/common', 
    'https://github.com/angular/angular', 
    'https://www.npmjs.com/package/@angular/core', 
    'https://angular.io/docs', 
    5000000, 
    86000, 
    22000, 
    '16.0.0', 
    '2023-05-03', 
    'frontend', 
    'csr', 
    'typescript'
  );

-- Insert sample data for tags
INSERT INTO tags (name, slug, title, meta_title, meta_description, description)
VALUES 
  (
    'Material Design', 
    'material-design', 
    'Material Design UI Libraries', 
    'Material Design UI Libraries for JavaScript Frameworks', 
    'Find the best Material Design UI libraries for your JavaScript framework projects', 
    'Material Design is a design language developed by Google that uses grid-based layouts, responsive animations, and transitions, padding, and depth effects such as lighting and shadows.'
  ),
  (
    'Tailwind', 
    'tailwind', 
    'Tailwind CSS UI Libraries', 
    'Tailwind CSS UI Libraries for JavaScript Frameworks', 
    'Find the best Tailwind CSS UI libraries for your JavaScript framework projects', 
    'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It provides low-level utility classes that let you build completely custom designs.'
  ),
  (
    'Accessible', 
    'accessible', 
    'Accessible UI Libraries', 
    'Accessible UI Libraries for JavaScript Frameworks', 
    'Find the best accessible UI libraries for your JavaScript framework projects', 
    'Accessible UI libraries prioritize inclusive design practices to ensure that applications can be used by people with various disabilities and abilities.'
  );

-- Insert sample data for libraries
INSERT INTO libraries (name, slug, title, icon_url, meta_title, meta_description, description, website_url, pricing, gallery_images, customization, installation_command, framework_id, github_url, npm_url, github_stars, github_forks, latest_version, last_update, npm_downloads, styling, total_components)
VALUES 
  (
    'Material UI', 
    'material-ui', 
    'Material UI - React Components Library', 
    'https://mui.com/static/logo.png', 
    'Material UI - React Material Design Components', 
    'Material UI is a popular React UI framework implementing Google''s Material Design', 
    'Material UI is a comprehensive library of components that features implementation of Google''s Material Design system for React applications. It includes a comprehensive collection of prebuilt components that are ready for use in production right out of the box.', 
    'https://mui.com', 
    'free', 
    '[{"url": "https://mui.com/static/images/templates/album.png", "alt": "Album template"}, {"url": "https://mui.com/static/images/templates/blog.png", "alt": "Blog template"}]', 
    'high', 
    'npm install @mui/material @emotion/react @emotion/styled', 
    (SELECT id FROM frameworks WHERE slug = 'react'), 
    'https://github.com/mui/material-ui', 
    'https://www.npmjs.com/package/@mui/material', 
    85000, 
    14000, 
    '5.13.0', 
    '2023-05-01', 
    2500000, 
    'styled', 
    100
  ),
  (
    'Chakra UI', 
    'chakra-ui', 
    'Chakra UI - Simple React Components', 
    'https://raw.githubusercontent.com/chakra-ui/chakra-ui/main/logo/logo-colored@2x.png', 
    'Chakra UI - Simple, Modular and Accessible UI Components for React', 
    'Chakra UI is a simple, modular and accessible component library for React applications', 
    'Chakra UI is a simple, modular and accessible component library that gives you the building blocks to build React applications with speed. All Chakra UI components are designed with accessibility in mind and provide keyboard navigation and focus management.', 
    'https://chakra-ui.com', 
    'free', 
    '[{"url": "https://chakra-ui.com/og-image.png", "alt": "Chakra UI components"}]', 
    'high', 
    'npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion', 
    (SELECT id FROM frameworks WHERE slug = 'react'), 
    'https://github.com/chakra-ui/chakra-ui', 
    'https://www.npmjs.com/package/@chakra-ui/react', 
    33000, 
    2700, 
    '2.6.1', 
    '2023-04-15', 
    1200000, 
    'styled', 
    70
  ),
  (
    'Vuetify', 
    'vuetify', 
    'Vuetify - Material Design Component Framework', 
    'https://cdn.vuetifyjs.com/images/logos/vuetify-logo-light.png', 
    'Vuetify - Material Design Component Framework for Vue', 
    'Vuetify is a Material Design component framework for Vue.js applications', 
    'Vuetify is a Vue UI Library with beautifully handcrafted Material Components. No design skills required — everything you need to create amazing applications is at your fingertips.', 
    'https://vuetifyjs.com', 
    'free', 
    '[{"url": "https://cdn.vuetifyjs.com/images/templates/parallax-starter.png", "alt": "Parallax template"}]', 
    'high', 
    'npm install vuetify', 
    (SELECT id FROM frameworks WHERE slug = 'vue'), 
    'https://github.com/vuetifyjs/vuetify', 
    'https://www.npmjs.com/package/vuetify', 
    36000, 
    6200, 
    '3.3.0', 
    '2023-05-10', 
    1800000, 
    'styled', 
    85
  ),
  (
    'Angular Material', 
    'angular-material', 
    'Angular Material - Material Design components for Angular', 
    'https://material.angular.io/assets/img/angular-material-logo.svg', 
    'Angular Material - UI component infrastructure and Material Design components for Angular', 
    'Angular Material provides Material Design components for Angular applications', 
    'Angular Material comprises a range of components which implement common interaction patterns according to the Material Design specification. It is built for and by the Angular team to integrate seamlessly with Angular.', 
    'https://material.angular.io', 
    'free', 
    '[{"url": "https://material.angular.io/assets/screenshots/dashboard.png", "alt": "Dashboard example"}]', 
    'moderate', 
    'ng add @angular/material', 
    (SELECT id FROM frameworks WHERE slug = 'angular'), 
    'https://github.com/angular/components', 
    'https://www.npmjs.com/package/@angular/material', 
    23000, 
    6300, 
    '16.0.0', 
    '2023-05-03', 
    1500000, 
    'styled', 
    60
  );

-- Connect libraries with tags
INSERT INTO library_tags (library_id, tag_id)
VALUES 
  ((SELECT id FROM libraries WHERE slug = 'material-ui'), (SELECT id FROM tags WHERE slug = 'material-design')),
  ((SELECT id FROM libraries WHERE slug = 'material-ui'), (SELECT id FROM tags WHERE slug = 'accessible')),
  ((SELECT id FROM libraries WHERE slug = 'chakra-ui'), (SELECT id FROM tags WHERE slug = 'accessible')),
  ((SELECT id FROM libraries WHERE slug = 'vuetify'), (SELECT id FROM tags WHERE slug = 'material-design')),
  ((SELECT id FROM libraries WHERE slug = 'angular-material'), (SELECT id FROM tags WHERE slug = 'material-design')),
  ((SELECT id FROM libraries WHERE slug = 'angular-material'), (SELECT id FROM tags WHERE slug = 'accessible'));

-- Connect frameworks with tags
INSERT INTO framework_tags (framework_id, tag_id)
VALUES 
  ((SELECT id FROM frameworks WHERE slug = 'react'), (SELECT id FROM tags WHERE slug = 'accessible')),
  ((SELECT id FROM frameworks WHERE slug = 'vue'), (SELECT id FROM tags WHERE slug = 'accessible')),
  ((SELECT id FROM frameworks WHERE slug = 'angular'), (SELECT id FROM tags WHERE slug = 'accessible'));
