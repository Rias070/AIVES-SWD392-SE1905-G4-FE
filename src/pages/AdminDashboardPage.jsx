import React, { useState } from 'react';
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
  UserPlus
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'assignments' | 'config'
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data: 3 default accounts & roles
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
      name: 'TS. Nguyễn Văn Giảng',
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
  const subjectAssignments = [
    {
      subjectCode: 'SWD392',
      subjectName: 'Software Architecture & Design',
      leadLecturer: 'TS. Nguyễn Văn Giảng (lecturer@aives.edu.vn)',
      totalQuestions: 142,
      activeExams: 3,
    },
    {
      subjectCode: 'SWP391',
      subjectName: 'Software Development Project',
      leadLecturer: 'TS. Nguyễn Văn Giảng (lecturer@aives.edu.vn)',
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Dành Cho Quản Trị Viên
            </span>
            <span className="text-xs text-gray-400">Quản trị & Phân quyền hệ thống</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-1.5 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            Quản Trị Hệ Thống & Phân Quyền Khảo Thí
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Quản lý tài khoản người dùng, phân quyền giảng viên theo môn học và cấu hình thông số ngôn ngữ STT/TTS.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center rounded-xl bg-gray-950/80 p-1 border border-gray-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tài Khoản
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'assignments'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Phân Quyền Môn
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'config'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
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
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tài khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 w-full sm:w-auto justify-center">
              <UserPlus className="w-4 h-4" />
              <span>Tạo Tài Khoản Mới</span>
            </button>
          </div>

          <div className="glass-card rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Mã ID</th>
                    <th className="px-5 py-3 font-semibold">Họ và Tên</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Vai Trò (Role)</th>
                    <th className="px-5 py-3 font-semibold">Phụ Trách / Lớp</th>
                    <th className="px-5 py-3 font-semibold">Trạng Thái</th>
                    <th className="px-5 py-3 font-semibold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-white">{user.code}</td>
                      <td className="px-5 py-3 font-medium text-white">{user.name}</td>
                      <td className="px-5 py-3 text-gray-400">{user.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold ${
                            user.role === 'ADMIN'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : user.role === 'LECTURER'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-300 font-mono text-[11px]">{user.assignedSubjects}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right space-x-2">
                        <button className="text-indigo-400 hover:text-indigo-300 font-medium">
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
          <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Danh Mục Môn Học & Giảng Viên Phụ Trách</h3>
              <p className="text-xs text-gray-400">Giảng viên chỉ có quyền quản lý ngân hàng câu hỏi và tổ chức ca thi cho môn học được phân công.</p>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" /> Gán Môn Học
            </button>
          </div>

          <div className="glass-card rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Mã Môn</th>
                    <th className="px-5 py-3 font-semibold">Tên Học Phần</th>
                    <th className="px-5 py-3 font-semibold">Giảng Viên Trưởng Môn</th>
                    <th className="px-5 py-3 font-semibold">Số Câu Hỏi</th>
                    <th className="px-5 py-3 font-semibold">Ca Thi Đang Mở</th>
                    <th className="px-5 py-3 font-semibold text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {subjectAssignments.map((subj) => (
                    <tr key={subj.subjectCode} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-indigo-400">{subj.subjectCode}</td>
                      <td className="px-5 py-3 font-medium text-white">{subj.subjectName}</td>
                      <td className="px-5 py-3 text-gray-300">{subj.leadLecturer}</td>
                      <td className="px-5 py-3">{subj.totalQuestions} câu</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {subj.activeExams} phiên thi
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-indigo-400 hover:text-indigo-300 font-medium">
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
        <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Languages className="w-5 h-5 text-indigo-400" />
              Cấu Hình Ngôn Ngữ & Tham Số Nhận Diện Giọng Nói (STT / TTS)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Điều chỉnh ngôn ngữ mặc định và tham số phỏng vấn AI cho toàn bộ hệ thống ca thi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
              <label className="block font-bold text-white">Ngôn Ngữ Mặc Định Cho Ca Thi</label>
              <select className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none">
                <option value="vi">Tiếng Việt (vi-VN) - Tối ưu thuật ngữ CNTT / Học thuật</option>
                <option value="en">Tiếng Anh (en-US) - Chuẩn phát âm quốc tế</option>
              </select>
              <p className="text-[11px] text-gray-400">Áp dụng cho giọng đọc AI Giám khảo và mô hình chuyển đổi giọng nói sinh viên sang văn bản.</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
              <label className="block font-bold text-white">Giới Hạn Lượt Hỏi Xoáy Tối Đa Mỗi Câu</label>
              <input 
                type="number" 
                defaultValue={3} 
                min={1} 
                max={5}
                className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none"
              />
              <p className="text-[11px] text-gray-400">Số lần AI được phép hỏi sâu / làm rõ khi câu trả lời của sinh viên còn mơ hồ.</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
              <label className="block font-bold text-white">Thời Gian Tối Đa Mỗi Lượt Trả Lời (Giây)</label>
              <input 
                type="number" 
                defaultValue={180} 
                step={30}
                className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none"
              />
              <p className="text-[11px] text-gray-400">Đồng hồ đếm ngược tự động khóa micro khi sinh viên trả lời quá thời lượng quy định.</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
              <label className="block font-bold text-white">Chế Độ Chấm Điểm Thẩm Quyền</label>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-semibold">Giảng viên luôn là người chốt điểm cuối (Bắt buộc)</span>
              </div>
              <p className="text-[11px] text-gray-400">AI chỉ cung cấp điểm gợi ý dựa trên Rubric, không tự ý công bố điểm chính thức.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md">
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
