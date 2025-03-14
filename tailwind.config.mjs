/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo-500
        'primary-light': '#818cf8', // Indigo-400
        'primary-dark': '#4f46e5', // Indigo-600
        'primary-bg': '#f9fafb', // Gray-50
        'primary-text': '#1f2937', // Gray-800
        'secondary-text': '#4b5563', // Gray-600
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
