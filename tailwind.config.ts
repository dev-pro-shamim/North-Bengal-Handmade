import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070c0a',
          900: '#0c1411',
          850: '#111d18',
          800: '#172721',
          700: '#233a32',
        },
        jute: {
          50: '#faf7f0',
          100: '#f4ede0',
          200: '#e8dac0',
          300: '#d9c29b',
          400: '#caa875',
          500: '#b88d51',
          600: '#9d713a',
          700: '#7e562b',
          800: '#644324',
          900: '#4e331c',
        },
        emeraldBrand: {
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        linen: {
          50: '#fdfbf7',
          100: '#f7f4ee',
          200: '#efe9dc',
        }
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        serif: ['var(--font-poppins)', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
      },
      boxShadow: {
        'glow-amber': '0 0 35px -5px rgba(202, 168, 117, 0.35)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.3)',
        'soft-card': '0 10px 40px -10px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};
export default config;
