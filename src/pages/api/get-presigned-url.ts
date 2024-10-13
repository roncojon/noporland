import type { APIRoute } from 'astro';

// Disable prerendering for this route
export const prerender = false;

// Define the POST route to handle the presigned URL request
export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the request body for fileName and fileType
    const { fileName, fileType } = await request.json();

    // Make the request to your existing AWS API Gateway endpoint
    const awsResponse = await fetch('https://d41s0q1zda.execute-api.us-west-1.amazonaws.com/prod/get-presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, fileType }),
    });

    if (!awsResponse.ok) {
      throw new Error('Failed to fetch presigned URL from AWS');
    }

    // Get the response data (uploadUrl and videoKey) from AWS
    const data = await awsResponse.json();

    // Return the presigned URL and video key back to the frontend
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust this if you need to restrict origins
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error generating presigned URL' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
