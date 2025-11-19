import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

function SearchBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="hover:text-gray-300 transition"
        >
          <FaSearch size={18} />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm phim..."
              autoFocus
              className="pl-10 pr-10 py-2 bg-black border border-white text-white rounded w-64 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SearchBar;
