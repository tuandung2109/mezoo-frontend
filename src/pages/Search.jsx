import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { genreService } from '../services/genreService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { FaStar, FaCalendar, FaSearch, FaFilter } from 'react-icons/fa';

function Search() {
  useDocumentTitle('Tìm kiếm');
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sort: 'popularity'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchGenres();
    // Load initial movies
    searchMovies();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchMovies();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, pagination.page]);

  const fetchGenres = async () => {
    try {
      const data = await genreService.getAllGenres();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const searchMovies = async () => {
    setLoading(true);
    try {
      // Only include non-empty params
      const params = {
        page: pagination.page,
        limit: 20
      };

      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (filters.genre && filters.genre.trim()) {
        params.genre = filters.genre;
      }
      if (filters.year && filters.year.trim()) {
        params.year = filters.year;
      }
      if (filters.rating && filters.rating.trim()) {
        params.minRating = filters.rating;
      }
      if (filters.sort) {
        params.sort = filters.sort;
      }

      // Update URL
      const newParams = {};
      if (searchQuery && searchQuery.trim()) newParams.q = searchQuery.trim();
      if (filters.genre) newParams.genre = filters.genre;
      if (filters.year) newParams.year = filters.year;
      if (filters.rating) newParams.rating = filters.rating;
      if (filters.sort !== 'popularity') newParams.sort = filters.sort;
      setSearchParams(newParams);

      const data = await movieService.searchMovies(params);
      setMovies(data.movies || []);
      setPagination({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0
      });
    } catch (error) {
      console.error('Error searching movies:', error);
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
    setSearchQuery('');
    setFilters({
      genre: '',
      year: '',
      rating: '',
      sort: 'popularity'
    });
    setSearchParams({});
    setMovies([]);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-6">Tìm kiếm phim</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phim, diễn viên, đạo diễn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
          >
            <FaFilter />
            <span>{showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Genre Filter */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Thể loại</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-netflix-red"
                >
                  <option value="">Tất cả</option>
                  {genres.map(genre => (
                    <option key={genre._id} value={genre._id}>{genre.name}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Năm</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-netflix-red"
                >
                  <option value="">Tất cả</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Đánh giá tối thiểu</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-netflix-red"
                >
                  <option value="">Tất cả</option>
                  <option value="9">9+ ⭐</option>
                  <option value="8">8+ ⭐</option>
                  <option value="7">7+ ⭐</option>
                  <option value="6">6+ ⭐</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Sắp xếp</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-netflix-red"
                >
                  <option value="popularity">Phổ biến</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="releaseDate">Mới nhất</option>
                  <option value="title">Tên A-Z</option>
                </select>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="mt-4 text-netflix-red hover:underline text-sm"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Results Info */}
        {!loading && movies.length > 0 && (
          <div className="text-gray-400 mb-6">
            Tìm thấy <span className="text-white font-semibold">{pagination.total}</span> kết quả
          </div>
        )}

        {/* Loading */}
        {loading && <Loading />}

        {/* No Results */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-white text-2xl font-bold mb-2">Không tìm thấy kết quả</h2>
            <p className="text-gray-400 mb-6">
              {searchQuery || filters.genre || filters.year || filters.rating 
                ? 'Thử thay đổi từ khóa hoặc bộ lọc' 
                : 'Không có phim nào trong database'}
            </p>
            {(searchQuery || filters.genre || filters.year || filters.rating) && (
              <button
                onClick={clearFilters}
                className="bg-netflix-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* Results Grid */}
        {!loading && movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map(movie => (
                <Link
                  key={movie._id}
                  to={`/movie/${movie._id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center space-x-2 text-xs text-white mb-1">
                          <FaStar className="text-yellow-400" />
                          <span>{(typeof movie.rating === 'number' ? movie.rating : movie.rating?.average || 0).toFixed(1)}</span>
                          <FaCalendar className="ml-2" />
                          <span>{new Date(movie.releaseDate).getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white mt-2 text-sm font-medium line-clamp-2 group-hover:text-netflix-red transition">
                    {movie.title}
                  </h3>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Trước
                </button>
                
                <div className="flex space-x-2">
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
                        className={`px-4 py-2 rounded-lg transition ${
                          pagination.page === pageNum
                            ? 'bg-netflix-red text-white'
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
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Search;
