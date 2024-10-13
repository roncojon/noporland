import { useRef, useState } from 'react';
import { isPlayableVideo } from '../../../utils/isPlayableVideo';

export const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input value
      setVideoFile(null); // Clear the video file state
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type === 'video/mp4' && file.name.toLowerCase().endsWith('.mp4')) {
      const isVideo = await isPlayableVideo(file);
      if (isVideo) {
        setVideoFile(file);
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

  const uploadVideo = async () => {
    if (!videoFile) return alert('Please select a video to upload.');
  
    // Step 1: Request presigned URL from your Astro API route
    const response = await fetch('/api/get-presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: videoFile.name, fileType: videoFile.type }),
    });
  
    const { uploadUrl, videoKey } = await response.json();
  
    // Step 2: Upload video directly to S3 using the presigned URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: videoFile,
      headers: {
        'Content-Type': videoFile.type,
      },
    });
  
    if (uploadResponse.ok) {
      alert('Video uploaded successfully!');
      // Handle video key as needed
    } else {
      alert('Failed to upload video.');
    }
  };
  

  return {
    videoFile,
    uploadProgress,
    handleFileChange,
    uploadVideo,
    fileInputRef,
  };
};
