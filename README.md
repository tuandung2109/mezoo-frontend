# mezoo Frontend - Movie Streaming Platform

Frontend React cho nền tảng xem phim mezoo với giao diện Netflix-style.

## 🎨 Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Swiper** - Carousel/Slider

## 📁 Cấu trúc Project

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── MovieRow.jsx
│   │   ├── MovieCard.jsx
│   │   ├── Loading.jsx
│   │   ├── Chatbot.jsx     # 🤖 AI Chatbot
│   │   └── Chatbot.css
│   ├── pages/              # Page components
│   │   └── Home.jsx
│   ├── services/           # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── movieService.js
│   │   ├── genreService.js
│   │   └── userService.js
│   ├── utils/              # Helper functions
│   │   └── helpers.js
│   ├── constants/          # Constants & config
│   │   └── index.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Cài đặt

```bash
cd frontend
npm install
```

## 🏃 Chạy Development

```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:5173

## 🔧 Build Production

```bash
npm run build
npm run preview
```

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM renderer
- `axios` - HTTP client
- `react-router-dom` - Routing
- `react-icons` - Icons
- `swiper` - Carousel

### Dev Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react-swc` - React plugin with SWC
- `tailwindcss` - CSS framework
- `postcss` - CSS processor
- `autoprefixer` - CSS vendor prefixes

## 🎯 Features

### Đã hoàn thành
✅ Netflix-style UI
✅ Hero banner với featured movie
✅ Movie rows với scroll ngang
✅ Hover effects trên movie cards
✅ Responsive design
✅ API integration với backend
✅ Loading states
✅ Navbar với scroll effect
✅ **AI Chatbot với Google Gemini** 🤖
  - Gợi ý phim thông minh
  - Tư vấn gói đăng ký
  - Hướng dẫn sử dụng tính năng
  - Trả lời câu hỏi về phim
  - Cá nhân hóa theo sở thích

### Sắp làm
🔜 Movie detail page
🔜 Video player
🔜 Authentication (Login/Register)
🔜 User profile
🔜 Search functionality
🔜 Favorites & Watchlist
🔜 Reviews & Comments

## 🎨 Design System

### Colors
- Netflix Red: `#E50914`
- Black: `#141414`
- Gray: `#2F2F2F`

### Typography
- Font: Netflix Sans, Helvetica Neue, Arial

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔗 API Endpoints

Backend API: `http://localhost:5000/api`

### Movies & Auth
- `GET /movies` - Danh sách phim
- `GET /movies/:id` - Chi tiết phim
- `GET /genres` - Danh sách thể loại
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký

### Chatbot 🤖
- `POST /chat` - Gửi tin nhắn
- `GET /chat/history` - Lịch sử chat
- `DELETE /chat/history` - Xóa lịch sử
- `GET /chat/sessions` - Danh sách sessions
- `GET /chat/suggestions` - Gợi ý nhanh

## 📝 Code Style

- Component names: PascalCase
- File names: PascalCase for components, camelCase for utilities
- CSS: Tailwind utility classes
- State management: React hooks

## 🤝 Contributing

1. Tạo feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 🤖 AI Chatbot

### Tính năng
Chatbot AI thông minh sử dụng **Google Gemini** để:
- 🎬 Gợi ý phim phù hợp với sở thích
- 🔍 Tìm kiếm phim theo thể loại, năm, rating
- 💡 Trả lời câu hỏi về phim, diễn viên, đạo diễn
- 🎯 Tư vấn gói đăng ký (Free, Basic, Premium, VIP)
- ✨ Hướng dẫn sử dụng tính năng mezoo
- 📊 Cá nhân hóa dựa trên lịch sử xem

### Cách sử dụng
1. Đăng nhập vào mezoo
2. Click nút chat 💬 ở góc dưới phải
3. Gõ câu hỏi và nhấn Enter
4. Bot sẽ trả lời trong 1-3 giây

### Ví dụ câu hỏi
```
- "Gợi ý phim hành động hay cho tôi"
- "Tìm phim kinh dị Hàn Quốc"
- "Avengers Endgame nói về gì?"
- "Gói Premium có gì?"
- "Làm sao thêm phim vào yêu thích?"
- "Tôi nên nâng cấp lên gói nào?"
```

### UI Features
- ✨ Beautiful gradient design
- 🎭 Smooth animations
- 📱 Fully responsive
- 🌙 Dark mode support
- 🎬 Movie cards với poster
- ⭐ Rating display
- 💡 Quick reply suggestions
- ⏳ Typing indicator
- 📜 Auto-scroll
- 🗑️ Clear history

### Tích hợp vào App
```jsx
// App.jsx
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ... existing routes ... */}
        
        {/* Thêm Chatbot */}
        <Chatbot />
      </Router>
    </AuthProvider>
  );
}
```

### Documentation
- [CHATBOT_README.md](../../CHATBOT_README.md) - Tổng quan đầy đủ
- [CHATBOT_QUICKSTART.md](../../CHATBOT_QUICKSTART.md) - Hướng dẫn nhanh
- [CHATBOT_CAPABILITIES.md](../../CHATBOT_CAPABILITIES.md) - Khả năng chatbot
- [CHATBOT_EXAMPLES.md](../../CHATBOT_EXAMPLES.md) - Ví dụ thực tế

---

## 📄 License

© 2025 mezoo Movie Streaming Platform
