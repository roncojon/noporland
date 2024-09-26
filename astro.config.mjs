import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output:'hybrid',
  integrations: [react(), tailwind(), sitemap()],
  adapter: vercel(),
});