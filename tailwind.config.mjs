import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        md: {
          primary: 'var(--md-sys-color-primary)',
          'on-primary': 'var(--md-sys-color-on-primary)',
          'primary-container': 'var(--md-sys-color-primary-container)',
          'on-primary-container': 'var(--md-sys-color-on-primary-container)',
          secondary: 'var(--md-sys-color-secondary)',
          'on-secondary': 'var(--md-sys-color-on-secondary)',
          'secondary-container': 'var(--md-sys-color-secondary-container)',
          'on-secondary-container': 'var(--md-sys-color-on-secondary-container)',
          tertiary: 'var(--md-sys-color-tertiary)',
          'on-tertiary': 'var(--md-sys-color-on-tertiary)',
          'tertiary-container': 'var(--md-sys-color-tertiary-container)',
          'on-tertiary-container': 'var(--md-sys-color-on-tertiary-container)',
          surface: 'var(--md-sys-color-surface)',
          'on-surface': 'var(--md-sys-color-on-surface)',
          'surface-variant': 'var(--md-sys-color-surface-variant)',
          'on-surface-variant': 'var(--md-sys-color-on-surface-variant)',
          'surface-container-lowest': 'var(--md-sys-color-surface-container-lowest)',
          'surface-container-low': 'var(--md-sys-color-surface-container-low)',
          'surface-container': 'var(--md-sys-color-surface-container)',
          'surface-container-high': 'var(--md-sys-color-surface-container-high)',
          'surface-container-highest': 'var(--md-sys-color-surface-container-highest)',
          outline: 'var(--md-sys-color-outline)',
          'outline-variant': 'var(--md-sys-color-outline-variant)',
          error: 'var(--md-sys-color-error)',
          'on-error': 'var(--md-sys-color-on-error)',
          'error-container': 'var(--md-sys-color-error-container)',
          'on-error-container': 'var(--md-sys-color-on-error-container)',
        },
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
      },
    },
  },
  plugins: [],
};
