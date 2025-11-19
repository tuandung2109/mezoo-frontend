import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCaretDown, FaUser, FaSignOutAlt, FaBars, FaHome, FaFilm, FaFire, FaHeart, FaHistory } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <h1 
            onClick={() => navigate('/')}
            className="text-netflix-red text-3xl md:text-4xl font-bold cursor-pointer hover:scale-110 transition-transform"
          >
            MOZI
          </h1>
          <div className="hidden md:flex space-x-6 text-sm">
            <button onClick={() => navigate('/')} className="hover:text-gray-300 transition">Trang chủ</button>
            <button onClick={() => navigate('/movies')} className="hover:text-gray-300 transition">Phim</button>
            <button onClick={() => navigate('/trending')} className="hover:text-gray-300 transition">Mới & Phổ biến</button>
            <button onClick={() => navigate('/my-list')} className="hover:text-gray-300 transition">Danh sách của tôi</button>
            <button onClick={() => navigate('/history')} className="hover:text-gray-300 transition">Lịch sử</button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar />
          
          {isAuthenticated ? (
            <>
              <button className="hover:text-gray-300 transition">
                <FaBell size={18} />
              </button>
              <div 
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="flex items-center space-x-2 cursor-pointer group">
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
                        onClick={() => { navigate('/history'); setShowDropdown(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <FaHistory size={14} />
                        <span>Lịch sử xem</span>
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
