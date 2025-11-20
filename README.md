# Mozi Frontend - Movie Streaming Platform

Frontend React cho nền tảng xem phim Mozi với giao diện Netflix-style.

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
│   │   └── Loading.jsx
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

- `GET /movies` - Danh sách phim
- `GET /movies/:id` - Chi tiết phim
- `GET /genres` - Danh sách thể loại
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký

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

## 📄 License

© 2025 Mozi Movie Streaming Platform
