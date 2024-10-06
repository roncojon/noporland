import type { VideoAndThumbnailUrlType } from "./env";

export const searchResponseQuery = (searchText: string, searchTags: string[]) => {
  return new Promise<VideoAndThumbnailUrlType[]>((resolve) => {
    const result: VideoAndThumbnailUrlType[] = [
      { index:0,
        videoKey: 'MainVideos/NEVER Guess React Event Types Again!.mp4',
        videoUrl: 'https://d1a9sy9txb1eh6.cloudfront.net/MainVideos/NEVER Guess React Event Types Again!.mp4',
        thumbnailUrl: 'https://d1a9sy9txb1eh6.cloudfront.net/Thumbnails/NEVER Guess React Event Types Again!.jpg',
        previewUrl: 'https://d1a9sy9txb1eh6.cloudfront.net/PreviewVideos/NEVER Guess React Event Types Again!_preview.mp4',
        tags: ['programming'],
      },
      { index:1,
        videoKey: 'MainVideos/contrate_a_esta_sirvienta_ella_vino_con_estos_shorts_para_provocarme_360p.mp4',
        videoUrl:
          'https://d1a9sy9txb1eh6.cloudfront.net/MainVideos/contrate_a_esta_sirvienta_ella_vino_con_estos_shorts_para_provocarme_360p.mp4',
        thumbnailUrl:
          'https://d1a9sy9txb1eh6.cloudfront.net/Thumbnails/contrate_a_esta_sirvienta_ella_vino_con_estos_shorts_para_provocarme_360p.jpg',
        previewUrl:
          'https://d1a9sy9txb1eh6.cloudfront.net/PreviewVideos/contrate_a_esta_sirvienta_ella_vino_con_estos_shorts_para_provocarme_360p_preview.mp4',
        tags: ['big ass', 'maid', 'shorts'],
      },
    ];

    setTimeout(() => {

      // Filter logic based on search text and tags
      const filteredResults = result.filter((video) => {
        // Check if the videoKey includes the search text (case-insensitive)
        const matchesText = searchText
          ? video.videoKey.slice(11).toLowerCase().includes(searchText.toLowerCase())
          : true;

        // Check if any of the video tags match the search tags
        const matchesTags = searchTags.length
        ? searchTags.every((searchTag) => video.tags.includes(searchTag)) // Ensure all searchTags are in the video tags
        : true;
      

        // Only include videos that match both text and tags (if both are provided)
        return matchesText && matchesTags;
      });

      resolve(filteredResults); // Return the filtered result
    }, 3000);
  });
};
