import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaTimes } from 'react-icons/fa';
import { isYouTubeUrl, getYouTubeEmbedUrl, getVideoType } from '../utils/videoHelpers';

function VideoPlayer({ movie, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [videoType, setVideoType] = useState('direct');

  // Check video type on mount and quality change
  useEffect(() => {
    if (movie.videos && movie.videos[selectedQuality]) {
      const type = getVideoType(movie.videos[selectedQuality].url);
      setVideoType(type);
    }
  }, [movie, selectedQuality]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoType === 'youtube') return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [videoType]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === '0');
  };

  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const changeQuality = (index) => {
    const currentTime = videoRef.current.currentTime;
    setSelectedQuality(index);
    videoRef.current.src = movie.videos[index].url;
    videoRef.current.currentTime = currentTime;
    if (isPlaying) {
      videoRef.current.play();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!movie.videos || movie.videos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Video không khả dụng</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-netflix-red text-white rounded hover:bg-red-700"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // Render YouTube player
  if (videoType === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(movie.videos[selectedQuality].url);
    
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white transition"
        >
          <FaTimes size={20} />
        </button>

        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
          <iframe
            className="w-full h-full md:w-4/5 md:h-4/5"
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          {/* Quality Selector for YouTube */}
          {movie.videos.length > 1 && (
            <div className="absolute bottom-4 right-4 flex space-x-2 z-50">
              {movie.videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedQuality(index)}
                  className={`px-3 py-2 text-sm rounded ${
                    selectedQuality === index
                      ? 'bg-netflix-red text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {video.quality}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Direct MP4 player
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white transition"
      >
        <FaTimes size={20} />
      </button>

      {/* Video Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="max-w-full max-h-full"
          src={movie.videos[selectedQuality].url}
          onClick={togglePlay}
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition">
              <FaPlay className="text-black text-3xl ml-1" />
            </div>
          </div>
        )}

        {/* Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 md:p-6 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-4"
          style={{
            background: `linear-gradient(to right, #E50914 0%, #E50914 ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
          }}
        />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white hover:text-netflix-red transition">
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <button onClick={toggleMute} className="text-white hover:text-netflix-red transition">
                  {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Time */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quality Selector */}
              <div className="flex space-x-2">
                {movie.videos.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => changeQuality(index)}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedQuality === index
                        ? 'bg-netflix-red text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {video.quality}
                  </button>
                ))}
              </div>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-white hover:text-netflix-red transition">
                {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
