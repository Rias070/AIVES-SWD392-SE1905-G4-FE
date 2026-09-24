/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        liquid: {
          darkest: '#1C1815',     // Nền tối nhất: nâu đen ấm
          surface: '#3A332C',     // Nền trung tính: nâu xám khói
          silver: '#B8B0A6',      // Bạc kim loại: ánh xám ấm
          lightSilver: '#E8E2D8', // Bạc sáng cao: ánh kim
          gold: '#C9A876',        // Vàng đồng: champagne
          goldDark: '#8B6F47',    // Vàng đồng đậm: viền/shadow
          ivory: '#F5F0E8',       // Chữ chính: trắng ngà
          divider: '#5C554C',     // Viền phân tách: xám khói
        },
        brand: {
          50: '#faf6f0',
          100: '#f5eee2',
          200: '#ebd9bf',
          300: '#dec096',
          400: '#c9a876',
          500: '#b8945d',
          600: '#8b6f47',
          700: '#6f5738',
          800: '#52402a',
          900: '#3a2d1e',
          950: '#1c1815',
        },
        dark: {
          bg: '#1C1815',
          card: '#3A332C',
          border: '#5C554C',
        }
      },
      borderRadius: {
        'liquid-sm': '16px',
        'liquid': '20px',
        'liquid-lg': '24px',
        'liquid-xl': '28px',
      },
      boxShadow: {
        'liquid-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(232, 226, 216, 0.2)',
        'liquid-glow': '0 0 25px -4px rgba(201, 168, 118, 0.35)',
        'liquid-card': '0 12px 36px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(232, 226, 216, 0.15)',
        'liquid-btn': '0 4px 18px 0 rgba(201, 168, 118, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
      },
      backgroundImage: {
        'liquid-overall': 'linear-gradient(135deg, #1C1815 0%, #3A332C 35%, #B8B0A6 65%, #E8E2D8 100%)',
        'liquid-gold': 'linear-gradient(180deg, #E8E2D8 0%, #C9A876 50%, #8B6F47 100%)',
        'liquid-glass': 'linear-gradient(135deg, rgba(232, 226, 216, 0.08) 0%, rgba(58, 51, 44, 0.75) 100%)',
      }
    },
  },
  plugins: [],
}
