import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Movies from './pages/Movies';
import Trending from './pages/Trending';
import MyList from './pages/MyList';
import History from './pages/History';
import Subscription from './pages/Subscription';
import Stats from './pages/Stats';
import Admin from './pages/Admin';
import LiveRoom from './pages/LiveRoom';
import Chatbot from './components/Chatbot';
import './App.css';

function AppRoutes() {
  const location = useLocation();
  const hideChatbot = location.pathname === '/live-room';

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/history" element={<History />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/live-room" element={<LiveRoom />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {!hideChatbot && <Chatbot />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
