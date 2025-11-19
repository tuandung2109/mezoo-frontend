import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-green-400" />,
    error: <FaExclamationCircle className="text-red-400" />
  };

  const colors = {
    success: 'bg-green-500/10 border-green-500',
    error: 'bg-red-500/10 border-red-500'
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className={`${colors[type]} border rounded-lg shadow-2xl backdrop-blur-lg p-4 pr-12 min-w-[300px] max-w-md`}>
        <div className="flex items-start space-x-3">
          <div className="text-xl mt-0.5">
            {icons[type]}
          </div>
          <p className="text-white text-sm flex-1">{message}</p>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
