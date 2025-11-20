import api from './api';

export const chatService = {
  // Send message to chatbot
  sendMessage: async (message) => {
    const response = await api.post('/chat/send', { message });
    return response.data;
  },

  // Get chat history
  getHistory: async () => {
    const response = await api.get('/chat/history');
    return response.data;
  },

  // Clear chat history
  clearHistory: async () => {
    const response = await api.delete('/chat/history');
    return response.data;
  },

  // Get quick reply suggestions
  getSuggestions: async () => {
    const response = await api.get('/chat/suggestions');
    return response.data;
  }
};
