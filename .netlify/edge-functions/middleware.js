// Netlify Edge Middleware for performance optimization
export default async (request, context) => {
  const url = new URL(request.url);
  
  // Skip middleware for API routes and static assets
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_astro/') ||
      url.pathname.includes('.')) {
    return;
  }

  // Get the response from the origin
  const response = await context.next();
  
  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, response);
  
  // Add cache control headers for HTML pages
  if (!url.pathname.includes('.')) {
    // Cache HTML pages for a short time at the edge
    newResponse.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
  }
  
  // Add security headers
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Enable early hints for critical resources
  newResponse.headers.set('Link', '</favicon.svg>; rel=preload; as=image');
  
  return newResponse;
};
