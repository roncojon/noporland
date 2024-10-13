import { useRef, useState } from 'react';
import { isPlayableVideo } from '../../utils/isPlayableVideo';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      if (file.type === 'video/mp4' && file.name.toLowerCase().endsWith('.mp4')) {
        const isVideo = await isPlayableVideo(file);
        if (isVideo) {
          setVideoFile(file);
          // Update the file input text if you're using the custom styled input
          const fileInputText = document.getElementById('fileInputText');
          if (fileInputText) {
            fileInputText.textContent = file.name;
          }
        } else {
          alert('The selected file is not a valid video file.');
          resetInput(); // Reset the input on invalid video
        }
      } else {
        // If the file is not an .mp4 video, show an error message
        alert('Please select a valid .mp4 video file.');
        resetInput(); // Reset the input on non-mp4 file
      }
    }
  };
  
  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input value
      setVideoFile(null); // Clear the video file state if needed
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return alert('Please select a video to upload.');

    // Step 1: Request pre-signed URL from backend
    const response = await fetch('https://d41s0q1zda.execute-api.us-west-1.amazonaws.com/prod/get-presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: videoFile.name, fileType: videoFile.type }),
    });

    const { uploadUrl, videoKey } = await response.json();

    // Step 2: Upload video directly to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: videoFile,
      headers: {
        'Content-Type': videoFile.type,
      },
    });

    if (uploadResponse.ok) {
      alert('Video uploaded successfully!');
      // Proceed to step 2: Wait for processing and collect metadata
    } else {
      alert('Failed to upload video.');
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center h-[calc(100%-82px)] p-5">
      <div className="card bg-neutral text-neutral-content p-4 w-full max-w-[500px]">
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Choose a video file </span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,video/mp4" /* .mp4,video/mp4 */
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
        </div>
        <button
          onClick={uploadVideo}
          className="btn btn-primary mb-4"
        >
          Upload Video
        </button>
        <div className="w-full">
          <progress
            className="progress progress-primary w-full"
            value={uploadProgress}
            max="100"
          ></progress>
          <div className="text-center mt-2">{uploadProgress}%</div>
        </div>
      </div>
    </div>
  );

};

export default UploadVideo;
