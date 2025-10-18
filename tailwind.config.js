/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* superfícies/textos */
        bg: 'var(--bg)',
        soft: 'var(--soft)',
        card: 'var(--card)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        ring: 'var(--ring)',
        ring2: 'var(--ring-2)',
        thead: 'var(--thead)',

        /* brand */
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
          foreground: 'var(--on-primary)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          light: 'var(--secondary-light)',
          dark: 'var(--secondary-dark)',
          foreground: 'var(--on-secondary)',
        },

        /* semantic */
        success: 'var(--success)',
        warning: 'var(--warning)',
        info: 'var(--info)',
        error: 'var(--error)',
      },
      ringColor: {
        DEFAULT: 'var(--ring)',
        light: 'var(--ring-2)',
      },
    },
  },
  plugins: [],
};
