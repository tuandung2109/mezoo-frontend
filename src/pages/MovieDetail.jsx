import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaPlay, FaPlus, FaCheck, FaShare, FaHeart, FaTimes, FaCopy, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatRuntime } from '../utils/helpers';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchMovieDetail();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    checkUserLists();
  }, [id, user]);

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

  const checkUserLists = async () => {
    if (!user) {
      setIsFavorite(false);
      setIsInWatchlist(false);
      return;
    }
    
    try {
      const data = await userService.getMyList();
      
      // Check favorites
      const inFavorites = data.favorites.some(m => m._id === id);
      setIsFavorite(inFavorites);
      
      // Check watchlist (watchlist has structure: { movie: {...}, addedAt: ... })
      const inWatchlist = data.watchlist.some(item => item.movie._id === id);
      setIsInWatchlist(inWatchlist);
      
      console.log('Checked lists:', { inFavorites, inWatchlist, id });
    } catch (error) {
      console.error('Error checking user lists:', error);
      setIsFavorite(false);
      setIsInWatchlist(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await userService.removeFromFavorites(id);
        setIsFavorite(false);
        showToast('Đã xóa khỏi danh sách yêu thích');
      } else {
        await userService.addToFavorites(id);
        setIsFavorite(true);
        showToast('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isInWatchlist) {
        await userService.removeFromWatchlist(id);
        setIsInWatchlist(false);
        showToast('Đã xóa khỏi danh sách xem sau');
      } else {
        await userService.addToWatchlist(id);
        setIsInWatchlist(true);
        showToast('Đã thêm vào danh sách xem sau');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Xem phim "${movie.title}" trên Mozi`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        showToast('Đã copy link!');
        setShowShareModal(false);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
    }
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
                onClick={toggleFavorite}
                className={`flex items-center space-x-2 px-8 py-3 rounded transition font-semibold ${
                  isFavorite 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-500/70 hover:bg-gray-500/50'
                }`}
              >
                <FaHeart className={isFavorite ? 'text-white' : ''} />
                <span>{isFavorite ? 'Đã yêu thích' : 'Yêu thích'}</span>
              </button>

              <button 
                onClick={toggleWatchlist}
                className={`flex items-center space-x-2 px-8 py-3 rounded transition font-semibold ${
                  isInWatchlist 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-500/70 hover:bg-gray-500/50'
                }`}
              >
                {isInWatchlist ? <FaCheck /> : <FaPlus />}
                <span>{isInWatchlist ? 'Đã thêm' : 'Xem sau'}</span>
              </button>

              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 bg-gray-500/70 px-4 py-3 rounded hover:bg-gray-500/50 transition"
              >
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">Chia sẻ phim</h2>

            <div className="space-y-3">
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center space-x-4 bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaCopy size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Copy link</p>
                  <p className="text-sm text-gray-400">Sao chép đường dẫn</p>
                </div>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center space-x-4 bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaFacebook size={24} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Facebook</p>
                  <p className="text-sm text-gray-400">Chia sẻ lên Facebook</p>
                </div>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center space-x-4 bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition"
              >
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                  <FaTwitter size={24} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Twitter</p>
                  <p className="text-sm text-gray-400">Chia sẻ lên Twitter</p>
                </div>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center space-x-4 bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <FaWhatsapp size={24} />
                </div>
                <div className="text-left">
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-gray-400">Chia sẻ qua WhatsApp</p>
                </div>
              </button>
            </div>
          </div>
        </div>
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

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default MovieDetail;
