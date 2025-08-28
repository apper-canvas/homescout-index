/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f1',
          100: '#dbeede',
          500: '#2C5530',
          600: '#1f3b23',
          700: '#1a3220',
          800: '#16291c',
          900: '#122118'
        },
        secondary: {
          50: '#f7f5f2',
          100: '#ede9e3',
          500: '#8B6F47',
          600: '#6d5638',
          700: '#5c4830',
          800: '#4b3d28',
          900: '#3d3220'
        },
        accent: {
          50: '#fdf9f3',
          100: '#f9f0e3',
          500: '#D4A574',
          600: '#c4925a',
          700: '#b37f4d',
          800: '#926841',
          900: '#785638'
        },
        surface: '#FFFFFF',
        background: '#F8F6F3',
        success: '#4A7C59',
        warning: '#E9B44C',
        error: '#C73E1D',
        info: '#4A6FA5'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}