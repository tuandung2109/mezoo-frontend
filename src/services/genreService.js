import api from './api';

export const genreService = {
  // Get all genres
  getGenres: () => {
    return api.get('/genres');
  },

  // Get all genres (alias)
  getAllGenres: async () => {
    const response = await api.get('/genres');
    return response.data?.data || response.data || [];
  },

  // Get single genre
  getGenre: (id) => {
    return api.get(`/genres/${id}`);
  },
};
