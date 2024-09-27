import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import sitemap from "@astrojs/sitemap";
import { fetchVideosData } from './src/services/awsServices';

const cstmPgs = async () => {
  let allVideoKeys = [];
  let currentPage = 1;
  let totalPages = 1;

  // Fetch all pages of videos
  do {
    const { videoFiles, totalPages: fetchedTotalPages } = await fetchVideosData({
      bringTags: false,
      elementsPerPage: 100,
      page: currentPage,
    });

    // Extract videoKeys and generate URLs
    const videoUrls = videoFiles.map(file => `/videos/${encodeURIComponent(file.videoKey)}`);
    allVideoKeys = [...allVideoKeys, ...videoUrls];

    totalPages = fetchedTotalPages;
    currentPage++;
  } while (currentPage <= totalPages);

  // Return the final array of URLs
  return [
    'https://noporland.vercel.app/', // Static home page
    ...allVideoKeys.map(key => `https://noporland.vercel.app${key}`),
  ];
};

const result = await cstmPgs();
export default defineConfig({
  output: 'hybrid',
  integrations: [
    sitemap({
      customPages: result,
    }),
    react(),
    tailwind(),
  ],
  site: 'https://noporland.vercel.app',
  adapter: vercel(),
});
