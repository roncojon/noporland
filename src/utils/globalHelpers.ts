export function extractVideoKeyFromWindowLocation(url) {
    // Create a new URL object to easily extract the pathname
    const urlObj = new URL(url);

    // Get the pathname part of the URL and split it by "/" to get the last part (the videoKey)
    const encodedVideoKey = urlObj.pathname.split('/').pop();

    // Decode the videoKey to return it in unencoded format
    return decodeURI(encodedVideoKey);
}
export function extractVideoKeyFromActualVideo(sourceTag: string) {
    // Use a regular expression to extract the src attribute value
    const srcMatch = sourceTag.match(/src="([^"]+)"/);

    if (srcMatch && srcMatch[1]) {
        const url = srcMatch[1];

        // Extract the videoKey (file name) from the URL
        const videoKey = url.split('/').pop();

        // Return the unencoded videoKey
        return decodeURI(videoKey);// videoKey;
    }

    // If src is not found, return null or some error handling
    return null;
}

export const extractTitleFromCloudfrontUrlMainVideos = (s:string):string=>{
const fullTitle = s.split('MainVideos/')[1];
return fullTitle.split('.mp4')[0];
}