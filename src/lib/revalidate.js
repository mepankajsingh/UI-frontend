/**
 * Triggers revalidation for specific paths
 * @param {string[]} paths - Array of paths to revalidate
 * @returns {Promise<Object>} - Response from the revalidation endpoint
 */
export async function revalidatePaths(paths) {
  try {
    // Get the token from environment variable or another secure source
    const token = import.meta.env.PUBLIC_REVALIDATION_TOKEN;
    
    if (!token) {
      console.error('Revalidation token not found');
      return { success: false, error: 'Revalidation token not found' };
    }
    
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ paths })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Revalidation failed:', error);
      return { success: false, error };
    }
    
    const result = await response.json();
    return { success: true, ...result };
  } catch (error) {
    console.error('Revalidation error:', error);
    return { success: false, error: error.message };
  }
}
