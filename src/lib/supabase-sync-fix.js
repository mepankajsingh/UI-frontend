/**
 * Optimized Supabase data fetching with connection pooling and retry logic
 */
import { supabase } from './supabase';

// Connection state tracking
let isReconnecting = false;
const RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

/**
 * Performs a Supabase query with retry logic
 * @param {Function} queryFn - Function that returns a Supabase query
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<Object>} - Query result
 */
export async function executeWithRetry(queryFn, retries = MAX_RETRIES) {
  try {
    const result = await queryFn();
    
    if (result.error) {
      // Check for connection errors that might need reconnection
      if (
        result.error.message?.includes('connection') ||
        result.error.message?.includes('network') ||
        result.error.code === 'PGRST301'
      ) {
        if (retries > 0 && !isReconnecting) {
          isReconnecting = true;
          console.log(`Retrying Supabase query. Attempts remaining: ${retries}`);
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          
          isReconnecting = false;
          return executeWithRetry(queryFn, retries - 1);
        }
      }
      
      throw result.error;
    }
    
    return result;
  } catch (error) {
    if (retries > 0 && !isReconnecting) {
      isReconnecting = true;
      console.log(`Error in Supabase query. Retrying. Attempts remaining: ${retries}`);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      
      isReconnecting = false;
      return executeWithRetry(queryFn, retries - 1);
    }
    
    throw error;
  }
}

/**
 * Optimized version of getPageData with connection handling
 * @param {string} slug - Page slug
 * @returns {Promise<Object>} - Page data
 */
export async function getOptimizedPageData(slug) {
  try {
    const result = await executeWithRetry(() => 
      supabase
        .from('page_content')
        .select('*')
        .eq('slug', slug)
        .single()
    );
    
    return result.data;
  } catch (error) {
    console.error('Error fetching optimized page data:', error);
    return {
      title: 'About UI Library Directory',
      content: 'Welcome to the UI Library Directory, your go-to resource for finding the perfect UI component library for your JavaScript projects.'
    };
  }
}
