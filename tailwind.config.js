/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        ink: '#0b0d12',
        paper: '#f6f5f1',
        accent: '#ff5a1f',
        accent2: '#2f6fed',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};
