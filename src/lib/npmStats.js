import { supabase } from './supabase';

// Function to get date range for the last 30 days
function getLastMonthDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  // Format dates as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    start: formatDate(startDate),
    end: formatDate(endDate)
  };
}

// Cache to store API responses with expiration (5 minutes)
const apiCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to fetch npm download stats for a package
export async function getNpmDownloads(packageName) {
  if (!packageName) return null;
  
  try {
    // Generate a unique cache key for this package
    const cacheKey = `npm-downloads-${packageName}`;
    
    // Check if we have a valid cached response
    const cachedData = apiCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRY) {
      console.log(`Using cached data for ${packageName}`);
      return cachedData.data;
    }
    
    const dateRange = getLastMonthDateRange();
    const rangeParam = `${dateRange.start}:${dateRange.end}`;
    
    // Direct URL format with package name
    const apiUrl = `https://api.npmjs.org/downloads/range/${rangeParam}/${encodeURIComponent(packageName)}`;
    
    console.log(`Fetching npm stats from: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`Error fetching npm stats for ${packageName}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    // Validate the data structure
    if (!data || !data.downloads || !Array.isArray(data.downloads)) {
      console.error(`Invalid data structure received from npm API for ${packageName}:`, data);
      return null;
    }
    
    // Sort the downloads by date to ensure chronological order
    data.downloads.sort((a, b) => new Date(a.day) - new Date(b.day));
    
    // Cache the response
    apiCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching npm downloads for ${packageName}:`, error);
    return null;
  }
}

// Function to get the total downloads for the last month
export function getTotalDownloads(downloadsData) {
  if (!downloadsData || !downloadsData.downloads || !Array.isArray(downloadsData.downloads)) return 0;
  
  return downloadsData.downloads.reduce((total, day) => total + day.downloads, 0);
}

// Function to format the download count
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

// Function to update the npm_package_name for a framework or library
export async function updateNpmPackageName(type, id, packageName) {
  try {
    const { error } = await supabase
      .from(type) // 'frameworks' or 'libraries'
      .update({ npm_package_name: packageName })
      .eq('id', id);
      
    if (error) {
      console.error(`Error updating ${type} npm_package_name:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in updateNpmPackageName for ${type}:`, error);
    return false;
  }
}
