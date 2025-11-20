import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Chatbot.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sessionId] = useState(`session-${Date.now()}`);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history
  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
      loadSuggestions();
    }
  }, [isOpen, user]);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/chat/history?sessionId=${sessionId}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/chat/suggestions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuggestions(response.data.data);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text, createdAt: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/chat`, {
        message: text,
        sessionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.data.message,
        recommendedMovies: response.data.data.recommendedMovies,
        createdAt: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau. 😔',
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    if (!confirm('Xóa toàn bộ lịch sử chat?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/chat/history?sessionId=${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h3>Mozi Assistant</h3>
                <span className="chatbot-status">
                  <span className="status-dot"></span> Online
                </span>
              </div>
            </div>
            <button onClick={clearChat} className="chatbot-clear" title="Xóa lịch sử">
              🗑️
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="welcome-icon">👋</div>
                <h4>Xin chào {user.fullName || user.username}!</h4>
                <p>Tôi là trợ lý AI của Mozi. Tôi có thể giúp bạn:</p>
                <ul>
                  <li>🎬 Gợi ý phim hay</li>
                  <li>🔍 Tìm kiếm phim</li>
                  <li>💡 Trả lời câu hỏi về phim</li>
                  <li>🎯 Hỗ trợ sử dụng trang web</li>
                </ul>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span>🤖</span>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                  
                  {/* Recommended Movies */}
                  {msg.recommendedMovies && msg.recommendedMovies.length > 0 && (
                    <div className="recommended-movies">
                      {msg.recommendedMovies.map(movie => (
                        <a 
                          key={movie._id} 
                          href={`/movie/${movie.slug}`}
                          className="movie-card-mini"
                        >
                          <img src={movie.poster} alt={movie.title} />
                          <div className="movie-info-mini">
                            <h5>{movie.title}</h5>
                            <div className="movie-meta-mini">
                              <span className="rating">⭐ {movie.rating.average.toFixed(1)}</span>
                              <span className="genres">{movie.genres.slice(0, 2).join(', ')}</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 0 && suggestions.length > 0 && (
            <div className="chatbot-suggestions">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              rows="1"
              disabled={isLoading}
            />
            <button 
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
