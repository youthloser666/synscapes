/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070709',
        surface: 'rgba(20, 20, 24, 0.7)',
        'surface-card': 'rgba(15, 15, 18, 0.85)',
      },
      fontFamily: {
        sans: ['Exo', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Michroma', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
