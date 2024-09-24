import React, { useState, useEffect, useRef } from 'react';
import styles from './Card.module.css';
import VideoPreviewCard from './VideoPreviewCard';

interface CardReactProps {
  title: string;
  body: string;
  href: string;
  thumbnailUrl?: string;
  previewUrl?: string;
}

const CardReact = ({ href, title, body, thumbnailUrl, previewUrl }: CardReactProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if the image is already loaded (for cached images or SSR)
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoading(false);
    }
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <li className={styles.linkCard}>
      <a href={`/videos/${title}`} title={title}>
        <div className={styles.mediaContainer}>
          <img
            ref={imgRef} // Reference to the image element
            className={styles.thumbnail}
            src={thumbnailUrl ?? ''}
            alt={title}
            loading="lazy"
            onLoad={handleImageLoad}
          />
          {/* Tailwind CSS for animation */}
          <div
            className={`absolute top-0 left-0 right-0 bottom-0 skeleton rounded-lg transition-opacity duration-250 ease-in-out ${
              isLoading ? 'opacity-100' : 'opacity-0'
            }`}
          ></div>
          <VideoPreviewCard previewUrl={previewUrl} />
        </div>
        <h2>
          {title}
          <span>&rarr;</span>
        </h2>
      </a>
    </li>
  );
};

export default CardReact;
