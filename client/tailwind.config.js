/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Stitch MCP: Precision Enterprise Design System
        primary: {
          50:  '#eeefff',
          100: '#dbe1ff',
          200: '#b4c5ff',
          300: '#8da8ff',
          400: '#5c86ff',
          500: '#2563eb', // Stitch Brand Primary
          600: '#004ac6',
          700: '#003ea8',
          800: '#003188',
          900: '#00174b',
          950: '#000f33',
        },
        stitch: {
          surface: '#faf8ff',
          'surface-dim': '#d9d9e5',
          'surface-bright': '#faf8ff',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#f3f3fe',
          'surface-container': '#ededf9',
          'surface-container-high': '#e7e7f3',
          'surface-container-highest': '#e1e2ed',
          'on-surface': '#191b23',
          'on-surface-variant': '#434655',
          'outline': '#737686',
          'outline-variant': '#c3c6d7',
          'inverse-surface': '#2e3039',
          'inverse-on-surface': '#f0f0fb',
          'error': '#ba1a1a',
          'error-container': '#ffdad6',
          'on-error-container': '#93000a',
        },
        surface: {
          DEFAULT: '#faf8ff',
          card: '#ffffff',
          elevated: '#f3f3fe',
          border: '#e1e2ed',
        },
      },
      borderRadius: {
        // Precision Enterprise shape language (ROUND_FOUR = 4px standard)
        'sm':   '0.125rem', // 2px  — checkboxes, small chips
        DEFAULT: '0.25rem', // 4px  — inputs, small buttons
        'md':   '0.375rem', // 6px  — medium controls
        'lg':   '0.5rem',   // 8px  — cards, containers, modals
        'xl':   '0.75rem',  // 12px — large panels, AI panels
        '2xl':  '1rem',     // 16px — hero sections (standard Tailwind default)
        '3xl':  '1.5rem',   // 24px — extra-large (standard Tailwind default)
        'full': '9999px',   // pill — status badges, tags
      },
      boxShadow: {
        'xs':    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm':    '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.06)',
        'card':  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
      },
      spacing: {
        'unit':           '8px',
        'gutter':         '24px',
        'margin-desktop': '40px',
        'margin-mobile':  '16px',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
