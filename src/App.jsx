import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
  Scale, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Users, 
  Languages, 
  Layers, 
  Award, 
  History, 
  LogOut, 
  Home, 
  Menu, 
  X, 
  Search,
  SlidersHorizontal,
  Bell,
  Activity,
  Database,
  TrendingUp,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Volume2,
  Calendar,
  Settings,
  LayoutDashboard,
  Shield,
  ArrowRight,
  Plus,
  Video,
  CreditCard,
  DollarSign
} from 'lucide-react';
import QuestionBankPage from './pages/QuestionBankPage';
import VivaRoomPage from './pages/VivaRoomPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LecturerAIGenerationPage from './pages/LecturerAIGenerationPage';
import LecturerReviewPage from './pages/LecturerReviewPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import PreExamDeviceCheckPage from './pages/PreExamDeviceCheckPage';
import ExamResultPage from './pages/ExamResultPage';
import LecturerRAGPage from './pages/LecturerRAGPage';
import MockPaymentPage from './pages/MockPaymentPage';
import AuthRBACPage from './pages/AuthRBACPage';
import UserManagementPage from './pages/UserManagementPage';
import TransactionRevenuePage from './pages/TransactionRevenuePage';
import RegisterPage from './pages/RegisterPage';

// Role configurations in Glacier Light style
const ROLE_CONFIGS = {
  LECTURER: {
    roleName: 'Giảng Viên',
    roleCode: 'LECTURER',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    avatarBg: 'from-sky-500 to-cyan-600',
    defaultPath: '/questions',
    menuItems: [
      { id: 'rag-portal', label: 'Cổng Học Liệu & RAG', icon: BookOpen, path: '/questions', desc: 'Quản trị tri thức S3 & Barem' },
      { id: 'generate', label: 'AI Sinh Đề Tự Động', icon: Sparkles, path: '/generate', desc: 'Trích xuất từ syllabus' },
      { id: 'review', label: 'Kiểm Duyệt Câu Hỏi AI', icon: CheckCircle2, path: '/review', desc: 'Duyệt & chỉnh sửa Rubric' },
      { id: 'scoring', label: 'Hội Đồng Chấm Điểm', icon: Scale, path: '/viva', desc: 'Giảng viên chốt điểm cuối' },
    ],
  },
  STUDENT: {
    roleName: 'Sinh Viên',
    roleCode: 'STUDENT',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    avatarBg: 'from-cyan-500 to-blue-600',
    defaultPath: '/student',
    menuItems: [
      { id: 'stu-dashboard', label: 'Bảng Điều Khiển Sinh Viên', icon: LayoutDashboard, path: '/student', desc: 'Môn học, ca thi & năng lực' },
      { id: 'device-check', label: 'Kiểm Tra Thiết Bị Thi', icon: Video, path: '/device-check', desc: 'Camera & micro AI' },
      { id: 'viva-room', label: 'Phòng Thi Vấn Đáp AI', icon: Mic, path: '/viva', desc: 'Phỏng vấn trực tiếp AI' },
      { id: 'results', label: 'Kết Quả & Nhận Xét AI', icon: Award, path: '/exam-result', desc: 'Bảng điểm & Rubric' },
    ],
  },
  ADMIN: {
    roleName: 'Quản Trị Viên',
    roleCode: 'ADMIN',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    avatarBg: 'from-blue-600 to-indigo-600',
    defaultPath: '/admin/users',
    menuItems: [
      { id: 'adm-users', label: 'Quản Lý Người Dùng & Phân Công', icon: Users, path: '/admin/users', desc: 'Phân quyền & giảng dạy' },
      { id: 'rag-portal', label: 'Học Liệu & Đề Thi RAG', icon: BookOpen, path: '/questions', desc: 'Quản trị ngân hàng câu hỏi' },
      { id: 'adm-config', label: 'Cấu Hình STT / Whisper / TTS', icon: Languages, path: '/admin', desc: 'Tham số nhận diện giọng nói' },
    ],
  },
};

