import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { 
  FaHeart, FaClock, FaStar, FaPlay, FaTrash, FaCalendar, FaFilm
} from 'react-icons/fa';

function MyList() {
  useDocumentTitle('Danh sách của tôi');
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'watchlist'
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyList();
    }
  }, [user]);

  const fetchMyList = async () => {
    setLoading(true);
    try {
      const data = await userService.getMyList();
      setFavorites(data.favorites || []);
      setWatchlist(data.watchlist || []);
    } catch (error) {
      console.error('Error fetching my list:', error);
      showToast('Không thể tải danh sách', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const removeFromFavorites = async (movieId) => {
    try {
      await userService.removeFromFavorites(movieId);
      setFavorites(favorites.filter(m => m._id !== movieId));
      showToast('Đã xóa khỏi yêu thích', 'success');
    } catch (error) {
      showToast('Không thể xóa', 'error');
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await userService.removeFromWatchlist(movieId);
      setWatchlist(watchlist.filter(item => item.movie._id !== movieId));
      showToast('Đã xóa khỏi danh sách', 'success');
    } catch (error) {
      showToast('Không thể xóa', 'error');
    }
  };

  const tabs = [
    { 
      id: 'favorites', 
      label: 'Yêu thích', 
      icon: FaHeart, 
      count: favorites.length,
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 'watchlist', 
      label: 'Xem sau', 
      icon: FaClock, 
      count: watchlist.length,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const displayMovies = activeTab === 'favorites' 
    ? favorites 
    : watchlist.map(item => ({ ...item.movie, addedAt: item.addedAt }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-netflix-red to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-netflix-red/50">
                <FaHeart className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white">
                  Danh sách của tôi
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                  Quản lý phim yêu thích và muốn xem
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Yêu thích</p>
                  <p className="text-white text-4xl font-bold">{favorites.length}</p>
                </div>
                <FaHeart className="text-red-500 text-4xl" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Xem sau</p>
                  <p className="text-white text-4xl font-bold">{watchlist.length}</p>
                </div>
                <FaClock className="text-blue-500 text-4xl" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Tổng cộng</p>
                  <p className="text-white text-4xl font-bold">{favorites.length + watchlist.length}</p>
                </div>
                <FaFilm className="text-green-500 text-4xl" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-2 border border-gray-800 inline-flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold transition-all transform ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="text-xl" />
                  <span className="text-lg">{tab.label}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && <Loading />}

          {/* Content */}
          {!loading && (
            <>
              {displayMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 animate-fade-in">
                  {displayMovies.map(movie => (
                    <div key={movie._id} className="group relative">
                      <Link to={`/movie/${movie._id}`}>
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
                          <img
                            src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <FaPlay className="text-black text-xl ml-1" />
                              </div>
                            </div>

                            {/* Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <div className="flex items-center space-x-2 text-xs text-white mb-2">
                                <div className="flex items-center space-x-1 bg-yellow-500/90 px-2 py-1 rounded">
                                  <FaStar />
                                  <span className="font-bold">
                                    {(typeof movie.rating === 'number' ? movie.rating : movie.rating?.average || 0).toFixed(1)}
                                  </span>
                                </div>
                                {movie.addedAt && (
                                  <div className="flex items-center space-x-1 bg-blue-500/90 px-2 py-1 rounded">
                                    <FaCalendar />
                                    <span>{new Date(movie.addedAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              activeTab === 'favorites' 
                                ? removeFromFavorites(movie._id)
                                : removeFromWatchlist(movie._id);
                            }}
                            className="absolute top-2 right-2 w-10 h-10 bg-black/80 hover:bg-red-500 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </Link>
                      
                      <h3 className="text-white mt-3 text-sm md:text-base font-medium line-clamp-2 group-hover:text-netflix-red transition">
                        {movie.title}
                      </h3>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20 animate-fade-in">
                  <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    {activeTab === 'favorites' ? (
                      <FaHeart className="text-gray-600 text-6xl" />
                    ) : (
                      <FaClock className="text-gray-600 text-6xl" />
                    )}
                  </div>
                  <h2 className="text-white text-3xl font-bold mb-4">
                    {activeTab === 'favorites' ? 'Chưa có phim yêu thích' : 'Danh sách trống'}
                  </h2>
                  <p className="text-gray-400 text-lg mb-8">
                    {activeTab === 'favorites' 
                      ? 'Thêm phim vào yêu thích để xem lại sau'
                      : 'Thêm phim vào danh sách để xem sau'}
                  </p>
                  <Link
                    to="/movies"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-netflix-red to-red-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-netflix-red/50 transition-all transform hover:scale-105"
                  >
                    <FaFilm />
                    <span>Khám phá phim</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MyList;
