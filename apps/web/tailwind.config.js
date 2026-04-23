/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      colors: {
        trading: {
          bg: 'hsl(var(--trading-bg))',
          surface: 'hsl(var(--trading-surface))',
          border: 'hsl(var(--trading-border))',
          text: 'hsl(var(--trading-text))',
          'text-secondary': 'hsl(var(--trading-text-secondary))',
          buy: 'hsl(var(--trading-buy))',
          sell: 'hsl(var(--trading-sell))',
          short: 'hsl(var(--trading-short))',
          accent: 'hsl(var(--trading-accent))',
          warning: 'hsl(var(--trading-warning))',
          success: 'hsl(var(--trading-success))',
          error: 'hsl(var(--trading-error))',
          pending: 'hsl(var(--trading-pending))',
        },
      },
      animation: {
        'pulse-trading': 'pulse-trading 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'pulse-trading': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        shimmer: {
          '0%': {
            'background-position': '-200% 0',
          },
          '100%': {
            'background-position': '200% 0',
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        '16': '4rem',
        '20': '5rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      gridTemplateColumns: {
        'trading': 'minmax(0, 1fr) minmax(0, 1fr)',
        'trading-mobile': 'minmax(0, 1fr)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1680px',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'trading': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'trading-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Custom plugin for trading-specific utilities
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme('colors.trading.border')} ${theme('colors.trading.bg')}`,
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.trading.bg'),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.trading.border'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme('colors.trading.text-secondary'),
          },
        },
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        },
        '.will-change-transform': {
          willChange: 'transform',
        },
        '.will-change-scroll': {
          willChange: 'scroll-position',
        },
        '.contain-layout': {
          contain: 'layout',
        },
        '.contain-paint': {
          contain: 'paint',
        },
        '.contain-strict': {
          contain: 'strict',
        },
      };

      const newComponents = {
        '.btn-trading': {
          '@apply px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-trading-accent focus:ring-opacity-50': {},
        },
        '.btn-trading-primary': {
          '@apply btn-trading bg-trading-accent text-white hover:bg-opacity-80 active:bg-opacity-90': {},
        },
        '.btn-trading-secondary': {
          '@apply btn-trading bg-trading-surface border border-trading-border text-trading-text hover:bg-trading-border': {},
        },
        '.card-trading': {
          '@apply bg-trading-surface border border-trading-border rounded-lg shadow-trading': {},
        },
        '.input-trading': {
          '@apply bg-trading-bg border border-trading-border rounded-lg px-3 py-2 text-trading-text placeholder-trading-text-secondary focus:outline-none focus:ring-2 focus:ring-trading-accent focus:border-transparent': {},
        },
        '.table-trading': {
          '@apply w-full text-sm border-collapse': {},
          'th, td': {
            '@apply px-4 py-2 text-left border-b border-trading-border': {},
          },
          'th': {
            '@apply bg-trading-bg font-semibold text-trading-text sticky top-0 z-10': {},
          },
          'tbody tr': {
            '@apply hover:bg-trading-bg transition-colors': {},
          },
        },
      };

      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
};