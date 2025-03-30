/**
 * Optimized NPM stats fetching with caching
 */

// In-memory cache with expiration
const statsCache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetches NPM download statistics with caching
 * @param {string} packageName - The npm package name
 * @returns {Promise<Array>} - Download statistics
 */
export async function getOptimizedNpmStats(packageName) {
  if (!packageName) return [];
  
  // Check cache first
  const cacheKey = `npm-stats-${packageName}`;
  const cachedData = statsCache.get(cacheKey);
  
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
    return cachedData.data;
  }
  
  try {
    // Calculate date range (last 14 days)
    const end = new Date();
    end.setDate(end.getDate() - 1); // Yesterday
    
    const start = new Date(end);
    start.setDate(start.getDate() - 14);
    
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    
    // Fetch from npm API
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/${startStr}:${endStr}/${packageName}`
    );
    
    if (!response.ok) {
      throw new Error(`NPM API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store in cache
    statsCache.set(cacheKey, {
      data: data.downloads || [],
      timestamp: Date.now()
    });
    
    return data.downloads || [];
  } catch (error) {
    console.error(`Error fetching NPM stats for ${packageName}:`, error);
    return [];
  }
}

/**
 * Fetches NPM download statistics for a package
 * @param {string} packageName - The npm package name
 * @returns {Promise<Array>} - Download statistics
 */
export async function getNpmDownloads(packageName) {
  return await getOptimizedNpmStats(packageName);
}

/**
 * Gets total downloads from download stats
 * @param {Array} downloadStats - Array of download statistics
 * @returns {number} - Total downloads
 */
export function getTotalDownloads(downloadStats) {
  if (!downloadStats || !Array.isArray(downloadStats)) {
    return 0;
  }
  
  return downloadStats.reduce((sum, day) => sum + (day.downloads || 0), 0);
}

/**
 * Formats download numbers for display
 * @param {number} downloads - Number of downloads
 * @returns {string} - Formatted download count
 */
export function formatDownloads(downloads) {
  if (!downloads) return '0';
  
  if (downloads >= 1000000) {
    return (downloads / 1000000).toFixed(1) + 'M';
  }
  
  if (downloads >= 1000) {
    return (downloads / 1000).toFixed(1) + 'k';
  }
  
  return downloads.toString();
}

/**
 * Determines if a package is trending based on download growth
 * @param {Array} downloadStats - Array of download statistics
 * @returns {boolean} - True if package is trending
 */
export function isTrendingPackage(downloadStats) {
  if (!downloadStats || downloadStats.length < 7) {
    return false;
  }
  
  try {
    // Calculate average downloads for first and second half of the period
    const midpoint = Math.floor(downloadStats.length / 2);
    
    const firstHalf = downloadStats.slice(0, midpoint);
    const secondHalf = downloadStats.slice(midpoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + (day.downloads || 0), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + (day.downloads || 0), 0) / secondHalf.length;
    
    // Consider trending if there's at least 15% growth
    const growthRate = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;
    
    return growthRate >= 0.15;
  } catch (error) {
    console.error("Error calculating trending status:", error);
    return false;
  }
}

/**
 * Fetches NPM package details
 * @param {string} packageName - The npm package name
 * @returns {Promise<Object|null>} - Package details
 */
export async function getNpmPackageDetails(packageName) {
  if (!packageName) return null;
  
  // Check cache first
  const cacheKey = `npm-details-${packageName}`;
  const cachedData = statsCache.get(cacheKey);
  
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
    return cachedData.data;
  }
  
  try {
    // Fetch from npm registry
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    
    if (!response.ok) {
      throw new Error(`NPM API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract relevant details
    const latestVersion = data['dist-tags']?.latest;
    const versionData = data.versions?.[latestVersion];
    
    const packageDetails = {
      version: latestVersion,
      lastUpdate: data.time?.[latestVersion],
      license: versionData?.license || 'Unknown',
      installCommand: `npm install ${packageName}`
    };
    
    // Store in cache
    statsCache.set(cacheKey, {
      data: packageDetails,
      timestamp: Date.now()
    });
    
    return packageDetails;
  } catch (error) {
    console.error(`Error fetching package details for ${packageName}:`, error);
    return null;
  }
}

// Helper to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}
