/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'circuit-bg': '#02040a',
        'neon-violet': '#8b5cf6',
        'electric-purple': '#a855f7',
        'amethyst': '#7e22ce',
      }
    },
  },
  plugins: [],
}
