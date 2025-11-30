import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { welcomeUser } from '../utils/textToSpeech';

function Login() {
  useDocumentTitle('Đăng nhập');
  const navigate = useNavigate();
  const { login, socialLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: 'dinhtuandung10a6@gmail.com',
    password: '123456'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSocialLogin = async (provider, token) => {
    setLoading(true);
    setError('');
    const result = await socialLogin({ provider, token });
    
    if (result.success) {
      const userName = result.user?.fullName || result.user?.username || 'bạn';
      welcomeUser(userName);
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Netflix-style Background with Continuous Animation */}
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

      {/* Header with Logo */}
      <header className="relative z-10 px-8 py-6">
        <Link to="/">
          <h1 className="text-netflix-red text-4xl font-bold">mezoo</h1>
        </Link>
      </header>

      {/* Login Form Container */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          {/* Glass morphism card with gradient border */}
          <div className="relative">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-netflix-red via-purple-600 to-pink-600 rounded-2xl opacity-75 blur"></div>
            
            {/* Main form card */}
            <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl px-12 py-12 shadow-2xl">
              {/* Title with gradient */}
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 text-4xl font-bold mb-8 text-center">
                Đăng nhập
              </h1>

              {error && (
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-lg mb-6 text-sm shadow-lg animate-pulse">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input with Icon */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-netflix-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email hoặc số điện thoại"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 placeholder-gray-500 transition-all duration-300 hover:bg-white/10"
                  />
                </div>

                {/* Password Input with Icon and Toggle */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-netflix-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 placeholder-gray-500 transition-all duration-300 hover:bg-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-netflix-red transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Submit Button with Gradient */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-netflix-red to-red-700 text-white py-4 rounded-xl font-bold text-base hover:from-red-700 hover:to-netflix-red transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-netflix-red/50 mt-8"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang đăng nhập...
                    </span>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>

                {/* Remember me & Help */}
                <div className="flex items-center justify-between text-sm mt-4">
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-white transition-colors group">
                    <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-600 text-netflix-red focus:ring-netflix-red focus:ring-offset-0" />
                    <span>Ghi nhớ tôi</span>
                  </label>
                  <a href="#" className="text-gray-300 hover:text-netflix-red transition-colors">
                    Quên mật khẩu?
                  </a>
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black/90 text-gray-400">hoặc đăng nhập với</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center justify-center w-full">
                    <GoogleLogin
                      onSuccess={credentialResponse => {
                        handleSocialLogin('google', credentialResponse.credential);
                      }}
                      onError={() => {
                        setError('Đăng nhập Google thất bại');
                      }}
                      theme="filled_black"
                      shape="pill"
                      width="100%"
                    />
                  </div>
              </div>

              {/* Sign up link */}
              <div className="text-center">
                <span className="text-gray-400">Bạn mới tham gia mezoo? </span>
                <Link to="/register" className="text-netflix-red hover:text-red-400 font-semibold transition-colors">
                  Đăng ký ngay
                </Link>
              </div>

              {/* reCAPTCHA notice */}
              {/* <div className="mt-6 text-xs text-gray-500 text-center">
                Trang này được Google reCAPTCHA bảo vệ để đảm bảo bạn không phải là robot.
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
