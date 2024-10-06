import type { VideoAndThumbnailUrlType } from "../env";
import { oneHoundredVideos } from "./oneHoundredVideos";

type TransformedVideoType = {
  id: string;
  sources: {
    url: string;
    mimeType: string;
    resolution: string;
    hd: string;
  }[];
  thumbnailUrl: string;
  title: string;
};

const transformVideos = (videos: VideoAndThumbnailUrlType[]): TransformedVideoType[] => {
    return videos.map((video, idx) => ({
      id: (idx).toString(),
      sources: [
        {
          url: video.videoUrl,
          mimeType: "video/mp4",
          resolution: "720p",
          hd: "true",
        },
      ],
      thumbnailUrl: video.thumbnailUrl,
      title: video.videoKey.length > 26
        ? video.videoKey.slice(0, 23) + '...' // Keep first 21 chars, replace last 3 with '...'
        : video.videoKey, // If shorter than 24, show the full title
    }));
  };
  

const getVideoSuggestions = (
  videos: VideoAndThumbnailUrlType[],
  index: number
): { suggestions12: TransformedVideoType[]; suggestions24: TransformedVideoType[] } => {
  const totalVideos = videos.length;
  
  // Ensure the index is within bounds
  const validIndex = Math.min(Math.max(index, 0), totalVideos - 1);

  // Function to get suggestions with a specified count
  const getSuggestions = (count: number) => {
    const halfCount = Math.floor(count / 2);
    let startIndex = Math.max(validIndex - halfCount, 0);
    let endIndex = Math.min(validIndex + halfCount + 1, totalVideos);

    // If there are not enough elements after the index, compensate by shifting the startIndex
    if (endIndex - startIndex < count) {
      startIndex = Math.max(0, endIndex - count);
    }
    
    // If there are not enough elements before the index, compensate by shifting the endIndex
    if (endIndex - startIndex < count) {
      endIndex = Math.min(startIndex + count, totalVideos);
    }

    return transformVideos(videos.slice(startIndex, endIndex));
  };

  // Get the 12 closest videos
  const suggestions12 = getSuggestions(12);

  // Get the 24 closest videos
  const suggestions24 = getSuggestions(24);

  return {
    suggestions12,
    suggestions24,
  };
};

export const allVideoSuggestions = (videoIndex: number) =>
  getVideoSuggestions(oneHoundredVideos, videoIndex);
