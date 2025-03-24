import { supabase } from './supabase';

// Function to get npm download stats for a package
export async function getNpmDownloads(packageName) {
  if (!packageName) return null;
  
  try {
    // Calculate date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Format dates as YYYY-MM-DD
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    console.log(`Fetching npm stats for ${packageName} from ${formattedStartDate} to ${formattedEndDate}`);
    
    // Fetch download data from npm API
    const response = await fetch(
      `https://api.npmjs.org/downloads/range/${formattedStartDate}:${formattedEndDate}/${packageName}`
    );
    
    if (!response.ok) {
      console.error(`Error fetching npm stats: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Received npm stats for ${packageName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error in getNpmDownloads for ${packageName}:`, error);
    return null;
  }
}

// Function to calculate total downloads from npm data
export function getTotalDownloads(downloadsData) {
  if (!downloadsData || !downloadsData.downloads || !Array.isArray(downloadsData.downloads)) {
    return 0;
  }
  
  return downloadsData.downloads.reduce((total, day) => total + day.downloads, 0);
}

// Function to format download numbers
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
