/// <reference path="../.astro/types.d.ts" />

export type VideoAndThumbnailUrlType = {
  index:number,
  videoKey: string,
  videoUrl: string,
  thumbnailUrl: string,
  previewUrl: string,
  tags: string[],
  lastModified?: string
};

declare global {
  interface Window {
    fluidPlayer: any; // Declare fluidPlayer on the window object
  }
}

// export type Tag = {
//     id: number;
//     name: string;
//   }

