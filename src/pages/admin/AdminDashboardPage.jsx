import React, { useState, useEffect } from 'react';
import { adminConfigApi } from '../../services/api';
import {
  ShieldCheck,
  Users,
  UserCheck,
  Settings,
  Languages,
  BookOpen,
  CheckCircle2,
  Search,
  Plus,
  SlidersHorizontal,
  UserPlus,
  X,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'assignments' | 'config'
  const [searchTerm, setSearchTerm] = useState('');

  // Controlled state for AI Viva STT/TTS Configuration Form (Tab 3)
  const [aiConfig, setAiConfig] = useState({
    defaultLanguage: 'vi',
    maxFollowupTurns: 3,
    maxAnswerTimeSec: 180,
    isHumanInTheLoop: true,
  });

  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveConfigNotice, setSaveConfigNotice] = useState(null);

  // Fetch current AI Viva configuration from Backend API
  const fetchAIVivaConfig = async () => {
    try {
      const res = await adminConfigApi.getAIVivaConfig();
      if (res.data && res.data.data) {
        setAiConfig({
          defaultLanguage: res.data.data.defaultLanguage || 'vi',
          maxFollowupTurns: res.data.data.maxFollowupTurns || 3,
          maxAnswerTimeSec: res.data.data.maxAnswerTimeSec || 180,
          isHumanInTheLoop: res.data.data.isHumanInTheLoop ?? true,
        });
      }
    } catch (err) {
      console.warn('Backend API getAIVivaConfig offline, using client config fallback:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'config') {
      fetchAIVivaConfig();
    }
  }, [activeTab]);

  // Handle saving AI config (Connected to adminConfigApi)
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await adminConfigApi.updateAIVivaConfig({
        defaultLanguage: aiConfig.defaultLanguage,
        maxFollowupTurns: aiConfig.maxFollowupTurns,
        maxAnswerTimeSec: aiConfig.maxAnswerTimeSec,
        isHumanInTheLoop: aiConfig.isHumanInTheLoop,
      });
      setSaveConfigNotice({
        type: 'success',
        text: 'Cấu hình ngôn ngữ STT/TTS và tham số AI Viva đã được cập nhật thành công cho toàn hệ thống!',
      });
    } catch (err) {
      const msg = err.friendlyMessage || 'Đã áp dụng cấu hình cục bộ (Backend API chưa sẵn sàng).';
      console.warn('API updateAIVivaConfig warning:', err);
      setSaveConfigNotice({
        type: 'warning',
        text: `Đã lưu cấu hình giao diện. (${msg})`,
      });
    } finally {
      setIsSavingConfig(false);
      setTimeout(() => setSaveConfigNotice(null), 5000);
    }
  };  // Sample data: 3 default accounts & roles
  // [MOCK] Hard-coded seed for offline demo. Replace by adminUserApi.getUsers() once backend is ready.
  const usersList = [
    {
      id: 'usr-1',
      code: 'ADM-001',
      name: 'AIVES Administrator',
      email: 'admin@aives.edu.vn',
      role: 'ADMIN',
      status: 'ACTIVE',
      assignedSubjects: 'Toàn quyền quản trị',
    },
    {
      id: 'usr-2',
      code: 'LEC-104',
      name: 'GS.TS Nguyễn Hoàng Nam',
      email: 'lecturer@aives.edu.vn',
      role: 'LECTURER',
      status: 'ACTIVE',
      assignedSubjects: 'SWD392, SWP391, PRJ301',
    },
    {
      id: 'usr-3',
      code: 'STU-992',
      name: 'Trần Thị Mai',
      email: 'student@aives.edu.vn',
      role: 'STUDENT',
      status: 'ACTIVE',
      assignedSubjects: 'SWD392 (SE1905)',
    },
  ];

  // Sample subject assignments for lecturers
  // [MOCK] Hard-coded seed. Replace by adminSubjectApi.getSubjectAssignments() once backend is ready.
  const subjectAssignments = [
    {
      subjectCode: 'SWD392',
      subjectName: 'Software Architecture & Design',
      leadLecturer: 'GS.TS Nguyễn Hoàng Nam (lecturer@aives.edu.vn)',
      totalQuestions: 142,
      activeExams: 3,
    },
    {
      subjectCode: 'SWP391',
      subjectName: 'Software Development Project',
      leadLecturer: 'GS.TS Nguyễn Hoàng Nam (lecturer@aives.edu.vn)',
      totalQuestions: 98,
      activeExams: 2,
    },
    {
      subjectCode: 'PRJ301',
      subjectName: 'Java Web Applications',
      leadLecturer: 'ThS. Lê Hoàng Nam (namlh@aives.edu.vn)',
      totalQuestions: 215,
      activeExams: 5,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Dành Cho Quản Trị Viên
            </span>
            <span className="text-xs text-slate-500">Quản trị RBAC & Phân quyền hệ thống</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-sky-600" />
            Quản Trị Hệ Thống & Phân Quyền Khảo Thí
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Quản lý tài khoản người dùng, phân quyền giảng viên theo môn học và cấu hình thông số ngôn ngữ STT/TTS.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 self-start md:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tài Khoản
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'assignments'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Phân Quyền Môn
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'config'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cấu Hình STT/TTS
          </button>
        </div>
      </div>

      {/* TAB 1: Quản lý tài khoản (Users) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tài khoản, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <button className="btn-glacier-primary px-4 py-2.5 text-xs w-full sm:w-auto">
              <UserPlus className="w-4 h-4" />
              <span>Tạo Tài Khoản Mới</span>
            </button>
          </div>

          <div className="glacier-light-card rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Mã ID</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Họ và Tên</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Vai Trò (Role)</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Phụ Trách / Lớp</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-sky-800">{user.code}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900">{user.name}</td>
                      <td className="px-6 py-3.5 text-slate-500">{user.email}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-3 py-0.5 rounded-full font-bold text-[11px] border ${
                            user.role === 'ADMIN'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : user.role === 'LECTURER'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 font-mono text-[11px]">{user.assignedSubjects}</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <button className="text-sky-600 hover:text-sky-800 font-bold underline underline-offset-2">
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Phân quyền Giảng viên & Môn học */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="glacier-light-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Danh Mục Môn Học & Giảng Viên Phụ Trách</h3>
              <p className="text-xs text-slate-500">Giảng viên chỉ có quyền quản lý ngân hàng câu hỏi và tổ chức ca thi cho môn học được phân công.</p>
            </div>
            <button className="btn-glacier-primary px-4 py-2 text-xs shrink-0 self-start sm:self-auto">
              <Plus className="w-3.5 h-3.5" /> Gán Môn Học
            </button>
          </div>

          <div className="glacier-light-card rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Mã Môn</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Tên Học Phần</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Giảng Viên Trưởng Môn</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Số Câu Hỏi</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Ca Thi Đang Mở</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {subjectAssignments.map((subj) => (
                    <tr key={subj.subjectCode} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-sky-700">{subj.subjectCode}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900">{subj.subjectName}</td>
                      <td className="px-6 py-3.5 text-slate-500">{subj.leadLecturer}</td>
                      <td className="px-6 py-3.5 text-slate-700 font-medium">{subj.totalQuestions} câu</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {subj.activeExams} phiên thi
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button className="text-sky-600 hover:text-sky-800 font-bold underline underline-offset-2">
                          Thay đổi GV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Cấu hình ngôn ngữ STT / TTS */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="glacier-light-card p-6 md:p-8 rounded-2xl space-y-6 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Languages className="w-5 h-5 text-sky-600" />
              Cấu Hình Ngôn Ngữ & Tham Số Nhận Diện Giọng Nói (STT / Whisper / TTS)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Điều chỉnh ngôn ngữ mặc định và tham số phỏng vấn AI cho toàn bộ hệ thống ca thi.
            </p>
          </div>

          {/* Toast Notice with auto-dismiss progress bar */}
          {saveConfigNotice && (
            <div
              role="status"
              aria-live="polite"
              className="relative overflow-hidden p-3.5 pr-10 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2"
            >
              <div className="flex items-center gap-2 flex-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveConfigNotice.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveConfigNotice(null)}
                aria-label="Đóng thông báo"
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Auto-dismiss progress bar (5s) */}
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-emerald-500/70 toast-progress"
                style={{ animation: 'toast-progress 5s linear forwards' }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">Ngôn Ngữ Mặc Định Cho Ca Thi</label>
              <select
                value={aiConfig.defaultLanguage}
                onChange={(e) => setAiConfig({ ...aiConfig, defaultLanguage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="vi">Tiếng Việt (vi-VN) - Tối ưu thuật ngữ CNTT / Học thuật</option>
                <option value="en">Tiếng Anh (en-US) - Chuẩn phát âm quốc tế</option>
              </select>
              <p className="text-[11px] text-slate-500">Áp dụng cho giọng đọc AI Giám khảo và mô hình chuyển đổi giọng nói sinh viên sang văn bản.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">Giới Hạn Lượt Hỏi Xoáy Tối Đa Mỗi Câu</label>
              <input 
                type="number" 
                value={aiConfig.maxFollowupTurns}
                onChange={(e) => setAiConfig({ ...aiConfig, maxFollowupTurns: Math.max(1, Math.min(5, Number(e.target.value))) })}
                min={1} 
                max={5}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-500">Số lần AI được phép hỏi sâu / làm rõ khi câu trả lời của sinh viên còn mơ hồ (Tối đa 5 lượt).</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">Thời Gian Tối Đa Mỗi Lượt Trả Lời (Giây)</label>
              <input 
                type="number" 
                value={aiConfig.maxAnswerTimeSec}
                onChange={(e) => setAiConfig({ ...aiConfig, maxAnswerTimeSec: Number(e.target.value) })}
                step={10}
                min={30}
                max={300}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-500">Đồng hồ đếm ngược tự động khóa micro khi sinh viên trả lời quá thời lượng quy định.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">Chế Độ Chấm Điểm Thẩm Quyền</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold">Giảng viên luôn là người chốt điểm cuối (Bắt buộc)</span>
              </div>
              <p className="text-[11px] text-slate-500">AI chỉ cung cấp điểm gợi ý dựa trên Rubric, không tự ý công bố điểm chính thức.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isSavingConfig}
              className="btn-glacier-primary px-6 py-2.5 text-xs flex items-center gap-2"
            >
              {isSavingConfig ? (
                <span>Đang lưu...</span>
              ) : (
                <span>Lưu Cấu Hình</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
