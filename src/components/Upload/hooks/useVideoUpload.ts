import { useRef, useState } from 'react';
import { isPlayableVideo } from '../../../utils/isPlayableVideo';
import { useMutation } from '@tanstack/react-query';

export const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the input field
  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input value
      setVideoFile(null); // Clear the video file state
    }
  };

  // Handle file selection and validation
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Ensure file is a valid MP4 video
    if (file.type === 'video/mp4' && file.name.toLowerCase().endsWith('.mp4')) {
      const isVideo = await isPlayableVideo(file);
      if (isVideo) {
        setVideoFile(file);

        // Optionally update file input text for display
        const fileInputText = document.getElementById('fileInputText');
        if (fileInputText) fileInputText.textContent = file.name;
      } else {
        alert('The selected file is not a valid video file.');
        resetInput();
      }
    } else {
      alert('Please select a valid .mp4 video file.');
      resetInput();
    }
  };

  // Step 1: Fetch presigned URL from API
  const fetchPresignedUrl = async (fileName: string, fileType: string) => {
    const response = await fetch('/api/get-presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, fileType }),
    });
    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }
    return response.json(); // { uploadUrl, videoKey }
  };

  // Step 2: Upload video to S3 using the presigned URL
  const uploadToS3 = async ({ uploadUrl, videoFile }: { uploadUrl: string; videoFile: File }) => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: videoFile,
      headers: {
        'Content-Type': videoFile.type,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to upload video to S3');
    }
    return response;
  };

  // React Query mutation to handle the entire upload process
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!videoFile) throw new Error('No video file selected');

      // Fetch presigned URL
      const { uploadUrl, videoKey } = await fetchPresignedUrl(videoFile.name, videoFile.type);

      // Upload the video to S3
      await uploadToS3({ uploadUrl, videoFile });

      // Return relevant video data
      return {
        videoKey,
        videoUrl: uploadUrl,
        videoPreviewUrl: `https://your-preview-url.com/${videoKey}`, // Replace with actual logic
        thumbnailUrl: `https://your-thumbnail-url.com/${videoKey}`, // Replace with actual logic
        duration: 0,
        tags: ['example', 'video'],
        serie: undefined,
        lastModified: new Date().toISOString(),
        description: '',
      };
    },
    onMutate: () => {
      setUploadProgress(0); // Reset progress at start
    },
    onError: (error: Error) => {
      alert(`Error: ${error.message}`);
    },
    onSuccess: (data) => {
      alert('Video uploaded successfully!');
      // You can handle additional actions here
    },
    onSettled: () => {
      setUploadProgress(100); // Set progress to 100 when upload is done
    },
  });

  // Function to trigger the upload process
  const uploadVideo = async () => {
    if (videoFile) {
      uploadMutation.mutate();
    } else {
      alert('Please select a video to upload.');
    }
  };

  return {
    videoFile,
    uploadProgress,
    handleFileChange,
    uploadVideo,
    fileInputRef,
    videoData: uploadMutation.data, // Video data after successful upload
    isUploading: uploadMutation.isPending, // Track if the upload is in progress
    isSuccess: uploadMutation.isSuccess, // Track if the upload is successful
  };
};
