/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        torbaa: {
          green: '#00C853',
          darkGreen: '#00A843',
          lightGreen: '#E8F5E9',
          gold: '#FFD700',
          dark: '#121824',
          cardDark: '#1E293B',
          accent: '#FF6F00',
        },
      },
    },
  },
  plugins: [],
}
