import FileInput from "./FileInput";
import ProgressBar from "./ProgressBar";
import UploadButton from "./UploadButton";
import { useVideoUpload } from "./hooks/useVideoUpload";

const UploadVideo = () => {
  const {
    handleFileChange,
    uploadVideo,
    fileInputRef,
    uploadProgress,
  } = useVideoUpload();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100%-82px)] p-5">
      <div className="card bg-neutral text-neutral-content p-4 w-full max-w-[500px]">
        <FileInput onChange={handleFileChange} fileInputRef={fileInputRef} />
        <UploadButton onClick={uploadVideo} />
        {/* <ProgressBar progress={uploadProgress} /> */}
      </div>
    </div>
  );
};

export default UploadVideo;
