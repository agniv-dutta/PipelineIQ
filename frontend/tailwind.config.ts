import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        card: '#111111',
        gold: {
          100: '#FFF4D6',
          300: '#F5D78E',
          500: '#D4AF37',
          600: '#C9A227',
          700: '#A67C00',
        },
        border: 'rgba(212,175,55,0.15)',
      },
      boxShadow: {
        goldGlow: '0 0 25px rgba(212,175,55,0.15)',
        goldGlowHover: '0 0 35px rgba(212,175,55,0.25)',
      },
      dropShadow: {
        goldText: '0 0 8px rgba(212,175,55,0.5)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
