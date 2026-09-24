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
  AlertTriangle, 
  Scale, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Users, 
  Languages, 
  Layers, 
  FileText, 
  Award, 
  History, 
  LogOut, 
  Home, 
  Menu, 
  X, 
  ChevronRight,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import QuestionBankPage from './pages/QuestionBankPage';
import VivaRoomPage from './pages/VivaRoomPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LecturerAIGenerationPage from './pages/LecturerAIGenerationPage';
import LecturerReviewPage from './pages/LecturerReviewPage';

// Definitions of Features tailored specifically for each Role in Liquid Metallic Glass style
const ROLE_CONFIGS = {
  LECTURER: {
    roleName: 'Giảng Viên',
    roleCode: 'LECTURER',
    badgeClass: 'bg-[#C9A876]/15 text-[#E8E2D8] border-[#C9A876]/40',
    avatarBg: 'from-[#E8E2D8] via-[#C9A876] to-[#8B6F47]',
    defaultPath: '/questions',
    menuItems: [
      { id: 'qbank', label: 'Ngân Hàng Câu Hỏi', icon: BookOpen, path: '/questions', desc: 'Kho câu hỏi chính thức' },
      { id: 'generate', label: 'AI Sinh Câu Hỏi', icon: Sparkles, path: '/generate', desc: 'Upload syllabus & slides' },
      { id: 'review', label: 'Kiểm Duyệt Đề AI', icon: CheckCircle2, path: '/review', desc: 'Duyệt & chỉnh sửa câu hỏi' },
      { id: 'scoring', label: 'Chốt Điểm Ca Thi', icon: Scale, path: '/viva', desc: 'Giảng viên quyết định điểm cuối' },
    ],
  },
  STUDENT: {
    roleName: 'Sinh Viên',
    roleCode: 'STUDENT',
    badgeClass: 'bg-[#B8B0A6]/15 text-[#F5F0E8] border-[#B8B0A6]/40',
    avatarBg: 'from-[#E8E2D8] via-[#B8B0A6] to-[#3A332C]',
    defaultPath: '/viva',
    menuItems: [
      { id: 'viva-room', label: 'Phòng Thi Vấn Đáp AI', icon: Mic, path: '/viva', desc: 'Ca thi viva trực tuyến thời gian thực' },
      { id: 'practice', label: 'Luyện Tập Phỏng Vấn AI', icon: Sparkles, path: '/viva', desc: 'Thực hành AI hỏi xoáy thích ứng' },
      { id: 'stu-rubric', label: 'Xem Tiêu Chuẩn Rubric', icon: Award, path: '/viva', desc: 'Xem thang điểm và tiêu chí đánh giá' },
      { id: 'history', label: 'Lịch Sử & Transcript Ca Thi', icon: History, path: '/viva', desc: 'Xem lại nội dung gỡ băng & nhận xét' },
    ],
  },
  ADMIN: {
    roleName: 'Quản Trị Viên',
    roleCode: 'ADMIN',
    badgeClass: 'bg-[#E8E2D8]/15 text-[#E8E2D8] border-[#C9A876]/50',
    avatarBg: 'from-[#C9A876] via-[#8B6F47] to-[#1C1815]',
    defaultPath: '/admin',
    menuItems: [
      { id: 'adm-users', label: 'Quản Lý Tài Khoản (RBAC)', icon: Users, path: '/admin', desc: 'Phân quyền ADMIN, GV, SV' },
      { id: 'adm-assign', label: 'Phân Quyền GV & Môn Học', icon: ShieldCheck, path: '/admin', desc: 'Gán giảng viên phụ trách môn' },
      { id: 'adm-config', label: 'Cấu Hình Ngôn Ngữ STT/TTS', icon: Languages, path: '/admin', desc: 'Cài đặt tiếng Việt / Anh & tham số' },
    ],
  },
};

