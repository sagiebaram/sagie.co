/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        silver: '#C0C0C0',
        'silver-mid': '#757575',
        'card-bg': '#0a0a0a',
        'pillar-green': '#2E7D32',
        'pillar-blue': '#1565C0',
        'pillar-silver': '#757575',
      },
      letterSpacing: {
        eyebrow: '0.28em',
        label: '0.18em',
      },
    },
  },
  plugins: [],
}
