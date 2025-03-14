import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: netlify({
    imageCDN: true,
    isr: {
      // Cache pages for 1 day (in seconds)
      expiration: 60 * 60 * 24,
    }
  }),
  integrations: [react(), vue(), tailwind()]
});
