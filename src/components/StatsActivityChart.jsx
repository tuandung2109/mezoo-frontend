import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { FaFire, FaChartLine, FaTrophy } from 'react-icons/fa';

function StatsActivityChart() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await userService.getMyStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mx-auto"></div>
          <p className="text-gray-400 mt-4">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!stats || !stats.activity) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="text-center py-12">
          <FaChartLine className="text-gray-600 text-6xl mx-auto mb-4" />
          <p className="text-gray-400">Chưa có dữ liệu hoạt động</p>
        </div>
      </div>
    );
  }

  const { activity, genres, overview } = stats;
  const monthlyData = activity.monthlyActivity || [];
  const topGenres = genres.topGenres || [];

  // Calculate max value for scaling
  const maxMonthlyCount = Math.max(...monthlyData.map(m => m.count), 1);

  return (
    <div className="space-y-8">
      {/* Activity Chart */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FaFire className="text-orange-500 mr-2" />
            Hoạt động 6 tháng gần đây
          </h3>
          <div className="text-right">
            <p className="text-gray-400 text-sm">7 ngày qua</p>
            <p className="text-white font-bold text-2xl">{activity.last7Days}</p>
          </div>
        </div>

        {monthlyData.length > 0 ? (
          <div className="space-y-4">
            {monthlyData.map((month, index) => {
              const percentage = (month.count / maxMonthlyCount) * 100;
              const isHighActivity = month.count >= maxMonthlyCount * 0.7;
              
              return (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold group-hover:text-orange-400 transition">
                      {month.month}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">{month.count} phim</span>
                      {isHighActivity && (
                        <FaFire className="text-orange-500 text-sm animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="relative w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        isHighActivity 
                          ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                      style={{ 
                        width: `${percentage}%`,
                        boxShadow: isHighActivity ? '0 0 20px rgba(249, 115, 22, 0.5)' : 'none'
                      }}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Chưa có hoạt động trong 6 tháng qua</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Trung bình/tháng</p>
            <p className="text-white text-2xl font-bold">
              {monthlyData.length > 0 
                ? Math.round(monthlyData.reduce((sum, m) => sum + m.count, 0) / monthlyData.length)
                : 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Tháng cao nhất</p>
            <p className="text-white text-2xl font-bold">{maxMonthlyCount}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Tổng 6 tháng</p>
            <p className="text-white text-2xl font-bold">
              {monthlyData.reduce((sum, m) => sum + m.count, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Top Genres Chart */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <FaTrophy className="text-yellow-400 mr-2" />
          Top 5 thể loại yêu thích
        </h3>

        {topGenres.length > 0 ? (
          <div className="space-y-4">
            {topGenres.map((genre, index) => {
              const percentage = (genre.count / overview.totalMoviesWatched) * 100;
              const colors = [
                { bg: 'from-red-500 to-pink-500', text: 'text-red-400' },
                { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-400' },
                { bg: 'from-purple-500 to-pink-500', text: 'text-purple-400' },
                { bg: 'from-green-500 to-emerald-500', text: 'text-green-400' },
                { bg: 'from-orange-500 to-yellow-500', text: 'text-orange-400' }
              ];
              const color = colors[index] || colors[0];
              
              return (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`text-2xl font-bold ${color.text}`}>#{index + 1}</span>
                      <span className="text-white font-semibold group-hover:text-netflix-red transition">
                        {genre.genre}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">{genre.count}</span>
                      <span className="text-gray-400 text-sm ml-1">phim</span>
                      <span className="text-gray-500 text-xs ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="relative w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${color.bg} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Chưa có dữ liệu thể loại</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            Bạn đã khám phá <span className="text-white font-semibold">{genres.totalGenresWatched}</span> thể loại khác nhau
          </p>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
          <p className="text-blue-400 text-sm mb-1">Tổng thời gian</p>
          <p className="text-white text-xl font-bold">{overview.totalWatchTimeFormatted}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
          <p className="text-green-400 text-sm mb-1">Hoàn thành</p>
          <p className="text-white text-xl font-bold">{overview.completedMovies}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
          <p className="text-purple-400 text-sm mb-1">TB/tuần</p>
          <p className="text-white text-xl font-bold">{overview.avgMoviesPerWeek}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
          <p className="text-orange-400 text-sm mb-1">Đánh giá</p>
          <p className="text-white text-xl font-bold">{overview.totalReviews}</p>
        </div>
      </div>
    </div>
  );
}

export default StatsActivityChart;
