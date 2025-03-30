-- Create npm_stats_cache table for caching npm download statistics
CREATE TABLE IF NOT EXISTS npm_stats_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name TEXT NOT NULL UNIQUE,
  stats_data JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for better query performance
  CONSTRAINT npm_stats_cache_package_name_key UNIQUE (package_name)
);

-- Add comment to the table
COMMENT ON TABLE npm_stats_cache IS 'Cache for npm package download statistics to reduce API calls';
