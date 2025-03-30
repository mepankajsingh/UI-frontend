/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.65rem', // Add smaller text size for labels
      },
      lineHeight: {
        'tighter': '0.85rem', // Add tighter line height for labels
      },
    },
  },
  plugins: [],
}
