/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Sophisticated Color Palette with Depth and Nuance
      colors: {
        // Modern Primary Palette
        primary: {
          50: '#e6f3e8',
          100: '#c2e3c2',
          200: '#9bd39b',
          300: '#74c374',
          400: '#50b450',
          500: '#0a8c33',   // Base primary color
          600: '#087a2c',
          700: '#066625',
          800: '#04521e',
          900: '#023917',
        },

        // Refined Secondary Palette
        secondary: {
          50: '#fff9e6',
          100: '#ffeeb8',
          200: '#ffe289',
          300: '#ffd65a',
          400: '#ffcc2b',
          500: '#FFD700',   // Base secondary color
          600: '#e6c200',
          700: '#cc ac00',
          800: '#b39600',
          900: '#997f00',
        },

        // Accent and Complementary Colors
        accent: {
          50: '#ffe6e6',
          100: '#ffb8b8',
          200: '#ff8989',
          300: '#ff5a5a',
          400: '#ff2b2b',
          500: '#FF6347',   // Base accent color
          600: '#e64030',
          700: '#cc2a1a',
          800: '#b31404',
          900: '#990000',
        },

        // Neutral Palette with More Depth
        neutral: {
          50: '#f7f7f9',
          100: '#eaeaf0',
          200: '#dcdce6',
          300: '#cecedd',
          400: '#c0c0d3',
          500: '#a6a6c2',
          600: '#8c8cb0',
          700: '#72729e',
          800: '#58588c',
          900: '#3e3e7a',
        },

        // Enhanced Dark Mode Colors
        dark: {
          50: '#e6e6eb',
          100: '#b8b8c7',
          200: '#8989a3',
          300: '#5a5a7f',
          400: '#2b2b5b',
          500: '#1a1a4a',
          600: '#14143c',
          700: '#0e0e2e',
          800: '#080820',
          900: '#020212',
        },
      },

      // Advanced Typography and Font Scaling
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1', fontWeight: '700' }],
        '6xl': ['3.75rem', { lineHeight: '1', fontWeight: '700' }],
        '7xl': ['4.5rem', { lineHeight: '1', fontWeight: '700' }],
        '8xl': ['6rem', { lineHeight: '1', fontWeight: '700' }],
        '9xl': ['8rem', { lineHeight: '1', fontWeight: '700' }],
      },

      // Enhanced Font Families with Google Fonts Recommendations
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif'],
        'serif': ['Merriweather', 'ui-serif', 'Georgia', 'Cambria', "Times New Roman", 'Times', 'serif'],
        'mono': ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },

      // Refined Breakpoints with More Granularity
      screens: {
        'xs': '320px',   // Extra small devices
        'sm': '640px',   // Small devices
        'md': '768px',   // Medium devices
        'lg': '1024px',  // Large devices
        'xl': '1280px',  // Extra large devices
        '2xl': '1536px', // 2X large devices
        '3xl': '1920px', // Larger screens and monitors
      },

      // Advanced Spacing and Sizing
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
        '224': '56rem',
        '256': '64rem',
      },

      // Sophisticated Shadow System
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'intense': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },

      // Advanced Border Radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },

      // Elegant Transition and Animation Defaults
      transitionProperty: {
        'standard': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform',
      },
      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'standard': '300ms',
      },
    },
  },

  // Dark Mode Configuration
  darkMode: 'class',

  // Advanced Plugins
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),

    // Optional: Custom Plugin for More Advanced Interactions
    function ({ addUtilities }) {
      const newUtilities = {
        '.smooth-scroll': {
          'scroll-behavior': 'smooth',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',  // IE and Edge
          'scrollbar-width': 'none',     // Firefox
          '&::-webkit-scrollbar': {
            'display': 'none'            // Chrome, Safari and Opera
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
}