/* ==================== SIDEBAR (Glacier Light Frosted Crystal) ==================== */
function LeftSidebar({ currentUser, onLogout, isOpen, onClose }) {
  const location = useLocation();
  if (!currentUser) return null;

  const roleConfig = ROLE_CONFIGS[currentUser.role] || ROLE_CONFIGS.STUDENT;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-2xl border-r border-slate-200/80 shadow-[4px_0_24px_rgba(15,23,42,0.04)] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/80">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-sky-600 to-cyan-600 p-[1px] shadow-md shadow-sky-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-sky-600" />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">AI Viva Voce Pro</h1>
                <p className="text-[10px] text-slate-500 tracking-wider mt-1 uppercase font-semibold">Glacier Edition</p>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Không gian:</span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${roleConfig.badgeClass}`}>
              {roleConfig.roleName}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <nav className="space-y-1.5">
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === '/'
                  ? 'bg-sky-50 text-sky-700 font-semibold border-l-[3px] border-sky-600 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${location.pathname === '/' ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className="text-xs font-semibold">Tổng quan (Dashboard)</span>
            </Link>

            {roleConfig.menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold border-l-[3px] border-sky-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold block leading-tight truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">{item.desc}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Student System Readiness Widget from Stitch Design */}
        {currentUser.role === 'STUDENT' && (
          <div className="p-3.5 mx-3 mb-2 rounded-2xl bg-sky-50/80 border border-sky-200/80 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">Hệ Thống Sẵn Sàng</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Đã kết nối máy chủ AI Viva v4.2 và kiểm tra thiết bị âm thanh.
            </p>
            <Link
              to="/viva"
              onClick={onClose}
              className="w-full py-1.5 px-3 rounded-xl bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-sky-600" />
              <span>Vào phòng thi</span>
            </Link>
          </div>
        )}

        {/* User Profile in Footer */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${roleConfig.avatarBg} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm border border-white`}>
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ==================== TOP NAVIGATION HEADER ==================== */
function TopNavbar({ currentUser, onOpenSidebar, onOpenAuth, onLogout, isHomePage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const roleConfig = currentUser ? (ROLE_CONFIGS[currentUser.role] || ROLE_CONFIGS.STUDENT) : null;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Brand & Breadcrumb */}
        <div className="flex items-center gap-4 flex-1">
          {currentUser && (
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-sky-600 to-cyan-600 p-[1px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-tight">AI Viva Voce Pro</span>
              <span className="text-[10px] text-sky-600 font-semibold block tracking-wider uppercase">Glacier Light Edition</span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 ml-4 pl-4 border-l border-slate-200">
            <Link
              to="/"
              className={`hover:text-sky-700 transition-colors px-2 py-1 rounded-lg ${location.pathname === '/' ? 'bg-sky-50 text-sky-700 font-bold' : ''}`}
            >
              Trung Tâm
            </Link>
            <Link
              to="/student"
              className={`hover:text-sky-700 transition-colors px-2 py-1 rounded-lg ${location.pathname === '/student' ? 'bg-sky-50 text-sky-700 font-bold' : ''}`}
            >
              Sinh Viên
            </Link>
            <Link
              to="/device-check"
              className={`hover:text-sky-700 transition-colors px-2 py-1 rounded-lg ${location.pathname === '/device-check' ? 'bg-sky-50 text-sky-700 font-bold' : ''}`}
            >
              Test Mic
            </Link>
            <Link
              to="/viva"
              className={`hover:text-sky-700 transition-colors px-2 py-1 rounded-lg ${location.pathname === '/viva' ? 'bg-sky-50 text-sky-700 font-bold' : ''}`}
            >
              Phòng Thi
            </Link>
            <Link
              to="/exam-result"
              className={`hover:text-sky-700 transition-colors px-2 py-1 rounded-lg ${location.pathname === '/exam-result' ? 'bg-sky-50 text-sky-700 font-bold' : ''}`}
            >
              Kết Quả
            </Link>
            <Link
              to="/questions"
              className={`hover:text-sky-700 transition-colors px-2 py-1 rounded-lg ${location.pathname === '/questions' ? 'bg-sky-50 text-sky-700 font-bold' : ''}`}
            >
              Học Liệu RAG
            </Link>
            <Link
              to="/admin/users"
              className={`hover:text-sky-700 transition-colors px-2 py-1 rounded-lg ${location.pathname === '/admin/users' ? 'bg-sky-50 text-sky-700 font-bold' : ''}`}
            >
              Quản Trị Users
            </Link>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Telemetry Pills */}
          <div className="hidden 2xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 font-medium">Vector DB: 99.8% Online</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span className="text-slate-700 font-medium">Whisper STT: Sẵn sàng</span>
            </div>
          </div>

          {!currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-glacier-primary px-3.5 py-2 text-xs flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-2 rounded-xl border border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/viva"
                className="btn-glacier-primary px-3.5 py-1.5 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Bắt đầu ca thi</span>
              </Link>

              <div 
                onClick={() => navigate(roleConfig.defaultPath)}
                className="flex items-center gap-2 cursor-pointer pl-1 hover:opacity-90"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${roleConfig.avatarBg} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-slate-800 block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-sky-600 font-semibold">{roleConfig.roleName}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ==================== CENTRAL DASHBOARD (GLACIER LIGHT EDITION) ==================== */
function GlacierCentralDashboard({ onOpenAuth, currentUser }) {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  return (
    <div className="space-y-8 py-2">
      {/* Title & Academic Term Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Hệ Thống Đánh Giá Vấn Đáp Thông Minh (AI Viva Voce)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Giám sát phiên chấm thi trực tiếp theo chuẩn khung năng lực và đối chiếu tri thức RAG thời gian thực.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-sky-200 text-xs font-semibold text-sky-800 flex items-center gap-2 shadow-xs">
            <Calendar className="w-4 h-4 text-sky-600" />
            Học kỳ II (2024 - 2025)
          </span>
        </div>
      </div>

      {/* ==================== 4 METRIC CARDS (GLACIER FROST GLASS LIGHT) ==================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="glacier-light-panel rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Tổng số ca thi hôm nay</span>
            <span className="p-2 rounded-xl bg-sky-50 border border-sky-100 text-sky-600">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">42</span>
            <span className="text-xs text-slate-500">ca thi</span>
            <span className="ml-auto text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18%
            </span>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Tiến độ hoàn thành</span>
              <span className="text-slate-800 font-semibold">28/42 ca (66.7%)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 w-[66.7%]"></div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glacier-light-panel rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Điểm TB AI đánh giá</span>
            <span className="p-2 rounded-xl bg-sky-50 border border-sky-100 text-sky-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-sky-700 tracking-tight">8.45</span>
            <span className="text-xs text-slate-500">/ 10</span>
            <span className="ml-auto text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
              Đạt 92.4%
            </span>
          </div>
          <div className="mt-4 flex items-end gap-1.5 h-6">
            <div className="flex-1 bg-slate-200 rounded-t-sm h-[45%]"></div>
            <div className="flex-1 bg-slate-300 rounded-t-sm h-[60%]"></div>
            <div className="flex-1 bg-sky-200 rounded-t-sm h-[75%]"></div>
            <div className="flex-1 bg-sky-300 rounded-t-sm h-[80%]"></div>
            <div className="flex-1 bg-sky-600 rounded-t-sm h-[92%]"></div>
            <div className="flex-1 bg-sky-400 rounded-t-sm h-[85%]"></div>
            <div className="flex-1 bg-sky-300 rounded-t-sm h-[90%]"></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glacier-light-panel rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Tài liệu RAG nhúng vector</span>
            <span className="p-2 rounded-xl bg-sky-50 border border-sky-100 text-sky-600">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">1,420</span>
            <span className="text-xs text-slate-500">Chunks</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80">
            <span className="text-slate-500">pgvector (1536-dim)</span>
            <span className="text-sky-700 font-semibold">Độ trễ: 42ms</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glacier-light-panel rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Trạng thái AI Viva Voce</span>
            <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-sm"></span>
            <span className="text-base font-bold text-slate-900">Hoạt động tối ưu</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80">
            <span className="text-slate-500">Độ chính xác Rubric</span>
            <span className="text-sky-700 font-semibold">96.2% Confident</span>
          </div>
        </div>
      </section>

      {/* ==================== MAIN SPLIT GRID (65% / 35%) ==================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Live Exam Monitor */}
        <section className="xl:col-span-8 space-y-5">
          <div className="glacier-light-panel rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Ca thi Vấn đáp Đang Diễn Ra Trực Tiếp</h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    TRUYỀN THỰC
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Giám sát âm thanh STT, tổng hợp ngữ cảnh RAG và chấm điểm bán tự động</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button 
                  onClick={() => setSelectedSubject('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedSubject === 'ALL'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  Tất cả môn
                </button>
                <button 
                  onClick={() => setSelectedSubject('CS301')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedSubject === 'CS301'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  CS301 (Cấu trúc DL)
                </button>
                <button 
                  onClick={() => setSelectedSubject('AI204')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedSubject === 'AI204'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  AI204 (Học máy)
                </button>
              </div>
            </div>

            {/* Live Exam Candidates List */}
            <div className="mt-5 space-y-4">
              {/* Candidate 1 */}
              {(selectedSubject === 'ALL' || selectedSubject === 'CS301') && (
                <div className="glacier-light-card rounded-2xl p-5 border-l-4 border-l-sky-600 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center font-bold text-sky-800 text-base shadow-xs border border-sky-200">
                        TL
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">Trần Bảo Long</span>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            MSSV: 21127094
                          </span>
                        </div>
                        <p className="text-xs text-sky-700 font-medium mt-0.5">CS301 - Ca #08 • Hội đồng AI-01</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500 font-medium">Điểm tạm tính Rubric</p>
                        <p className="text-lg font-bold text-sky-700">8.5 <span className="text-xs text-slate-400 font-normal">/ 10</span></p>
                      </div>
                      <button 
                        onClick={() => navigate('/viva')}
                        className="btn-glacier-secondary px-4 py-2 text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Quan sát phòng thi</span>
                      </button>
                    </div>
                  </div>

                  {/* STT Live Feedback & Waveform */}
                  <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-sky-100 border border-sky-200 text-sky-800 text-[11px] font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
                        Đang phản biện Turn 4/5
                      </span>
                      <span className="text-xs text-slate-700 font-medium truncate max-w-md">
                        AI: "Hãy tối ưu hoá thuật toán Dijkstra trong đồ thị thưa sử dụng Fibonacci Heap..."
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <span className="text-[11px] text-slate-500 font-medium">STT Feed</span>
                      <div className="flex items-center gap-1 h-5 w-20">
                        <div className="waveform-bar w-1 bg-sky-600 rounded-full" style={{ animationDelay: '0.1s', height: '35%' }}></div>
                        <div className="waveform-bar w-1 bg-sky-600 rounded-full" style={{ animationDelay: '0.3s', height: '85%' }}></div>
                        <div className="waveform-bar w-1 bg-sky-600 rounded-full" style={{ animationDelay: '0.2s', height: '60%' }}></div>
                        <div className="waveform-bar w-1 bg-sky-600 rounded-full" style={{ animationDelay: '0.5s', height: '95%' }}></div>
                        <div className="waveform-bar w-1 bg-sky-600 rounded-full" style={{ animationDelay: '0.4s', height: '45%' }}></div>
                        <div className="waveform-bar w-1 bg-sky-600 rounded-full" style={{ animationDelay: '0.15s', height: '75%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-sky-600"></div>
                    <div className="flex-1 h-1.5 rounded-full bg-sky-600"></div>
                    <div className="flex-1 h-1.5 rounded-full bg-sky-600"></div>
                    <div className="flex-1 h-1.5 rounded-full bg-sky-600 animate-pulse"></div>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200"></div>
                  </div>
                </div>
              )}

              {/* Candidate 2 */}
              {(selectedSubject === 'ALL' || selectedSubject === 'AI204') && (
                <div className="glacier-light-card rounded-2xl p-5 border-l-4 border-l-cyan-600 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center font-bold text-cyan-800 text-base shadow-xs border border-cyan-200">
                        LH
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">Lê Thu Hà</span>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            MSSV: 22120118
                          </span>
                        </div>
                        <p className="text-xs text-cyan-700 font-medium mt-0.5">AI204 - Ca #03 • Hội đồng AI-02</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500 font-medium">Điểm tạm tính Rubric</p>
                        <p className="text-lg font-bold text-cyan-700">7.8 <span className="text-xs text-slate-400 font-normal">/ 10</span></p>
                      </div>
                      <button 
                        onClick={() => navigate('/viva')}
                        className="btn-glacier-secondary px-4 py-2 text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Quan sát phòng thi</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 animate-spin text-cyan-600" />
                        Đang phân tích câu trả lời (RAG Verification)
                      </span>
                      <span className="text-xs text-slate-600 hidden md:inline font-medium">
                        Đối chiếu Giáo trình Deep Learning Goodfellow (Ch. 9)
                      </span>
                    </div>
                    <span className="text-[11px] text-cyan-700 font-semibold">Tiến độ: Turn 2/5</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-cyan-600"></div>
                    <div className="flex-1 h-1.5 rounded-full bg-cyan-600 animate-pulse"></div>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200"></div>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200"></div>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200"></div>
                  </div>
                </div>
              )}

              {/* Candidate 3 */}
              {selectedSubject === 'ALL' && (
                <div className="glacier-light-card rounded-2xl p-5 border-l-4 border-l-emerald-600 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-base shadow-xs border border-emerald-200">
                        VĐ
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">Vũ Minh Đức</span>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            MSSV: 20120542
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">SE102 - Ca #12 • Hội đồng AI-03</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500 font-medium">Điểm AI đề xuất</p>
                        <p className="text-lg font-bold text-emerald-700">9.2 <span className="text-xs text-slate-400 font-normal">/ 10</span></p>
                      </div>
                      <button 
                        onClick={() => navigate('/review')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Duyệt bảng điểm</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-between shadow-xs">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Hoàn thành ca thi - Chờ duyệt bảng điểm
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Thời gian vấn đáp: 24m 12s (5/5 turns)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: RAG & Integrity Telemetry */}
        <section className="xl:col-span-4 space-y-5">
          <div className="glacier-light-panel rounded-2xl p-6 space-y-5">
            {/* Header RAG Pipeline */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">Giám sát RAG Pipeline</h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shadow-sm shadow-sky-600/50"></span>
            </div>

            {/* Pipeline Status Rows */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Kho học liệu S3 Sync</span>
                <span className="text-slate-900 font-bold">AWS S3 (ap-southeast-1)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Embedding Model</span>
                <span className="text-sky-700 font-bold">text-embedding-3-large</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Embedding Latency</span>
                <span className="text-slate-900 font-bold">48ms (Avg)</span>
              </div>

              {/* Vector Cache Progress */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">pgvector Memory Cache</span>
                  <span className="text-sky-700 font-bold">84% / 16GB</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 w-[84%]"></div>
                </div>
              </div>
            </div>

            {/* Module 2: Thang đo Bậc nhận thức Bloom */}
            <div className="pt-4 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Phân bổ Bậc Nhận Thức (Bloom)</h4>
                <span className="text-[10px] text-slate-500 font-medium">Realtime</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1 font-medium text-[11px]">
                    <span>Nhớ (Knowledge)</span>
                    <span className="text-slate-700 font-bold">20%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-slate-400 w-[20%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1 font-medium text-[11px]">
                    <span>Hiểu (Comprehension)</span>
                    <span className="text-sky-700 font-bold">35%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-sky-600 w-[35%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1 font-medium text-[11px]">
                    <span>Phân tích (Analysis)</span>
                    <span className="text-cyan-700 font-bold">30%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[30%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1 font-medium text-[11px]">
                    <span>Đánh giá & Tổng hợp</span>
                    <span className="text-indigo-700 font-bold">15%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[15%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 3: Khung kiểm soát liêm chính AI */}
            <div className="pt-4 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-sky-600" />
                  Kiểm Soát Liêm Chính AI
                </h4>
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  An toàn
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shadow-2xs">
                  <span className="text-slate-700 font-medium">Camera Face Tracking</span>
                  <span className="text-emerald-700 font-bold">100% Verified</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shadow-2xs">
                  <span className="text-slate-700 font-medium">Phát hiện âm thanh ngoài</span>
                  <span className="text-slate-700 font-bold">0 Tạp âm phụ</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shadow-2xs">
                  <span className="text-slate-700 font-medium">Chuyển tab trình duyệt</span>
                  <span className="text-emerald-700 font-bold">0 lần vi phạm</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ==================== AUTH MODAL (Glacier Light) ==================== */
function AuthModal({ isOpen, onClose, initialTab = 'login', onLoginSuccess }) {
  const [tab, setTab] = useState(initialTab);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;

    let userRole = 'STUDENT';
    let userName = 'Trần Thị Mai';
    let defaultPath = '/viva';

    if (loginEmail.includes('lecturer')) {
      userRole = 'LECTURER';
      userName = 'GS.TS Nguyễn Hoàng Nam';
      defaultPath = '/questions';
    } else if (loginEmail.includes('admin')) {
      userRole = 'ADMIN';
      userName = 'AIVES Administrator';
      defaultPath = '/admin';
    }

    const userData = {
      name: userName,
      email: loginEmail,
      role: userRole,
    };

    onLoginSuccess(userData);
    onClose();
    navigate(defaultPath);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerEmail || !fullName) return;

    const userData = {
      name: fullName,
      email: registerEmail,
      role: role,
    };

    onLoginSuccess(userData);
    onClose();
    navigate(role === 'LECTURER' ? '/questions' : '/viva');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glacier-light-panel max-w-md w-full p-6 md:p-8 rounded-3xl border border-slate-200 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
              {tab === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {tab === 'login' ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}
              </h3>
              <p className="text-xs text-slate-500">
                AI Viva Voce Pro - Glacier Light Edition
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-white text-sky-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-white text-sky-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Ký Tài Khoản
          </button>
        </div>

        {/* Tab 1: LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email hoặc Tên đăng nhập
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ví dụ: lecturer@aives.edu.vn hoặc student@aives.edu.vn"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-glacier-primary w-full py-2.5 text-xs shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập</span>
            </button>

            <p className="text-center text-xs text-slate-500 pt-1">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-sky-600 hover:text-sky-700 font-semibold underline underline-offset-2"
              >
                Đăng ký ngay
              </button>
            </p>
          </form>
        )}

        {/* Tab 2: REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Vai trò đăng ký
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'STUDENT'
                      ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
                      ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Giảng Viên</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email trường / cá nhân
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="email@aives.edu.vn"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-glacier-primary w-full py-2.5 text-xs shadow-md mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng Ký Tài Khoản</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ==================== MAIN APP ROOT ==================== */
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aives_user');
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, tab: 'login' });

  const isHomePage = location.pathname === '/';
  const showSidebar = !!currentUser;

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('aives_user', JSON.stringify(userData));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('aives_user');
    } catch {}
    navigate('/');
  };

  const openAuth = (tab = 'login') => {
    setAuthModalState({ isOpen: true, tab });
  };

  const closeAuth = () => {
    setAuthModalState({ isOpen: false, tab: 'login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100 text-slate-800 font-sans flex relative">
      {/* Background Ambient Glacier Radiance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full bg-sky-200/35 blur-[160px]"></div>
        <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] rounded-full bg-cyan-100/45 blur-[170px]"></div>
        <div className="absolute -bottom-36 left-1/3 w-[720px] h-[720px] rounded-full bg-blue-100/40 blur-[180px]"></div>
      </div>

      {showSidebar && (
        <LeftSidebar
          currentUser={currentUser}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 z-10 ${showSidebar ? 'lg:pl-64' : ''}`}>
        <TopNavbar 
          currentUser={currentUser}
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          onOpenAuth={openAuth}
          onLogout={handleLogout}
          isHomePage={isHomePage}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route
              path="/"
              element={
                currentUser?.role === 'STUDENT' ? (
                  <StudentDashboardPage currentUser={currentUser} />
                ) : (
                  <GlacierCentralDashboard onOpenAuth={openAuth} currentUser={currentUser} />
                )
              }
            />
            <Route path="/student" element={<StudentDashboardPage currentUser={currentUser} />} />
            <Route path="/payment" element={<Navigate to="/student" replace />} />
            <Route path="/login" element={<AuthRBACPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/device-check" element={<PreExamDeviceCheckPage />} />
            <Route path="/viva" element={<VivaRoomPage />} />
            <Route path="/exam-result" element={<ExamResultPage />} />
            <Route path="/questions" element={<LecturerRAGPage />} />
            <Route path="/generate" element={<LecturerAIGenerationPage />} />
            <Route path="/review" element={<LecturerReviewPage />} />
            <Route path="/admin" element={<UserManagementPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/transactions" element={<Navigate to="/admin/users" replace />} />
          </Routes>
        </main>

        <footer className="mt-auto px-8 py-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2025 AI Viva Voce Pro. Enterprise Academic Evaluation Framework. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
            <span>Latency: 14ms</span>
            <span>•</span>
            <span>Security Layer: TLS 1.3 End-to-End</span>
          </div>
        </footer>
      </div>

      {/* Global Auth Modal */}
      <AuthModal 
        isOpen={authModalState.isOpen} 
        onClose={closeAuth} 
        initialTab={authModalState.tab} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
