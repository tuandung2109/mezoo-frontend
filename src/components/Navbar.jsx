import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaBroadcastTower, FaCaretDown, FaUser, FaSignOutAlt, FaBars, FaHome, FaFilm, FaFire, FaHeart, FaHistory, FaCrown, FaCog, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import { notificationService } from '../services/notificationService';

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container') && !event.target.closest('.notification-container')) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications(false, 10);
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await notificationService.markAsRead(notification._id);
      fetchNotifications();
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setShowNotifications(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => navigate('/')}
            className="text-netflix-red text-3xl md:text-4xl font-black cursor-pointer hover:scale-105 transition-all flex-shrink-0 flex items-center"
            style={{ 
              fontFamily: '"Bebas Neue", "Impact", "Arial Black", sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(229,9,20,0.5)',
              letterSpacing: '0.05em',
              lineHeight: '1'
            }}
          >
            mezoo
          </div>
          <div className="hidden md:flex items-center space-x-6 text-base font-medium">
            <button onClick={() => navigate('/')} className="hover:text-gray-300 transition whitespace-nowrap">Trang chủ</button>
            <button onClick={() => navigate('/movies')} className="hover:text-gray-300 transition whitespace-nowrap">Phim</button>
            <button onClick={() => navigate('/trending')} className="hover:text-gray-300 transition whitespace-nowrap">Mới & Phổ biến</button>
            <button onClick={() => navigate('/live-room')} className="hover:text-gray-300 transition whitespace-nowrap flex items-center gap-1">
              <FaBroadcastTower size={14} />
              <span>Phòng live</span>
            </button>
            <button onClick={() => navigate('/my-list')} className="hover:text-gray-300 transition whitespace-nowrap">Danh sách của tôi</button>
            <button onClick={() => navigate('/history')} className="hover:text-gray-300 transition whitespace-nowrap">Lịch sử</button>
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')} 
                className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 transition font-semibold"
              >
                <FaCog />
                <span>Quản trị</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar />
          
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative notification-container">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="hover:text-gray-300 transition relative"
                >
                  <FaBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-netflix-red rounded-full text-xs flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-black/95 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    <div className="sticky top-0 bg-black/95 border-b border-gray-700 p-4 flex items-center justify-between">
                      <h3 className="font-bold">Thông báo</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-netflix-red hover:underline"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <FaBell size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Không có thông báo</p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notif) => (
                          <button
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`w-full text-left p-4 border-b border-gray-800 hover:bg-gray-800 transition ${
                              !notif.isRead ? 'bg-gray-900/50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {notif.relatedMovie?.poster && (
                                <img
                                  src={notif.relatedMovie.poster}
                                  alt=""
                                  className="w-12 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm mb-1">{notif.title}</p>
                                <p className="text-xs text-gray-400 line-clamp-2">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{getTimeAgo(notif.createdAt)}</p>
                              </div>
                              {!notif.isRead && (
                                <div className="w-2 h-2 bg-netflix-red rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative dropdown-container">
                <div 
                  className="flex items-center space-x-2 cursor-pointer group"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-8 h-8 bg-netflix-red rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <FaCaretDown className="group-hover:rotate-180 transition-transform" />
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-gray-700 rounded shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-semibold">{user?.fullName}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>

                    {/* Mobile Menu Items - Only show on mobile */}
                    <div className="md:hidden border-b border-gray-700">
                      <button 
                        onClick={() => { navigate('/'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <FaHome size={14} />
                        <span>Trang chủ</span>
                      </button>
                      <button 
                        onClick={() => { navigate('/movies'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <FaFilm size={14} />
                        <span>Phim</span>
                      </button>
                      <button 
                        onClick={() => { navigate('/trending'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <FaFire size={14} />
                        <span>Mới & Phổ biến</span>
                      </button>
                      <button 
                        onClick={() => { navigate('/my-list'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <FaHeart size={14} />
                        <span>Danh sách của tôi</span>
                      </button>
                      <button 
                        onClick={() => { navigate('/live-room'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <FaBroadcastTower size={14} />
                        <span>Phòng live</span>
                      </button>
                      <button 
                        onClick={() => { navigate('/history'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <FaHistory size={14} />
                        <span>Lịch sử xem</span>
                      </button>
                      <button 
                        onClick={() => { navigate('/stats'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <FaChartLine size={14} />
                        <span>Thống kê</span>
                      </button>
                    </div>

                    <button 
                      onClick={() => navigate('/profile')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                    >
                      <FaUser size={14} />
                      <span>Tài khoản</span>
                    </button>
                    <button 
                      onClick={() => navigate('/subscription')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                    >
                      <FaCrown size={14} />
                      <span>Gói đăng ký</span>
                    </button>
                    
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => { navigate('/admin'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2 text-orange-400"
                      >
                        <FaCog size={14} />
                        <span>Quản trị</span>
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                    >
                      <FaSignOutAlt size={14} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-netflix-red px-4 py-2 rounded hover:bg-red-700 transition font-semibold"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>


    </nav>
  );
}

export default Navbar;
