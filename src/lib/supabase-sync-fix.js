// Cache implementation for optimized data fetching
const cache = new Map();

/**
 * Optimized fetch function with caching
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Async function to fetch data
 * @param {Object} options - Cache options
 * @returns {Promise<any>} - Fetched data
 */
export async function optimizedFetch(key, fetchFn, options = { ttl: 60000 }) {
  const now = Date.now();
  
  // Check if we have a valid cached response
  if (cache.has(key)) {
    const cachedData = cache.get(key);
    if (now - cachedData.timestamp < options.ttl) {
      return cachedData.data;
    }
  }
  
  // If no cache or expired, fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  cache.set(key, {
    data,
    timestamp: now
  });
  
  return data;
}

/**
 * Clear cache entries that match a prefix
 * @param {string} prefix - Cache key prefix to clear
 */
export function clearCache(prefix = '') {
  if (!prefix) {
    cache.clear();
    return;
  }
  
  // Clear only keys that match the prefix
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
