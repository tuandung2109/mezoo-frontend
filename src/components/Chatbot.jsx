import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaComments, FaTimes, FaPaperPlane, FaRobot, 
  FaTrash, FaStar, FaExpand, FaCompress, FaMicrophone, FaStop
} from 'react-icons/fa';
import axios from 'axios';
import Toast from './Toast';
import './Chatbot.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Chatbot() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const quickReplies = isAuthenticated 
    ? [
        "Gợi ý phim hành động hay",
        "Phim mới nhất là gì?",
        "Gói Premium có gì?",
        "Làm sao thêm phim vào yêu thích?"
      ]
    : [
        "Gợi ý phim hành động hay",
        "Phim mới nhất là gì?",
        "Mozi có những tính năng gì?",
        "Làm sao để đăng ký?"
      ];

  // Load chat history from localStorage - DISABLED (không lưu lịch sử)
  useEffect(() => {
    // const savedMessages = localStorage.getItem('mozi_chat_history');
    // if (savedMessages) {
    //   try {
    //     const parsed = JSON.parse(savedMessages);
    //     // Restore messages without movie data (movies will be empty arrays)
    //     const restored = parsed.map(msg => ({
    //       ...msg,
    //       movies: [] // Don't restore movie data, too heavy
    //     }));
    //     setMessages(restored);
    //   } catch (e) {
    //     console.error('Error loading chat history:', e);
    //     localStorage.removeItem('mozi_chat_history');
    //   }
    // } else {
      // Welcome message - Always show on load
      const welcomeMessage = isAuthenticated
        ? `Xin chào ${user?.fullName || 'bạn'}! Tôi là Mozi AI Assistant. Tôi có thể giúp bạn tìm phim, tư vấn gói đăng ký, và trả lời các câu hỏi về nền tảng. Bạn cần giúp gì?`
        : 'Xin chào! Tôi là Mozi AI Assistant. Tôi có thể giúp bạn tìm phim và trả lời các câu hỏi về nền tảng. Đăng nhập để trải nghiệm đầy đủ tính năng nhé! 😊';
      
      setMessages([{
        id: Date.now(),
        type: 'bot',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    // }
  }, [isAuthenticated, user]);

  // Save chat history to localStorage - DISABLED (không lưu lịch sử)
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     // Only save last 50 messages to prevent localStorage overflow
  //     const messagesToSave = messages.slice(-50).map(msg => ({
  //       id: msg.id,
  //       type: msg.type,
  //       content: msg.content,
  //       timestamp: msg.timestamp,
  //       error: msg.error,
  //       // Only save movie IDs, not full movie data
  //       movieIds: msg.movies?.map(m => m._id) || []
  //     }));
  //     
  //     try {
  //       localStorage.setItem('mozi_chat_history', JSON.stringify(messagesToSave));
  //     } catch (e) {
  //       console.error('Error saving chat history:', e);
  //       // If localStorage is full, clear old history
  //       if (e.name === 'QuotaExceededError') {
  //         localStorage.removeItem('mozi_chat_history');
  //         console.log('localStorage full, cleared chat history');
  //       }
  //     }
  //   }
  // }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN'; // Vietnamese

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          showToast('Không nghe thấy giọng nói. Vui lòng thử lại.', 'error');
        } else if (event.error === 'not-allowed') {
          showToast('Vui lòng cho phép truy cập microphone.', 'error');
        } else {
          showToast('Lỗi nhận diện giọng nói. Vui lòng thử lại.', 'error');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      showToast('Trình duyệt không hỗ trợ nhận diện giọng nói.', 'error');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast('Đang lắng nghe... Hãy nói gì đó! 🎤', 'info');
      } catch (error) {
        console.error('Error starting recognition:', error);
        showToast('Không thể bắt đầu nhận diện giọng nói.', 'error');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const headers = {};
      if (isAuthenticated) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }

      const response = await axios.post(`${API_URL}/chat/send`, {
        message: inputValue
      }, {
        headers,
        timeout: 30000
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.data.response,
        movies: response.data.data.movies || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Bot không phản hồi. Vui lòng thử lại.';
      } else if (!navigator.onLine) {
        errorMessage = 'Không thể kết nối. Vui lòng kiểm tra internet.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
      }

      showToast(errorMessage, 'error');
      
      const errorMsg = {
        id: Date.now() + 1,
        type: 'bot',
        content: errorMessage,
        error: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (text) => {
    setInputValue(text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa lịch sử chat?')) {
      setMessages([{
        id: Date.now(),
        type: 'bot',
        content: 'Lịch sử chat đã được xóa. Bạn cần giúp gì?',
        timestamp: new Date()
      }]);
      localStorage.removeItem('mozi_chat_history');
      showToast('Đã xóa lịch sử chat', 'success');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageContent = (content) => {
    // Replace \n with actual line breaks
    return content.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  // Hide chatbot on specific pages or during loading
  const hiddenPaths = ['/login', '/register', '/admin'];
  const shouldHideChatbot = loading || hiddenPaths.some(path => location.pathname.startsWith(path));

  // Auto-close chatbot when navigating to hidden pages
  useEffect(() => {
    if (shouldHideChatbot && isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname, shouldHideChatbot, isOpen]);

  // Hide body scrollbar when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Don't show chatbot on hidden pages
  if (shouldHideChatbot) {
    return null;
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className={`chatbot-container ${loading ? 'chatbot-loading' : ''}`}>
        {/* Floating Button */}
        {!isOpen && (
          <button 
            className="chatbot-button pulse"
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
          >
            <FaComments size={24} />
          </button>
        )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window animate-slide-in ${isFullscreen ? 'chatbot-fullscreen' : ''}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="bot-avatar">
                <FaRobot size={24} />
              </div>
              <div className="bot-info">
                <h3>Mozi AI Assistant</h3>
                <span className="bot-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                aria-label={isFullscreen ? "Thu nhỏ" : "Phóng to"}
                title={isFullscreen ? "Thu nhỏ" : "Phóng to"}
              >
                {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                title="Đóng"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" role="log" aria-live="polite">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.type}-message animate-fade-in`}
              >
                <div className={`message-bubble ${message.error ? 'error' : ''}`}>
                  <p>{formatMessageContent(message.content)}</p>
                  
                  {/* Movie Cards List */}
                  {message.movies && message.movies.length > 0 && (
                    <div className="movies-list-chat">
                      {message.movies.map((movie) => (
                        <div 
                          key={movie._id}
                          className="movie-card-chat"
                          onClick={() => {
                            navigate(`/movie/${movie._id}`);
                            setIsOpen(false);
                          }}
                        >
                          <img 
                            src={movie.poster} 
                            alt={movie.title}
                            className="movie-poster-chat"
                          />
                          <div className="movie-info-chat">
                            <h4>{movie.title}</h4>
                            <div className="movie-meta-chat">
                              <span className="movie-rating-chat">
                                <FaStar size={12} />
                                {movie.rating?.toFixed(1) || 'N/A'}
                              </span>
                              <span>{new Date(movie.releaseDate).getFullYear()}</span>
                            </div>
                            {movie.genres && (
                              <div className="movie-genres-chat">
                                {movie.genres.slice(0, 2).map((genre, idx) => (
                                  <span key={idx} className="genre-tag-chat">{genre}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="message bot-message">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="quick-replies">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhắn tin cho Mozi AI..."
              disabled={isTyping}
              aria-label="Message input"
            />
            <button 
              onClick={toggleVoiceInput}
              aria-label={isListening ? "Dừng ghi âm" : "Ghi âm giọng nói"}
              title={isListening ? "Dừng ghi âm" : "Ghi âm giọng nói"}
              className={`voice-button ${isListening ? 'listening' : ''}`}
            >
              {isListening ? <FaStop size={16} /> : <FaMicrophone size={16} />}
            </button>
            <button 
              onClick={handleClearHistory}
              aria-label="Clear history"
              title="Xóa lịch sử"
              className="clear-button"
            >
              <FaTrash size={16} />
            </button>
            <button 
              onClick={handleSendMessage}
              disabled={isTyping || !inputValue.trim()}
              aria-label="Send message"
              className="send-button"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default Chatbot;
