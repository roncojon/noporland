import type { APIRoute } from 'astro';
import { allVideoSuggestions } from '../../utils/getVideoSuggestions';

// Disable prerendering for this route
export const prerender = false;

// Define the GET route for fetching video suggestions
export const GET: APIRoute = async ({ request }) => {
  // Get the search parameters from the request URL
  const { searchParams } = new URL(request.url);
  const videoIndex = Number(searchParams.get('videoIndex'));

  // Validate the videoIndex and use 0 as the default if it's not a valid number
  const validVideoIndex = isNaN(videoIndex) ? 0 : videoIndex;

  // Get suggestions12 from the utility function
  const { suggestions24 } = allVideoSuggestions(validVideoIndex);

  // Return the suggestions12 as a JSON response
  return new Response(JSON.stringify(suggestions24), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
