/**
 * Netlify function to handle on-demand revalidation
 */
exports.handler = async function(event, context) {
  // Verify request method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  // Verify authentication token
  const authHeader = event.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
  const validToken = process.env.PUBLIC_REVALIDATION_TOKEN;
  
  if (!token || token !== validToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const paths = body.paths || [];
    
    if (!Array.isArray(paths) || paths.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or missing paths' })
      };
    }
    
    // Trigger Netlify build hook to regenerate content
    const buildHookId = process.env.NETLIFY_BUILD_HOOK_ID;
    if (!buildHookId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Build hook not configured' })
      };
    }
    
    // Call the build hook
    const response = await fetch(buildHookId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths })
    });
    
    if (!response.ok) {
      throw new Error(`Build hook failed: ${response.status}`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Revalidation triggered successfully',
        paths: paths
      })
    };
  } catch (error) {
    console.error('Revalidation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
