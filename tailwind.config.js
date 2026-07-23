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
        torba: {
          brand: {
            50: '#E0F7FC',
            100: '#B8EEF9',
            500: '#00B2E3', // Electric Cyan Blue from screenshot
            600: '#0097C2',
            700: '#007AA1',
          },
          toin: {
            bg: '#FFF9E6', // Warm Cream Yellow from screenshot
            border: '#FEF08A',
            text: '#854D0E',
            gold: '#F59E0B',
          },
          coral: '#FF5722', // Bright Coral Orange (%20 İndirim badge)
          navy: '#0B132B',  // Dark Midnight Navy (Hero Banner)
          neutral: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            400: '#94A3B8',
            600: '#64748B',
            800: '#1E293B',
            950: '#0F172A',
          },
        }
      },
      borderRadius: {
        'torba-sm': '8px',
        'torba-md': '12px',
        'torba-lg': '16px',
        'torba-xl': '20px',
        'torba-2xl': '24px',
      },
      boxShadow: {
        'torba-card': '0 4px 16px rgba(15, 23, 42, 0.05)',
        'torba-floating': '0 -6px 24px rgba(15, 23, 42, 0.08)',
        'torba-modal': '0 20px 50px rgba(15, 23, 42, 0.16)',
      }
    },
  },
  plugins: [],
}
