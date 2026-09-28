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

// Response interceptor: Handle common HTTP responses & format error messages
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let message = 'Đã xảy ra lỗi khi kết nối tới hệ thống.';

    if (error.response) {
      const status = error.response.status;
      const backendMsg = error.response.data?.message;

      switch (status) {
        case 401:
          message = backendMsg || 'Phiên làm việc đã hết hạn hoặc chưa được xác thực. Vui lòng đăng nhập lại.';
          break;
        case 403:
          message = backendMsg || 'Tài khoản của bạn không có quyền thực hiện thao tác Quản trị viên này.';
          break;
        case 404:
          message = backendMsg || 'Không tìm thấy dữ liệu yêu cầu trên máy chủ Backend.';
          break;
        case 422:
          message = backendMsg || 'Dữ liệu gửi lên không đúng định dạng quy định.';
          break;
        case 500:
          message = backendMsg || 'Lỗi máy chủ nội bộ Backend (Internal Server Error 500).';
          break;
        default:
          message = backendMsg || `Yêu cầu thất bại với mã lỗi HTTP ${status}.`;
      }
    } else if (error.request) {
      message = 'Không thể kết nối máy chủ API (localhost:8080). Đang chạy ở chế độ dự phòng Offline Demo Mode.';
    }

    error.friendlyMessage = message;
    console.warn(`[AIVES API Error ${error.response?.status || 'Network'}]:`, message);
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

// ==========================================
// 5. API SERVICE CẤU HÌNH THAM SỐ AI VIVA (ADMIN ROLE)
// ==========================================
export const adminConfigApi = {
  // Lấy thông số cấu hình AI Viva hiện tại (Ngôn ngữ, Max turns, Timeout duration...)
  getAIVivaConfig: () => api.get('/v1/admin/config/ai-viva'),

  // Cập nhật cấu hình thông số AI Viva cho toàn hệ thống ca thi
  updateAIVivaConfig: (configData) => api.put('/v1/admin/config/ai-viva', configData),

  // Lấy chi tiết tham số cài đặt mô hình STT (Whisper) / TTS giọng đọc AI
  getSTTTTSSettings: () => api.get('/v1/admin/config/stt-tts'),

  // Cập nhật cài đặt mô hình STT / TTS giọng đọc AI
  updateSTTTTSSettings: (settingsData) => api.put('/v1/admin/config/stt-tts', settingsData),

  // Khôi phục cấu hình thông số AI Viva về mặc định của hệ thống
  resetAIVivaConfigToDefault: () => api.post('/v1/admin/config/ai-viva/reset'),
};

export default api;
