/**
 * Utility function to trigger revalidation of specific paths
 * @param {string|string[]} paths - Path or array of paths to revalidate
 * @returns {Promise<Object>} - Revalidation result
 */
export async function revalidatePaths(paths) {
  const token = import.meta.env.PUBLIC_REVALIDATION_TOKEN;
  
  if (!token) {
    console.error('Revalidation token is not configured');
    return { success: false, error: 'Revalidation token missing' };
  }
  
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ paths: Array.isArray(paths) ? paths : [paths] })
    });
    
    if (!response.ok) {
      throw new Error(`Revalidation failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return { success: true, ...result };
  } catch (error) {
    console.error('Error during revalidation:', error);
    return { success: false, error: error.message };
  }
}
