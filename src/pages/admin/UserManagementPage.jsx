import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  BookOpen,
  GraduationCap,
  Search,
  Filter,
  Plus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  Check,
  X,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  ExternalLink,
  Edit,
  Trash2,
  Lock
} from 'lucide-react';

export default function UserManagementPage() {
  const navigate = useNavigate();

  // Filters & Tabs
  const [roleTab, setRoleTab] = useState('ALL'); // 'ALL' | 'ADMIN' | 'LECTURER' | 'STUDENT'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState({
    id: 'GV-10294',
    name: 'TS. Lê Quang',
    email: 'quanglt@fpt.edu.vn',
    title: 'Giám khảo trưởng',
    examsCount: 32,
    avatar: 'LQ',
    courses: [
      {
        code: 'CS301',
        title: 'Cấu trúc dữ liệu & Thuật toán nâng cao',
        classes: '03 lớp (SE1701, SE1702, SE1704) • 84 sinh viên',
        canApproveRAG: true,
        canEditRubric: true,
      },
      {
        code: 'AI204',
        title: 'Nhập môn Xử lý Ngôn ngữ Tự nhiên & LLM',
        classes: '02 lớp (AI1701) • 62 sinh viên',
        canApproveRAG: true,
        canEditRubric: true,
      },
    ],
  });

  const users = [
    {
      id: 'GV-10294',
      name: 'TS. Lê Quang',
      email: 'quanglt@fpt.edu.vn',
      role: 'LECTURER',
      roleBadge: 'Giảng viên / GK',
      roleBadgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      assigned: 'CS301, AI204',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'LQ',
    },
    {
      id: 'GV-10042',
      name: 'ThS. Trần Thị Hạnh',
      email: 'hanhtt@fpt.edu.vn',
      role: 'LECTURER',
      roleBadge: 'Giảng viên / GK',
      roleBadgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      assigned: 'SE401 (Kiến trúc PM)',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'TH',
    },
    {
      id: 'AD-00012',
      name: 'Nguyễn Văn An',
      email: 'annv.sys@fpt.edu.vn',
      role: 'ADMIN',
      roleBadge: 'System Admin',
      roleBadgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      assigned: 'Toàn quyền hệ thống',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'NA',
    },
    {
      id: 'SE170291',
      name: 'Bùi Quang Nhật',
      email: 'nhatbqse170291@fpt.edu.vn',
      role: 'STUDENT',
      roleBadge: 'Sinh viên (K17)',
      roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      assigned: 'Lớp SE1704 - AI204',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'BN',
    },
    {
      id: 'SE164821',
      name: 'Đặng Minh Khôi',
      email: 'khoidmse164821@fpt.edu.vn',
      role: 'STUDENT',
      roleBadge: 'Sinh viên (K16)',
      roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      assigned: 'Lớp SE1601 - CS301',
      status: 'pending',
      statusText: 'Chờ xác thực SSO',
      avatarText: 'DK',
    },
    {
      id: 'AI170644',
      name: 'Vũ Thùy Linh',
      email: 'linhvt_ai17@fpt.edu.vn',
      role: 'STUDENT',
      roleBadge: 'Sinh viên (K17)',
      roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      assigned: 'Lớp AI1702 - AI204',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'VL',
    },
  ];

  const filteredUsers = users.filter((u) => {
    if (roleTab !== 'ALL' && u.role !== roleTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Breadcrumb & Action bar */}
      <div className="p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Cổng Quản trị viên</span>
            <span className="text-slate-300">›</span>
            <span className="text-sky-700 font-semibold">Quản lý người dùng & Phân công môn học</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 mt-1">
            Phân quyền hệ thống & Phân công giảng dạy
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Đang mở trình import danh sách sinh viên / giảng viên từ Excel (.xlsx)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import danh sách Excel</span>
          </button>

          <button
            onClick={() => alert('Mở form thêm người dùng mới')}
            className="btn-glacier-primary px-3.5 py-1.5 text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm người dùng mới</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">TỔNG SỐ NGƯỜI DÙNG</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">3,420</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +12.4%
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Sinh viên: <strong className="text-slate-800">3,250</strong></span>
            <span>•</span>
            <span>Giảng viên: <strong className="text-slate-800">150</strong></span>
            <span>•</span>
            <span>Admin: <strong className="text-slate-800">20</strong></span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">TỶ LỆ KÍCH HOẠT TÀI KHOẢN</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">98.4%</span>
            <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-mono">
              SSO FPT Edu Sync
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Đã kích hoạt: <strong className="text-emerald-700">3,365</strong></span>
            <span>•</span>
            <span>Chờ xác thực: <strong className="text-amber-700">55</strong></span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">MÔN HỌC ĐÃ PHÂN CÔNG</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">48 / 48</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Hoàn tất
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>RAG Học liệu: <strong className="text-sky-700">48 Ready</strong></span>
            <span>•</span>
            <span>Barem chấm AI: <strong className="text-emerald-700">Đã chuẩn hóa</strong></span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Table (8 cols) / Assignment Drawer (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT TABLE (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 md:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Danh sách tài khoản hệ thống
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    3,420 bản ghi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Phân quyền vai trò, quản lý tài khoản định danh sinh viên và hội đồng chấm thi.
                </p>
              </div>

              {/* Role filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setRoleTab('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${roleTab === 'ALL' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setRoleTab('ADMIN')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${roleTab === 'ADMIN' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Admin (20)
                </button>
                <button
                  onClick={() => setRoleTab('LECTURER')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${roleTab === 'LECTURER' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Giảng viên (150)
                </button>
                <button
                  onClick={() => setRoleTab('STUDENT')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${roleTab === 'STUDENT' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Sinh viên (3.2k)
                </button>
              </div>
            </div>

            {/* Filter Search Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="relative sm:col-span-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên, MSSV, email FPT..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <select className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none">
                <option>Viện Trí tuệ Nhân tạo</option>
                <option>Khoa Kỹ thuật Phần mềm</option>
              </select>

              <select className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none">
                <option>Đang hoạt động (Active)</option>
                <option>Chờ kích hoạt</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-3">Mã định danh</th>
                    <th className="pb-3 px-3">Họ và tên</th>
                    <th className="pb-3 px-3">Email FPT/Edu</th>
                    <th className="pb-3 px-3">Vai trò</th>
                    <th className="pb-3 px-3">Môn phụ trách / Lớp</th>
                    <th className="pb-3 pl-3 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isSelected = selectedLecturer?.id === u.id;
                    return (
                      <tr
                        key={u.id}
                        onClick={() => {
                          if (u.role === 'LECTURER') {
                            setSelectedLecturer({
                              id: u.id,
                              name: u.name,
                              email: u.email,
                              title: 'Giám khảo trưởng',
                              examsCount: 32,
                              avatar: u.avatarText,
                              courses: [
                                {
                                  code: 'CS301',
                                  title: 'Cấu trúc dữ liệu & Thuật toán nâng cao',
                                  classes: '03 lớp • 84 sinh viên',
                                  canApproveRAG: true,
                                  canEditRubric: true,
                                },
                              ],
                            });
                          }
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-sky-50/80' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3.5 pr-3 font-mono font-bold text-sky-700">
                          {u.id}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                              {u.avatarText}
                            </div>
                            <span className="font-bold text-slate-900">{u.name}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                          {u.email}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${u.roleBadgeColor}`}>
                            {u.roleBadge}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-slate-700 font-medium">
                          {u.assigned}
                        </td>

                        <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                          {u.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Chờ SSO
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Hiển thị 6 / trang trong tổng số 3,420 người dùng</span>
              <div className="flex items-center gap-1 font-mono">
                <button className="px-2 py-1 rounded border border-slate-200 bg-slate-50">‹</button>
                <button className="px-2.5 py-1 rounded bg-sky-600 text-white font-bold">1</button>
                <button className="px-2.5 py-1 rounded border border-slate-200">2</button>
                <button className="px-2.5 py-1 rounded border border-slate-200">3</button>
                <button className="px-2 py-1 rounded border border-slate-200 bg-slate-50">›</button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ASSIGNMENT DRAWER (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  HỌC KỲ: SPRING 2026
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Bảng phân công giảng dạy</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Đang chỉnh sửa
              </span>
            </div>

            {/* Lecturer Profile Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {selectedLecturer.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{selectedLecturer.name}</h4>
                  <span className="text-[10px] text-sky-700 font-semibold block">{selectedLecturer.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedLecturer.email}</span>
                </div>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500">
                <span>Mã: {selectedLecturer.id}</span>
                <span className="block font-bold text-slate-700">Ca thi: {selectedLecturer.examsCount} ca</span>
              </div>
            </div>

            {/* Assigned Courses List */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                MÔN HỌC & HỌC PHẦN ĐƯỢC PHÂN CÔNG
              </span>

              {selectedLecturer.courses.map((c, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                          {c.code}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">{c.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{c.classes}</p>
                    </div>
                    <button className="text-slate-400 hover:text-rose-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Permissions checkboxes */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        defaultChecked={c.canApproveRAG}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-[11px]">Phân quyền duyệt học liệu RAG (Knowledge Hub)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        defaultChecked={c.canEditRubric}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-[11px]">Hiệu chỉnh Barem chấm điểm vấn đáp AI (Rubric Editor)</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Add course dropdown */}
            <button
              onClick={() => alert('Thêm học phần mới vào danh sách giảng dạy của giảng viên')}
              className="w-full py-2.5 rounded-xl border border-dashed border-sky-300 hover:bg-sky-50 text-xs font-semibold text-sky-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Chọn môn học bổ sung để phân công...</span>
            </button>

            {/* Audit log notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Tài khoản này được cấp quyền ký số bảo mật trên mô hình AI Viva Voce RAG. Mọi thay đổi barem chấm sẽ được ghi nhận vào Audit Log của Viện Đào Tạo.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => alert('Phân công môn học đã được cập nhật thành công!')}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Lưu phân công môn học
              </button>
              <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
