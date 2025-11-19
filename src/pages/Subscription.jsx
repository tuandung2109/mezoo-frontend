import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { FaCheck, FaCrown, FaStar, FaRocket, FaGift } from 'react-icons/fa';

function Subscription() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    // Đợi auth loading xong
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, loading]);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: FaGift,
      price: 0,
      period: 'Miễn phí',
      color: 'from-gray-500 to-gray-600',
      features: [
        'Xem phim chất lượng SD',
        'Quảng cáo',
        'Giới hạn 5 phim/ngày',
        'Không tải xuống',
        '1 thiết bị'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      icon: FaStar,
      price: 70000,
      period: '/tháng',
      color: 'from-blue-500 to-blue-600',
      popular: false,
      features: [
        'Xem phim chất lượng HD',
        'Không quảng cáo',
        'Không giới hạn',
        'Tải xuống 10 phim',
        '2 thiết bị đồng thời'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: FaCrown,
      price: 120000,
      period: '/tháng',
      color: 'from-purple-500 to-purple-600',
      popular: true,
      features: [
        'Xem phim chất lượng Full HD',
        'Không quảng cáo',
        'Không giới hạn',
        'Tải xuống 50 phim',
        '4 thiết bị đồng thời',
        'Xem trước phim mới'
      ]
    },
    {
      id: 'vip',
      name: 'VIP',
      icon: FaRocket,
      price: 200000,
      period: '/tháng',
      color: 'from-red-500 to-pink-600',
      popular: false,
      features: [
        'Xem phim chất lượng 4K',
        'Không quảng cáo',
        'Không giới hạn',
        'Tải xuống không giới hạn',
        'Không giới hạn thiết bị',
        'Xem trước phim mới',
        'Nội dung độc quyền',
        'Hỗ trợ ưu tiên 24/7'
      ]
    }
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    
    if (plan.id === 'free') {
      showToast('Bạn đang dùng gói miễn phí', 'info');
      return;
    }

    // TODO: Integrate payment gateway
    showToast('Tính năng thanh toán đang được phát triển', 'info');
  };

  const currentPlan = user?.subscription?.plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Chọn gói phù hợp với bạn
            </h1>
            <p className="text-gray-400 text-lg">
              Nâng cấp để trải nghiệm tốt nhất
            </p>
            {user?.subscription?.plan && (
              <div className="mt-4 inline-block">
                <span className="px-4 py-2 bg-gray-800 rounded-full text-sm">
                  Gói hiện tại: <span className="font-bold text-netflix-red capitalize">{currentPlan}</span>
                </span>
              </div>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-gray-900 rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 flex flex-col ${
                    isCurrentPlan
                      ? 'border-netflix-red shadow-lg shadow-netflix-red/50'
                      : plan.popular
                      ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                        PHỔ BIẾN NHẤT
                      </span>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-netflix-red text-white text-xs font-bold px-4 py-1 rounded-full">
                        GÓI HIỆN TẠI
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="text-white text-3xl" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="text-center mb-6">
                    {plan.price === 0 ? (
                      <p className="text-3xl font-bold text-green-400">Miễn phí</p>
                    ) : (
                      <>
                        <p className="text-3xl font-bold">
                          {plan.price.toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-sm text-gray-400">{plan.period}</p>
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 rounded-xl font-bold transition ${
                      isCurrentPlan
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg transform hover:scale-105`
                    }`}
                  >
                    {isCurrentPlan ? 'Đang sử dụng' : plan.price === 0 ? 'Dùng miễn phí' : 'Nâng cấp'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold mb-2">Tôi có thể hủy bất cứ lúc nào không?</h3>
                <p className="text-gray-400 text-sm">
                  Có, bạn có thể hủy gói đăng ký bất cứ lúc nào mà không mất phí.
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold mb-2">Tôi có thể đổi gói không?</h3>
                <p className="text-gray-400 text-sm">
                  Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào.
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="font-bold mb-2">Phương thức thanh toán nào được chấp nhận?</h3>
                <p className="text-gray-400 text-sm">
                  Chúng tôi chấp nhận thẻ tín dụng, thẻ ghi nợ, ví điện tử và chuyển khoản ngân hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Subscription;
