const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, './index.html'),
    path.join(__dirname, './src/**/*.{js,jsx}')
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#F8F6F2',
        primary: '#7A5C45',
        secondary: '#A27B5C',
        card: '#FFFFFF',
        textDark: '#3E2E22'
      },
      borderRadius: {
        card: '18px'
      },
      boxShadow: {
        soft: '0 2px 12px rgba(122, 92, 69, 0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
