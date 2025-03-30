// Import necessary modules
import { supabase } from './supabase';

// Function to get npm download stats for a package
export async function getNpmDownloads(packageName) {
  try {
    // Get the current date
    const now = new Date();
    
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // Format dates for the API
    const startDate = formatDateForNpm(thirtyDaysAgo);
    const endDate = formatDateForNpm(now);
    
    // Fetch download data from npm API
    const response = await fetch(`https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${packageName}`);
    
    if (!response.ok) {
      console.error(`Error fetching npm stats: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    
    // Return the downloads array
    return data.downloads || [];
  } catch (error) {
    console.error('Error in getNpmDownloads:', error);
    return [];
  }
}

// Function to get optimized npm stats (cached if possible)
export async function getOptimizedNpmStats(packageName) {
  try {
    // Check if we have cached stats in the database
    const { data: cachedStats, error } = await supabase
      .from('npm_stats_cache')
      .select('stats_data, last_updated')
      .eq('package_name', packageName)
      .single();
    
    // If we have recent cached stats (less than 24 hours old), use them
    if (cachedStats && !error) {
      const lastUpdated = new Date(cachedStats.last_updated);
      const now = new Date();
      const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate < 24) {
        return cachedStats.stats_data;
      }
    }
    
    // Otherwise, fetch fresh stats
    const freshStats = await getNpmDownloads(packageName);
    
    // Cache the fresh stats if we got them
    if (freshStats && freshStats.length > 0) {
      await supabase
        .from('npm_stats_cache')
        .upsert({
          package_name: packageName,
          stats_data: freshStats,
          last_updated: new Date().toISOString()
        }, { onConflict: 'package_name' });
    }
    
    return freshStats;
  } catch (error) {
    console.error('Error in getOptimizedNpmStats:', error);
    return [];
  }
}

// Function to calculate total downloads from stats array
export function getTotalDownloads(stats) {
  if (!stats || !Array.isArray(stats)) return 0;
  return stats.reduce((total, day) => total + (day.downloads || 0), 0);
}

// Function to format download numbers for display
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

// Helper function to format date for npm API
function formatDateForNpm(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to determine if a package is trending
export function isTrendingPackage(stats) {
  if (!stats || !Array.isArray(stats) || stats.length < 14) {
    return false;
  }
  
  // Get the first and second half of the stats (each should be about a week)
  const halfIndex = Math.floor(stats.length / 2);
  const firstHalf = stats.slice(0, halfIndex);
  const secondHalf = stats.slice(halfIndex);
  
  // Calculate total downloads for each half
  const firstHalfDownloads = firstHalf.reduce((sum, day) => sum + (day.downloads || 0), 0);
  const secondHalfDownloads = secondHalf.reduce((sum, day) => sum + (day.downloads || 0), 0);
  
  // Calculate growth percentage
  if (firstHalfDownloads === 0) return false;
  
  const growthPercentage = ((secondHalfDownloads - firstHalfDownloads) / firstHalfDownloads) * 100;
  
  // Consider trending if growth is at least 5%
  return growthPercentage >= 5;
}
