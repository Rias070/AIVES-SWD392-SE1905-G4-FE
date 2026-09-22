import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Clock, 
  Zap, 
  Lock, 
  Scale, 
  CheckCircle2, 
  ChevronRight, 
  UserCheck, 
  FileText,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import QuestionBankPage from './pages/QuestionBankPage';
import VivaRoomPage from './pages/VivaRoomPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function NavigationBar() {
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <>
      <nav className="glass-panel sticky top-0 z-50 border-b border-gray-800 bg-[#0b0f19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white font-['Outfit'] block leading-none">
                  AIVES
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                  AI Viva Exam System
                </span>
              </div>
            </Link>

            {/* Role Gateway Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRoleModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                <UserCheck className="w-4 h-4" />
                <span>Cổng Đăng Nhập / Chọn Vai Trò</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-gray-700 bg-gray-900/95 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                Chọn vai trò truy cập hệ thống
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Các tính năng của AIVES được phân quyền nghiêm ngặt theo vai trò người dùng để đảm bảo tính bảo mật và tính toàn vẹn của kỳ thi.
            </p>
            <div className="space-y-3 pt-1">
              <Link
                to="/questions"
                onClick={() => setShowRoleModal(false)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block group-hover:text-indigo-300">
                      Vai trò Giảng Viên (Lecturer)
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Ngân hàng câu hỏi RAG & thiết lập Rubric chấm
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/viva"
                onClick={() => setShowRoleModal(false)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block group-hover:text-cyan-300">
                      Vai trò Sinh Viên (Student)
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Phòng thi vấn đáp trực tiếp với AI Giám khảo
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="pt-2 text-center">
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HomePage() {
  return (
    <div className="space-y-14 py-4">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Hệ Thống Thi Vấn Đáp Trực Tuyến Ứng Dụng Trí Tuệ Nhân Tạo
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] leading-tight">
          Nền Tảng Vấn Đáp Thông Minh <span className="gradient-text">AIVES</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Giải pháp hỗ trợ toàn diện công tác khảo thí và thi vấn đáp. Ứng dụng AI tương tác hỏi xoáy thích ứng theo ngữ cảnh, đảm bảo tính khách quan và bảo vệ quyền đánh giá cuối cùng của giảng viên.
        </p>
      </div>

      {/* Main Core Features by Role */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Các Nhóm Tính Năng Trọng Tâm
          </h2>
          <p className="text-xs text-gray-400">
            Thiết kế chuyên biệt cho từng vai trò người dùng trong quy trình khảo thí
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature 1: Giảng viên */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-gray-900/60 to-gray-900/80 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wide">
                  <BookOpen className="w-4 h-4" />
                  Dành cho Giảng Viên
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Nhóm Chức Năng 1
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Quản Lý Ngân Hàng Câu Hỏi & Rubric Chấm Điểm
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Công cụ chuẩn bị đề thi thông minh, giải phóng thời gian ra đề và chuẩn hóa tiêu chí chấm.
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">AI sinh câu hỏi từ tài liệu môn học (RAG):</strong> Giảng viên tạo, nhập (import) hoặc dùng AI trích xuất câu hỏi vấn đáp trực tiếp từ slide bài giảng, giáo trình theo từng chủ đề.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Gắn nhãn nhận thức thang Bloom:</strong> Phân cấp rõ ràng 4 mức độ tư duy: <em>Nhớ, Hiểu, Vận dụng, Phân tích</em> để đánh giá đúng năng lực thí sinh.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Liên kết Rubric tiêu chí & thang điểm:</strong> Thiết lập tiêu chí chấm rõ ràng làm căn cứ chuẩn xác để AI đề xuất điểm gợi ý sau phiên thi.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Toàn quyền phê duyệt & chỉnh sửa:</strong> Giảng viên toàn quyền duyệt, tinh chỉnh hoặc loại bỏ câu hỏi do AI tạo ra trước khi đưa vào ngân hàng chính thức.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Yêu cầu quyền: Giảng viên phụ trách môn</span>
              <Link
                to="/questions"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
              >
                <span>Vào Không Gian Giảng Viên</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Feature 2: Sinh viên & Giảng viên */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-gray-900/60 to-gray-900/80 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wide">
                  <GraduationCap className="w-4 h-4" />
                  Dành cho Sinh Viên & Giảng Viên
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1">
                  <span>Nhóm Chức Năng 2</span>
                  <span className="text-amber-400">🪄 Cốt Lõi</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Lõi Phỏng Vấn AI Hỏi Xoáy Thích Ứng
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Điểm khác biệt cốt lõi — Mô phỏng đối thoại thực thụ với AI Giám khảo ảo.
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <Mic className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Giám khảo ảo tương tác giọng nói:</strong> AI đọc câu hỏi bằng Text-to-Speech (TTS), sinh viên trả lời bằng giọng nói và được chuyển sang văn bản (STT) gần thời gian thực.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">AI hỏi xoáy / làm rõ (Adaptive Follow-up):</strong> Tự động phân tích nội dung câu trả lời để hỏi sâu thêm khi sinh viên trả lời mơ hồ, thiếu ý hoặc mâu thuẫn — thể hiện chiều sâu trí tuệ vượt trội so với trắc nghiệm.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Kiểm soát phòng thi chặt chẽ:</strong> Có đồng hồ giới hạn thời gian trả lời và cài đặt số lượt hỏi xoáy tối đa cho mỗi câu để đảm bảo tiến độ công bằng.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <Scale className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Đề xuất chấm điểm theo Rubric:</strong> Phân tích từng lượt trả lời theo rubric đã định sẵn để đưa ra bản nhận xét và điểm số đề xuất chi tiết.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Yêu cầu quyền: Thí sinh tham gia ca thi</span>
              <Link
                to="/viva"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-600/20"
              >
                <span>Vào Phòng Thi Trực Tuyến</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Non-functional Requirements & Quality Principles */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-gray-800 bg-gray-900/40 space-y-6">
        <div className="border-b border-gray-800 pb-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            Tiêu Chuẩn Chất Lượng & Cam Kết Hệ Thống
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Nhóm Yêu Cầu Phi Chức Năng Đảm Bảo Tính Khảo Thí
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Độ Trễ Tối Thiểu</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Thời gian giữa lúc sinh viên trả lời xong và AI đặt câu hỏi tiếp theo được tối ưu siêu nhanh, không làm ngắt quãng nhịp đối thoại tự nhiên.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Mic className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">STT Thuật Ngữ Chuẩn</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Nhận diện giọng nói tiếng Việt tối ưu hóa riêng cho các thuật ngữ chuyên ngành học thuật, giúp chuyển tải câu trả lời chính xác nhất.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/70 border border-gray-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Bảo Mật Quyền Riêng Tư</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Toàn bộ dữ liệu âm thanh ghi âm và transcript của sinh viên được mã hóa và bảo vệ nghiêm ngặt theo quy chuẩn khảo thí.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/70 border border-indigo-500/30 bg-indigo-950/20 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Giảng Viên Chốt Điểm Cuối</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-indigo-300">Nguyên tắc cốt lõi:</strong> AI chỉ đóng vai trò trợ lý khách quan. Giảng viên luôn là người quyết định điểm cuối cùng để loại trừ hoàn toàn rủi ro pháp lý hay khiếu nại.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 font-sans">
        <NavigationBar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questions" element={<QuestionBankPage />} />
            <Route path="/viva" element={<VivaRoomPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <footer className="glass-panel border-t border-gray-800 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <p>© 2026 AIVES - AI-powered Viva Exam System. Hệ thống hỗ trợ khảo thí vấn đáp thông minh.</p>
            <p className="text-gray-600">Được thiết kế tối ưu cho Giảng viên và Sinh viên trong môi trường học thuật.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
