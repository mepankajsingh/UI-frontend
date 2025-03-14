/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(136, 58, 234)',
        'accent-light': 'rgb(224, 204, 250)',
        'accent-dark': 'rgb(49, 10, 101)',
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
};
