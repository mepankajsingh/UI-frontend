import { supabase } from './supabase';

// Fetch npm download stats for a package
export async function getNpmDownloads(packageName) {
  try {
    // Use a 30-day period for download stats
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    // Format dates as YYYY-MM-DD
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    // Fetch from npm API
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${packageName}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch npm stats: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.downloads || [];
  } catch (error) {
    console.error(`Error fetching npm downloads for ${packageName}:`, error);
    return [];
  }
}

// Calculate total downloads from npm data
export function getTotalDownloads(downloadsData) {
  if (!downloadsData || !Array.isArray(downloadsData)) {
    return 0;
  }
  
  return downloadsData.reduce((sum, day) => sum + (day.downloads || 0), 0);
}

// Check if a package is trending (5% week-over-week growth)
// Modified to exclude the most recent TWO days and look at the two weeks before that
export function isTrendingPackage(downloadsData) {
  // Debug: Log the data we're working with
  console.log("Checking if trending with data:", downloadsData?.length || 0, "days");
  
  if (!downloadsData || !Array.isArray(downloadsData) || downloadsData.length < 16) {
    console.log("Not enough data to determine trending status");
    return false;
  }
  
  // Exclude the most recent TWO days
  const dataExcludingRecentDays = downloadsData.slice(0, -2);
  
  // Get the last 14 days of data (excluding the most recent two days)
  const last14Days = dataExcludingRecentDays.slice(-14);
  
  // Calculate downloads for the more recent week (last 7 days excluding most recent two days)
  const recentWeek = last14Days.slice(-7);
  const recentWeekDownloads = recentWeek.reduce((sum, day) => sum + (day.downloads || 0), 0);
  
  // Calculate downloads for the previous week (7 days before the recent week)
  const olderWeek = last14Days.slice(0, 7);
  const olderWeekDownloads = olderWeek.reduce((sum, day) => sum + (day.downloads || 0), 0);
  
  // Debug: Log the calculations
  console.log(`Recent week (excluding last 2 days): ${recentWeekDownloads}, Older week: ${olderWeekDownloads}`);
  
  // Prevent division by zero
  if (olderWeekDownloads === 0) {
    return false;
  }
  
  // Calculate percentage increase
  const percentageIncrease = ((recentWeekDownloads - olderWeekDownloads) / olderWeekDownloads) * 100;
  console.log(`Percentage increase: ${percentageIncrease.toFixed(2)}%`);
  
  // Return true if increase is at least 5% (changed from 2%)
  return percentageIncrease >= 5;
}

// Format download numbers for display
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

// Get npm package details
export async function getNpmPackageDetails(packageName) {
  try {
    // Fetch package details from npm registry
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch package details: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract relevant information
    const latestVersion = data['dist-tags']?.latest;
    const versionData = latestVersion ? data.versions[latestVersion] : null;
    
    return {
      name: data.name,
      version: latestVersion,
      description: data.description,
      license: versionData?.license || data.license,
      lastUpdate: data.time?.modified,
      homepage: versionData?.homepage || data.homepage,
      installCommand: `npm install ${packageName}`
    };
  } catch (error) {
    console.error(`Error fetching package details for ${packageName}:`, error);
    return null;
  }
}

// Cache npm stats in Supabase for better performance
export async function cacheNpmStats(packageName, stats) {
  try {
    if (!packageName || !stats) return;
    
    // Add cache-busting timestamp to ensure the update is recognized
    const timestamp = new Date().toISOString();
    
    const { error } = await supabase
      .from('npm_stats_cache')
      .upsert({
        package_name: packageName,
        stats_data: stats,
        last_updated: timestamp,
        update_timestamp: timestamp // Additional field to force update
      }, {
        onConflict: 'package_name'
      });
      
    if (error) {
      console.error('Error caching npm stats:', error);
    }
  } catch (error) {
    console.error('Error in cacheNpmStats:', error);
  }
}

// Get cached npm stats if available, otherwise fetch fresh data
export async function getOptimizedNpmStats(packageName) {
  try {
    // Debug: Log the package name we're fetching
    console.log(`Fetching stats for package: ${packageName}`);
    
    // Add cache-busting query parameter
    const cacheBuster = new Date().getTime();
    
    // Try to get from cache first with cache-control headers
    const { data: cachedData, error } = await supabase
      .from('npm_stats_cache')
      .select('stats_data, last_updated')
      .eq('package_name', packageName)
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
      console.error(`Cache fetch error for ${packageName}:`, error);
    }
    
    // If we have recent cache (less than 24 hours old), use it
    if (cachedData) {
      const lastUpdated = new Date(cachedData.last_updated);
      const now = new Date();
      const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate < 24) {
        console.log(`Using cached data for ${packageName}, ${hoursSinceUpdate.toFixed(1)} hours old`);
        return cachedData.stats_data;
      }
    }
    
    // Otherwise fetch fresh data
    console.log(`Fetching fresh data for ${packageName}`);
    const freshData = await getNpmDownloads(packageName);
    
    // Cache the fresh data for future use
    await cacheNpmStats(packageName, freshData);
    
    return freshData;
  } catch (error) {
    console.error(`Error in getOptimizedNpmStats for ${packageName}:`, error);
    // Fallback to direct fetch if anything goes wrong
    return await getNpmDownloads(packageName);
  }
}
