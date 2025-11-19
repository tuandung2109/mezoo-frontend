// Check if URL is YouTube
export const isYouTubeUrl = (url) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Convert YouTube URL to embed URL
export const getYouTubeEmbedUrl = (url) => {
  let videoId = '';
  
  if (url.includes('youtu.be/')) {
    // Format: https://youtu.be/VIDEO_ID
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v');
  } else if (url.includes('youtube.com/embed/')) {
    // Already embed format
    return url;
  }
  
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;
};

// Get video type
export const getVideoType = (url) => {
  if (isYouTubeUrl(url)) return 'youtube';
  return 'direct';
};
