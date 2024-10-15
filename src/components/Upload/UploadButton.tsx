interface UploadButtonProps {
  onClick: () => void;
  isLoading: boolean
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick, isLoading }) => (
  <button onClick={onClick} disabled={isLoading} className="btn btn-primary mb-4 w-full">
    {isLoading &&
      <span className="loading loading-spinner"></span>
    }
    Upload Video
  </button>
);

export default UploadButton;
