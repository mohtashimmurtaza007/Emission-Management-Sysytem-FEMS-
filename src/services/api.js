import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Carbon Calculator API
export const carbonCalculatorAPI = {
  // Calculate carbon footprint
  calculate: async (data) => {
    try {
      const response = await api.post('/api/calculate-carbon', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's calculation history
  getHistory: async (userId, limit = 10, offset = 0) => {
    try {
      const response = await api.get(`/api/calculations/${userId}`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single calculation
  getCalculation: async (id) => {
    try {
      const response = await api.get(`/api/calculation/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete calculation
  deleteCalculation: async (id, userId) => {
    try {
      const response = await api.delete(`/api/calculation/${id}`, {
        data: { userId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user statistics
  getStats: async (userId) => {
    try {
      const response = await api.get(`/api/stats/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;
