import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaChartLine, FaFilm, FaUsers, FaStar, FaCog } from 'react-icons/fa';

function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-netflix-red to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-netflix-red/50">
                <FaCog className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white">
                  Quản trị hệ thống
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                  Chào mừng, {user.fullName || user.username}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Tổng phim</p>
                  <p className="text-white text-4xl font-bold">--</p>
                </div>
                <FaFilm className="text-blue-500 text-4xl" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Người dùng</p>
                  <p className="text-white text-4xl font-bold">--</p>
                </div>
                <FaUsers className="text-green-500 text-4xl" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Đánh giá</p>
                  <p className="text-white text-4xl font-bold">--</p>
                </div>
                <FaStar className="text-yellow-500 text-4xl" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Lượt xem</p>
                  <p className="text-white text-4xl font-bold">--</p>
                </div>
                <FaChartLine className="text-purple-500 text-4xl" />
              </div>
            </div>
          </div>

          {/* Admin Sections */}
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCog className="text-gray-600 text-6xl animate-spin-slow" />
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">
              Trang quản trị đang được xây dựng
            </h2>
            <p className="text-gray-400 text-lg">
              Các tính năng quản lý sẽ được thêm vào sớm
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Admin;
