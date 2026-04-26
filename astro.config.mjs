import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://aitoolguru.co.uk',
  output: 'server',
  adapter: vercel(),
  integrations: [],
  scopedStyleStrategy: 'class'
});
