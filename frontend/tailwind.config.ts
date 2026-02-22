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
        goldGlowHover: '0 0 40px rgba(212,175,55,0.35)',
        goldGlowStrong: '0 0 60px rgba(212,175,55,0.4)',
        cardGlow: '0 0 30px rgba(212,175,55,0.12), inset 0 1px 0 rgba(212,175,55,0.08)',
      },
      dropShadow: {
        goldText: '0 0 12px rgba(212,175,55,0.6)',
        goldTextStrong: '0 0 20px rgba(212,175,55,0.8)',
      },
      animation: {
        'sparkle': 'sparkle-drift 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
