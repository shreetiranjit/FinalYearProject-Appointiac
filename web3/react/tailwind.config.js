/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0e0e0e', 
          600: '#0e0e0e',
          700: '#0e0e0e',
        },
        secondary: {
          500 : '4CB9D4',
        }
      },
    },
  },
  plugins: [],
}