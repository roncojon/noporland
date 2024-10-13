interface FileInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
  }
  
  const FileInput: React.FC<FileInputProps> = ({ onChange, fileInputRef }) => (
    <div className="form-control w-full mb-4">
      <label className="label">
        <span className="label-text">Choose a video file</span>
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,video/mp4"
        onChange={onChange}
        className="file-input file-input-bordered w-full"
      />
    </div>
  );
  
  export default FileInput;
  