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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#5C554C]/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#C9A876]/15 text-[#E8E2D8] border border-[#C9A876]/35">
              Dành Cho Quản Trị Viên
            </span>
            <span className="text-xs text-[#B8B0A6]">Quản trị RBAC & Phân quyền hệ thống</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F5F0E8] mt-2 flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-[#C9A876]" />
            Quản Trị Hệ Thống & Phân Quyền Khảo Thí
          </h1>
          <p className="text-xs md:text-sm text-[#B8B0A6] mt-1">
            Quản lý tài khoản người dùng, phân quyền giảng viên theo môn học và cấu hình thông số ngôn ngữ STT/TTS.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center rounded-[20px] bg-[#1C1815]/90 p-1.5 border border-[#5C554C]/60 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-[14px] transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-b from-[#E8E2D8] via-[#C9A876] to-[#8B6F47] text-[#1C1815] shadow-md'
                : 'text-[#B8B0A6] hover:text-[#F5F0E8]'
            }`}
          >
            Tài Khoản
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 text-xs font-bold rounded-[14px] transition-all ${
              activeTab === 'assignments'
                ? 'bg-gradient-to-b from-[#E8E2D8] via-[#C9A876] to-[#8B6F47] text-[#1C1815] shadow-md'
                : 'text-[#B8B0A6] hover:text-[#F5F0E8]'
            }`}
          >
            Phân Quyền Môn
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-bold rounded-[14px] transition-all ${
              activeTab === 'config'
                ? 'bg-gradient-to-b from-[#E8E2D8] via-[#C9A876] to-[#8B6F47] text-[#1C1815] shadow-md'
                : 'text-[#B8B0A6] hover:text-[#F5F0E8]'
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
              <Search className="w-4 h-4 text-[#B8B0A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tài khoản, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="liquid-input w-full pl-10 pr-4 py-2.5 text-xs"
              />
            </div>

            <button className="btn-liquid-gold px-5 py-2.5 text-xs w-full sm:w-auto">
              <UserPlus className="w-4 h-4" />
              <span>Tạo Tài Khoản Mới</span>
            </button>
          </div>

          <div className="glass-card rounded-[24px] border border-[#5C554C]/60 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1815]/90 text-[#B8B0A6] border-b border-[#5C554C]/60">
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
                <tbody className="divide-y divide-[#5C554C]/40 text-[#F5F0E8]">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-[#3A332C]/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-[#E8E2D8]">{user.code}</td>
                      <td className="px-6 py-3.5 font-semibold text-[#F5F0E8]">{user.name}</td>
                      <td className="px-6 py-3.5 text-[#B8B0A6]">{user.email}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-3 py-0.5 rounded-full font-bold text-[11px] border ${
                            user.role === 'ADMIN'
                              ? 'bg-[#E8E2D8]/15 text-[#E8E2D8] border-[#C9A876]/45'
                              : user.role === 'LECTURER'
                              ? 'bg-[#C9A876]/20 text-[#E8E2D8] border-[#C9A876]/40'
                              : 'bg-[#B8B0A6]/15 text-[#F5F0E8] border-[#B8B0A6]/35'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[#B8B0A6] font-mono text-[11px]">{user.assignedSubjects}</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C9A876]/15 text-[#E8E2D8] border border-[#C9A876]/30 font-medium">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <button className="text-[#C9A876] hover:text-[#E8E2D8] font-bold underline underline-offset-2">
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
          <div className="glass-panel p-5 rounded-[22px] border border-[#5C554C]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#F5F0E8]">Danh Mục Môn Học & Giảng Viên Phụ Trách</h3>
              <p className="text-xs text-[#B8B0A6]">Giảng viên chỉ có quyền quản lý ngân hàng câu hỏi và tổ chức ca thi cho môn học được phân công.</p>
            </div>
            <button className="btn-liquid-gold px-4 py-2 text-xs shrink-0 self-start sm:self-auto">
              <Plus className="w-3.5 h-3.5" /> Gán Môn Học
            </button>
          </div>

          <div className="glass-card rounded-[24px] border border-[#5C554C]/60 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1815]/90 text-[#B8B0A6] border-b border-[#5C554C]/60">
                  <tr>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Mã Môn</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Tên Học Phần</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Giảng Viên Trưởng Môn</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Số Câu Hỏi</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Ca Thi Đang Mở</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5C554C]/40 text-[#F5F0E8]">
                  {subjectAssignments.map((subj) => (
                    <tr key={subj.subjectCode} className="hover:bg-[#3A332C]/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-[#C9A876]">{subj.subjectCode}</td>
                      <td className="px-6 py-3.5 font-semibold text-[#F5F0E8]">{subj.subjectName}</td>
                      <td className="px-6 py-3.5 text-[#B8B0A6]">{subj.leadLecturer}</td>
                      <td className="px-6 py-3.5 text-[#E8E2D8]">{subj.totalQuestions} câu</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C9A876]/15 text-[#E8E2D8] border border-[#C9A876]/30">
                          {subj.activeExams} phiên thi
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button className="text-[#C9A876] hover:text-[#E8E2D8] font-bold underline underline-offset-2">
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
        <div className="glass-card p-6 md:p-8 rounded-[26px] border border-[#C9A876]/35 space-y-6">
          <div className="border-b border-[#5C554C]/60 pb-4">
            <h3 className="text-base font-bold text-[#F5F0E8] flex items-center gap-2">
              <Languages className="w-5 h-5 text-[#C9A876]" />
              Cấu Hình Ngôn Ngữ & Tham Số Nhận Diện Giọng Nói (STT / TTS)
            </h3>
            <p className="text-xs text-[#B8B0A6] mt-1">
              Điều chỉnh ngôn ngữ mặc định và tham số phỏng vấn AI cho toàn bộ hệ thống ca thi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-[20px] bg-[#1C1815]/75 border border-[#5C554C]/60 space-y-3">
              <label className="block font-bold text-[#E8E2D8]">Ngôn Ngữ Mặc Định Cho Ca Thi</label>
              <select className="liquid-input w-full text-xs">
                <option value="vi">Tiếng Việt (vi-VN) - Tối ưu thuật ngữ CNTT / Học thuật</option>
                <option value="en">Tiếng Anh (en-US) - Chuẩn phát âm quốc tế</option>
              </select>
              <p className="text-[11px] text-[#B8B0A6]">Áp dụng cho giọng đọc AI Giám khảo và mô hình chuyển đổi giọng nói sinh viên sang văn bản.</p>
            </div>

            <div className="p-5 rounded-[20px] bg-[#1C1815]/75 border border-[#5C554C]/60 space-y-3">
              <label className="block font-bold text-[#E8E2D8]">Giới Hạn Lượt Hỏi Xoáy Tối Đa Mỗi Câu</label>
              <input 
                type="number" 
                defaultValue={3} 
                min={1} 
                max={5}
                className="liquid-input w-full text-xs"
              />
              <p className="text-[11px] text-[#B8B0A6]">Số lần AI được phép hỏi sâu / làm rõ khi câu trả lời của sinh viên còn mơ hồ.</p>
            </div>

            <div className="p-5 rounded-[20px] bg-[#1C1815]/75 border border-[#5C554C]/60 space-y-3">
              <label className="block font-bold text-[#E8E2D8]">Thời Gian Tối Đa Mỗi Lượt Trả Lời (Giây)</label>
              <input 
                type="number" 
                defaultValue={180} 
                step={30}
                className="liquid-input w-full text-xs"
              />
              <p className="text-[11px] text-[#B8B0A6]">Đồng hồ đếm ngược tự động khóa micro khi sinh viên trả lời quá thời lượng quy định.</p>
            </div>

            <div className="p-5 rounded-[20px] bg-[#1C1815]/75 border border-[#5C554C]/60 space-y-3">
              <label className="block font-bold text-[#E8E2D8]">Chế Độ Chấm Điểm Thẩm Quyền</label>
              <div className="flex items-center gap-2 p-3 rounded-[16px] bg-[#C9A876]/15 border border-[#C9A876]/30 text-[#E8E2D8]">
                <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0" />
                <span className="text-[11px] font-semibold">Giảng viên luôn là người chốt điểm cuối (Bắt buộc)</span>
              </div>
              <p className="text-[11px] text-[#B8B0A6]">AI chỉ cung cấp điểm gợi ý dựa trên Rubric, không tự ý công bố điểm chính thức.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#5C554C]/60 flex justify-end">
            <button className="btn-liquid-gold px-6 py-2.5 text-xs">
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
