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

    // Request pre-signed URL from backend
    const response = await fetch('https://d41s0q1zda.execute-api.us-west-1.amazonaws.com/prod/get-presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: videoFile.name, fileType: videoFile.type }),
    });

    const { uploadUrl } = await response.json();

    // Upload video directly to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: videoFile,
      headers: { 'Content-Type': videoFile.type },
    });

    if (uploadResponse.ok) {
      alert('Video uploaded successfully!');
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
