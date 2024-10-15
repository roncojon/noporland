import FileInput from "./FileInput";
import ProgressBar from "./ProgressBar";
import UploadButton from "./UploadButton";
import VideoForm from "./UploadVideoForm";
// import VideoForm from "./VideoForm"; // Assuming you have this component
import { useVideoUpload } from "./hooks/useVideoUpload";

const UploadVideo = () => {
  const {
    handleFileChange,
    uploadVideo,
    fileInputRef,
    uploadProgress,
    videoData,
    isUploading,
    isSuccess,
  } = useVideoUpload();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100%-82px)] p-6">
      <div className="card bg-neutral text-neutral-content p-4 w-full max-w-[600px]">
          <FileInput onChange={handleFileChange} fileInputRef={fileInputRef} disabled={isUploading} />
          <UploadButton onClick={uploadVideo} isLoading={isUploading} />
          {/* Optionally display upload progress */}
          {/* {isUploading && <ProgressBar progress={uploadProgress} />} */}
        <VideoForm videoData={videoData} />
      </div>
    </div>
  );
};

export default UploadVideo;
