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
  Camera,
  CheckCircle2,
  Building,
  User,
  Mail,
  Phone,
  FileCheck,
  CheckSquare,
  Square,
  Fingerprint,
  RefreshCw
} from 'lucide-react';

export default function RegisterPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  // Role: 'STUDENT' | 'LECTURER'
  const [role, setRole] = useState('STUDENT');

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('CNTT');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasFaceCaptured, setHasFaceCaptured] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const handleCaptureFace = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setHasFaceCaptured(true);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    if (!agreedToTerms) {
      alert('Vui lòng đồng ý với cam kết liêm chính học thuật!');
      return;
    }

    const newUser = {
      name: fullName || (role === 'STUDENT' ? 'Sinh Viên Mới' : 'Giảng Viên Mới'),
      email: email,
      role: role,
      idNumber: idNumber,
      department: department,
    };

    if (onLoginSuccess) {
      onLoginSuccess(newUser);
    } else {
      localStorage.setItem('aives_user', JSON.stringify(newUser));
    }

    alert('Đăng ký tài khoản thành công! Chào mừng bạn gia nhập hệ thống AIVES.');
    if (role === 'STUDENT') {
      navigate('/student');
    } else {
      navigate('/questions');
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-6xl mx-auto py-6 animate-fade-in">
      {/* Top Header Micro Bar */}
      <div className="flex items-center justify-between py-3 border-b border-slate-200/80 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">AIVES Viva</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            REGISTRATION
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Đã có tài khoản?</span>
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-xl border border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100 font-bold transition-colors shadow-2xs"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: HERO INFORMATION (5 COLS) ================= */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              Định danh thí sinh & giảng viên số hóa
            </span>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Tạo tài khoản học thuật AIVES
            </h1>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Hệ thống khảo thí AI chuẩn quốc tế. Cung cấp hồ sơ học thuật, theo dõi lịch thi vấn đáp và bảo mật kết quả qua công nghệ mã hóa WebRTC E2EE.
            </p>
          </div>

          {/* 3 Key Benefits */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Sinh trắc học AI Face ID</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Đăng ký khuôn mặt mẫu một lần để tự động vượt qua các vòng kiểm tra phòng thi ảo mà không lo thi hộ.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Chứng nhận số Blockchain</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Bảng điểm và đánh giá rubric của từng câu hỏi viva được lưu trữ vĩnh viễn trên sổ cái số không thể giả mạo.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">AI Examiner Cá nhân hóa</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Hệ thống phân tích điểm mạnh, gợi ý tài liệu ôn thi từ kho tri thức RAG của giảng viên phù hợp với từng bạn.
                </p>
              </div>
            </div>
          </div>

          {/* Quick SSO */}
          <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
              HOẶC LIÊN KẾT NHANH TÀI KHOẢN TRƯỜNG HỌC
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFullName('Nguyễn Văn An');
                  setEmail('annv@fpt.edu.vn');
                  setIdNumber('SE190521');
                  alert('Đã đồng bộ thông tin sinh viên từ Google Edu!');
                }}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="text-rose-500 font-bold">G</span>
                <span>Google Edu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFullName('Trần Thị Mai');
                  setEmail('maitt@fpt.edu.vn');
                  setIdNumber('SE180412');
                  alert('Đã đồng bộ thông tin từ Cổng Đào Tạo FPT/ĐHQG!');
                }}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Building className="w-3.5 h-3.5 text-sky-600" />
                <span>Cổng FPT/ĐHQG</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: REGISTRATION FORM (7 COLS) ================= */}
        <div className="lg:col-span-7">
          <div className="p-6 md:p-8 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl space-y-5">
            {/* Role Segmented Controller */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Chọn vai trò đăng ký:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === 'STUDENT'
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Sinh Viên Khảo Thí</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('LECTURER')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === 'LECTURER'
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Giảng Viên / Hội Đồng</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Họ và tên đầy đủ *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn An"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Student ID / Lecturer ID */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {role === 'STUDENT' ? 'Mã số sinh viên (MSSV) *' : 'Mã cán bộ / Giảng viên *'}
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder={role === 'STUDENT' ? 'SE190521' : 'GV-10294'}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Email học đường (@fpt.edu.vn) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="annv@fpt.edu.vn"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Số điện thoại liên hệ *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Department selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Khoa / Ngành đào tạo *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="CNTT">Khoa Công nghệ Thông tin (CNTT)</option>
                  <option value="SE">Kỹ thuật Phần mềm (Software Engineering)</option>
                  <option value="AI">Trí tuệ Nhân tạo & Khoa học Dữ liệu (AI & DS)</option>
                  <option value="IS">Hệ thống Thông tin & An toàn Mạng (IS & CyberSec)</option>
                  <option value="GD">Thiết kế Đồ họa & Truyền thông số</option>
                </select>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Mật khẩu bảo mật *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Nhập lại mật khẩu *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Khớp với mật khẩu trên"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Độ mạnh mật khẩu:</span>
                    <span className="font-bold">
                      {strength <= 25 ? 'Yếu' : strength <= 50 ? 'Trung bình' : strength <= 75 ? 'Khá' : 'Rất mạnh'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength <= 25 ? 'bg-rose-500' : strength <= 50 ? 'bg-amber-500' : strength <= 75 ? 'bg-sky-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${strength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Biometric Face ID Capture Box */}
              <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Đăng ký khuôn mặt mẫu (Face ID)</h4>
                      <p className="text-[10px] text-slate-500">Dùng cho AI xác thực khi vào phòng thi viva</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCaptureFace}
                    disabled={isCapturing}
                    className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    {isCapturing ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Đang quét...</span>
                      </>
                    ) : hasFaceCaptured ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                        <span>Chụp lại</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3 h-3" />
                        <span>Chụp ảnh thẻ</span>
                      </>
                    )}
                  </button>
                </div>

                {hasFaceCaptured ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Khuôn mặt đã được mã hóa Vector 512-dim thành công! Khớp 99.8% độ tin cậy.</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Nhấp "Chụp ảnh thẻ" để hệ thống ghi nhận khuôn mặt mẫu qua Webcam.
                  </p>
                )}
              </div>

              {/* Code of Conduct Checkbox */}
              <div
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="text-sky-600 mt-0.5">
                  {agreedToTerms ? <CheckSquare className="w-4 h-4 text-sky-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                </div>
                <span className="text-[11px] text-slate-700 select-none leading-snug">
                  Tôi cam kết cung cấp thông tin định danh chính xác và tuân thủ toàn bộ <strong>Quy chế Liêm chính Học thuật & Khảo thí Trực tuyến AIVES</strong>.
                </span>
              </div>

              {/* CTA Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-sky-600 hover:from-amber-600 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Hoàn Tất Đăng Ký Tài Khoản AIVES</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