/* LEFT SIDEBAR NAVIGATION (LIQUID GLASS CHROME) */
function LeftSidebar({ currentUser, onLogout, isOpen, onClose }) {
  const location = useLocation();
  if (!currentUser) return null;

  const roleConfig = ROLE_CONFIGS[currentUser.role] || ROLE_CONFIGS.STUDENT;

  return (
    <>
      {/* Mobile Backdrop with Blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#1C1815]/80 backdrop-blur-md lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#25201C]/85 backdrop-blur-2xl border-r border-[#5C554C]/60 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 shadow-[8px_0_36px_rgba(0,0,0,0.6)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-4 border-b border-[#5C554C]/60 bg-[#1C1815]/40">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              onClick={onClose}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-[14px] bg-gradient-to-b from-[#E8E2D8] via-[#C9A876] to-[#8B6F47] flex items-center justify-center text-[#1C1815] shadow-lg shadow-[#C9A876]/25 group-hover:scale-105 transition-transform border border-white/40">
                <Bot className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-[#F5F0E8] block leading-none">
                  AIVES
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#C9A876]">
                  Liquid Glass Viva AI
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-[#B8B0A6] hover:text-[#F5F0E8] hover:bg-[#3A332C]/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Role Indicator */}
          <div className="mt-3.5 pt-3 border-t border-[#5C554C]/50 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8B0A6]">
              Không gian:
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${roleConfig.badgeClass}`}>
              {roleConfig.roleName}
            </span>
          </div>
        </div>

        {/* Middle: Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8B0A6] block">
            Chức năng của {roleConfig.roleName}:
          </span>

          <nav className="space-y-2">
            {roleConfig.menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-start gap-3 p-3 rounded-[20px] transition-all group ${
                    isActive
                      ? 'bg-[#3A332C]/90 text-[#F5F0E8] border border-[#C9A876]/60 shadow-[0_4px_20px_rgba(201,168,118,0.15)] font-semibold'
                      : 'text-[#B8B0A6] hover:text-[#F5F0E8] hover:bg-[#3A332C]/50 border border-transparent hover:border-[#5C554C]/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-[12px] flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isActive 
                      ? 'bg-gradient-to-b from-[#E8E2D8] via-[#C9A876] to-[#8B6F47] text-[#1C1815] shadow-sm' 
                      : 'bg-[#1C1815]/80 text-[#B8B0A6] group-hover:text-[#E8E2D8] group-hover:bg-[#1C1815]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold block leading-snug truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#B8B0A6]/80 block truncate mt-0.5 font-normal">
                      {item.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Return to Home Page */}
          <div className="pt-3 border-t border-[#5C554C]/50">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[18px] text-xs font-medium text-[#B8B0A6] hover:text-[#F5F0E8] hover:bg-[#3A332C]/40 border border-transparent hover:border-[#5C554C]/40 transition-colors"
            >
              <Home className="w-4 h-4 text-[#C9A876]" />
              <span>Về Trang Chủ</span>
            </Link>
          </div>
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="p-4 border-t border-[#5C554C]/60 bg-[#1C1815]/60 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${roleConfig.avatarBg} flex items-center justify-center text-[#1C1815] font-bold text-xs shrink-0 shadow-md border border-[#E8E2D8]/40`}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#F5F0E8] block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#B8B0A6] block truncate">
                {currentUser.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[16px] bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}

/* TOP NAVBAR */
function TopNavbar({ currentUser, onOpenSidebar, onOpenAuth, onLogout, isHomePage }) {
  const navigate = useNavigate();
  const roleConfig = currentUser ? (ROLE_CONFIGS[currentUser.role] || ROLE_CONFIGS.STUDENT) : null;

  return (
    <header className="glass-panel sticky top-0 z-30 border-b border-[#5C554C]/60 bg-[#1C1815]/80 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Mobile menu button */}
          <div className="flex items-center gap-3">
            {currentUser && !isHomePage && (
              <button
                onClick={onOpenSidebar}
                className="lg:hidden p-2 rounded-xl text-[#B8B0A6] hover:text-[#F5F0E8] hover:bg-[#3A332C]/60 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-[14px] bg-gradient-to-b from-[#E8E2D8] via-[#C9A876] to-[#8B6F47] flex items-center justify-center text-[#1C1815] shadow-lg shadow-[#C9A876]/25 group-hover:scale-105 transition-transform border border-white/40">
                <Bot className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-[#F5F0E8] block leading-none">
                  AIVES
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A876]">
                  Liquid Glass Exam AI
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-liquid-gold px-5 py-2 text-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {isHomePage && (
                  <button
                    onClick={() => navigate(roleConfig.defaultPath)}
                    className="btn-liquid-gold hidden sm:inline-flex px-3.5 py-1.5 text-xs"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Không Gian Làm Việc</span>
                  </button>
                )}

                <div 
                  onClick={() => navigate(roleConfig.defaultPath)} 
                  className="flex items-center gap-2.5 pl-2 cursor-pointer hover:opacity-90 transition-opacity" 
                  title="Nhấn để vào không gian làm việc"
                >
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${roleConfig.avatarBg} flex items-center justify-center text-[#1C1815] font-bold text-xs shadow-md border border-[#E8E2D8]/40`}>
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#C9A876] border-2 border-[#1C1815]" />
                  </div>

                  <div className="hidden md:block text-left">
                    <span className="text-xs font-bold text-[#F5F0E8] block leading-tight">
                      {currentUser.name}
                    </span>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.2 rounded-full border ${roleConfig.badgeClass}`}>
                      {roleConfig.roleName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* AUTH MODAL */
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
      userName = 'TS. Nguyễn Văn Giảng';
      defaultPath = '/questions';
    } else if (loginEmail.includes('admin')) {
      userRole = 'ADMIN';
      userName = 'Quản Trị Viên AIVES';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1815]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel max-w-md w-full p-6 md:p-8 rounded-[28px] border border-[#C9A876]/40 bg-[#25201C]/95 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#5C554C]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[16px] bg-[#C9A876]/15 border border-[#C9A876]/35 flex items-center justify-center text-[#E8E2D8]">
              {tab === 'login' ? <LogIn className="w-5 h-5 text-[#C9A876]" /> : <UserPlus className="w-5 h-5 text-[#C9A876]" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F5F0E8] leading-tight">
                {tab === 'login' ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}
              </h3>
              <p className="text-xs text-[#B8B0A6]">
                AIVES - Nền tảng khảo thí vấn đáp Liquid Glass
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#3A332C]/80 hover:bg-[#3A332C] text-[#B8B0A6] hover:text-[#F5F0E8] flex items-center justify-center transition-colors border border-[#5C554C]/50"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-[18px] bg-[#1C1815]/90 p-1 border border-[#5C554C]/60">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-[14px] transition-all ${
              tab === 'login'
                ? 'bg-gradient-to-b from-[#E8E2D8] via-[#C9A876] to-[#8B6F47] text-[#1C1815] font-bold shadow-sm'
                : 'text-[#B8B0A6] hover:text-[#F5F0E8]'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-[14px] transition-all ${
              tab === 'register'
                ? 'bg-gradient-to-b from-[#E8E2D8] via-[#C9A876] to-[#8B6F47] text-[#1C1815] font-bold shadow-sm'
                : 'text-[#B8B0A6] hover:text-[#F5F0E8]'
            }`}
          >
            Đăng Ký Tài Khoản
          </button>
        </div>

        {/* Tab 1: LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#E8E2D8] mb-1.5">
                Email hoặc Tên đăng nhập
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ví dụ: lecturer@aives.edu.vn hoặc student@aives.edu.vn"
                required
                className="liquid-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8E2D8] mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="liquid-input w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8B0A6] hover:text-[#F5F0E8]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-liquid-gold w-full py-3 text-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập</span>
            </button>

            <p className="text-center text-xs text-[#B8B0A6] pt-1">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-[#C9A876] hover:text-[#E8E2D8] font-semibold underline underline-offset-2"
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
              <label className="block text-xs font-semibold text-[#E8E2D8] mb-1.5">
                Vai trò đăng ký
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-[16px] border text-xs font-semibold transition-all ${
                    role === 'STUDENT'
                      ? 'bg-[#C9A876]/25 border-[#C9A876] text-[#F5F0E8] shadow-sm'
                      : 'bg-[#1C1815]/60 border-[#5C554C]/50 text-[#B8B0A6] hover:bg-[#3A332C]/40'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Sinh Viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('LECTURER')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-[16px] border text-xs font-semibold transition-all ${
                    role === 'LECTURER'
                      ? 'bg-[#C9A876]/25 border-[#C9A876] text-[#F5F0E8] shadow-sm'
                      : 'bg-[#1C1815]/60 border-[#5C554C]/50 text-[#B8B0A6] hover:bg-[#3A332C]/40'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Giảng Viên</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8E2D8] mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                required
                className="liquid-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8E2D8] mb-1">
                Email trường / cá nhân
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="email@aives.edu.vn"
                required
                className="liquid-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8E2D8] mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="liquid-input w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8B0A6] hover:text-[#F5F0E8]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-liquid-gold w-full py-3 text-xs mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng Ký Tài Khoản</span>
            </button>

            <p className="text-center text-xs text-[#B8B0A6] pt-1">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-[#C9A876] hover:text-[#E8E2D8] font-semibold underline underline-offset-2"
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

/* HOME PAGE WITH LIQUID GLASS METALLIC LOOK */
function HomePage({ onOpenAuth, currentUser }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <div className="text-center space-y-5 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3A332C]/70 border border-[#C9A876]/40 text-xs font-semibold text-[#E8E2D8] shadow-[0_4px_18px_rgba(201,168,118,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A876]" />
          <span>Hệ Thống Thi Vấn Đáp Trực Tuyến Liquid Glass AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F5F0E8] leading-tight">
          Nền Tảng Vấn Đáp Thông Minh <span className="gradient-text">AIVES</span>
        </h1>
        <p className="text-[#B8B0A6] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Giải pháp hỗ trợ toàn diện công tác khảo thí và thi vấn đáp. Ứng dụng AI tương tác hỏi xoáy thích ứng theo ngữ cảnh, giao diện kính lỏng (Liquid Glass) sang trọng, bảo vệ quyền đánh giá tối thượng của giảng viên.
        </p>

        {/* Primary CTA */}
        <div className="pt-3 flex flex-col items-center justify-center gap-3">
          {!currentUser ? (
            <>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn-liquid-gold px-8 py-3.5 text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng Ký Trải Nghiệm</span>
              </button>

              <p className="text-xs text-[#B8B0A6]">
                Đã có tài khoản rồi?{' '}
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-[#C9A876] hover:text-[#E8E2D8] font-semibold underline underline-offset-2"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </>
          ) : (
            <button
              onClick={() => navigate(ROLE_CONFIGS[currentUser.role]?.defaultPath || '/questions')}
              className="btn-liquid-gold px-8 py-3.5 text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Vào Không Gian {ROLE_CONFIGS[currentUser.role]?.roleName}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Problem & Solution Decorative Section */}
      <div className="glass-panel p-6 md:p-10 rounded-[28px] border border-[#C9A876]/30 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C9A876]">
            Bối Cảnh & Giá Trị Thực Tiễn
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-[#F5F0E8]">
            Tại Sao Cần Giải Pháp Vấn Đáp Thông Minh?
          </h2>
          <p className="text-xs text-[#B8B0A6]">
            Thi vấn đáp đóng vai trò then chốt trong bảo vệ đồ án, thi kết thúc học phần và đánh giá năng lực thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Traditional Challenges */}
          <div className="p-6 rounded-[22px] bg-[#3A332C]/80 border border-[#8B6F47]/50 space-y-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[14px] bg-[#8B6F47]/20 border border-[#8B6F47]/40 flex items-center justify-center text-[#E8E2D8]">
                <AlertTriangle className="w-5 h-5 text-[#C9A876]" />
              </div>
              <h3 className="text-base font-bold text-[#E8E2D8]">
                Thách Thức Của Thi Vấn Đáp Truyền Thống
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-[#B8B0A6]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#C9A876] font-bold">•</span>
                <span><strong className="text-[#F5F0E8]">Tốn nhiều thời gian giảng viên:</strong> Việc tổ chức hỏi thi trực tiếp từng sinh viên kéo dài nhiều ngày, gây quá tải cho hội đồng khảo thí.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C9A876] font-bold">•</span>
                <span><strong className="text-[#F5F0E8]">Khó chuẩn hóa câu hỏi & thang điểm:</strong> Sự khác biệt về độ khó và cách hỏi giữa các phòng thi dẫn đến độ lệch điểm số giữa các thí sinh.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C9A876] font-bold">•</span>
                <span><strong className="text-[#F5F0E8]">Khó mở rộng quy mô lớn:</strong> Khi số lượng sinh viên lên tới hàng trăm, hàng nghìn, việc tổ chức phỏng vấn trực tiếp trở nên bất khả thi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C9A876] font-bold">•</span>
                <span><strong className="text-[#F5F0E8]">Thiếu bằng chứng khách quan:</strong> Khó giải quyết khiếu nại điểm số do thiếu dữ liệu ghi nhận (transcript và điểm chi tiết từng câu hỏi).</span>
              </li>
            </ul>
          </div>

          {/* AIVES Solutions */}
          <div className="p-6 rounded-[22px] bg-[#3A332C]/85 border border-[#C9A876]/60 space-y-4 shadow-[0_0_30px_rgba(201,168,118,0.12)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[14px] bg-[#C9A876]/20 border border-[#C9A876]/40 flex items-center justify-center text-[#1C1815]">
                <Sparkles className="w-5 h-5 text-[#E8E2D8]" />
              </div>
              <h3 className="text-base font-bold text-[#E8E2D8]">
                Giải Pháp Đột Phá Từ Hệ Thống AIVES
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-[#B8B0A6]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <span><strong className="text-[#F5F0E8]">Sinh câu hỏi thông minh theo tài liệu:</strong> Giảng viên tạo đề hoặc dùng AI trích xuất câu hỏi bám sát giáo trình, slide bài giảng môn học.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <span><strong className="text-[#F5F0E8]">Buổi vấn đáp AI hỏi xoáy thích ứng:</strong> AI Giám khảo đặt câu hỏi và tự động hỏi sâu/làm rõ theo đúng ngữ cảnh câu trả lời của sinh viên.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <span><strong className="text-[#F5F0E8]">Hỗ trợ chấm điểm theo Rubric:</strong> Đề xuất điểm số khách quan dựa trên tiêu chí và thang điểm định trước cho từng câu trả lời.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <span><strong className="text-[#F5F0E8]">Lưu vết minh bạch toàn bộ ca thi:</strong> Ghi nhận đầy đủ âm thanh, bản gỡ băng (transcript) và gợi ý điểm để làm căn cứ minh bạch.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Core Features by Role */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-[#F5F0E8]">
            Các Tính Năng Trọng Tâm
          </h2>
          <p className="text-xs text-[#B8B0A6]">
            Thiết kế kính lỏng mềm mại tối ưu cho từng vai trò người dùng trong quy trình khảo thí
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Giảng viên */}
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-[#C9A876]/40 space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A876]/15 border border-[#C9A876]/30 text-[#E8E2D8] text-xs font-bold uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-[#C9A876]" />
                Dành cho Giảng Viên
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F5F0E8]">
                Quản Lý Ngân Hàng Câu Hỏi & Rubric Chấm Điểm
              </h3>
              <p className="text-xs text-[#B8B0A6] mt-1">
                Công cụ chuẩn bị đề thi thông minh, giải phóng thời gian ra đề và chuẩn hóa tiêu chí đánh giá.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#B8B0A6]">
              <div className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#1C1815]/60 border border-[#5C554C]/50">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8]">AI sinh câu hỏi từ tài liệu môn học (RAG):</strong> Giảng viên tạo, nhập (import) hoặc dùng AI sinh câu hỏi vấn đáp theo môn học/chủ đề từ giáo trình, slide bài giảng.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#1C1815]/60 border border-[#5C554C]/50">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8]">Gắn nhãn mức độ nhận thức thang Bloom:</strong> Phân cấp rõ 4 bậc tư duy: <em>Nhớ, Hiểu, Vận dụng, Phân tích</em> để đánh giá chính xác năng lực sinh viên.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#1C1815]/60 border border-[#5C554C]/50">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8]">Gắn kết Rubric tiêu chí & thang điểm:</strong> Thiết lập tiêu chí chấm rõ ràng làm căn cứ chuẩn xác cho AI đề xuất điểm gợi ý sau phiên thi.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#1C1815]/60 border border-[#5C554C]/50">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8]">Toàn quyền kiểm duyệt & chỉnh sửa:</strong> Giảng viên toàn quyền duyệt, chỉnh sửa hoặc loại bỏ câu hỏi do AI tạo ra trước khi đưa vào ngân hàng chính thức.
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Sinh viên */}
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-[#B8B0A6]/35 space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8B0A6]/15 border border-[#B8B0A6]/30 text-[#F5F0E8] text-xs font-bold uppercase tracking-wide">
                <GraduationCap className="w-4 h-4 text-[#E8E2D8]" />
                Dành cho Sinh Viên & Giảng Viên
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F5F0E8]">
                Phỏng Vấn AI Hỏi Xoáy Thích Ứng
              </h3>
              <p className="text-xs text-[#B8B0A6] mt-1">
                Mô phỏng đối thoại vấn đáp thực thụ giữa Giám khảo ảo và thí sinh trên nền tảng kính lỏng.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#B8B0A6]">
              <div className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#1C1815]/60 border border-[#5C554C]/50">
                <Mic className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8]">Giám khảo ảo tương tác giọng nói:</strong> AI đọc câu hỏi bằng Text-to-Speech (TTS), sinh viên trả lời bằng giọng nói và được chuyển sang văn bản (STT) gần thời gian thực.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#1C1815]/60 border border-[#5C554C]/50">
                <Sparkles className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8]">AI hỏi xoáy / làm rõ (Adaptive Follow-up):</strong> Tự động phân tích nội dung câu trả lời để hỏi sâu thêm khi câu trả lời mơ hồ, thiếu ý hoặc mâu thuẫn.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#1C1815]/60 border border-[#5C554C]/50">
                <Clock className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8]">Kiểm soát phòng thi chặt chẽ:</strong> Đồng hồ giới hạn thời gian trả lời và cài đặt số lượt hỏi xoáy tối đa cho mỗi câu để đảm bảo sự công bằng.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#1C1815]/60 border border-[#5C554C]/50">
                <Scale className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E8]">AI gợi ý điểm — Giảng viên chốt điểm cuối:</strong> AI đề xuất điểm theo Rubric, giảng viên luôn là người chốt điểm cuối cùng để đảm bảo tính pháp lý.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* MAIN APP WRAPPER WITH ROLE-AWARE ROUTING */
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aives_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && parsed.name) {
        parsed.name = parsed.name.replace(/\s*\((Sinh Viên|Sinh viên|Giảng Viên|Giảng viên|Quản Trị Viên|Admin)\)$/i, '');
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, tab: 'login' });

  const isHomePage = location.pathname === '/';
  const showSidebar = !!currentUser && !isHomePage;

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
    <div className="min-h-screen liquid-bg-canvas text-[#F5F0E8] font-sans flex relative selection:bg-[#C9A876] selection:text-[#1C1815]">
      {showSidebar && (
        <LeftSidebar
          currentUser={currentUser}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${showSidebar ? 'lg:pl-72' : ''}`}>
        <TopNavbar 
          currentUser={currentUser}
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          onOpenAuth={openAuth}
          onLogout={handleLogout}
          isHomePage={isHomePage}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<HomePage onOpenAuth={openAuth} currentUser={currentUser} />} />
            <Route path="/questions" element={<QuestionBankPage />} />
            <Route path="/generate" element={<LecturerAIGenerationPage />} />
            <Route path="/review" element={<LecturerReviewPage />} />
            <Route path="/viva" element={<VivaRoomPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>

        <footer className="glass-panel rounded-none border-t border-[#5C554C]/60 bg-[#1C1815]/75 py-6 text-center text-xs text-[#B8B0A6] mt-auto">
          <div className="max-w-6xl mx-auto px-4 space-y-1">
            <p>© 2026 AIVES - AI-powered Viva Exam System. Hệ thống khảo thí vấn đáp Liquid Glass.</p>
            <p className="text-[#8B6F47]">Bảo mật phân quyền theo vai trò cho Quản trị viên, Giảng viên và Sinh viên.</p>
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
