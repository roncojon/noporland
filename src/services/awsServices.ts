import type { VideoAndThumbnailUrlType } from "../env";

type FetchVideosQueryParamsType = {
    elementsPerPage: number;
    searchText?: string;
    searchTags?: string[];
    page: number;  // Add page for user pagination
};

export type FetchVideosDataType = {
    videoFiles: VideoAndThumbnailUrlType[];
    currentPage: any;
    totalPages: any;
    totalResults: any;
    tags:string[];
};
export const fetchVideosData = async ({
    elementsPerPage,
    searchText,
    searchTags,
    page,
}: FetchVideosQueryParamsType):Promise<FetchVideosDataType> => {
    // Build the query string
    const queryParams = new URLSearchParams({
        elementsPerPage: String(elementsPerPage),
        page: String(page), // Add user pagination page
    });

    if (searchText) {
        queryParams.append('searchText', searchText);
    }

    if (searchTags && searchTags.length > 0) {
        queryParams.append('searchTags', searchTags.join(','));
    }

    // Perform the fetch request with dynamic query parameters
    const response = await fetch(
        `https://0wy4drz3l6.execute-api.us-west-1.amazonaws.com/prod/%7Bvideos%7D?${queryParams.toString()}`
    )
    .then((res) => res.json())
    .catch((err) => {
        console.error(err);
        return { videoFiles: [], currentPage: 1, totalPages: 1, totalResults: 0 }; // Return empty result in case of error
    });

    // Return the video files, current page, total pages, and total results
    return {
        videoFiles: response.videoFiles?.map((item: VideoAndThumbnailUrlType) => ({
            ...item,
            videoKey: item?.videoKey?.slice(11), // Remove 'MainVideos/' prefix
        })) || [],
        currentPage: response.currentPage || 1,  // Current page
        totalPages: response.totalPages || 1,    // Total number of pages
        totalResults: response.totalResults || 0, // Total number of results
        tags:response.tags || [],
    };
};
