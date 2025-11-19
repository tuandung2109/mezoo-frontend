import api from './api';

export const authService = {
  // Register
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Login
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Get current user
  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  // Update user details
  updateDetails: (data) => {
    return api.put('/auth/updatedetails', data);
  },

  // Update password
  updatePassword: (data) => {
    return api.put('/auth/updatepassword', data);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
