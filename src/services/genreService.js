import api from './api';

export const genreService = {
  // Admin endpoints
  getAllGenres: async (params) => {
    const response = await api.get('/genres/admin/all', { params });
    return response.data;
  },

  getGenreStats: async () => {
    const response = await api.get('/genres/admin/stats');
    return response.data;
  },

  getGenreMovies: async (id, params) => {
    const response = await api.get(`/genres/admin/${id}/movies`, { params });
    return response.data;
  },

  toggleGenreStatus: async (id) => {
    const response = await api.put(`/genres/admin/${id}/toggle`);
    return response.data;
  },

  createGenre: async (data) => {
    const response = await api.post('/genres', data);
    return response.data;
  },

  updateGenre: async (id, data) => {
    const response = await api.put(`/genres/${id}`, data);
    return response.data;
  },

  deleteGenre: async (id) => {
    const response = await api.delete(`/genres/${id}`);
    return response.data;
  },

  // Public endpoints
  getGenres: async () => {
    const response = await api.get('/genres');
    return response.data;
  },

  getGenre: async (id) => {
    const response = await api.get(`/genres/${id}`);
    return response.data;
  }
};
