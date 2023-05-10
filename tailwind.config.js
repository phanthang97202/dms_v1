/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        's-active': '#098850',
        's-inactive': '#E48203',
      },
    },
  },
  plugins: [],
}

