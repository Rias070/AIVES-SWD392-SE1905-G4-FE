# AIVES Frontend - AI-powered Viva Exam System

Giao diện người dùng cho hệ thống thi vấn đáp tự động ứng dụng trí tuệ nhân tạo (AIVES), xây dựng trên nền tảng **React 18**, **Vite**, **Tailwind CSS**, **Axios**, và **Lucide React**.

## 1. Yêu cầu môi trường
- Node.js 18+
- npm (hoặc pnpm)

## 2. Cài đặt thư viện dependencies
```bash
npm install
```

## 3. Khởi chạy máy chủ phát triển (Dev Server)
```bash
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ:
- URL: [http://localhost:5173](http://localhost:5173)

Proxy API và WebSocket được cấu hình trỏ tự động về Backend tại:
- API Backend: `http://localhost:8080/api`
- WebSocket STOMP: `http://localhost:8080/ws`

## 4. Tài liệu API Backend (Swagger UI)
Khi Backend đang khởi chạy, Frontend developers có thể tra cứu danh sách endpoints, request/response schemas và test trực tiếp tại:
- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

> **Lưu ý:** Khởi động Backend (`aives-backend`) trước để truy cập được Swagger.

## 5. Cấu trúc các trang tính năng chính (Scaffold)
- **Trang chủ (`/`)**: Cổng điều hướng tổng quan hệ thống AIVES.
- **Ngân Hàng Câu Hỏi RAG (`/questions`)**: Feature 1 - Quản lý câu hỏi kiểm thử và nhãn vector embedding pgvector.
- **Phòng Thi Vấn Đáp AI (`/viva`)**: Feature 3 - Giao diện phòng thi trực tuyến thời gian thực với AI Giám Khảo tương tác giọng nói.
- **Quản Trị Hệ Thống (`/admin`)**: Feature 7 - Quản lý phân quyền tài khoản (ADMIN, LECTURER, STUDENT) và giám sát hạ tầng.
