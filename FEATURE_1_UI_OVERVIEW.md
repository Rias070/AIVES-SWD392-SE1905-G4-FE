# AIVES Frontend - Feature 1: Lecturer Portal, Question Bank & Rubric UI

## 1. Overview
Phân hệ Chức năng 1 trên Frontend cung cấp giao diện chuẩn hóa cho Giảng viên:
- **Ngân hàng câu hỏi (`/question-bank`):** Hiển thị danh sách câu hỏi phân loại theo môn học (`CS301`, `PRJ301`, `SWD392`), độ khó, và thang đo nhận thức Bloom.
- **Barem chấm điểm chi tiết (Rubric Modal):** Hiển thị trực quan 3 tiêu chí đánh giá, mức điểm tối đa và trọng số tương ứng tổng 10.0 điểm, không còn hiện tượng barem ảo.
- **Quản lý học liệu RAG (`/questions`):** Cho phép giảng viên đăng ký hoặc tải lên file giáo trình, theo dõi số lượng chunks và trạng thái vector hóa.

## 2. Key UI/UX Enhancements
- **Unified Navigation & Persistent Auth:** Tự động lưu phiên đăng nhập vào `localStorage`, loại bỏ tình trạng bị xóa phiên khi mở tab mới.
- **Smart Root Routing (`/`):** Tự động điều hướng người dùng chưa đăng nhập về `/login`, và người dùng đã đăng nhập về đúng không gian làm việc tương ứng (`/question-bank` cho Giảng viên, `/student` cho Sinh viên, `/admin` cho Quản trị viên).
- **Responsive Glacier Light Design:** Giao diện thẻ Frosted Crystal đồng nhất, hỗ trợ đầy đủ các thao tác xem barem, thêm câu hỏi và bộ lọc nâng cao.
