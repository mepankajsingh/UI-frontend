import React, { useEffect, useState, useRef } from 'react';

/**
 * Loading bar component that appears at the top of the page during navigation
 */
export default function LoadingBar() {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const mountedRef = useRef(true);
  const timersRef = useRef([]);

  // Helper to safely clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => {
      if (timer.type === 'timeout') {
        clearTimeout(timer.id);
      } else if (timer.type === 'interval') {
        clearInterval(timer.id);
      }
    });
    timersRef.current = [];
  };

  // Helper to add a timer to our ref for tracking
  const addTimer = (id, type) => {
    timersRef.current.push({ id, type });
    return id;
  };

  // Start the loading animation
  const start = () => {
    if (!mountedRef.current) return;
    
    // Clear any existing timers
    clearAllTimers();
    
    // Show the bar and reset width
    setVisible(true);
    setWidth(0);
    
    // Animate to 90%
    const intervalId = setInterval(() => {
      if (!mountedRef.current) return;
      
      setWidth(w => {
        if (w >= 90) {
          clearInterval(intervalId);
          return 90;
        }
        return w + (90 - w) / 10;
      });
    }, 100);
    
    addTimer(intervalId, 'interval');
  };

  // Complete the loading animation
  const complete = () => {
    if (!mountedRef.current) return;
    
    // Clear any existing timers
    clearAllTimers();
    
    // Animate to 100%
    setWidth(100);
    
    // Hide after animation completes
    const timeoutId = setTimeout(() => {
      if (!mountedRef.current) return;
      setVisible(false);
      
      // Reset width after hiding (with delay to ensure transition completes)
      const resetId = setTimeout(() => {
        if (!mountedRef.current) return;
        setWidth(0);
      }, 100);
      
      addTimer(resetId, 'timeout');
    }, 500);
    
    addTimer(timeoutId, 'timeout');
  };

  useEffect(() => {
    // Mark component as mounted
    mountedRef.current = true;
    
    // Handle navigation events
    const handleBeforeNavigate = () => {
      console.log('Navigation started');
      start();
    };
    
    const handleAfterNavigate = () => {
      console.log('Navigation completed');
      complete();
    };
    
    // Register Astro navigation events
    document.addEventListener('astro:before-swap', handleBeforeNavigate);
    document.addEventListener('astro:after-swap', handleAfterNavigate);
    document.addEventListener('astro:page-load', handleAfterNavigate);
    
    // Simulate initial loading for visual feedback
    start();
    
    // Complete the initial loading after a short delay
    const initialLoadTimer = setTimeout(() => {
      complete();
    }, 500);
    
    addTimer(initialLoadTimer, 'timeout');
    
    // Clean up function
    return () => {
      mountedRef.current = false;
      clearAllTimers();
      
      // Remove event listeners
      document.removeEventListener('astro:before-swap', handleBeforeNavigate);
      document.removeEventListener('astro:after-swap', handleAfterNavigate);
      document.removeEventListener('astro:page-load', handleAfterNavigate);
    };
  }, []);
  
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-2 pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 300ms linear' }}
    >
      <div 
        className="h-full bg-blue-600"
        style={{ 
          width: `${width}%`,
          transition: width === 100 ? 'width 300ms ease-out' : 'width 600ms ease-in'
        }}
      />
    </div>
  );
}
