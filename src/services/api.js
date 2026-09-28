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

// ==========================================
// 3. API SERVICE QUẢN LÝ USER (ADMIN ROLE)
// ==========================================
export const adminUserApi = {
  // Lấy danh sách người dùng (hỗ trợ phân trang, tìm kiếm, lọc role, status)
  getUsers: (params) => api.get('/v1/admin/users', { params }),

  // Lấy chi tiết thông tin 1 người dùng theo ID / UUID
  getUserById: (userId) => api.get(`/v1/admin/users/${userId}`),

  // Tạo tài khoản người dùng mới
  createUser: (userData) => api.post('/v1/admin/users', userData),

  // Cập nhật thông tin / vai trò / phân công người dùng
  updateUser: (userId, userData) => api.put(`/v1/admin/users/${userId}`, userData),

  // Cập nhật nhanh trạng thái tài khoản (ACTIVE / INACTIVE / PENDING_SSO)
  updateUserStatus: (userId, status) => api.patch(`/v1/admin/users/${userId}/status`, { status }),

  // Xóa tài khoản người dùng
  deleteUser: (userId) => api.delete(`/v1/admin/users/${userId}`),

  // Import danh sách sinh viên / giảng viên hàng loạt từ tệp Excel (.xlsx)
  importUserExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/v1/admin/users/import-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Xuất danh sách người dùng ra tệp Excel (.xlsx)
  exportUserExcel: (params) =>
    api.get('/v1/admin/users/export-excel', {
      params,
      responseType: 'blob',
    }),
};

export default api;
