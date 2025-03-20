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

// Check if a package is trending (2% week-over-week growth)
export function isTrendingPackage(downloadsData) {
  // Debug: Log the data we're working with
  console.log("Checking if trending with data:", downloadsData?.length || 0, "days");
  
  if (!downloadsData || !Array.isArray(downloadsData) || downloadsData.length < 14) {
    console.log("Not enough data to determine trending status");
    return false;
  }
  
  // Get the last 14 days of data
  const last14Days = downloadsData.slice(-14);
  
  // Calculate downloads for current week (last 7 days)
  const currentWeek = last14Days.slice(-7);
  const currentWeekDownloads = currentWeek.reduce((sum, day) => sum + (day.downloads || 0), 0);
  
  // Calculate downloads for previous week (7 days before current week)
  const previousWeek = last14Days.slice(0, 7);
  const previousWeekDownloads = previousWeek.reduce((sum, day) => sum + (day.downloads || 0), 0);
  
  // Debug: Log the calculations
  console.log(`Current week: ${currentWeekDownloads}, Previous week: ${previousWeekDownloads}`);
  
  // Prevent division by zero
  if (previousWeekDownloads === 0) {
    return false;
  }
  
  // Calculate percentage increase
  const percentageIncrease = ((currentWeekDownloads - previousWeekDownloads) / previousWeekDownloads) * 100;
  console.log(`Percentage increase: ${percentageIncrease.toFixed(2)}%`);
  
  // Return true if increase is at least 2%
  return percentageIncrease >= 2;
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
    if (!packageName || !stats) return
    if (!packageName || !stats) return;
    
    const { error } = await supabase
      .from('npm_stats_cache')
      .upsert({
        package_name: packageName,
        stats_data: stats,
        last_updated: new Date().toISOString()
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
    
    // Try to get from cache first
    const { data: cachedData } = await supabase
      .from('npm_stats_cache')
      .select('stats_data, last_updated')
      .eq('package_name', packageName)
      .single();
    
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
