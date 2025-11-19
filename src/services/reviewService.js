import api from './api';

export const reviewService = {
  // Admin endpoints
  getAllReviews: async (params) => {
    const response = await api.get('/reviews/admin/all', { params });
    return response.data;
  },

  getReviewStats: async () => {
    const response = await api.get('/reviews/admin/stats');
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/admin/${id}`);
    return response.data;
  },

  // Public endpoints
  getMovieReviews: async (movieId, params) => {
    const response = await api.get(`/reviews/movie/${movieId}`, { params });
    return response.data;
  }
};
