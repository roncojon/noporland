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
}: FetchVideosQueryParamsType): Promise<FetchVideosDataType> => {
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

    try {
        // Perform the fetch request with dynamic query parameters
        const response = await fetch(
            `https://7iq10f6qtk.execute-api.us-west-1.amazonaws.com/dev/videos/?${queryParams.toString()}`, // Use dynamic query string
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // credentials: 'include', // if needed for authentication with cookies
            }
        );

        // Check for non-200 responses
        // if (!response.ok) {
        //     if (response.status === 403) {
        //         console.error('Forbidden: Invalid Origin');
        //     } else {
        //         console.error(`Error: ${response.statusText}`);
        //     }
        //     return { videoFiles: [], currentPage: 1, totalPages: 1, totalResults: 0 }; // Return empty result in case of error
        // }

        const data = await response.json(); // Properly await the JSON response
        console.log('responseData: ', data);

        // Return the video files, current page, total pages, and total results
        return {
            videoFiles: data.videoFiles?.map((item: VideoAndThumbnailUrlType) => ({
                ...item,
                videoKey: item?.videoKey?.slice(11), // Remove 'MainVideos/' prefix
            })) || [],
            currentPage: data.currentPage || 1, // Current page
            totalPages: data.totalPages || 1, // Total number of pages
            totalResults: data.totalResults || 0, // Total number of results
            tags: data.tags || [],
        };
    } catch (error) {
        // Handle any network or parsing errors
        console.error('Fetch error:', error);
        return { videoFiles: [], currentPage: 1, totalPages: 1, totalResults: 0 }; // Return empty result in case of error
    }
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
// console.log('response: ',response);
//         // Check for non-200 responses
//         if (!response.ok) {
//             if (response.status === 403) {
//                 console.error('Forbidden: Invalid Origin');
//             } else {
//                 console.error(`Error: ${response.statusText}`);
//             }
//             return { videoFiles: [], currentPage: 1, totalPages: 1, totalResults: 0 }; // Return empty result in case of error
//         }

//         const data = await response?.json();
//         console.log('responseData: ',data);

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
