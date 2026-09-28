import axios from 'axios';

// Create Axios instance with base URL for AIVES Backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Attach Bearer JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle common HTTP responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized: clear token and redirect to login if required
      console.warn('Unauthorized request - invalid or expired token.');
    }
    return Promise.reject(error);
  }
);

// API Service for Admin User Management
export const adminUserApi = {
  // Get paginated and filtered list of users
  getUsers: (params = {}) => {
    return api.get('/v1/admin/users', { params });
  },

  // Get details of a single user by ID / UUID
  getUserById: (userId) => {
    return api.get(`/v1/admin/users/${userId}`);
  },

  // Create a new user (Student, Lecturer, or Admin)
  createUser: (userData) => {
    return api.post('/v1/admin/users', userData);
  },

  // Update existing user details, status, or role
  updateUser: (userId, userData) => {
    return api.put(`/v1/admin/users/${userId}`, userData);
  },

  // Delete or deactivate a user
  deleteUser: (userId) => {
    return api.delete(`/v1/admin/users/${userId}`);
  },

  // Upload Excel file (.xlsx / .csv) for bulk user import
  importUserExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/v1/admin/users/import-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Export users list as Excel file
  exportUserExcel: (params = {}) => {
    return api.get('/v1/admin/users/export-excel', {
      params,
      responseType: 'blob',
    });
  },
};

export default api;
