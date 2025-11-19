import api from './api';

export const userService = {
  // Favorites
  getFavorites: () => {
    return api.get('/users/favorites');
  },

  addToFavorites: (movieId) => {
    return api.post(`/users/favorites/${movieId}`);
  },

  removeFromFavorites: (movieId) => {
    return api.delete(`/users/favorites/${movieId}`);
  },

  // Watchlist
  getWatchlist: () => {
    return api.get('/users/watchlist');
  },

  addToWatchlist: (movieId) => {
    return api.post(`/users/watchlist/${movieId}`);
  },

  removeFromWatchlist: (movieId) => {
    return api.delete(`/users/watchlist/${movieId}`);
  },

  // Watch History
  getHistory: () => {
    return api.get('/users/history');
  },

  addToHistory: (movieId, data) => {
    return api.post(`/users/history/${movieId}`, data);
  },

  // Preferences
  updatePreferences: (data) => {
    return api.put('/users/preferences', data);
  },
};
