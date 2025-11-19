import api from './api';

export const movieService = {
  // Get all movies
  getMovies: async (params = {}) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  // Get single movie
  getMovie: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data?.data || response.data;
  },

  // Get movie by slug
  getMovieBySlug: async (slug) => {
    const response = await api.get(`/movies/slug/${slug}`);
    return response.data?.data || response.data;
  },

  // Get featured movies
  getFeaturedMovies: async () => {
    const response = await api.get('/movies/featured');
    return response.data?.data || response.data;
  },

  // Get trending movies
  getTrendingMovies: async () => {
    const response = await api.get('/movies/trending');
    return response.data?.data || response.data;
  },

  // Search movies with filters
  searchMovies: async (params) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  // Create movie (Admin)
  createMovie: async (data) => {
    const response = await api.post('/movies', data);
    return response.data;
  },

  // Update movie (Admin)
  updateMovie: async (id, data) => {
    const response = await api.put(`/movies/${id}`, data);
    return response.data;
  },

  // Delete movie (Admin)
  deleteMovie: async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  },
};
