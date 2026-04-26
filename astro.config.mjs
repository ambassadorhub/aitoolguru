import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aitoolguru.co.uk',
  integrations: [],
  vite: {
    plugins: [tailwindcss()]
  }
});
