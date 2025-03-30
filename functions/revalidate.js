// Netlify Function for on-demand revalidation
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const { paths } = body;
    
    // Validate token from Authorization header
    const authHeader = event.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    
    if (!token || token !== process.env.REVALIDATION_TOKEN) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }
    
    // Validate paths
    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid paths provided' })
      };
    }
    
    // Purge Netlify cache for the specified paths
    const purgePromises = paths.map(async (path) => {
      // Normalize path
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      
      try {
        // Use Netlify's cache purge API
        const response = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/purge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NETLIFY_API_TOKEN}`
          },
          body: JSON.stringify({ paths: [normalizedPath] })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to purge cache for ${normalizedPath}:`, errorText);
          return { path: normalizedPath, success: false, error: errorText };
        }
        
        return { path: normalizedPath, success: true };
      } catch (error) {
        console.error(`Error purging cache for ${normalizedPath}:`, error);
        return { path: normalizedPath, success: false, error: error.message };
      }
    });
    
    const results = await Promise.all(purgePromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cache invalidation processed',
        results
      })
    };
  } catch (error) {
    console.error('Error in revalidate function:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
