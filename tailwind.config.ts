import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}<boltArtifact id="tailwind-config-update" title="Update Tailwind Config for Font Sizes">
<boltAction type="file" filePath="tailwind.config.mjs">
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      fontSize: {
        'xs': '0.875rem',     // Increased from default 0.75rem
        'sm': '1rem',         // Increased from default 0.875rem
        'base': '1.125rem',   // Increased from default 1rem
        'lg': '1.25rem',      // Increased from default 1.125rem
        'xl': '1.375rem',     // Increased from default 1.25rem
        '2xl': '1.625rem',    // Increased from default 1.5rem
        '3xl': '1.875rem',    // Increased from default 1.875rem (kept same)
        '4xl': '2.5rem',      // Increased from default 2.25rem
        '5xl': '3.25rem',     // Increased from default 3rem
        '6xl': '4.25rem',     // Increased from default 3.75rem
      }
    },
  },
  plugins: [typography],
}
