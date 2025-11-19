import { useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle, FaStar } from 'react-icons/fa';

function HeroBanner({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const handlePlayClick = () => {
    navigate(`/movie/${movie._id}`);
  };

  const handleInfoClick = () => {
    navigate(`/movie/${movie._id}`);
  };

  return (
    <div className="hero-banner relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.backdrop || movie.poster})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </div>
      
      <div className="relative h-full flex items-center px-4 md:px-16">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-7xl font-bold drop-shadow-lg">
            {movie.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              {(typeof movie.rating === 'number' ? movie.rating : movie.rating?.average || 0).toFixed(1)}
            </span>
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
            <span>{movie.runtime} phút</span>
          </div>

          <p className="text-base md:text-xl line-clamp-3 drop-shadow-lg">
            {movie.overview}
          </p>

          <div className="flex items-center space-x-4 pt-4">
            <button 
              onClick={handlePlayClick}
              className="flex items-center space-x-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded hover:bg-gray-200 transition font-semibold"
            >
              <FaPlay />
              <span>Phát</span>
            </button>
            <button 
              onClick={handleInfoClick}
              className="flex items-center space-x-2 bg-gray-500/70 px-6 md:px-8 py-2 md:py-3 rounded hover:bg-gray-500/50 transition font-semibold"
            >
              <FaInfoCircle />
              <span>Thông tin</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {movie.genres.slice(0, 3).map((genre, idx) => (
              <span key={idx} className="px-3 py-1 bg-netflix-gray/50 rounded-full text-sm">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
