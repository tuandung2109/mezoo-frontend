import api from './api';

export const commentService = {
  // Admin endpoints
  getAllComments: async (params) => {
    const response = await api.get('/comments/admin/all', { params });
    return response.data;
  },

  getCommentStats: async () => {
    const response = await api.get('/comments/admin/stats');
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/admin/${id}`);
    return response.data;
  },

  restoreComment: async (id) => {
    const response = await api.put(`/comments/admin/${id}/restore`);
    return response.data;
  },

  // Public endpoints
  getMovieComments: async (movieId) => {
    const response = await api.get(`/comments/movie/${movieId}`);
    return response.data;
  },

  createComment: async (data) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  updateComment: async (id, data) => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  likeComment: async (id) => {
    const response = await api.put(`/comments/${id}/like`);
    return response.data;
  }
};
