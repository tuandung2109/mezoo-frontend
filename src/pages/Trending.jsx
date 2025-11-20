import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { FaStar, FaFire, FaClock, FaEye, FaPlay, FaTrophy } from 'react-icons/fa';

function Trending() {
  useDocumentTitle('Mới & Phổ biến');
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'popular'
  const [newMovies, setNewMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const [newData, popularData] = await Promise.all([
        movieService.getMovies({ limit: 20, sort: 'releaseDate' }),
        movieService.getMovies({ limit: 20, sort: 'popularity' })
      ]);

      setNewMovies(newData.movies || []);
      setPopularMovies(popularData.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'new', label: 'Mới nhất', icon: FaClock, color: 'from-blue-500 to-cyan-500' },
    { id: 'popular', label: 'Phổ biến', icon: FaFire, color: 'from-orange-500 to-red-500' }
  ];

  const displayMovies = activeTab === 'new' ? newMovies : popularMovies;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-netflix-red via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Mới & Phổ biến
            </h1>
            <p className="text-gray-400 text-lg">
              Khám phá những bộ phim mới nhất và được yêu thích nhất
            </p>
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
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && <Loading />}

          {/* Content */}
          {!loading && (
            <div className="animate-fade-in">
              {activeTab === 'new' ? (
                /* New Movies - Timeline Style */
                <div className="space-y-6">
                  {newMovies.map((movie, index) => (
                    <Link
                      key={movie._id}
                      to={`/movie/${movie._id}`}
                      className="group block"
                    >
                      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/20">
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="relative md:w-80 h-64 md:h-auto overflow-hidden">
                            <img
                              src={movie.backdrop || movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/50"></div>
                            
                            {/* New Badge */}
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center space-x-2 shadow-lg">
                              <FaClock />
                              <span>MỚI</span>
                            </div>

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <FaPlay className="text-black text-xl ml-1" />
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6 md:p-8">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                                  {movie.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                  {new Date(movie.releaseDate).toLocaleDateString('vi-VN', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 bg-yellow-500 px-4 py-2 rounded-xl">
                                <FaStar className="text-white" />
                                <span className="text-white font-bold text-lg">
                                  {(typeof movie.rating === 'number' ? movie.rating : movie.rating?.average || 0).toFixed(1)}
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-300 line-clamp-2 mb-4">
                              {movie.overview || 'Chưa có mô tả'}
                            </p>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-3">
                              {movie.genres && movie.genres.slice(0, 3).map((genre, i) => (
                                <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Popular Movies - Ranking Style */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {popularMovies.map((movie, index) => (
                    <Link
                      key={movie._id}
                      to={`/movie/${movie._id}`}
                      className="group block"
                    >
                      <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/20">
                        {/* Ranking Number */}
                        <div className="absolute top-0 left-0 z-10">
                          <div className={`w-20 h-20 flex items-center justify-center ${
                            index < 3 
                              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                              : 'bg-gradient-to-br from-gray-700 to-gray-800'
                          } rounded-br-3xl`}>
                            <span className="text-white font-black text-3xl drop-shadow-lg">
                              {index + 1}
                            </span>
                          </div>
                          {index < 3 && (
                            <FaTrophy className="absolute top-2 right-2 text-yellow-200 text-sm" />
                          )}
                        </div>

                        <div className="flex">
                          {/* Image */}
                          <div className="relative w-40 md:w-48 h-64 overflow-hidden">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900"></div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition line-clamp-2">
                                {movie.title}
                              </h3>
                              
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                <div className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-lg">
                                  <FaStar />
                                  <span className="font-bold">
                                    {(typeof movie.rating === 'number' ? movie.rating : movie.rating?.average || 0).toFixed(1)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg">
                                  <FaEye />
                                  <span className="font-bold">{movie.views || 0}</span>
                                </div>
                              </div>

                              <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                {movie.overview || 'Chưa có mô tả'}
                              </p>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2">
                              {movie.genres && movie.genres.slice(0, 2).map((genre, i) => (
                                <span key={i} className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded text-xs">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                            <FaPlay className="text-white text-xl ml-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Trending;
