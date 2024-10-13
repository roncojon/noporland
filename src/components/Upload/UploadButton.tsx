interface UploadButtonProps {
    onClick: () => void;
  }
  
  const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => (
    <button onClick={onClick} className="btn btn-primary mb-4">
      Upload Video
    </button>
  );
  
  export default UploadButton;
  