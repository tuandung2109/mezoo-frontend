import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function ForgotPassword() {
  useDocumentTitle('Quên mật khẩu');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await authService.forgotPassword(email);
      setMessage('Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra cả hộp thư chính và thư rác (Spam).');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Netflix-style Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 animate-slow-pan"
          style={{
            backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/fc164b4b-f085-44ee-bb7f-ec7df8539eff/d23a1608-7d90-4da1-93d6-bae2fe60a69b/IN-en-20230814-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
            backgroundSize: 'auto 100%',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: '0 center',
            width: '200%'
          }}
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6">
        <Link to="/">
          <h1 className="text-netflix-red text-4xl font-bold">mezoo</h1>
        </Link>
      </header>

      {/* Form Container */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-netflix-red via-purple-600 to-pink-600 rounded-2xl opacity-75 blur"></div>
            
            <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl px-12 py-12 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Quên mật khẩu</h2>
              
              {message && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-6">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang gửi...' : 'Gửi email khôi phục'}
                </button>

                {message && (
                  <p className="text-xs text-gray-400 text-center">
                    Nếu chưa thấy email, hãy kiểm tra thư mục Spam và đánh dấu "Không phải spam" để lần sau vào hộp thư chính.
                  </p>
                )}
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
