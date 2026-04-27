import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Emerald Green
        'emerald-primary': '#059669',
        // Secondary Mint Light
        'mint-secondary': '#D1FAE5',
        // Surface Off-White
        'surface': '#F9FAFB',
        // Text Slate Dark
        'text-slate': '#1E293B',
        // Additional colors
        'white': '#FFFFFF',
        'red-soft': '#EF4444',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
      },
    },
  },
  plugins: [],
}

export default config
