/** @type {import('tailwindcss').Config} */

export default {
  content: ['./*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  darkMode: 'class', // or 'media'
  heme: {
    extend: {
      colors: {
        // Define custom colors if needed
        darkBg: '#1a202c',
        darkText: '#a0aec0',
      },
    },
  },
  plugins: [],
}

