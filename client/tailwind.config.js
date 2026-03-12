/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#fefdf8', 100: '#fdf9ed', 200: '#f9f0d0', 300: '#f3e4a8', 400: '#ebd07a', 500: '#e0bb52', 600: '#d4a017', 700: '#b5850f', 800: '#956a10', 900: '#7a5510' },
        gold: { 100: '#fef7e0', 200: '#fdedb8', 300: '#fad887', 400: '#f6be3a', 500: '#e8a000', 600: '#c98000', 700: '#a66200', 800: '#854d00', 900: '#6b3d00' },
        navy: { 50: '#f0f4f8', 100: '#d9e2ec', 200: '#bcccdc', 300: '#9fb3c8', 400: '#829ab1', 500: '#627d98', 600: '#486581', 700: '#334e68', 800: '#243b53', 900: '#102a43' },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Lato', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
      }
    },
  },
  plugins: [],
}
