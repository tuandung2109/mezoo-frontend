# 🤖 Mozi AI Chatbot - Giao diện đẹp & Responsive

## ✨ Tính năng

### 🎨 Giao diện đẹp mắt
- **Netflix-style design** với gradient đỏ đặc trưng (#E50914)
- **Dark theme** phù hợp với thiết kế tổng thể
- **Backdrop blur** và shadow effects tạo độ sâu
- **Smooth animations** (slide-in, fade-in, typing dots)
- **Custom scrollbar** với màu Netflix red

### 📱 Responsive Design
- **Mobile** (< 768px): Full screen khi mở
- **Tablet** (768px - 1024px): 400x600px
- **Desktop** (> 1024px): 450x700px
- **Touch-friendly** buttons trên mobile

### 💬 Tính năng Chat
- ✅ Gửi tin nhắn với Enter hoặc nút Send
- ✅ Hiển thị tin nhắn user (bên phải, gradient xanh/tím)
- ✅ Hiển thị tin nhắn bot (bên trái, xám đậm)
- ✅ **Movie cards** trong chat với poster, rating, genres
- ✅ **Typing indicator** với 3 dots animation
- ✅ **Quick replies** - gợi ý câu hỏi nhanh
- ✅ **Timestamp** cho mỗi tin nhắn
- ✅ **Auto-scroll** xuống tin nhắn mới nhất

### 💾 Lưu trữ
- ✅ Lưu chat history vào **localStorage**
- ✅ Load lại history khi mở chatbot
- ✅ Nút **Clear History** với confirmation

### ⚠️ Error Handling
- ✅ Network errors
- ✅ API errors
- ✅ Timeout (30 giây)
- ✅ Authentication errors
- ✅ Retry functionality

### ♿ Accessibility
- ✅ ARIA labels cho tất cả buttons
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators
- ✅ Color contrast WCAG AA compliant
- ✅ Reduced motion support

## 🚀 Cách sử dụng

### 1. Component đã được tích hợp sẵn

Chatbot đã được import và sử dụng trong `App.jsx`:

```jsx
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ... routes ... */}
        </Routes>
        <Chatbot />
      </Router>
    </AuthProvider>
  );
}
```

### 2. Floating Button

- Nút chat floating ở **góc dưới bên phải**
- Click để mở chat window
- **Pulse animation** để thu hút sự chú ý

### 3. Chat Window

**Header:**
- Bot avatar với icon AI
- Bot name: "Mozi AI Assistant"
- Status: "Online" với green dot
- Nút Clear History và Close

**Messages:**
- User messages: bên phải, gradient xanh/tím
- Bot messages: bên trái, xám đậm
- Movie cards: click để xem chi tiết phim
- Typing indicator khi bot đang trả lời

**Quick Replies:**
- Hiển thị khi mới mở chat
- Click để tự động gửi câu hỏi

**Input:**
- Nhập tin nhắn
- Enter hoặc click Send để gửi
- Disable khi đang gửi

## 🎨 Customization

### Colors

Trong `Chatbot.css`, bạn có thể thay đổi màu sắc:

```css
/* Netflix Red */
background: linear-gradient(135deg, #E50914 0%, #B20710 100%);

/* User Message Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Bot Message Background */
background: #2a2a2a;

/* Dark Background */
background: #141414;
```

### Sizes

```css
/* Desktop */
.chatbot-window {
  width: 450px;
  height: 700px;
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .chatbot-window {
    width: 400px;
    height: 600px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .chatbot-window {
    width: 100%;
    height: 100%;
  }
}
```

## 🔧 API Integration

### Backend Endpoints

Chatbot gọi các API sau:

```javascript
POST /api/chat/send
{
  "message": "Gợi ý phim hành động hay"
}

Response:
{
  "success": true,
  "data": {
    "response": "Đây là một số phim hành động hay...",
    "movieData": {
      "_id": "...",
      "title": "...",
      "poster": "...",
      "rating": 8.5,
      "releaseDate": "...",
      "genres": ["Action", "Thriller"]
    }
  }
}
```

### Environment Variables

Trong `.env`:

```env
VITE_API_URL=https://mozi-backend.onrender.com/api
```

## 📱 Screenshots

### Desktop View
```
┌─────────────────────────────────────┐
│  🤖 Mozi AI Assistant    🗑️ ✕     │
├─────────────────────────────────────┤
│                                     │
│  Bot: Xin chào! Tôi là Mozi AI...  │
│                                     │
│              User: Gợi ý phim? 💬  │
│                                     │
│  Bot: Đây là một số phim hay...    │
│  ┌─────────────────────────────┐   │
│  │ [Poster] Movie Title        │   │
│  │          ⭐ 8.5  2025       │   │
│  │          Action, Thriller   │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Gợi ý 1] [Gợi ý 2] [Gợi ý 3]     │
├─────────────────────────────────────┤
│ [Nhắn tin cho Mozi AI...]    [📤]  │
└─────────────────────────────────────┘
```

### Mobile View
```
┌───────────────────────┐
│ 🤖 Mozi AI  🗑️ ✕    │
├───────────────────────┤
│                       │
│ Bot: Xin chào!        │
│                       │
│      User: Hi! 💬     │
│                       │
│ Bot: Tôi có thể...    │
│                       │
│                       │
│                       │
├───────────────────────┤
│ [Quick Replies]       │
├───────────────────────┤
│ [Input...]      [📤]  │
└───────────────────────┘
```

## 🎯 Quick Replies mặc định

1. "Gợi ý phim hành động hay"
2. "Phim mới nhất là gì?"
3. "Gói Premium có gì?"
4. "Làm sao thêm phim vào yêu thích?"

## ⌨️ Keyboard Shortcuts

- **Enter**: Gửi tin nhắn
- **Escape**: Đóng chatbot
- **Tab**: Navigate qua các elements

## 🐛 Troubleshooting

### Chatbot không hiển thị
- Kiểm tra user đã đăng nhập chưa
- Kiểm tra import trong App.jsx
- Kiểm tra CSS đã được import

### API không hoạt động
- Kiểm tra VITE_API_URL trong .env
- Kiểm tra backend đang chạy
- Kiểm tra token trong localStorage

### Styling bị lỗi
- Kiểm tra Chatbot.css đã được import
- Kiểm tra Tailwind CSS không conflict
- Clear cache và rebuild

## 📝 Notes

- Chatbot chỉ hiển thị khi user đã đăng nhập
- Chat history được lưu trong localStorage
- Timeout cho API call là 30 giây
- Movie cards có thể click để xem chi tiết

## 🚀 Future Enhancements

- [ ] Voice input
- [ ] Rich media (images, videos)
- [ ] Multi-language support
- [ ] Personalized suggestions
- [ ] Analytics tracking

---

**Created with ❤️ for Mozi Movie Streaming Platform**
