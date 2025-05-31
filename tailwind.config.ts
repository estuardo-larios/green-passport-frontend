import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        transparent: 'transparent',
        current: 'currentColor',
        white: '#ffffff',
        purple: '#4f46e5',
        midnight: '#121063',
        metal: '#565584',
        tahiti: '#3ab7bf',
        silver: '#ecebff',
        'bubble-gum': '#ff77e9',
        bermuda: '#78dcca',
        blue: '#1d4ed8',
        grey: '#475569',
        'grey-gum': '#cbd5e1',
        turquoise: '#4FD1C5',
        'grey-blue': '#A0AEC0',
        'ocean-blue': '#031C30',
        black: '#020617',
        red: '#b91c1c',
        'medium-blue-gray': '#2B4052',
        'light-periwinkle': '#A5B4FC',
        'blue-mist': '#EFF4FA',
        'light-blue': '#EFF4FA',
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '140px',
      },
      // gradientColorStopPositions solo si usas un plugin que lo soporte:
      // gradientColorStopPositions: {
      //   33: '33%',
      // },
    },
  },
  plugins: [],
};

export default config;
