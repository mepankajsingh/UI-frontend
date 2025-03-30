import { supabase } from './supabase';

const NPM_API_BASE = 'https://api.npmjs.org/downloads/point/last-';

/**
 * Fetches npm download stats for a package with caching
 * @param {string} packageName - The npm package name
 * @param {number} days - Number of days of data to fetch (default: 30)
 * @returns {Promise<Array>} - Array of download data objects
 */
export async function getOptimizedNpmStats(packageName, days = 30) {
  if (!packageName) {
    console.error('No package name provided');
    return [];
  }

  try {
    // Check cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('npm_stats_cache')
      .select('stats_data, last_updated')
      .eq('package_name', packageName)
      .single();

    // If we have fresh cached data (less than 12 hours old), use it
    const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    if (cachedData && !cacheError) {
      const lastUpdated = new Date(cachedData.last_updated);
      const now = new Date();
      if (now - lastUpdated < CACHE_TTL) {
        console.log(`Using cached npm stats for ${packageName}`);
        return cachedData.stats_data;
      }
    }

    // Cache miss or stale cache, fetch from npm API
    console.log(`Fetching fresh npm stats for ${packageName}`);
    const dailyData = await fetchDailyDownloads(packageName, days);
    
    // Store in cache
    if (dailyData && dailyData.length > 0) {
      const { error: upsertError } = await supabase
        .from('npm_stats_cache')
        .upsert({
          package_name: packageName,
          stats_data: dailyData,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'package_name'
        });
      
      if (upsertError) {
        console.error('Error updating npm stats cache:', upsertError);
      }
    }
    
    return dailyData;
  } catch (error) {
    console.error(`Error in getOptimizedNpmStats for ${packageName}:`, error);
    return [];
  }
}

/**
 * Determines if a package is trending based on download growth
 * @param {Array} npmStats - Array of daily download data
 * @returns {boolean} - True if package is trending
 */
export function isTrendingPackage(npmStats) {
  // If no stats or less than 14 days of data, return false
  if (!npmStats || npmStats.length < 14) {
    return false;
  }
  
  // Calculate average downloads for first and second half of the period
  const halfIndex = Math.floor(npmStats.length / 2);
  
  const firstHalf = npmStats.slice(0, halfIndex);
  const secondHalf = npmStats.slice(halfIndex);
  
  const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.downloads, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.downloads, 0) / secondHalf.length;
  
  // Consider trending if there's at least 15% growth
  const growthRate = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;
  return growthRate >= 0.15;
}

/**
 * Fetches daily download data for a package
 * @param {string} packageName - The npm package name
 * @param {number} days - Number of days to fetch
 * @returns {Promise<Array>} - Array of daily download data
 */
async function fetchDailyDownloads(packageName, days) {
  try {
    // Fetch data for each day individually to create a daily series
    const dailyData = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      
      const response = await fetch(`${NPM_API_BASE}day/${dateStr}/${packageName}`);
      
      if (!response.ok) {
        console.warn(`Failed to fetch npm stats for ${packageName} on ${dateStr}`);
        continue;
      }
      
      const data = await response.json();
      dailyData.unshift({
        day: data.start,
        downloads: data.downloads
      });
    }
    
    return dailyData;
  } catch (error) {
    console.error(`Error fetching daily downloads for ${packageName}:`, error);
    return [];
  }
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Get total downloads for a package over the last 30 days
 * @param {string} packageName - The npm package name
 * @returns {Promise<number>} - Total downloads
 */
export async function getTotalDownloads(packageName) {
  try {
    const response = await fetch(`${NPM_API_BASE}month/${packageName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch npm stats: ${response.statusText}`);
    }
    const data = await response.json();
    return data.downloads;
  } catch (error) {
    console.error(`Error fetching total downloads for ${packageName}:`, error);
    return 0;
  }
}

/**
 * Format download numbers for display
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export function formatDownloads(num) {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * Get npm downloads for a package
 * @param {string} packageName - The npm package name
 * @returns {Promise<number>} - Download count
 */
export async function getNpmDownloads(packageName) {
  if (!packageName) return 0;
  return getTotalDownloads(packageName);
}
