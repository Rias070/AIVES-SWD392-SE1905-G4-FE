import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  ArrowRight,
  Bot,
  HelpCircle,
  Settings,
  Fingerprint,
  Video,
  CheckCircle2,
  Building
} from 'lucide-react';

export default function AuthRBACPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  // Form states
  const [selectedRole, setSelectedRole] = useState('STUDENT'); // 'STUDENT' | 'LECTURER' | 'ADMIN'
  const [email, setEmail] = useState('khanhmq@fpt.edu.vn');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'STUDENT') {
      setEmail('khanhmq@fpt.edu.vn');
    } else if (role === 'LECTURER') {
      setEmail('quanglt@fpt.edu.vn');
    } else if (role === 'ADMIN') {
      setEmail('annv.sys@fpt.edu.vn');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userRoleNames = {
      STUDENT: 'Đặng Nhật Minh',
      LECTURER: 'TS. Lê Quang',
      ADMIN: 'Nguyễn Văn An (SysAdmin)',
    };

    const userData = {
      name: userRoleNames[selectedRole],
      email: email,
      role: selectedRole,
    };

    if (onLoginSuccess) {
      onLoginSuccess(userData);
    } else {
      localStorage.setItem('aives_user', JSON.stringify(userData));
    }

    if (selectedRole === 'STUDENT') {
      navigate('/student');
    } else if (selectedRole === 'LECTURER') {
      navigate('/questions');
    } else {
      navigate('/admin/users');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto py-6 animate-fade-in">
      {/* Top micro bar */}
      <div className="flex items-center justify-between py-3 border-b border-slate-200/80 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">AIVES</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
            PROCTORING v4.2
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Chưa có tài khoản?</span>
          <Link
            to="/register"
            className="px-3.5 py-1.5 rounded-xl border border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100 font-bold transition-colors shadow-2xs"
          >
            Đăng ký tài khoản
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* ================= LEFT COLUMN: HERO INTRO (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>CÔNG NGHỆ VIVA ĐỘC BẢN — RAG MULTI-AGENT</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              AIVES • AI Viva Exam
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
              Hệ thống Khảo thí Vấn đáp Trực tuyến Thông minh ứng dụng AI & RAG. Đánh giá năng lực chuyên sâu, phản biện học thuật chuẩn mực theo thời gian thực.
            </p>
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">WebRTC E2EE</h3>
              <p className="text-[11px] text-slate-500 leading-tight">
                Mã hóa đa kênh âm thanh & hình ảnh chuẩn quân sự
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Fingerprint className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Sinh trắc học</h3>
              <p className="text-[11px] text-slate-500 leading-tight">
                Xác thực khuôn mặt 3D & phân tích âm sắc giọng nói
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">AI Proctoring</h3>
              <p className="text-[11px] text-slate-500 leading-tight">
                Giám sát góc nhìn, hành vi & cảnh báo gian lận tức thì
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium pt-2">
            <span>BỘ GIÁO DỤC & ĐÀO TẠO BẢO CHỨNG</span>
            <span>•</span>
            <span>FPT EDU — VNU-HCM — HUST</span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: AUTH CARD (6 COLS) ================= */}
        <div className="lg:col-span-6">
          <div className="p-8 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl space-y-6 max-w-md mx-auto">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Đăng nhập tài khoản</h2>
              <p className="text-xs text-slate-500">
                Chọn vai trò xác thực trong kỳ khảo thí số hóa
              </p>
            </div>

            {/* RBAC Role Selector Pills */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleRoleChange('STUDENT')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'STUDENT'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Sinh viên</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('LECTURER')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'LECTURER'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Giảng viên</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'ADMIN'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Quản trị viên</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Email học đường / FPT Edu
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khanhmq@fpt.edu.vn"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700">Mật khẩu bảo mật</label>
                  <a href="#" className="text-[11px] text-sky-600 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="remember" className="text-xs text-slate-600 select-none cursor-pointer">
                  Ghi nhớ phiên đăng nhập trên thiết bị an toàn
                </label>
              </div>

              {/* Login Button with Warm Metallic Gold/Glacier Style */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-sky-600 hover:from-amber-600 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Đăng nhập vào hệ thống</span>
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
                HOẶC XÁC THỰC SSO ĐẠI HỌC
              </span>
            </div>

            {/* SSO Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSubmit({ preventDefault: () => {} })}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <span className="text-rose-500 font-bold">G</span>
                <span>Google Edu</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit({ preventDefault: () => {} })}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Building className="w-3.5 h-3.5 text-sky-600" />
                <span>Cổng FPT/ĐHQG</span>
              </button>
            </div>

            {/* Register Link */}
            <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
              <span>Chưa có tài khoản học thuật? </span>
              <Link to="/register" className="text-sky-600 font-bold hover:underline">
                Đăng ký ngay
              </Link>
            </div>

            <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Phiên bản v4.2 Pro • Đạt chuẩn liêm chính học thuật Quốc gia</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
