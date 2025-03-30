import React, { useEffect, useState } from 'react';

/**
 * Loading bar component that appears at the top of the page during navigation
 */
export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let timeout;
    let interval;
    
    // Function to handle route changes
    const handleRouteChangeStart = () => {
      setLoading(true);
      setProgress(0);
      
      // Simulate progress
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
    };
    
    const handleRouteChangeComplete = () => {
      clearInterval(interval);
      setProgress(100);
      
      // Reset after animation completes
      timeout = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300); // Increased timeout to ensure animation completes
    };
    
    // Add event listeners for navigation
    document.addEventListener('astro:before-swap', handleRouteChangeStart);
    document.addEventListener('astro:after-swap', handleRouteChangeComplete);
    
    // Handle initial page load completion
    document.addEventListener('DOMContentLoaded', () => {
      setLoading(false);
      setProgress(0);
    });
    
    // Also handle astro:page-load event which fires when the page is fully loaded
    document.addEventListener('astro:page-load', () => {
      clearInterval(interval);
      setProgress(100);
      
      timeout = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    });
    
    // Clean up
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      document.removeEventListener('astro:before-swap', handleRouteChangeStart);
      document.removeEventListener('astro:after-swap', handleRouteChangeComplete);
      document.removeEventListener('DOMContentLoaded', handleRouteChangeComplete);
      document.removeEventListener('astro:page-load', handleRouteChangeComplete);
    };
  }, []);
  
  if (!loading && progress === 0) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div 
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          transition: progress === 100 ? 'width 200ms ease-out' : 'width 400ms ease-in'
        }}
      />
    </div>
  );
}
