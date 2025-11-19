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
};
