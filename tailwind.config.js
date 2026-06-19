/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        terminal: {
          bg: '#022c22',
          text: '#4ade80',
          panel: 'rgba(2, 44, 34, 0.8)',
        }
      }
    },
  },
  plugins: [],
}
