/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Apple-inspired palette
        primary: {
          DEFAULT: '#007AFF',  // iOS Blue - clean, modern
          light: '#5AC8FA',    // Light blue
          dark: '#0051D5',     // Dark blue
        },
        secondary: {
          DEFAULT: '#5E5CE6',  // Modern purple
          light: '#AF52DE',    // Light purple
          dark: '#3634A3',     // Dark purple
        },
        accent: {
          orange: '#FF9500',   // Apple orange
          pink: '#FF2D55',     // Apple pink/red
          cyan: '#5AC8FA',     // Apple cyan
          mint: '#00C7BE',     // Apple mint
        },
        fitness: {
          calories: '#FF6B35',    // Vibrant orange for energy
          protein: '#5E5CE6',     // Purple for protein
          carbs: '#FF9500',       // Amber for carbs
          fat: '#FFD60A',         // Yellow for fat
          success: '#34C759',     // Apple success green
          warning: '#FF9500',     // Apple warning orange
          error: '#FF3B30',       // Apple error red
        },
        dark: {
          background: '#000000',
          surface: '#1C1C1E',      // Slightly lighter than pure black
          'surface-light': '#2C2C2E',  // Apple's elevated surface
          card: '#1C1C1E',         // Card background
          text: '#FFFFFF',         // Pure white for primary text
          'text-secondary': '#98989F',  // Apple's secondary text
          'text-tertiary': '#636366',   // Apple's tertiary text
          border: '#38383A',       // Apple's separator color
          'border-light': '#48484A',
        },
        light: {
          background: '#FFFFFF',
          surface: '#F2F2F7',      // Apple's light background
          'surface-light': '#FFFFFF',
          card: '#FFFFFF',
          text: '#000000',
          'text-secondary': '#8E8E93',
          'text-tertiary': '#C7C7CC',
          border: '#C6C6C8',
          'border-light': '#E5E5EA',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-terminal': 'pulse-terminal 2s ease-in-out infinite',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-terminal': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
      gridTemplateColumns: {
        'fitness-layout': 'repeat(3, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}