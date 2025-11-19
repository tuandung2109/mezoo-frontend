import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { 
  FaHistory, FaStar, FaPlay, FaTrash, FaClock, FaCalendar, FaCheckCircle
} from 'react-icons/fa';

function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await userService.getHistory();
      setHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      showToast('Không thể tải lịch sử', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleRemove = async (movieId) => {
    try {
      await userService.removeFromHistory(movieId);
      setHistory(history.filter(item => item.movie._id !== movieId));
      showToast('Đã xóa khỏi lịch sử');
    } catch (error) {
      showToast('Không thể xóa', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử xem?')) return;

    try {
      await userService.clearHistory();
      setHistory([]);
      showToast('Đã xóa toàn bộ lịch sử');
    } catch (error) {
      showToast('Không thể xóa lịch sử', 'error');
    }
  };

  const formatProgress = (progress) => {
    return `${Math.round(progress)}%`;
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' năm trước';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' tháng trước';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' ngày trước';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' giờ trước';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' phút trước';
    
    return 'Vừa xong';
  };

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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <FaHistory className="text-white text-3xl" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-white">
                    Lịch sử xem
                  </h1>
                  <p className="text-gray-400 text-lg mt-2">
                    {history.length} phim đã xem
                  </p>
                </div>
              </div>

              {history.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition flex items-center space-x-2"
                >
                  <FaTrash />
                  <span>Xóa tất cả</span>
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && <Loading />}

          {/* Content */}
          {!loading && (
            <>
              {history.length > 0 ? (
                <>
                <div className="space-y-4 animate-fade-in">
                  {history
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((item) => (
                    <div 
                      key={item._id} 
                      className="group bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Poster */}
                        <Link 
                          to={`/movie/${item.movie._id}`}
                          className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0"
                        >
                          <img
                            src={item.movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                            alt={item.movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                              <FaPlay className="text-black text-xl ml-1" />
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {item.progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                              <div 
                                className="h-full bg-netflix-red transition-all"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <Link 
                              to={`/movie/${item.movie._id}`}
                              className="text-2xl font-bold hover:text-netflix-red transition mb-2 block"
                            >
                              {item.movie.title}
                            </Link>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                              <div className="flex items-center space-x-1">
                                <FaStar className="text-yellow-400" />
                                <span className="font-semibold text-white">
                                  {(typeof item.movie.rating === 'number' 
                                    ? item.movie.rating 
                                    : item.movie.rating?.average || 0).toFixed(1)}
                                </span>
                              </div>
                              <span>•</span>
                              <span>{new Date(item.movie.releaseDate).getFullYear()}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <FaClock />
                                <span>{item.movie.runtime} phút</span>
                              </div>
                            </div>

                            <p className="text-gray-300 line-clamp-2 mb-4">
                              {item.movie.overview}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.movie.genres?.slice(0, 3).map((genre, idx) => (
                                <span 
                                  key={idx}
                                  className="px-3 py-1 bg-gray-800 rounded-full text-xs"
                                >
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <FaCalendar />
                                <span>{getTimeAgo(item.watchedAt)}</span>
                              </div>
                              
                              {item.progress > 0 && (
                                <div className="flex items-center space-x-2">
                                  {item.completed ? (
                                    <div className="flex items-center space-x-1 text-green-400">
                                      <FaCheckCircle />
                                      <span className="font-semibold">Đã xem xong</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-1 text-blue-400">
                                      <FaClock />
                                      <span className="font-semibold">{formatProgress(item.progress)}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleRemove(item.movie._id)}
                              className="text-gray-400 hover:text-red-500 transition p-2"
                              title="Xóa khỏi lịch sử"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {history.length > itemsPerPage && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        currentPage === 1
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      Trước
                    </button>

                    {Array.from({ length: Math.ceil(history.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          currentPage === page
                            ? 'bg-netflix-red text-white'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(history.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(history.length / itemsPerPage)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        currentPage === Math.ceil(history.length / itemsPerPage)
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      Sau
                    </button>
                  </div>
                )}
                </>
              ) : (
                /* Empty State */
                <div className="text-center py-20 animate-fade-in">
                  <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaHistory className="text-gray-600 text-6xl" />
                  </div>
                  <h2 className="text-white text-3xl font-bold mb-4">
                    Chưa có lịch sử xem
                  </h2>
                  <p className="text-gray-400 text-lg mb-8">
                    Bắt đầu xem phim để lưu lại lịch sử
                  </p>
                  <Link
                    to="/movies"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-netflix-red to-red-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-netflix-red/50 transition-all transform hover:scale-105"
                  >
                    <FaPlay />
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

export default History;
