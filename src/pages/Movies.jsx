import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { genreService } from '../services/genreService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { FaStar, FaCalendar, FaFilter, FaTimes, FaPlay } from 'react-icons/fa';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sort: 'popularity'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchGenres();
    fetchFeaturedMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [filters, pagination.page]);

  // Auto change banner every 2 seconds
  useEffect(() => {
    if (featuredMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % featuredMovies.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies]);

  const fetchGenres = async () => {
    try {
      const data = await genreService.getGenres();
      setGenres(data.data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setGenres([]);
    }
  };

  const fetchFeaturedMovies = async () => {
    try {
      const data = await movieService.getMovies({ limit: 5, sort: 'rating' });
      const topMovies = (data.movies || []).filter(m => m.backdrop);
      setFeaturedMovies(topMovies.slice(0, 5));
    } catch (error) {
      console.error('Error fetching featured movies:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20
      };

      if (filters.genre) params.genre = filters.genre;
      if (filters.year) params.year = filters.year;
      if (filters.rating) params.minRating = filters.rating;
      if (filters.sort) params.sort = filters.sort;

      const data = await movieService.searchMovies(params);
      setMovies(data.movies || []);
      setPagination({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      rating: '',
      sort: 'popularity'
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

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

      {/* Hero Banner Carousel */}
      {featuredMovies.length > 0 && (
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {featuredMovies.map((movie, index) => (
            <div
              key={movie._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={movie.backdrop || movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl animate-fade-in">
                      {movie.title}
                    </h1>
                    <p className="text-gray-200 text-base md:text-lg mb-6 line-clamp-3 drop-shadow-lg">
                      {movie.overview}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center space-x-2 bg-yellow-500 px-4 py-2 rounded-lg">
                        <FaStar className="text-white" />
                        <span className="text-white font-bold">
                          {(typeof movie.rating === 'number' ? movie.rating : movie.rating?.average || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                        <FaCalendar className="text-white" />
                        <span className="text-white font-semibold">
                          {new Date(movie.releaseDate).getFullYear()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to={`/movie/${movie._id}`}
                        className="flex items-center space-x-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-2xl"
                      >
                        <FaPlay />
                        <span>Xem ngay</span>
                      </Link>
                      <button className="flex items-center space-x-2 bg-gray-500/70 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-500/90 transition-all transform hover:scale-105">
                        <span>Thêm vào danh sách</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`transition-all ${
                  index === currentBanner
                    ? 'w-12 h-2 bg-netflix-red'
                    : 'w-8 h-2 bg-white/50 hover:bg-white/80'
                } rounded-full`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 z-10"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % featuredMovies.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 z-10"
          >
            →
          </button>
        </div>
      )}

      <div className="pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Tất cả phim
            </h2>
            <p className="text-gray-400">
              Tìm kiếm trong hàng nghìn bộ phim chất lượng cao
            </p>
          </div>

          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-netflix-red/20 to-orange-500/20 border border-netflix-red/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-gray-400 text-sm">Tổng số phim</p>
                  <p className="text-white text-3xl font-bold">{pagination.total}</p>
                </div>
                <div className="h-12 w-px bg-gray-700"></div>
                <div>
                  <p className="text-gray-400 text-sm">Đang hiển thị</p>
                  <p className="text-white text-3xl font-bold">{movies.length}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 border border-white/20"
              >
                <FaFilter />
                <span>{showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-gray-800 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Genre Filter */}
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Thể loại</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition"
                  >
                    <option value="">Tất cả thể loại</option>
                    {genres.map(genre => (
                      <option key={genre._id} value={genre._id}>{genre.name}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Năm phát hành</label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition"
                  >
                    <option value="">Tất cả năm</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Đánh giá</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition"
                  >
                    <option value="">Tất cả</option>
                    <option value="9">9+ ⭐ Xuất sắc</option>
                    <option value="8">8+ ⭐ Rất tốt</option>
                    <option value="7">7+ ⭐ Tốt</option>
                    <option value="6">6+ ⭐ Khá</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Sắp xếp theo</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition"
                  >
                    <option value="popularity">Phổ biến nhất</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="releaseDate">Mới nhất</option>
                    <option value="title">Tên A-Z</option>
                  </select>
                </div>
              </div>

              {/* Active Filters & Clear */}
              {(filters.genre || filters.year || filters.rating) && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {filters.genre && (
                      <span className="bg-netflix-red/20 text-netflix-red px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                        <span>{genres.find(g => g._id === filters.genre)?.name}</span>
                        <button onClick={() => handleFilterChange('genre', '')}>
                          <FaTimes size={12} />
                        </button>
                      </span>
                    )}
                    {filters.year && (
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                        <span>Năm {filters.year}</span>
                        <button onClick={() => handleFilterChange('year', '')}>
                          <FaTimes size={12} />
                        </button>
                      </span>
                    )}
                    {filters.rating && (
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                        <span>{filters.rating}+ ⭐</span>
                        <button onClick={() => handleFilterChange('rating', '')}>
                          <FaTimes size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white text-sm transition"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && <Loading />}

          {/* Movies Grid */}
          {!loading && movies.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
                {movies.map(movie => (
                  <Link
                    key={movie._id}
                    to={`/movie/${movie._id}`}
                    className="group"
                  >
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
                          <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <FaPlay className="text-white text-xl ml-1" />
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
                            <div className="flex items-center space-x-1 bg-gray-900/90 px-2 py-1 rounded">
                              <FaCalendar />
                              <span>{new Date(movie.releaseDate).getFullYear()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-white mt-3 text-sm md:text-base font-medium line-clamp-2 group-hover:text-netflix-red transition">
                      {movie.title}
                    </h3>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    ← Trang trước
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`w-12 h-12 rounded-xl font-semibold transition-all transform hover:scale-110 ${
                            pagination.page === pageNum
                              ? 'bg-gradient-to-r from-netflix-red to-red-600 text-white shadow-lg shadow-netflix-red/50'
                              : 'bg-gray-800 text-white hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    Trang sau →
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!loading && movies.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-white text-2xl font-bold mb-2">Không tìm thấy phim</h2>
              <p className="text-gray-400 mb-6">Thử thay đổi bộ lọc để xem thêm phim</p>
              <button
                onClick={clearFilters}
                className="bg-netflix-red text-white px-6 py-3 rounded-xl hover:bg-red-600 transition"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Movies;
