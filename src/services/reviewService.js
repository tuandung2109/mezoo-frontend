import api from './api';

export const reviewService = {
  // Get reviews for a movie
  getMovieReviews: (movieId, sort = 'newest') => {
    return api.get(`/reviews/movie/${movieId}?sort=${sort}`);
  },

  // Get user's review for a movie
  getUserReview: (movieId) => {
    return api.get(`/reviews/movie/${movieId}/user`);
  },

  // Create a review
  createReview: (movieId, data) => {
    return api.post(`/reviews/movie/${movieId}`, data);
  },

  // Update a review
  updateReview: (reviewId, data) => {
    return api.put(`/reviews/${reviewId}`, data);
  },

  // Delete a review
  deleteReview: (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
  },

  // Toggle helpful
  toggleHelpful: (reviewId) => {
    return api.post(`/reviews/${reviewId}/helpful`);
  }
};
