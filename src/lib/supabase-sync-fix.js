/**
 * Simple in-memory cache for optimizing API calls
 */
const memoryCache = new Map();

/**
 * Optimized fetch function with caching
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Async function to fetch data
 * @param {Object} options - Cache options
 * @returns {Promise<any>} - Fetched data
 */
export async function optimizedFetch(key, fetchFn, options = { ttl: 60000 }) {
  // Check if we have a valid cached value
  if (memoryCache.has(key)) {
    const cachedItem = memoryCache.get(key);
    if (Date.now() < cachedItem.expiry) {
      console.log(`Cache hit for ${key}`);
      return cachedItem.value;
    }
    console.log(`Cache expired for ${key}`);
  }

  // Cache miss or expired, fetch fresh data
  try {
    const result = await fetchFn();
    
    // Store in cache with expiry
    memoryCache.set(key, {
      value: result,
      expiry: Date.now() + options.ttl
    });
    
    return result;
  } catch (error) {
    console.error(`Error in optimizedFetch for ${key}:`, error);
    throw error;
  }
}

/**
 * Clear specific cache entries by prefix
 * @param {string} keyPrefix - Prefix to match cache keys
 */
export function clearCache(keyPrefix) {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(keyPrefix)) {
      console.log(`Clearing cache for ${key}`);
      memoryCache.delete(key);
    }
  }
}

/**
 * Clear all cache entries
 */
export function clearAllCache() {
  console.log('Clearing all cache entries');
  memoryCache.clear();
}
