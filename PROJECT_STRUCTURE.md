# 📁 Cấu Trúc Project Frontend Mozi

## 🎯 Tổng Quan

Frontend được tổ chức theo **Component-Based Architecture** chuẩn React với separation of concerns rõ ràng.

---

## 📂 Cấu Trúc Thư Mục

```
frontend/
│
├── public/                      # Static assets
│   └── vite.svg
│
├── src/
│   │
│   ├── components/             # ✅ Reusable UI Components
│   │   ├── Navbar.jsx         # Navigation bar với scroll effect
│   │   ├── Footer.jsx         # Footer với links
│   │   ├── HeroBanner.jsx     # Hero banner cho featured movie
│   │   ├── MovieRow.jsx       # Hàng phim cuộn ngang
│   │   ├── MovieCard.jsx      # Card hiển thị từng phim
│   │   └── Loading.jsx        # Loading spinner
│   │
│   ├── pages/                  # ✅ Page Components
│   │   └── Home.jsx           # Trang chủ
│   │
│   ├── services/               # ✅ API Services Layer
│   │   ├── api.js             # Axios instance với interceptors
│   │   ├── authService.js     # Authentication APIs
│   │   ├── movieService.js    # Movie APIs
│   │   ├── genreService.js    # Genre APIs
│   │   └── userService.js     # User APIs (favorites, watchlist)
│   │
│   ├── utils/                  # ✅ Helper Functions
│   │   └── helpers.js         # Format date, runtime, rating, etc.
│   │
│   ├── constants/              # ✅ Constants & Config
│   │   └── index.js           # API URLs, routes, enums
│   │
│   ├── App.jsx                 # Main App component
│   ├── App.css                 # App-specific styles
│   ├── index.css               # Global styles + Tailwind
│   └── main.jsx                # Entry point
│
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── README.md                    # Documentation
└── PROJECT_STRUCTURE.md        # This file
```

---

## 🧩 Components Layer

### **Navbar.jsx**
- Fixed navigation bar
- Scroll effect (transparent → solid)
- Responsive menu
- Search, notifications, profile icons

### **HeroBanner.jsx**
- Full-screen hero section
- Featured movie display
- Play & Info buttons
- Gradient overlays

### **MovieRow.jsx**
- Horizontal scrolling row
- Title heading
- Contains multiple MovieCards

### **MovieCard.jsx**
- Movie poster display
- Hover effects (scale + info)
- Rating & year display
- Lazy loading images

### **Footer.jsx**
- Multi-column links
- Social media links
- Copyright info

### **Loading.jsx**
- Animated loading screen
- Mozi logo with pulse effect

---

## 📄 Pages Layer

### **Home.jsx**
- Main landing page
- Fetches movies & genres
- Displays HeroBanner
- Multiple MovieRows by category
- Integrates all components

---

## 🔌 Services Layer

### **api.js**
- Axios instance configuration
- Base URL setup
- Request interceptor (add JWT token)
- Response interceptor (handle 401)

### **authService.js**
```javascript
- register(userData)
- login(credentials)
- getCurrentUser()
- updateDetails(data)
- updatePassword(data)
- logout()
```

### **movieService.js**
```javascript
- getMovies(params)
- getMovie(id)
- getMovieBySlug(slug)
- getFeaturedMovies()
- getTrendingMovies()
- searchMovies(query)
```

### **genreService.js**
```javascript
- getGenres()
- getGenre(id)
```

### **userService.js**
```javascript
- getFavorites()
- addToFavorites(movieId)
- removeFromFavorites(movieId)
- getWatchlist()
- addToWatchlist(movieId)
- removeFromWatchlist(movieId)
- getHistory()
- addToHistory(movieId, data)
- updatePreferences(data)
```

---

## 🛠️ Utils Layer

### **helpers.js**
```javascript
- formatDate(date)          // Format date to Vietnamese
- formatRuntime(minutes)    // Convert minutes to hours/mins
- truncateText(text, max)   // Truncate long text
- getYear(date)             // Extract year from date
- formatRating(rating)      // Format rating to 1 decimal
```

---

## 📋 Constants Layer

### **index.js**
```javascript
- API_BASE_URL              // Backend API URL
- ROUTES                    // App routes
- SUBSCRIPTION_PLANS        // Plan types
- VIDEO_QUALITIES           // Quality options
```

---

## 🎨 Styling Strategy

### **Tailwind CSS**
- Utility-first approach
- Custom Netflix colors in config
- Responsive breakpoints
- Custom scrollbar styles

### **Custom CSS**
- `App.css` - Component-specific styles
- `index.css` - Global styles + Tailwind directives
- Animations (fadeIn, pulse, bounce)

---

## 🔄 Data Flow

```
User Action
    ↓
Component (pages/Home.jsx)
    ↓
Service Layer (services/movieService.js)
    ↓
API Instance (services/api.js)
    ↓
Backend API (http://localhost:5000/api)
    ↓
Response
    ↓
Component State Update
    ↓
UI Re-render
```

---

## 🎯 Best Practices Implemented

✅ **Separation of Concerns**
- Components chỉ lo UI
- Services lo API calls
- Utils lo business logic

✅ **Reusability**
- Components có thể tái sử dụng
- Services có thể gọi từ nhiều nơi

✅ **Maintainability**
- Code dễ đọc, dễ maintain
- Cấu trúc rõ ràng

✅ **Scalability**
- Dễ thêm features mới
- Dễ mở rộng

✅ **Performance**
- Lazy loading images
- Code splitting ready
- Optimized re-renders

---

## 🚀 Next Steps

### Sẽ thêm:
1. **Context/State Management**
   - `contexts/AuthContext.jsx`
   - `contexts/MovieContext.jsx`

2. **More Pages**
   - `pages/MovieDetail.jsx`
   - `pages/Login.jsx`
   - `pages/Register.jsx`
   - `pages/Profile.jsx`
   - `pages/MyList.jsx`

3. **More Components**
   - `components/VideoPlayer.jsx`
   - `components/SearchBar.jsx`
   - `components/Modal.jsx`
   - `components/ReviewCard.jsx`

4. **Routing**
   - React Router setup
   - Protected routes
   - 404 page

5. **Advanced Features**
   - Infinite scroll
   - Search with debounce
   - Filters & sorting
   - User authentication flow

---

## 📝 Naming Conventions

- **Components**: PascalCase (MovieCard.jsx)
- **Services**: camelCase (movieService.js)
- **Utils**: camelCase (helpers.js)
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case (Tailwind)

---

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Axios Docs](https://axios-http.com)

---

**Cấu trúc này đảm bảo code clean, maintainable và scalable!** 🚀
