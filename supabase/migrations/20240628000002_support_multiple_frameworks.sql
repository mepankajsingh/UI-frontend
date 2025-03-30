-- Create library_frameworks junction table
CREATE TABLE IF NOT EXISTS library_frameworks (
  library_id UUID REFERENCES libraries(id) ON DELETE CASCADE,
  framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (library_id, framework_id)
);

-- Migrate existing framework relationships to the junction table
INSERT INTO library_frameworks (library_id, framework_id, is_primary)
SELECT id, framework_id, true
FROM libraries
WHERE framework_id IS NOT NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_library_frameworks_library_id ON library_frameworks(library_id);
CREATE INDEX IF NOT EXISTS idx_library_frameworks_framework_id ON library_frameworks(framework_id);

-- Modify libraries table to remove the direct framework_id column
-- First, we'll create a temporary column to store the framework_id values
ALTER TABLE libraries ADD COLUMN temp_framework_id UUID;

-- Copy the existing framework_id values to the temporary column
UPDATE libraries SET temp_framework_id = framework_id;

-- Now drop the framework_id column
ALTER TABLE libraries DROP COLUMN IF EXISTS framework_id;

-- Add a comment to explain the change
COMMENT ON TABLE library_frameworks IS 'Junction table allowing libraries to be associated with multiple frameworks';
COMMENT ON COLUMN library_frameworks.is_primary IS 'Indicates if this is the primary framework for the library';
