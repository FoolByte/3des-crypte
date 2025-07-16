/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transition: {
        theme: 'background-color 0.5s ease-in-out, color 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
