export async function handler(event) {
  // Basic auth check - you should implement proper authentication
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }

  const token = authHeader.split(' ')[1];
  // Use environment variable for the token
  if (token !== process.env.REVALIDATION_TOKEN) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' })
    };
  }

  try {
    // Parse the request body to get the paths to revalidate
    const { paths } = JSON.parse(event.body);
    
    if (!paths || !Array.isArray(paths)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request. Expected an array of paths.' })
      };
    }

    // Call Netlify's On-demand Builder API to purge the cache for each path
    const results = await Promise.all(paths.map(async (path) => {
      const purgeUrl = `https://api.netlify.com/build_hooks/${process.env.NETLIFY_BUILD_HOOK_ID}?trigger_path=${encodeURIComponent(path)}`;
      
      const response = await fetch(purgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      return {
        path,
        status: response.status,
        ok: response.ok
      };
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Revalidation triggered',
        results
      })
    };
  } catch (error) {
    console.error('Revalidation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error.message })
    };
  }
}
