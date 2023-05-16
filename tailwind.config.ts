import forms from '@tailwindcss/forms';
import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss/types';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        gravity: {
          50: '#1a202c',
          100: '#181d28',
          200: '#0f131a',
          300: '#0d1016',
          400: '#0b0d12',
          500: '#090b0f',
          600: '#07080b',
          700: '#040507',
          800: '#020304',
          900: '#000000',
        },
      },
      backgroundColor: {
        'airbroke-800': '#192231',
        'airbroke-900': '#1F2937',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            'display': 'none'
          }
        }
      });
    }),
    forms
  ],
};
export default config;
