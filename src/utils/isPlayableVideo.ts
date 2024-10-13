export const isPlayableVideo = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
  
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(true);
      };
  
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve(false);
      };
  
      video.src = URL.createObjectURL(file);
    });
  };