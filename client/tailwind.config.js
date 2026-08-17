/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'hsl(200, 100%, 50%)',
        page: 'hsl(210, 40%, 98%)',
      },
    },
  },
  plugins: [],
}
