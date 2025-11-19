import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';

function MovieBackground() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieService.getMovies({ limit: 20 });
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Movie Posters Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 h-full opacity-30 animate-float">
        {movies.map((movie, index) => (
          <div
            key={movie._id}
            className="relative overflow-hidden"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}

export default MovieBackground;
