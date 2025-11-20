import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { 
  FaFilm, FaHeart, FaClock, FaStar, FaChartLine, FaTrophy,
  FaFire, FaCalendar, FaCrown, FaEye
} from 'react-icons/fa';

function Stats() {
  useDocumentTitle('Thống kê của tôi');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }

    fetchStats();
  }, [user, authLoading, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await userService.getMyStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return <Loading />;
  }

  if (!stats) {
    return null;
  }

  const { overview, genres, activity, subscription } = stats;

  // Calculate achievement level
  const getLevel = (moviesWatched) => {
    if (moviesWatched >= 100) return { level: 'Huyền thoại', icon: '👑', color: 'from-yellow-400 to-orange-500' };
    if (moviesWatched >= 50) return { level: 'Chuyên gia', icon: '🏆', color: 'from-purple-500 to-pink-500' };
    if (moviesWatched >= 20) return { level: 'Người hâm mộ', icon: '⭐', color: 'from-blue-500 to-cyan-500' };
    if (moviesWatched >= 5) return { level: 'Người mới', icon: '🎬', color: 'from-green-500 to-emerald-500' };
    return { level: 'Khởi đầu', icon: '🌱', color: 'from-gray-500 to-gray-600' };
  };

  const levelInfo = getLevel(overview.totalMoviesWatched);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-netflix-red to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-netflix-red/50">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white">
                  Thống kê của tôi
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                  Xem tổng quan hoạt động xem phim của bạn
                </p>
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className={`bg-gradient-to-r ${levelInfo.color} rounded-3xl p-8 mb-8 shadow-2xl animate-fade-in`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-6xl mb-3">{levelInfo.icon}</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Cấp độ: {levelInfo.level}
                </h2>
                <p className="text-white/90">
                  Bạn đã xem {overview.totalMoviesWatched} bộ phim
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {overview.totalMoviesWatched}
                </div>
                <p className="text-white/90">Phim đã xem</p>
              </div>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {/* Total Movies */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <FaFilm className="text-blue-400 text-3xl" />
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <FaEye className="text-blue-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Đã xem</p>
              <p className="text-white text-3xl font-bold">{overview.totalMoviesWatched}</p>
              <p className="text-green-400 text-xs mt-2">
                ✓ {overview.completedMovies} hoàn thành
              </p>
            </div>

            {/* Favorites */}
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <FaHeart className="text-red-400 text-3xl" />
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FaHeart className="text-red-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Yêu thích</p>
              <p className="text-white text-3xl font-bold">{overview.totalFavorites}</p>
              <p className="text-gray-500 text-xs mt-2">
                {overview.totalWatchlist} trong watchlist
              </p>
            </div>

            {/* Watch Time */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <FaClock className="text-purple-400 text-3xl" />
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <FaClock className="text-purple-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Thời gian xem</p>
              <p className="text-white text-2xl font-bold">{overview.totalWatchTimeFormatted}</p>
              <p className="text-gray-500 text-xs mt-2">
                {overview.totalWatchTime} phút
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <FaStar className="text-yellow-400 text-3xl" />
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <FaStar className="text-yellow-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Đánh giá</p>
              <p className="text-white text-3xl font-bold">{overview.totalReviews}</p>
              <p className="text-gray-500 text-xs mt-2">
                Đóng góp của bạn
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Top Genres */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaTrophy className="text-yellow-400 mr-3" />
                Thể loại yêu thích
              </h3>
              
              {genres.topGenres.length > 0 ? (
                <div className="space-y-4">
                  {genres.topGenres.map((genre, index) => {
                    const percentage = (genre.count / overview.totalMoviesWatched) * 100;
                    const colors = [
                      'from-red-500 to-pink-500',
                      'from-blue-500 to-cyan-500',
                      'from-purple-500 to-pink-500',
                      'from-green-500 to-emerald-500',
                      'from-orange-500 to-yellow-500'
                    ];
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">{genre.genre}</span>
                          <span className="text-gray-400 text-sm">{genre.count} phim</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${colors[index]} transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Chưa có dữ liệu thể loại
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  Tổng cộng: <span className="text-white font-semibold">{genres.totalGenresWatched}</span> thể loại khác nhau
                </p>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaFire className="text-orange-400 mr-3" />
                Hoạt động gần đây
              </h3>

              {activity.monthlyActivity.length > 0 ? (
                <div className="space-y-4">
                  {activity.monthlyActivity.slice(0, 6).map((month, index) => {
                    const maxCount = Math.max(...activity.monthlyActivity.map(m => m.count));
                    const percentage = (month.count / maxCount) * 100;
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">{month.month}</span>
                          <span className="text-gray-400 text-sm">{month.count} phim</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Chưa có hoạt động gần đây
                </p>
              )}

              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm">7 ngày qua:</p>
                  <p className="text-white font-bold text-lg">{activity.last7Days} phim</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Account Info */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <FaCalendar className="text-blue-400 text-2xl" />
                <h3 className="text-xl font-bold text-white">Tài khoản</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tuổi tài khoản:</span>
                  <span className="text-white font-semibold">{overview.accountAge} ngày</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trung bình/tuần:</span>
                  <span className="text-white font-semibold">{overview.avgMoviesPerWeek} phim</span>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <FaCrown className="text-yellow-400 text-2xl" />
                <h3 className="text-xl font-bold text-white">Gói dịch vụ</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gói hiện tại:</span>
                  <span className="text-white font-semibold capitalize">{subscription.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trạng thái:</span>
                  <span className={`font-semibold ${subscription.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                    {subscription.isActive ? 'Đang hoạt động' : 'Chưa kích hoạt'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <FaFire className="text-orange-400 text-2xl" />
                <h3 className="text-xl font-bold text-white">Hoạt động</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">7 ngày qua:</span>
                  <span className="text-white font-semibold">{overview.recentActivity} phim</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tỷ lệ hoàn thành:</span>
                  <span className="text-white font-semibold">
                    {overview.totalMoviesWatched > 0 
                      ? Math.round((overview.completedMovies / overview.totalMoviesWatched) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Stats;
