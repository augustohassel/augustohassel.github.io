import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.hasselpunk.com',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [tailwind()],
  output: 'static',
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  preview: {
    host: '0.0.0.0',
    port: 4321,
  },
});
