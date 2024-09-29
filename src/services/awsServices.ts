import type { VideoAndThumbnailUrlType } from "../env";

type FetchVideosQueryParamsType = {
    bringTags?:boolean;
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
    tags?:string[];
};

export const fetchVideosData = async ({
    bringTags,
    elementsPerPage,
    searchText,
    searchTags,
    page,
}: FetchVideosQueryParamsType):Promise<FetchVideosDataType> => {
    // Build the query string
    const queryParams = new URLSearchParams({
        bringTags: String(bringTags),
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


// import type { VideoAndThumbnailUrlType } from "../env";

// type FetchVideosQueryParamsType = {
//     bringTags?: boolean;
//     elementsPerPage: number;
//     searchText?: string;
//     searchTags?: string[];
//     page: number; // Add page for user pagination
// };

// export type FetchVideosDataType = {
//     videoFiles: VideoAndThumbnailUrlType[];
//     currentPage: any;
//     totalPages: any;
//     totalResults: any;
//     tags?: string[];
// };

// export const fetchVideosData = async ({
//     bringTags,
//     elementsPerPage,
//     searchText,
//     searchTags,
//     page,
// }: FetchVideosQueryParamsType): Promise<FetchVideosDataType> => {
//     // Build the query string
//     const queryParams = new URLSearchParams({
//         bringTags: String(bringTags),
//         elementsPerPage: String(elementsPerPage),
//         page: String(page), // Add user pagination page
//     });

//     if (searchText) {
//         queryParams.append('searchText', searchText);
//     }

//     if (searchTags && searchTags.length > 0) {
//         queryParams.append('searchTags', searchTags.join(','));
//     }

//     try {
//         // Perform the fetch request with dynamic query parameters
//         const response = await fetch(
//             `https://0wy4drz3l6.execute-api.us-west-1.amazonaws.com/prod/%7Bvideos%7D?${queryParams.toString()}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include', // if needed for authentication with cookies
//             }
//         );

//         // Check for non-200 responses
//         if (!response.ok) {
//             if (response.status === 403) {
//                 console.error('Forbidden: Invalid Origin');
//             } else {
//                 console.error(`Error: ${response.statusText}`);
//             }
//             return { videoFiles: [], currentPage: 1, totalPages: 1, totalResults: 0 }; // Return empty result in case of error
//         }

//         const data = await response.json();

//         // Return the video files, current page, total pages, and total results
//         return {
//             videoFiles: data.videoFiles?.map((item: VideoAndThumbnailUrlType) => ({
//                 ...item,
//                 videoKey: item?.videoKey?.slice(11), // Remove 'MainVideos/' prefix
//             })) || [],
//             currentPage: data.currentPage || 1, // Current page
//             totalPages: data.totalPages || 1, // Total number of pages
//             totalResults: data.totalResults || 0, // Total number of results
//             tags: data.tags || [],
//         };
//     } catch (error) {
//         // Handle any network or parsing errors
//         console.error('Fetch error:', error);
//         return { videoFiles: [], currentPage: 1, totalPages: 1, totalResults: 0 }; // Return empty result in case of error
//     }
// };
