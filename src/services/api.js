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

// ==========================================
// 4. API SERVICE PHÂN CÔNG MÔN HỌC (ADMIN ROLE)
// ==========================================
export const adminSubjectApi = {
  // Lấy danh mục tất cả môn học trong hệ thống
  getSubjects: (params) => api.get('/v1/admin/subjects', { params }),

  // Lấy danh sách phân công môn học cho toàn bộ giảng viên
  getSubjectAssignments: (params) => api.get('/v1/admin/subjects/assignments', { params }),

  // Lấy danh sách môn học & quyền chi tiết của 1 Giảng viên cụ thể
  getLecturerAssignments: (lecturerId) => api.get(`/v1/admin/subjects/assignments/lecturers/${lecturerId}`),

  // Gán môn học mới cho Giảng viên (kèm quyền canApproveRAG, canEditRubric)
  assignSubject: (assignmentData) => api.post('/v1/admin/subjects/assignments', assignmentData),

  // Cập nhật quyền hạn RAG & Rubric cho 1 phân công môn học
  updateAssignmentPermissions: (assignmentId, permissionsData) =>
    api.put(`/v1/admin/subjects/assignments/${assignmentId}/permissions`, permissionsData),

  // Hủy phân công môn học khỏi Giảng viên
  removeAssignment: (assignmentId) => api.delete(`/v1/admin/subjects/assignments/${assignmentId}`),
};

export default api;
