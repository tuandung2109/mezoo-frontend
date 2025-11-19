import api from './api';

export const userService = {
  // My List (combined favorites + watchlist)
  getMyList: async () => {
    const response = await api.get('/users/me/list');
    return response.data.data;
  },

  // Favorites
  getFavorites: () => {
    return api.get('/users/favorites');
  },

  addToFavorites: (movieId) => {
    return api.post(`/users/me/favorites/${movieId}`);
  },

  removeFromFavorites: (movieId) => {
    return api.delete(`/users/me/favorites/${movieId}`);
  },

  // Watchlist
  getWatchlist: () => {
    return api.get('/users/watchlist');
  },

  addToWatchlist: (movieId) => {
    return api.post(`/users/me/watchlist/${movieId}`);
  },

  removeFromWatchlist: (movieId) => {
    return api.delete(`/users/me/watchlist/${movieId}`);
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
