/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        eliteBlack: '#0a0a0a',
        eliteBlackSoft: '#1a1a1a',
        eliteBlackCard: '#252525',
        eliteGold: '#c9a227',
        eliteGoldLight: '#d4b848',
        eliteGoldDark: '#a68a1f'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        subheading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
