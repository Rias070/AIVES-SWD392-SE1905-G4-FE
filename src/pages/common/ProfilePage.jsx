import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  CheckCircle2,
  Save,
  ArrowLeft,
  Key,
  Calendar,
  BookOpen,
  GraduationCap,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  BadgeCheck
} from 'lucide-react';

export default function ProfilePage({ currentUser, onUpdateProfile }) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(currentUser?.name || 'Nguyễn Văn A');
  const [email, setEmail] = useState(currentUser?.email || 'user@aives.edu.vn');
  const [phone, setPhone] = useState(currentUser?.phone || '0912 345 678');
  const [department, setDepartment] = useState(currentUser?.department || (currentUser?.role === 'STUDENT' ? 'Khoa Kỹ Thuật Phần Mềm - Lớp SE1905' : 'Viện Trí Tuệ Nhân Tạo & Khảo Thí'));
  const [userCode] = useState(currentUser?.idNumber || currentUser?.id || (currentUser?.role === 'STUDENT' ? 'SE190501' : currentUser?.role === 'LECTURER' ? 'GV-AI301' : 'ADM-001'));
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Status message
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize local fields if currentUser prop updates
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.department) setDepartment(currentUser.department);
    }
  }, [currentUser]);

  const roleLabels = {
    ADMIN: { name: 'Quản Trị Viên Hệ Thống', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Shield },
    LECTURER: { name: 'Giảng Viên / Giám Khảo', badge: 'bg-sky-50 text-sky-700 border-sky-200', icon: BookOpen },
    STUDENT: { name: 'Sinh Viên / Thí Sinh', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: GraduationCap },
  };

  const currentRoleConfig = roleLabels[currentUser?.role] || roleLabels.STUDENT;
  const RoleIcon = currentRoleConfig.icon;

  const handleSaveProfile = (e) => {
    e.preventDefault();

    // 1. Validate Email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      setToastMessage({ type: 'error', text: 'Địa chỉ email không đúng định dạng (ví dụ: student@fpt.edu.vn hoặc user@domain.com)!' });
      return;
    }

    // 2. Validate Password Change logic
    const isChangingPassword = currentPassword || newPassword || confirmPassword;
    if (isChangingPassword) {
      if (!currentPassword) {
        setToastMessage({ type: 'error', text: 'Vui lòng nhập Mật khẩu hiện tại để xác thực trước khi đổi mật khẩu mới!' });
        return;
      }
      if (!newPassword) {
        setToastMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu mới muốn thay đổi!' });
        return;
      }
      if (newPassword.length < 6) {
        setToastMessage({ type: 'error', text: 'Mật khẩu mới phải có độ dài tối thiểu từ 6 ký tự trở lên!' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setToastMessage({ type: 'error', text: 'Mật khẩu mới và xác nhận mật khẩu không khớp nhau!' });
        return;
      }
      if (newPassword === currentPassword) {
        setToastMessage({ type: 'error', text: 'Mật khẩu mới không được trùng với mật khẩu hiện tại!' });
        return;
      }
    }

    setIsSaving(true);

    setTimeout(() => {
      const updatedUser = {
        ...currentUser,
        id: currentUser?.id || currentUser?.idNumber || userCode,
        idNumber: currentUser?.id || currentUser?.idNumber || userCode,
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department: department.trim(),
        assigned: department.trim(),
        previousEmail: currentUser?.email,
        ...(newPassword ? { password: newPassword } : {}),
      };

      if (onUpdateProfile) {
        onUpdateProfile(updatedUser);
      }

      setIsSaving(false);
      setToastMessage({ type: 'success', text: 'Cập nhật thông tin hồ sơ cá nhân thành công! Dữ liệu đã được lưu và đồng bộ toàn hệ thống.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => setToastMessage(null), 4500);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 animate-in fade-in duration-200">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-sky-600 transition-colors">Trang Chủ</Link>
            <span className="text-slate-300">›</span>
            <span className="text-sky-700 font-semibold">Hồ Sơ Cá Nhân & Tài Khoản</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <User className="w-6 h-6 text-sky-600" />
            <span>Thông Tin Cá Nhân & Thiết Lập Tài Khoản</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin định danh, email liên hệ và mật khẩu bảo mật trên hệ thống AI Viva Voice
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 shadow-xs animate-in fade-in ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="glacier-light-panel p-6 rounded-3xl border border-slate-200/90 shadow-glacier-card text-center space-y-4">
            {/* Avatar with Ring */}
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-600 p-[2px] shadow-md shadow-sky-500/20 mx-auto">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-sky-700 font-bold text-2xl">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Trạng thái: Đang hoạt động">
                <BadgeCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{fullName}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{email}</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-2xs mx-auto">
              <RoleIcon className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-slate-700">{currentRoleConfig.name}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mã định danh:</span>
                <span className="font-mono font-bold text-slate-800">{userCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                  Hoạt động
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Xác thực:</span>
                <span className="font-medium text-slate-700">FPT SSO / AIVES ID</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phân quyền:</span>
                <span className="font-bold text-sky-700">{currentUser?.role || 'STUDENT'}</span>
              </div>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2 text-xs text-slate-700 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-sky-900">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Bảo Vệ Tính Toàn Vẹn Khảo Thí</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Mọi cập nhật thông tin định danh và địa chỉ email sẽ được đồng bộ ngay vào hồ sơ dự thi và biên bản chấm vấn đáp AI.
            </p>
          </div>
        </div>

        {/* Right Column: Update Form (8 cols) */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSaveProfile} className="glacier-light-panel p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-glacier-card space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-sky-700">
                1. Thông Tin Cơ Bản (Update Thông Tin Cá Nhân)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật họ tên, địa chỉ email liên hệ và số điện thoại nhận thông báo ca thi
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Họ và tên người dùng <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email liên hệ chính <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@aives.edu.vn"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Số điện thoại di động
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Đơn vị đào tạo / Lớp học
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Khoa CNTT / Lớp SE1905"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-sky-700">
                2. Thiết Lập Mật Khẩu (Tùy Chọn)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉ điền vào các trường dưới đây nếu bạn muốn thay đổi mật khẩu đăng nhập mới
              </p>
            </div>

            <div className="space-y-4">
              {/* Current Password - Required before setting new password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Mật khẩu hiện tại <span className="text-slate-400 font-normal">(bắt buộc nhập nếu muốn đổi mật khẩu)</span></span>
                  <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Xác thực bảo mật</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang sử dụng hiện tại"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mật khẩu mới (Tối thiểu 6 ký tự)
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới muốn thay đổi"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            </div>
          </div>

            {/* Submit Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-glacier-primary px-6 py-2.5 text-xs font-semibold shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu thay đổi...' : 'Lưu Cập Nhật Hồ Sơ'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
