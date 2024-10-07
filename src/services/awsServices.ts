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

// Helper function to calculate the global index based on page and elements per page
const calculateGlobalIndex = (
    page: number, 
    elementsPerPage: number, 
    currentIndex: number
): number => {
    return (page - 1) * elementsPerPage + currentIndex;
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
            // 'https://7iq10f6qtk.execute-api.us-west-1.amazonaws.com/dev/videos/?bringTags=false&elementsPerPage=100&page=1',
            {
                method: 'GET',
                // headers: {
                //     'Origin': 'https://noporland.me',
                //     'Content-Type': 'application/json',
                // },
                // referrer: 'https://noporland.me'
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

        // Return the video files, current page, total pages, and total results
        const finalResult = {
            videoFiles: data.videoFiles?.map((item: VideoAndThumbnailUrlType,index) => ({
                ...item,
                videoKey: item?.videoKey?.slice(11), // Remove 'MainVideos/' prefix
                index: calculateGlobalIndex(page, elementsPerPage, index),
            })) || [],
            currentPage: data.currentPage || 1, // Current page
            totalPages: data.totalPages || 1, // Total number of pages
            totalResults: data.totalResults || 0, // Total number of results
            tags: data.tags || [],
        };
        // console.log('finalResult',JSON.stringify(finalResult))
        return finalResult;
    } catch (error) {
        // Handle any network or parsing errors
        console.error('Fetch error:', error);
        return { videoFiles: [], currentPage: 1, totalPages: 1, totalResults: 0 }; // Return empty result in case of error
    }
};

