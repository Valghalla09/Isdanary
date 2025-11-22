/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // New IsdaNary theme tokens
        primary: '#0F9BB5',
        primaryDark: '#3C8F8B',
        primaryLight: '#95CACF',
        // keep secondary as a soft variant of primary for now
        secondary: '#95CACF',
        background: '#F7F8F8',
        card: '#FFFFFF',
        muted: '#ECF1F1',
        textDark: '#2A2A2A',
        textMuted: '#486A77',
        accent: '#F9EBB4',
      },
    },
  },
  plugins: [],
};
