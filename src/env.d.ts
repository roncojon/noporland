/// <reference path="../.astro/types.d.ts" />

export type VideoAndThumbnailUrlType = {
    videoKey: string,
    videoUrl: string,
    thumbnailUrl: string,
    previewUrl: string,
	tags:string[]
};

export type Tag = {
    id: number;
    name: string;
  }
  