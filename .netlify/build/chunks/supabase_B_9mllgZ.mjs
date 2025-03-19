import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tcblwrhrgeaxfpcvmema.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYmx3cmhyZ2VheGZwY3ZtZW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzIxMTIsImV4cCI6MjA1NjM0ODExMn0.8bqwiq5uNZqA6aOxFAox4RsJ3SvJ1XyFmSKf2QWkuDQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase as s };
