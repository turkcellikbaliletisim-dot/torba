/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        torba: {
          brand: {
            50: '#F1FBFE',
            100: '#DDF6FD',
            500: '#00B7EB',
            600: '#009BC8',
            700: '#007DA3',
          },
          neutral: {
            50: '#F7FAFC',
            100: '#EDF3F6',
            200: '#DCE6EB',
            400: '#9AAAB3',
            600: '#647681',
            800: '#263B46',
            950: '#10212B',
          },
          campaign: '#FF6B35',
          points: '#F4B400',
          premium: '#7B61FF',
          success: '#16A56A',
          warning: '#F4A62A',
          error: '#E34D59',
          info: '#2C7BE5',
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
        'torba-card': '0 6px 20px rgba(16, 33, 43, 0.07)',
        'torba-floating': '0 -8px 28px rgba(16, 33, 43, 0.10)',
        'torba-modal': '0 20px 50px rgba(16, 33, 43, 0.16)',
      }
    }
  }
};
