/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/*.{js,ts,jsx,tsx}',
    './src/***/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

