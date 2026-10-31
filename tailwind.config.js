export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#f3f6f4',
        line: '#e3e9e5',
        ink: {
          DEFAULT: '#14251b',
          muted: '#5f6f66',
          soft: '#8a978f',
        },
        brand: {
          50: '#ecf7ef',
          100: '#d4eedb',
          200: '#a9dcb6',
          300: '#76c58d',
          400: '#43ad65',
          500: '#22a447',
          600: '#1a8a3a',
          700: '#156f30',
          800: '#115529',
          900: '#0d3f20',
          950: '#0a2414',
        },
        water: {
          50: '#e8f3fd',
          100: '#cfe5fa',
          500: '#2f8fe0',
          600: '#1f74c0',
        },
        heat: {
          50: '#fdecec',
          100: '#fad5d6',
          500: '#e5484d',
          600: '#c8343a',
        },
        soil: {
          100: '#f1e7da',
          300: '#cfae88',
          500: '#8b6a47',
        },
        sun: {
          50: '#fef5e2',
          100: '#fde8bb',
          500: '#f2a20c',
          600: '#c98204',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 40, 24, 0.06), 0 1px 1px rgba(16, 40, 24, 0.03)',
        pop: '0 12px 32px -8px rgba(16, 40, 24, 0.22)',
      },
    },
  },
};
