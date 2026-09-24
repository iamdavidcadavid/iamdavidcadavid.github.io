// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://iamdavidcadavid.github.io',
  output: 'static',
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Downloaded at build time and served from the site itself, so visitors never
  // contact a third-party font host (constitution privacy constraint).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Young Serif',
      cssVariable: '--font-serif',
      weights: [400],
      styles: ['normal'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Onest',
      cssVariable: '--font-sans',
      weights: [300, 400, 500, 600],
      // Onest has no italic on Google Fonts; the footer quote's italic is synthesized.
      styles: ['normal'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/sales/') && !page.includes('/easter-egg/') && !page.includes('/404'),
    }),
  ],
});
