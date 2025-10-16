import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const plansApi = {
  // Generate a new plan
  generatePlan: async (planData) => {
    const response = await api.post('/plans/generate', planData);
    return response.data;
  },

  // Get all plans
  getPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  // Get a specific plan
  getPlan: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },

  // Update a plan
  updatePlan: async (id, planData) => {
    const response = await api.put(`/plans/${id}`, planData);
    return response.data;
  },

  // Delete a plan
  deletePlan: async (id) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  },
};

export const healthCheck = async () => {
  try {
    // Use direct axios call since health endpoint is not under /api
    const response = await axios.get('http://localhost:5000/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default api;