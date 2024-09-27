import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output:'hybrid',
  integrations: [
    sitemap({
      customPages: async () => {
        // Fetch all video data (you might want to paginate through all pages)
        let allVideoKeys = [];
        let currentPage = 1;
        let totalPages = 1;

        do {
          const { videoFiles, totalPages: fetchedTotalPages } = await fetchVideosData({
            bringTags: false, // Or true, depending on what you need
            elementsPerPage: 100, // Adjust this according to your needs
            page: currentPage,
          });

          // Extract videoKeys and generate URLs
          const videoUrls = videoFiles.map(file => `/videos/${file.videoKey}`);
          allVideoKeys = [...allVideoKeys, ...videoUrls];

          totalPages = fetchedTotalPages;
          currentPage++;
        } while (currentPage <= totalPages);

        // Return the list of dynamic URLs, adding other static pages if necessary
        return [
          'https://noporland.vercel.app/', // Static pages can go here
          ...allVideoKeys.map(key => `https://noporland.vercel.app${key}`)
        ];
      },
    }),react(), tailwind()],
  site: 'https://noporland.vercel.app',
  adapter: vercel(),
});