import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie._id}`);
  };

  return (
    <div 
      className="movie-card flex-shrink-0 w-40 md:w-48 cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img 
        src={movie.poster} 
        alt={movie.title}
        className="w-full h-56 md:h-72 object-cover rounded-lg shadow-lg"
        loading="lazy"
      />
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
          <h3 className="font-bold text-xs md:text-sm line-clamp-1">{movie.title}</h3>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" size={10} />
              {(typeof movie.rating === 'number' ? movie.rating : movie.rating?.average || 0).toFixed(1)}
            </span>
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieCard;
