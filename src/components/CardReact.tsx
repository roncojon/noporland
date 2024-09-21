import React from 'react';
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
  return (
    <li className={styles.linkCard}>
      <a href={`/videos/${title}`} title={title} >
        <div className={styles.mediaContainer}>
          <img className={styles.thumbnail} src={thumbnailUrl ?? ''} alt={title} />
          <VideoPreviewCard previewUrl={previewUrl} />
        </div>
        <h2 >
          {title}
          <span>&rarr;</span>
        </h2>
        {/* <p className={styles.body}>{body}</p> */}
      </a>
    </li>
  );
};

export default CardReact;
