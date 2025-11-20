import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { welcomeUser } from '../utils/textToSpeech';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
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

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      // Get user name from result or form data
      const userName = result.user?.fullName || formData.fullName || formData.username;
      
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

      {/* Register Form Container */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <div className="bg-black/75 rounded px-16 py-14">
            <h1 className="text-white text-3xl font-semibold mb-7">Đăng ký</h1>

            {error && (
              <div className="bg-[#e87c03] text-white px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-[#333] text-white rounded border-0 focus:outline-none focus:ring-1 focus:ring-white/50 placeholder-gray-400"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full px-5 py-4 bg-[#333] text-white rounded border-0 focus:outline-none focus:ring-1 focus:ring-white/50 placeholder-gray-400"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
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
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-5 py-4 bg-[#333] text-white rounded border-0 focus:outline-none focus:ring-1 focus:ring-white/50 placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-netflix-red text-white py-4 rounded font-semibold text-base hover:bg-[#c11119] transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>

            <div className="mt-12 text-[#737373]">
              <span>Đã có tài khoản Mozi? </span>
              <Link to="/login" className="text-white hover:underline">
                Đăng nhập ngay
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

export default Register;