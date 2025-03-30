-- Add npm_package_name column to frameworks table
ALTER TABLE frameworks
ADD COLUMN IF NOT EXISTS npm_package_name TEXT;

-- Add npm_package_name column to libraries table
ALTER TABLE libraries
ADD COLUMN IF NOT EXISTS npm_package_name TEXT;

-- Update existing frameworks with npm package names
UPDATE frameworks
SET npm_package_name = 'react'
WHERE slug = 'react';

UPDATE frameworks
SET npm_package_name = 'vue'
WHERE slug = 'vue';

UPDATE frameworks
SET npm_package_name = '@angular/core'
WHERE slug = 'angular';

-- Update existing libraries with npm package names
UPDATE libraries
SET npm_package_name = '@mui/material'
WHERE slug = 'material-ui';

UPDATE libraries
SET npm_package_name = '@chakra-ui/react'
WHERE slug = 'chakra-ui';

UPDATE libraries
SET npm_package_name = 'vuetify'
WHERE slug = 'vuetify';

UPDATE libraries
SET npm_package_name = '@angular/material'
WHERE slug = 'angular-material';
