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
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="hover:text-gray-300 transition p-2"
        >
          <FaSearch size={18} />
        </button>
      ) : (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 bg-black/80 z-40 md:hidden"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
          />
          
          {/* Search Form */}
          <form 
            onSubmit={handleSubmit} 
            className="fixed md:relative top-4 left-4 right-4 md:top-auto md:left-auto md:right-auto z-50 md:z-auto"
          >
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={14} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm phim..."
                autoFocus
                className="w-full md:w-64 pl-10 pr-10 py-3 md:py-2 bg-black border border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 shadow-2xl md:shadow-none"
              />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white z-10"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
}

export default SearchBar;
