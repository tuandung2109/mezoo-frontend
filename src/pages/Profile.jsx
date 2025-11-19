import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';
import { 
  FaUser, FaLock, FaEdit, FaSave, FaTimes, 
  FaHistory, FaHeart, FaCrown, FaCalendar, FaStar, FaFilm,
  FaEye, FaClock, FaFire, FaChartLine
} from 'react-icons/fa';

function Profile() {
  const { user, logout, updateUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);

  // Profile data
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Đợi auth loading xong
    if (authLoading) return;

    if (!user) {
      navigate('/login');
    }
  }, [user, navigate, authLoading]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.updateDetails(profileData);
      const updatedUser = response.data.data;
      updateUser(updatedUser);
      
      showToast('Cập nhật thông tin thành công!', 'success');
      setEditMode(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Cập nhật thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp!', 'error');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
      setLoading(false);
      return;
    }

    try {
      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showToast('Đổi mật khẩu thành công!', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showToast(error.response?.data?.message || 'Đổi mật khẩu thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  const tabs = [
    { id: 'info', label: 'Thông tin', icon: FaUser },
    { id: 'security', label: 'Bảo mật', icon: FaLock },
    { id: 'stats', label: 'Thống kê', icon: FaChartLine },
    { id: 'subscription', label: 'Gói dịch vụ', icon: FaCrown }
  ];

  const stats = [
    { 
      icon: FaEye, 
      value: user.watchHistory?.length || 0, 
      label: 'Đã xem',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: FaHeart, 
      value: user.favorites?.length || 0, 
      label: 'Yêu thích',
      color: 'from-red-500 to-pink-600'
    },
    { 
      icon: FaStar, 
      value: '0', 
      label: 'Đánh giá',
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      icon: FaClock, 
      value: Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)),
      label: 'Ngày',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar />
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <div className="relative overflow-hidden rounded-3xl mb-8 animate-fade-in">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-netflix-red via-red-600 to-orange-600">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
              }}></div>
            </div>

            {/* Content */}
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-white/20 overflow-hidden shadow-2xl">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-bold text-white">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {user.subscription?.plan === 'vip' && (
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg animate-pulse">
                      <FaCrown className="text-white text-xl" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                    {user.fullName}
                  </h1>
                  <p className="text-white/90 text-lg mb-2">@{user.username}</p>
                  <p className="text-white/70 mb-4">{user.email}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                        <div className="flex items-center space-x-2">
                          <stat.icon className="text-white/80" />
                          <div>
                            <p className="text-white font-bold text-lg">{stat.value}</p>
                            <p className="text-white/70 text-xs">{stat.label}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscription Badge */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 text-center">
                  <FaCrown className="text-yellow-400 text-3xl mx-auto mb-2" />
                  <p className="text-white/70 text-sm mb-1">Gói dịch vụ</p>
                  <p className="text-white font-bold text-xl capitalize">
                    {user.subscription?.plan || 'Free'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditMode(false);
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-netflix-red to-red-600 text-white shadow-lg shadow-netflix-red/50'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-gray-800 shadow-2xl">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Thông tin cá nhân</h2>
                    <p className="text-gray-400">Quản lý thông tin tài khoản của bạn</p>
                  </div>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-netflix-red to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-netflix-red/50 transition-all transform hover:scale-105"
                    >
                      <FaEdit />
                      <span>Chỉnh sửa</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setProfileData({
                          fullName: user.fullName,
                          email: user.email,
                          avatar: user.avatar || ''
                        });
                      }}
                      className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition"
                    >
                      <FaTimes />
                      <span>Hủy</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">Họ và tên</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3.5 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3.5 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-gray-300 text-sm font-medium mb-3 block">Ảnh đại diện</label>
                      {editMode ? (
                        <ImageUpload
                          currentImage={profileData.avatar}
                          onImageChange={(url) => setProfileData({ ...profileData, avatar: url })}
                        />
                      ) : (
                        <div className="flex items-center space-x-4 bg-gray-800/30 rounded-xl p-4">
                          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700">
                            {profileData.avatar ? (
                              <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-3xl text-white">{user.username?.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">Click "Chỉnh sửa" để thay đổi ảnh đại diện</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {editMode && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-netflix-red to-red-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-netflix-red/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSave />
                      <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Bảo mật</h2>
                  <p className="text-gray-400">Thay đổi mật khẩu để bảo vệ tài khoản</p>
                </div>
                
                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3.5 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3.5 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-netflix-red to-red-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-netflix-red/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                  </button>
                </form>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Thống kê hoạt động</h2>
                  <p className="text-gray-400">Xem tổng quan về hoạt động của bạn</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all transform hover:scale-105">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <stat.icon className="text-white text-2xl" />
                      </div>
                      <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Activity Chart Placeholder */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FaFire className="text-orange-500 mr-2" />
                    Hoạt động gần đây
                  </h3>
                  <div className="text-center py-12">
                    <FaChartLine className="text-gray-600 text-6xl mx-auto mb-4" />
                    <p className="text-gray-400">Biểu đồ hoạt động đang được phát triển</p>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Gói dịch vụ</h2>
                  <p className="text-gray-400">Quản lý gói dịch vụ của bạn</p>
                </div>
                
                {/* Current Plan */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-8 mb-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaCrown className="text-white text-3xl" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white capitalize mb-1">
                          Gói {user.subscription?.plan || 'Free'}
                        </h3>
                        <p className="text-gray-300">
                          {user.subscription?.isActive ? '✓ Đang hoạt động' : '✗ Chưa kích hoạt'}
                        </p>
                      </div>
                    </div>
                    {user.subscription?.endDate && (
                      <div className="bg-black/30 rounded-xl px-6 py-4 text-center">
                        <p className="text-gray-400 text-sm mb-1">Hết hạn</p>
                        <p className="text-white font-bold text-lg">
                          {new Date(user.subscription.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upgrade Plans */}
                <h3 className="text-xl font-bold text-white mb-6">Nâng cấp gói dịch vụ</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { name: 'Basic', price: '70.000đ', features: ['720p', '2 thiết bị', '10 phim tải'] },
                    { name: 'Premium', price: '120.000đ', features: ['1080p', '4 thiết bị', 'Không giới hạn'], popular: true },
                    { name: 'VIP', price: '200.000đ', features: ['4K', 'Không giới hạn', 'Xem trước'] }
                  ].map((plan, index) => (
                    <div key={index} className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 transition-all transform hover:scale-105 ${
                      plan.popular ? 'border-netflix-red shadow-lg shadow-netflix-red/20' : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-netflix-red to-red-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                          PHỔ BIẾN
                        </div>
                      )}
                      <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                      <p className="text-4xl font-bold text-netflix-red mb-6">
                        {plan.price}
                        <span className="text-sm text-gray-400 font-normal">/tháng</span>
                      </p>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-gray-300">
                            <span className="text-green-400 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-netflix-red to-red-600 text-white hover:shadow-lg hover:shadow-netflix-red/50'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}>
                        Nâng cấp
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
