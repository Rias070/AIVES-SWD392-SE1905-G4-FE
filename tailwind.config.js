/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0284c7",
          dark: "#0369a1",
          light: "#38bdf8",
        },
        accent: {
          cyan: "#06b6d4",
          sky: "#0284c7",
        },
        glacier: {
          surface: "rgba(255, 255, 255, 0.85)",
          subtle: "rgba(248, 250, 252, 0.75)",
          border: "rgba(226, 232, 240, 0.85)",
          borderAccent: "rgba(186, 230, 253, 0.65)"
        },
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        }
      },
      borderRadius: {
        'glacier-sm': '8px',
        'glacier': '12px',
        'glacier-lg': '16px',
        'glacier-xl': '20px',
        'glacier-2xl': '24px',
      },
      boxShadow: {
        'glacier-panel': '0 10px 30px -5px rgba(14, 116, 144, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.95)',
        'glacier-card': '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)',
        'glacier-btn': '0 4px 16px -2px rgba(2, 132, 199, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.35)',
      },
      backgroundImage: {
        'glacier-primary': 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
        'glacier-hover': 'linear-gradient(135deg, #0369a1 0%, #0891b2 100%)',
      }
    },
  },
  plugins: [],
}
