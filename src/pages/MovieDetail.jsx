import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaPlay, FaPlus, FaCheck, FaShare } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';
import { formatDate, formatRuntime } from '../utils/helpers';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    fetchMovieDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchMovieDetail = async () => {
    try {
      setLoading(true);
      const movieData = await movieService.getMovie(id);
      setMovie(movieData);

      // Fetch similar movies (same genre)
      if (movieData.genres && movieData.genres.length > 0) {
        const moviesData = await movieService.getMovies({ 
          genre: movieData.genres[0],
          limit: 10 
        });
        const movies = moviesData.movies || [];
        setSimilarMovies(movies.filter(m => m._id !== id));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie:', error);
      setLoading(false);
    }
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    // TODO: Call API to add/remove from watchlist
  };

  if (loading) return <Loading />;
  if (!movie) return <div className="text-white text-center py-20">Không tìm thấy phim</div>;

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-center px-4 md:px-16 pt-20">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-xl md:text-2xl text-gray-300 italic">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <span className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                <FaStar className="mr-1" />
                {(typeof movie.rating === 'number' ? movie.rating : movie.rating?.average || 0).toFixed(1)}
              </span>
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span>{formatRuntime(movie.runtime)}</span>
              <span className="px-3 py-1 border border-gray-400 rounded">{movie.ageRating || 'NR'}</span>
            </div>

            <p className="text-base md:text-lg leading-relaxed line-clamp-4">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre, idx) => (
                <span key={idx} className="px-4 py-2 bg-netflix-gray/50 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setShowPlayer(true)}
                className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition font-semibold"
              >
                <FaPlay />
                <span>Phát ngay</span>
              </button>
              <button 
                onClick={toggleWatchlist}
                className="flex items-center space-x-2 bg-gray-500/70 px-8 py-3 rounded hover:bg-gray-500/50 transition font-semibold"
              >
                {isInWatchlist ? <FaCheck /> : <FaPlus />}
                <span>{isInWatchlist ? 'Đã thêm' : 'Danh sách'}</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-500/70 px-4 py-3 rounded hover:bg-gray-500/50 transition">
                <FaShare />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && (
        <VideoPlayer movie={movie} onClose={() => setShowPlayer(false)} />
      )}

      {/* Movie Info */}
      <div className="px-4 md:px-16 py-12 space-y-12">
        {/* Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Thông tin phim</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Diễn viên</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movie.cast.slice(0, 8).map((actor, idx) => (
                    <div key={idx} className="text-center">
                      <img 
                        src={actor.profilePath || 'https://via.placeholder.com/150x200?text=No+Image'} 
                        alt={actor.name}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <p className="font-semibold text-sm">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Đạo diễn</h3>
              {movie.crew && movie.crew.filter(c => c.job === 'Director').map((director, idx) => (
                <p key={idx} className="text-gray-300">{director.name}</p>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Ngày phát hành</h3>
              <p className="text-gray-300">{formatDate(movie.releaseDate)}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Thời lượng</h3>
              <p className="text-gray-300">{formatRuntime(movie.runtime)}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Quốc gia</h3>
              <p className="text-gray-300">{movie.countries?.join(', ') || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Ngôn ngữ</h3>
              <p className="text-gray-300">{movie.originalLanguage?.toUpperCase() || 'N/A'}</p>
            </div>

            {movie.budget > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-2">Ngân sách</h3>
                <p className="text-gray-300">${movie.budget.toLocaleString()}</p>
              </div>
            )}

            {movie.revenue > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-2">Doanh thu</h3>
                <p className="text-gray-300">${movie.revenue.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Phim tương tự</h2>
            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4">
              {similarMovies.map(movie => (
                <div key={movie._id} onClick={() => navigate(`/movie/${movie._id}`)}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MovieDetail;
