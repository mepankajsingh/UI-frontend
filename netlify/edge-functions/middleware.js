import { createClient } from '@supabase/supabase-js';

export default async (request, context) => {
  // Get Supabase URL and key from environment variables
  const supabaseUrl = Netlify.env.get("PUBLIC_SUPABASE_URL") || "https://tcblwrhrgeaxfpcvmema.supabase.co";
  const supabaseKey = Netlify.env.get("PUBLIC_SUPABASE_ANON_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYmx3cmhyZ2VheGZwY3ZtZW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzIxMTIsImV4cCI6MjA1NjM0ODExMn0.8bqwiq5uNZqA6aOxFAox4RsJ3SvJ1XyFmSKf2QWkuDQ";
  
  // Create Supabase client with explicit URL and key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Continue with the rest of your middleware logic
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Add response headers for better performance
  const response = await context.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add performance headers
  response.headers.set('Cache-Control', 'public, max-age=300');
  
  return response;
}
