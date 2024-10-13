interface ProgressBarProps {
    progress: number;
  }
  
  const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
    <div className="w-full">
      <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
      <div className="text-center mt-2">{progress}%</div>
    </div>
  );
  
  export default ProgressBar;
  