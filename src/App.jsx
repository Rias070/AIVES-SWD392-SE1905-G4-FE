import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  LogIn, 
  UserPlus,
  AlertTriangle,
  Scale,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import QuestionBankPage from './pages/QuestionBankPage';
import VivaRoomPage from './pages/VivaRoomPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' | 'LECTURER'
  
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Keep internal tab in sync if initialTab changes when opening
  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    onClose();
    if (loginEmail.includes('lecturer')) {
      navigate('/questions');
    } else if (loginEmail.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/viva');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerEmail || !fullName) return;
    onClose();
    if (role === 'LECTURER') {
      navigate('/questions');
    } else {
      navigate('/viva');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel max-w-md w-full p-6 md:p-8 rounded-3xl border border-gray-700 bg-gray-900/95 space-y-5 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              {tab === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {tab === 'login' ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}
              </h3>
              <p className="text-xs text-gray-400">
                AIVES - Nền tảng khảo thí vấn đáp AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex rounded-xl bg-gray-950/80 p-1 border border-gray-800">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Đăng Ký Tài Khoản
          </button>
        </div>

        {/* Tab 1: LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Email hoặc Tên đăng nhập
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ví dụ: giangvien@aives.edu.vn hoặc sinhvien@aives.edu.vn"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập</span>
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
              >
                Đăng ký ngay
              </button>
            </p>
          </form>
        )}

        {/* Tab 2: REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Vai trò đăng ký
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'STUDENT'
                      ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
                      : 'bg-gray-950/40 border-gray-800 text-gray-400 hover:bg-gray-800/40'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Sinh Viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('LECTURER')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'LECTURER'
                      ? 'bg-indigo-950/60 border-indigo-500/60 text-indigo-300'
                      : 'bg-gray-950/40 border-gray-800 text-gray-400 hover:bg-gray-800/40'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Giảng Viên</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-gray-950/80 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email trường / Email cá nhân
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="email@aives.edu.vn"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-gray-950/80 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-950/80 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng Ký Tài Khoản</span>
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
              >
                Đăng nhập ngay
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function NavigationBar({ onOpenAuth }) {
  return (
    <nav className="glass-panel sticky top-0 z-40 border-b border-gray-800 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block leading-none">
                AIVES
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                Hệ thống Thi Vấn Đáp AI
              </span>
            </div>
          </Link>

          {/* Clean Navbar - Login Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage({ onOpenAuth }) {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Hệ Thống Thi Vấn Đáp Trực Tuyến Ứng Dụng Trí Tuệ Nhân Tạo
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Nền Tảng Vấn Đáp Thông Minh <span className="gradient-text">AIVES</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Giải pháp hỗ trợ toàn diện công tác khảo thí và thi vấn đáp. Ứng dụng AI tương tác hỏi xoáy thích ứng theo ngữ cảnh, đảm bảo tính khách quan và bảo vệ quyền đánh giá cuối cùng của giảng viên.
        </p>

        {/* Primary CTA: Đăng Ký Trải Nghiệm & Đã có tài khoản switch */}
        <div className="pt-2 flex flex-col items-center justify-center gap-2.5">
          <button
            onClick={() => onOpenAuth('register')}
            className="flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Đăng Ký Trải Nghiệm</span>
          </button>

          <p className="text-xs text-gray-400">
            Đã có tài khoản rồi?{' '}
            <button
              onClick={() => onOpenAuth('login')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>

      {/* Problem & Solution Decorative Section */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-gray-800 bg-gray-900/40 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Bối Cảnh & Giá Trị Thực Tiễn
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Tại Sao Cần Giải Pháp Vấn Đáp Thông Minh?
          </h2>
          <p className="text-xs text-gray-400">
            Thi vấn đáp (viva/oral exam) đóng vai trò then chốt trong bảo vệ đồ án, thi kết thúc học phần và đánh giá năng lực thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Traditional Challenges */}
          <div className="p-5 md:p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-amber-300">
                Thách Thức Của Thi Vấn Đáp Truyền Thống
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Tốn nhiều thời gian giảng viên:</strong> Việc tổ chức hỏi thi trực tiếp từng sinh viên kéo dài nhiều ngày, gây quá tải cho hội đồng khảo thí.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Khó chuẩn hóa câu hỏi & thang điểm:</strong> Sự khác biệt về độ khó và cách hỏi giữa các phòng thi dẫn đến độ lệch điểm số giữa các thí sinh.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Khó mở rộng quy mô lớn:</strong> Khi số lượng sinh viên lên tới hàng trăm, hàng nghìn, việc tổ chức phỏng vấn trực tiếp trở nên bất khả thi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Thiếu bằng chứng khách quan:</strong> Khó giải quyết khiếu nại điểm số do thiếu dữ liệu ghi nhận (transcript và điểm chi tiết từng câu hỏi).</span>
              </li>
            </ul>
          </div>

          {/* AIVES Solutions */}
          <div className="p-5 md:p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-indigo-300">
                Giải Pháp Đột Phá Từ Hệ Thống AIVES
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Sinh câu hỏi thông minh theo tài liệu:</strong> Giảng viên tạo đề hoặc dùng AI trích xuất câu hỏi bám sát giáo trình, slide bài giảng môn học.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Buổi vấn đáp AI hỏi xoáy thích ứng:</strong> AI Giám khảo đặt câu hỏi và tự động hỏi sâu/làm rõ theo đúng ngữ cảnh câu trả lời của sinh viên.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Hỗ trợ chấm điểm theo Rubric:</strong> Đề xuất điểm số khách quan dựa trên tiêu chí và thang điểm định trước cho từng câu trả lời.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Lưu vết minh bạch toàn bộ ca thi:</strong> Ghi nhận đầy đủ âm thanh, bản gỡ băng (transcript) và gợi ý điểm để làm căn cứ minh bạch.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Core Features by Role (No action buttons to role-restricted pages) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Các Tính Năng Trọng Tâm
          </h2>
          <p className="text-xs text-gray-400">
            Hỗ trợ tối ưu cho từng vai trò người dùng trong quy trình khảo thí
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Giảng viên */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-gray-900/60 to-gray-900/80 space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wide">
                <BookOpen className="w-4 h-4" />
                Dành cho Giảng Viên
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Quản Lý Ngân Hàng Câu Hỏi & Rubric Chấm Điểm
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Công cụ chuẩn bị đề thi thông minh, giải phóng thời gian ra đề và chuẩn hóa tiêu chí đánh giá.
              </p>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">AI sinh câu hỏi từ tài liệu môn học (RAG):</strong> Giảng viên tạo, nhập (import) hoặc dùng AI sinh câu hỏi vấn đáp theo môn học/chủ đề từ giáo trình, slide bài giảng.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Gắn nhãn mức độ nhận thức thang Bloom:</strong> Phân cấp rõ 4 bậc tư duy: <em>Nhớ, Hiểu, Vận dụng, Phân tích</em> để đánh giá chính xác năng lực sinh viên.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Gắn kết Rubric tiêu chí & thang điểm:</strong> Thiết lập tiêu chí chấm rõ ràng làm căn cứ chuẩn xác cho AI đề xuất điểm gợi ý sau phiên thi.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Toàn quyền kiểm duyệt & chỉnh sửa:</strong> Giảng viên toàn quyền duyệt, chỉnh sửa hoặc loại bỏ câu hỏi do AI tạo ra trước khi đưa vào ngân hàng chính thức.
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Sinh viên & Giảng viên (ĐÃ BỎ CHỮ "LÕI", ĐÃ BỎ NÚT BẤM DƯỚI ĐÁY) */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-gray-900/60 to-gray-900/80 space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wide">
                <GraduationCap className="w-4 h-4" />
                Dành cho Sinh Viên & Giảng Viên
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Phỏng Vấn AI Hỏi Xoáy Thích Ứng
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Mô phỏng đối thoại vấn đáp thực thụ giữa Giám khảo ảo và thí sinh.
              </p>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <Mic className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Giám khảo ảo tương tác giọng nói:</strong> AI đọc câu hỏi bằng Text-to-Speech (TTS), sinh viên trả lời bằng giọng nói và được chuyển sang văn bản (STT) gần thời gian thực.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">AI hỏi xoáy / làm rõ (Adaptive Follow-up):</strong> Tự động phân tích nội dung câu trả lời để hỏi sâu thêm khi câu trả lời mơ hồ, thiếu ý hoặc mâu thuẫn — thể hiện chiều sâu trí tuệ vượt trội.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Kiểm soát phòng thi chặt chẽ:</strong> Đồng hồ giới hạn thời gian trả lời và cài đặt số lượt hỏi xoáy tối đa cho mỗi câu để đảm bảo sự công bằng.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <Scale className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">AI gợi ý điểm — Giảng viên chốt điểm cuối:</strong> AI đề xuất điểm theo Rubric, giảng viên luôn là người chốt điểm cuối cùng để đảm bảo tính pháp lý và tin cậy tuyệt đối.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [authModalState, setAuthModalState] = useState({ isOpen: false, tab: 'login' });

  const openAuth = (tab = 'login') => {
    setAuthModalState({ isOpen: true, tab });
  };

  const closeAuth = () => {
    setAuthModalState({ isOpen: false, tab: 'login' });
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 font-sans">
        <NavigationBar onOpenAuth={openAuth} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<HomePage onOpenAuth={openAuth} />} />
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

        {/* Global Auth Modal (Login / Register with Role selection) */}
        <AuthModal 
          isOpen={authModalState.isOpen} 
          onClose={closeAuth} 
          initialTab={authModalState.tab} 
        />
      </div>
    </BrowserRouter>
  );
}
