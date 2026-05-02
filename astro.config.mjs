import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from '@astrojs/vercel';
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "min-light"
    }
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },
  site: 'https://aitoolguru.co.uk',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [sitemap(), mdx()],
  // Default all pages to static/prerendered in hybrid mode
  // Only API routes will be serverless
});
