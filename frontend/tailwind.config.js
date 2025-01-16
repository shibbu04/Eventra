/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6', // Purple
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        secondary: {
          DEFAULT: '#FCD34D', // Yellow
          dark: '#F59E0B',
          light: '#FDE68A',
        }
      }
    },
  },
  plugins: [],
};