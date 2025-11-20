import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { welcomeUser } from '../utils/textToSpeech';

function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      // Get user info from result or context
      const userName = result.user?.fullName || result.user?.username || 'bạn';
      
      // Welcome speech
      welcomeUser(userName);
      
      // Navigate to home
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Netflix-style Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/fc164b4b-f085-44ee-bb7f-ec7df8539eff/d23a1608-7d90-4da1-93d6-bae2fe60a69b/IN-en-20230814-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Header with Logo */}
      <header className="relative z-10 px-8 py-6">
        <Link to="/">
          <h1 className="text-netflix-red text-4xl font-bold">MOZI</h1>
        </Link>
      </header>

      {/* Login Form Container */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <div className="bg-black/75 rounded px-16 py-14">
            <h1 className="text-white text-3xl font-semibold mb-7">Đăng nhập</h1>

            {error && (
              <div className="bg-[#e87c03] text-white px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email hoặc số điện thoại"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-[#333] text-white rounded border-0 focus:outline-none focus:ring-1 focus:ring-white/50 placeholder-gray-400"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-[#333] text-white rounded border-0 focus:outline-none focus:ring-1 focus:ring-white/50 placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-netflix-red text-white py-4 rounded font-semibold text-base hover:bg-[#c11119] transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <div className="flex items-center justify-between text-sm mt-3">
                <label className="flex items-center text-[#b3b3b3] cursor-pointer">
                  <input type="checkbox" className="mr-2 w-4 h-4" />
                  <span>Ghi nhớ tôi</span>
                </label>
                <a href="#" className="text-[#b3b3b3] hover:underline">
                  Bạn cần trợ giúp?
                </a>
              </div>
            </form>

            <div className="mt-16 text-[#737373]">
              <span>Bạn mới tham gia Mozi? </span>
              <Link to="/register" className="text-white hover:underline">
                Đăng ký ngay
              </Link>
              .
            </div>

            <div className="mt-3 text-xs text-[#737373]">
              Trang này được Google reCAPTCHA bảo vệ để đảm bảo bạn không phải là robot.{' '}
              <a href="#" className="text-[#0071eb] hover:underline">Tìm hiểu thêm</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
