import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify({
    imageCDN: true,
    edgeMiddleware: true,
    cacheOnDemandPages: true,
  }),
  integrations: [react(), tailwind()],
  vite: {
    build: {
      // Optimize chunks
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code into separate chunks
            'react-vendor': ['react', 'react-dom'],
            'chart-vendor': ['chart.js', 'react-chartjs-2'],
            'supabase-vendor': ['@supabase/supabase-js']
          }
        }
      }
    },
    // Add optimizations for development and production
    optimizeDeps: {
      include: ['react', 'react-dom', 'chart.js', 'react-chartjs-2']
    },
    ssr: {
      // Optimize SSR
      noExternal: ['chart.js', 'react-chartjs-2']
    }
  }
});
