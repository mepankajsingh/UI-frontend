import { supabase } from './supabase';

// Cache for npm stats to avoid redundant API calls
const npmStatsCache = new Map();
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

/**
 * Get npm download stats for a package
 * @param {string} packageName - The npm package name
 * @returns {Promise<Array>} - Array of daily download counts
 */
export async function getNpmDownloads(packageName) {
  if (!packageName) return null;
  
  try {
    // Calculate date range (last 30 days)
    const end = new Date();
    end.setDate(end.getDate() - 1); // Yesterday
    
    const start = new Date();
    start.setDate(start.getDate() - 30); // 30 days ago
    
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    // Fetch from npm API
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${packageName}`
    );
    
    if (!response.ok) {
      throw new Error(`NPM API returned ${response.status}`);
    }
    
    const data = await response.json();
    return data.downloads || [];
  } catch (error) {
    console.error(`Error fetching npm stats for ${packageName}:`, error);
    return null;
  }
}

/**
 * Check if a package is trending based on download growth
 * @param {Array} downloadsData - Array of daily download counts
 * @returns {boolean} - Whether the package is trending
 */
export function isTrendingPackage(downloadsData) {
  if (!downloadsData || downloadsData.length < 14) {
    return false;
  }
  
  // Exclude the last 2 days as they might have incomplete data
  const relevantData = [...downloadsData].slice(0, -2);
  
  // Calculate average downloads for first and second week
  const firstWeekData = relevantData.slice(-14, -7);
  const secondWeekData = relevantData.slice(-7);
  
  const firstWeekAvg = firstWeekData.reduce((sum, day) => sum + day.downloads, 0) / firstWeekData.length;
  const secondWeekAvg = secondWeekData.reduce((sum, day) => sum + day.downloads, 0) / secondWeekData.length;
  
  // Calculate growth percentage
  if (firstWeekAvg === 0) return false;
  
  const growthPercentage = ((secondWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;
  
  // Consider trending if growth is at least 5%
  return growthPercentage >= 5;
}

/**
 * Get optimized npm stats with caching
 * @param {string} packageName - The npm package name
 * @returns {Promise<Array>} - Array of daily download counts
 */
export async function getOptimizedNpmStats(packageName) {
  if (!packageName) return null;
  
  // Check cache first
  const cacheKey = `npm-stats-${packageName}`;
  const cachedData = npmStatsCache.get(cacheKey);
  
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
    return cachedData.data;
  }
  
  // If not in cache or expired, fetch new data
  try {
    // Try to get from database first
    const { data: dbStats } = await supabase
      .from('npm_stats')
      .select('stats_data')
      .eq('package_name', packageName)
      .single();
    
    let downloadsData;
    
    if (dbStats && dbStats.stats_data) {
      // Use database data if available
      downloadsData = dbStats.stats_data;
    } else {
      // Fallback to API if not in database
      downloadsData = await getNpmDownloads(packageName);
      
      // Store in database for future use if we got valid data
      if (downloadsData && downloadsData.length > 0) {
        await supabase
          .from('npm_stats')
          .upsert({
            package_name: packageName,
            stats_data: downloadsData,
            last_updated: new Date().toISOString()
          });
      }
    }
    
    // Store in memory cache
    if (downloadsData) {
      npmStatsCache.set(cacheKey, {
        data: downloadsData,
        timestamp: Date.now()
      });
    }
    
    return downloadsData;
  } catch (error) {
    console.error(`Error in getOptimizedNpmStats for ${packageName}:`, error);
    
    // Fallback to direct API call if database operations fail
    const downloadsData = await getNpmDownloads(packageName);
    
    // Still cache the result even if DB operations failed
    if (downloadsData) {
      npmStatsCache.set(cacheKey, {
        data: downloadsData,
        timestamp: Date.now()
      });
    }
    
    return downloadsData;
  }
}

/**
 * Get total downloads for a package over the last 30 days
 * @param {string} packageName - The npm package name
 * @returns {Promise<number>} - Total download count
 */
export async function getTotalDownloads(packageName) {
  const downloads = await getOptimizedNpmStats(packageName);
  
  if (!downloads || !downloads.length) {
    return 0;
  }
  
  return downloads.reduce((sum, day) => sum + day.downloads, 0);
}

/**
 * Format download count for display
 * @param {number} count - Download count
 * @returns {string} - Formatted string
 */
export function formatDownloads(count) {
  if (!count) return '0';
  
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  
  return count.toString();
}
