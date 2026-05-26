import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green:  '#1D9E75',
          dark:   '#0F6E56',
          light:  '#E1F5EE',
          gold:   '#F59E0B',
          navy:   '#0F172A',
        },
      },
      fontFamily: {
        sans:    ['var(--font-outfit)', 'sans-serif'],
        display: ['var(--font-bebas)', 'sans-serif'],
        bengali: ['var(--font-hind)', 'Noto Sans Bengali', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        fadeIn:  'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
