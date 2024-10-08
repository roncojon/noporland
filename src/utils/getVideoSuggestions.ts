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
  tags: string[]
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
    tags: video.tags
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
    let startIndex = validIndex - Math.floor(count / 2);
    let endIndex = validIndex + Math.floor(count / 2) + 1;

    // Ensure bounds for startIndex and endIndex
    if (startIndex < 0) {
      endIndex += Math.abs(startIndex); // Adjust endIndex to compensate for out-of-bound startIndex
      startIndex = 0;
    }
    if (endIndex > totalVideos) {
      startIndex -= endIndex - totalVideos; // Adjust startIndex to compensate for out-of-bound endIndex
      endIndex = totalVideos;
    }

    // Slice and filter out the video at the validIndex
    let filteredVideos = videos.slice(Math.max(startIndex, 0), Math.min(endIndex, totalVideos)).filter((_, idx) => startIndex + idx !== validIndex);

    // If there are not enough videos, extend the range
    while (filteredVideos.length < count && startIndex > 0) {
      startIndex--;
      filteredVideos = [videos[startIndex], ...filteredVideos];
    }

    while (filteredVideos.length < count && endIndex < totalVideos) {
      filteredVideos = [...filteredVideos, videos[endIndex]];
      endIndex++;
    }

    // Return transformed videos
    return transformVideos(filteredVideos.slice(0, count)); // Ensure to return exactly 'count' videos
  };

  // Get the 12 closest videos excluding the current one
  const suggestions12 = getSuggestions(12);

  // Get the 24 closest videos excluding the current one
  const suggestions24 = getSuggestions(24);

  return {
    suggestions12,
    suggestions24,
  };
};

export const allVideoSuggestions = (videoIndex: number) =>
  getVideoSuggestions(oneHoundredVideos, videoIndex);
