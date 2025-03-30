// Simple function to return current server timestamp
// Used to check if Netlify is serving stale content

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
  };
};
