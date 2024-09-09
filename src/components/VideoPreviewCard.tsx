import { useState } from 'react';
import styles from './Card.module.css';

const VideoPreviewCard = ({ previewUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State for tracking loading

  const handleVideoLoaded = () => {
    setIsLoading(false); // Video has loaded, hide the loader
  };

  const handleVideoPlay = () => {
    setIsLoading(false); // Video is playing, hide the loader (extra safety)
  };

  return (
    <div
      className={styles.clientMediaContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsLoading(true); // Reset loader when video is hidden
      }}
    >
      {isHovered ? (
        <>
          {isLoading && <div className={styles.loader}>{/* Loading... */}</div>} {/* Show loader while loading */}
          <video
            className="preview"
            muted
            loop
            preload="auto"
            src={previewUrl}
            autoPlay
            onLoadedData={handleVideoLoaded} // Trigger when video data is loaded
            onPlay={handleVideoPlay} // Trigger when the video starts playing
            style={{
              width: '100%',
              aspectRatio: 4/3,
              position: 'absolute',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
            }}
          />
        </>
      ) : null}
    </div>
  );
};

export default VideoPreviewCard;
