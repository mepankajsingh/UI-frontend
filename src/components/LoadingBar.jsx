import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function LoadingBar() {
  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      minimum: 0.1,
      easing: 'ease',
      speed: 500
    });
    
    // Setup navigation event listeners for Astro's view transitions
    document.addEventListener('astro:page-load', () => {
      NProgress.done();
    });
    
    document.addEventListener('astro:before-preparation', () => {
      NProgress.start();
    });
    
    document.addEventListener('astro:after-preparation', () => {
      NProgress.set(0.4);
    });
    
    document.addEventListener('astro:after-swap', () => {
      NProgress.set(0.8);
    });
    
    return () => {
      NProgress.done();
      // Clean up event listeners
      document.removeEventListener('astro:page-load', () => {
        NProgress.done();
      });
      
      document.removeEventListener('astro:before-preparation', () => {
        NProgress.start();
      });
      
      document.removeEventListener('astro:after-preparation', () => {
        NProgress.set(0.4);
      });
      
      document.removeEventListener('astro:after-swap', () => {
        NProgress.set(0.8);
      });
    };
  }, []);

  return null;
}
