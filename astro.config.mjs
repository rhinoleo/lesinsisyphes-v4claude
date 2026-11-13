import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Adresse publique du site : sert aux liens canoniques, au sitemap et aux images de partage.
  site: 'https://lesinsisyphes.fr',
  integrations: [vue(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
