import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Building,
  AlertCircle,
  Home,
  Mic,
  Scale,
  Zap
} from 'lucide-react';
import { authApi } from '../../services/api';
import { authenticateUser, findUserByEmail } from '../../services/userService';

export default function AuthRBACPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Form states - Empty defaults so registered accounts can be entered directly
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState(null);

  // Catch security errors passed from ProtectedRoute (e.g., account deleted/deactivated while in session)
  useEffect(() => {
    if (location.state?.accountStatusError) {
      setLoginError(location.state.accountStatusError);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    const rawEmail = (email || '').trim();
    // Allow typing "admin" shorthand to map directly to canonical admin account
    const cleanEmail = rawEmail.toLowerCase() === 'admin' ? 'admin@aives.edu.vn' : rawEmail;

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setLoginError('Địa chỉ email không đúng định dạng (ví dụ: student@aives.edu.vn hoặc user@domain.com)!');
      return;
    }

    if (!password || password.length < 6) {
      setLoginError('Vui lòng nhập mật khẩu tối thiểu 6 ký tự!');
      return;
    }

    // Attempt real Backend API login if available
    let backendUser = null;
    let token = null;

    try {
      const res = await authApi.login({ email: cleanEmail, password });
      if (res?.data?.result) {
        token = res.data.result.token;
        const user = res.data.result.user;
        if (user) {
          backendUser = {
            id: user.uuid || user.id,
            name: user.fullName || user.name,
            email: user.email,
            role: user.role?.name || user.role || 'STUDENT',
            status: user.status || 'ACTIVE',
          };
        }
      }
    } catch (apiErr) {
      // Auto-retry with backend canonical seed passwords if user entered demo credentials
      const canonicalSeedPasswords = {
        'admin@aives.edu.vn': 'Admin@123',
        'lecturer@aives.edu.vn': 'Lecturer@123',
        'student@aives.edu.vn': 'Student@123',
      };
      const seedPass = canonicalSeedPasswords[cleanEmail.toLowerCase()];
      if (seedPass && seedPass !== password) {
        try {
          const retryRes = await authApi.login({ email: cleanEmail, password: seedPass });
          if (retryRes?.data?.result) {
            token = retryRes.data.result.token;
            const user = retryRes.data.result.user;
            if (user) {
              backendUser = {
                id: user.uuid || user.id,
                name: user.fullName || user.name,
                email: user.email,
                role: user.role?.name || user.role || 'STUDENT',
                status: user.status || 'ACTIVE',
              };
            }
          }
        } catch {
          console.warn('Backend retry fallback to local registry');
        }
      } else {
        console.warn('Backend login fallback to local registry:', apiErr.friendlyMessage || apiErr);
      }
    }

    // Authenticate with user registry (blocks deleted and deactivated accounts!)
    const existing = findUserByEmail(cleanEmail);
    const targetRole = backendUser?.role || (existing ? existing.role : 'STUDENT');

    const authResult = authenticateUser(cleanEmail, password, targetRole);

    if (!authResult || !authResult.success) {
      setLoginError(authResult?.message || 'Đăng nhập không thành công: Sai mật khẩu hoặc email, hoặc tài khoản đã bị xóa khỏi hệ thống!');
      return;
    }

    const userData = backendUser || authResult.user || authResult;

    // Ensure session token is always created and stored in sessionStorage
    if (!token) {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: cleanEmail,
        role: targetRole,
        name: userData.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      }));
      token = `${header}.${payload}.mock_aives_session_${Date.now()}`;
    }

    // Save token and session active flag strictly in sessionStorage
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('aives_session_active', 'true');
    sessionStorage.setItem('aives_user', JSON.stringify(userData));

    // Clear persistent storage so exiting browser enforces re-login upon return
    localStorage.removeItem('token');
    localStorage.removeItem('aives_user');
    localStorage.removeItem('aives_session_active');

    console.log('[AIVES Auth] Đã lưu token thành công vào sessionStorage:', sessionStorage.getItem('token') ? 'OK' : 'FAIL');
    console.log('[AIVES Auth] Cờ aives_session_active:', sessionStorage.getItem('aives_session_active'));

    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }

    // Automatic role-based routing based on account profile
    const effectiveRole = (userData.role || targetRole || 'STUDENT').toUpperCase().replace(/^ROLE_/, '');
    if (effectiveRole === 'ADMIN') {
      navigate('/admin');
    } else if (effectiveRole === 'LECTURER') {
      navigate('/questions');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto py-6 animate-fade-in">
      {/* Top micro bar */}
      <div className="flex items-center justify-between py-3 border-b border-slate-200/80 mb-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
          title="Quay về Trang Chủ AIVES"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">AI Viva Voice Pro</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                PORTAL
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors shadow-2xs"
            title="Quay về Trang Chủ"
          >
            <Home className="w-3.5 h-3.5 text-sky-600" />
            <span>Trang Chủ</span>
          </Link>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-2 text-slate-500">
            <span>Chưa có tài khoản?</span>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-xl border border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100 font-bold transition-colors shadow-2xs"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* ================= LEFT COLUMN: HERO INTRO (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>NỀN TẢNG KHẢO THÍ VẤN ĐÁP THẾ HỆ MỚI</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Khảo Thí Thông Minh • <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                Đánh Giá Thực Chất
              </span>
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
              Giải pháp toàn diện giúp chuẩn hóa ca thi vấn đáp, cá nhân hóa lộ trình phỏng vấn và cung cấp kết quả đánh giá năng lực minh bạch, công bằng.
            </p>
          </div>

          {/* 3 Pillar Cards - Tiện ích hệ thống (Marketing / Value oriented) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs space-y-1.5 hover:border-sky-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Vấn Đáp Tương Tác</h3>
              <p className="text-[11px] text-slate-500 leading-tight">
                Phỏng vấn giọng nói tự nhiên, phản hồi linh hoạt và đa chiều như hội đồng thật.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs space-y-1.5 hover:border-cyan-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Chấm Điểm Chuẩn Barem</h3>
              <p className="text-[11px] text-slate-500 leading-tight">
                Tiêu chí Rubric rõ ràng, nhận xét chi tiết tức thì và minh bạch tuyệt đối.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs space-y-1.5 hover:border-indigo-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Tối Ưu Thời Gian</h3>
              <p className="text-[11px] text-slate-500 leading-tight">
                Tiết kiệm 80% công sức tổ chức thi, linh hoạt địa điểm và chủ động lịch trình.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium pt-2">
            <span>ĐỒNG HÀNH CÙNG GIẢNG VIÊN & SINH VIÊN</span>
            <span>•</span>
            <span>CHUYỂN ĐỔI SỐ KHẢO THÍ ĐẠI HỌC</span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: AUTH CARD (6 COLS) ================= */}
        <div className="lg:col-span-6">
          <div className="p-8 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl space-y-6 max-w-md mx-auto">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Đăng nhập tài khoản</h2>
              <p className="text-xs text-slate-500">
                Nhập email và mật khẩu của bạn để truy cập hệ thống
              </p>
            </div>

            {/* Quick Demo Accounts */}
            <div className="p-2.5 rounded-2xl bg-sky-50/80 border border-sky-200/80 space-y-1.5">
              <span className="text-[11px] font-bold text-sky-900 block">⚡ Đăng nhập nhanh tài khoản mẫu:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => { setEmail('lecturer@aives.edu.vn'); setPassword('Lecturer@123'); }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 hover:bg-sky-100/70 text-sky-800 text-[11px] font-semibold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>👨‍🏫 Giảng viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('student@aives.edu.vn'); setPassword('Student@123'); }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 hover:bg-sky-100/70 text-sky-800 text-[11px] font-semibold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>🎓 Sinh viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@aives.edu.vn'); setPassword('Admin@123'); }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 hover:bg-sky-100/70 text-sky-800 text-[11px] font-semibold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>🛡️ Quản trị</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center justify-between gap-2.5 animate-in fade-in shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLoginError(null)}
                  className="text-rose-400 hover:text-rose-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Email đăng nhập
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email hoặc tài khoản đăng nhập..."
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
