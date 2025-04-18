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
});
