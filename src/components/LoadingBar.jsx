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
    
    return () => {
      NProgress.done();
    };
  }, []);

  return null;
}
