import { useState, useEffect } from 'react';

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigationStart = () => {
      setProgress(0);
      setIsVisible(true);
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress < 90 ? newProgress : 90;
        });
      }, 200);
      
      return () => clearInterval(interval);
    };

    const handleNavigationEnd = () => {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 300);
    };

    // Listen for custom events
    window.addEventListener('navigationStart', handleNavigationStart);
    window.addEventListener('navigationEnd', handleNavigationEnd);

    return () => {
      window.removeEventListener('navigationStart', handleNavigationStart);
      window.removeEventListener('navigationEnd', handleNavigationEnd);
    };
  }, []);

  if (!isVisible && progress !== 100) return null;

  return (
    <div 
      className={`fixed top-0 left-0 h-1 bg-accent-light z-50 transition-all duration-300 ease-out ${progress === 100 ? 'opacity-0' : 'opacity-100'}`}
      style={{ width: `${progress}%` }}
    />
  );
}
