/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 requires this preset
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0984E3',
        secondary: '#00B894',
        danger: '#D63031',
        dark: '#2D3436',
        light: '#F5F7FA',
        gray: '#636E72',
      },
    },
  },
  plugins: [],
};