// This file contains functions to improve Supabase data synchronization on Netlify

import { supabase } from './supabase';

// Function to force a fresh fetch from Supabase, bypassing any caching
export async function fetchWithNoCache(table, query) {
  try {
    // Add a cache-busting timestamp to ensure we get fresh data
    const timestamp = new Date().getTime();
    
    // Execute the query with cache headers
    const { data, error } = await supabase
      .from(table)
      .select(query)
      .order('id', { ascending: false })
      // Use the noCacheHeaders option
      .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      .setHeader('Pragma', 'no-cache')
      .setHeader('Expires', '0')
      // Add a dummy filter that changes on each request to bypass any caching
      .filter('cache_buster', 'eq', timestamp.toString());
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in fetchWithNoCache:', error);
    return null;
  }
}

// Function to implement real-time subscriptions for critical data
export function subscribeToChanges(table, callback) {
  const subscription = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
      console.log('Change received!', payload);
      callback(payload);
    })
    .subscribe();
  
  return subscription;
}

// Function to check if Netlify is serving stale content
export async function checkNetlifyCacheStatus() {
  try {
    // Make a request to a special endpoint that returns current time
    const response = await fetch('/.netlify/functions/timestamp');
    const data = await response.json();
    
    // Compare server time with client time
    const serverTime = new Date(data.timestamp);
    const clientTime = new Date();
    const diffInSeconds = Math.abs((clientTime - serverTime) / 1000);
    
    console.log(`Time difference between client and server: ${diffInSeconds} seconds`);
    
    return {
      isCacheStale: diffInSeconds > 60, // Consider cache stale if more than 60 seconds difference
      serverTime,
      clientTime,
      diffInSeconds
    };
  } catch (error) {
    console.error('Error checking Netlify cache status:', error);
    return { error: error.message };
  }
}

// Function to implement optimistic UI updates
export function optimisticUpdate(table, record, callback) {
  // Immediately update UI
  callback(record);
  
  // Then perform the actual database update
  return supabase
    .from(table)
    .upsert(record)
    .then(({ data, error }) => {
      if (error) {
        console.error('Error in optimistic update:', error);
        // You might want to revert the UI change here
        return { success: false, error };
      }
      return { success: true, data };
    });
}
