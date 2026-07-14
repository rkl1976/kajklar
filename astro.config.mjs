// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// GitHub Pages-projektsite: serveres fra https://rkl1976.github.io/kajklar/
// Ved skift til eget domæne (kajklar.dk): sæt site tilbage til
// 'https://kajklar.dk' og fjern base (eller sæt base: '/').
export default defineConfig({
  site: 'https://rkl1976.github.io',
  base: '/kajklar',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
