import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import StockDetail from './components/StockDetail';
import NewsPage from './components/NewsPage';
import AISummary from './components/AISummary';
import WatchlistPage from './components/WatchlistPage';
import ProfilePage from './components/ProfilePage';
import LoginSignup from './components/LoginSignup';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stock/:ticker" element={<StockDetail />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/summary/:id" element={<AISummary />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
