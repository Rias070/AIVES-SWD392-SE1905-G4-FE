import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, UserPlus, Search, Upload, Edit2, Trash2, FileSpreadsheet, Plus } from 'lucide-react';
import { StatCard, PageHeader, EmptyState, Modal, RoleBadge, StatusDot } from './adminComponents';

const SEED = [
  { id: 'AD-00012', name: 'Nguyễn Văn An',  email: 'annv.sys@fpt.edu.vn',    role: 'ADMIN',    status: 'active',  assigned: 'Toàn quyền' },
  { id: 'GV-10294', name: 'TS. Lê Quang',   email: 'quanglt@fpt.edu.vn',     role: 'LECTURER', status: 'active',  assigned: 'CS301, AI204' },
  { id: 'GV-10042', name: 'ThS. Trần Hạnh', email: 'hanhtt@fpt.edu.vn',      role: 'LECTURER', status: 'active',  assigned: 'SE401' },
  { id: 'SE170291',name: 'Bùi Quang Nhật',  email: 'nhatbqse170291@fpt.edu.vn', role: 'STUDENT', status: 'active',  assigned: 'SE1704 - AI204' },
  { id: 'SE164821',name: 'Đặng Minh Khôi',  email: 'khoidmse164821@fpt.edu.vn', role: 'STUDENT', status: 'pending', assigned: 'SE1601 - CS301' },
  { id: 'AI170644',name: 'Vũ Thùy Linh',    email: 'linhvt_ai17@fpt.edu.vn', role: 'STUDENT', status: 'active',  assigned: 'AI1702 - AI204' },
];

const TABS = [
  { key: 'ALL',      label: 'Tất cả' },
  { key: 'ADMIN',    label: 'Admin' },
  { key: 'LECTURER', label: 'Giảng viên' },
  { key: 'STUDENT',  label: 'Sinh viên' },
];

export default function UsersPage() {
  const { currentUser } = useOutletContext();
  const [users, setUsers]   = useState(SEED);
  const [tab, setTab]       = useState('ALL');
  const [q, setQ]           = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [edit, setEdit]     = useState(null);
  const [openDel, setOpenDel]   = useState(null);

  const filtered = users.filter((u) => {
    if (tab !== 'ALL' && u.role !== tab) return false;
    if (q && !`${u.name} ${u.email} ${u.id}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: users.length,
    ADMIN: users.filter((u) => u.role === 'ADMIN').length,
    LECTURER: users.filter((u) => u.role === 'LECTURER').length,
    STUDENT: users.filter((u) => u.role === 'STUDENT').length,
  };

  const handleSave = (data) => {
    if (edit) {
      setUsers((prev) => prev.map((u) => (u.id === edit.id ? { ...u, ...data } : u)));
    } else {
      setUsers((prev) => [{ ...data, id: `USR-${Date.now().toString().slice(-6)}` }, ...prev]);
    }
    setOpenForm(false); setEdit(null);
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== openDel.id));
    setOpenDel(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Tài khoản"
        subtitle={`${users.length} người dùng trong hệ thống`}
        action={
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Import Excel
            </button>
            <button
              onClick={() => { setEdit(null); setOpenForm(true); }}
              className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Thêm người dùng
            </button>
          </div>
        }
      />

      {/* Stats - gọn 1 hàng */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard icon={Users}    label="Tổng"         value={counts.all}                color="sky" />
        <StatCard icon={Users}    label="Sinh viên"    value={counts.STUDENT}            color="cyan" hint="Đang hoạt động" />
        <StatCard icon={Users}    label="Giảng viên"   value={counts.LECTURER}           color="emerald" />
        <StatCard icon={Users}    label="Admin"        value={counts.ADMIN}              color="amber" />
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="px-4 pt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tab === t.key ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.label} <span className="text-slate-400 font-normal">({counts[t.key] ?? counts.all})</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm tên, email, mã..."
              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm w-64 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Bảng gọn */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Người dùng</th>
                <th className="px-4 py-2.5 text-left font-semibold">Vai trò</th>
                <th className="px-4 py-2.5 text-left font-semibold hidden md:table-cell">Phân công</th>
                <th className="px-4 py-2.5 text-left font-semibold">Trạng thái</th>
                <th className="px-4 py-2.5 text-right font-semibold w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={Search} title="Không có kết quả" hint="Thử thay đổi bộ lọc hoặc từ khóa" />
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{u.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell">{u.assigned}</td>
                    <td className="px-4 py-3"><StatusDot status={u.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => { setEdit(u); setOpenForm(true); }}
                          className="p-1.5 rounded-md text-slate-500 hover:text-sky-600 hover:bg-sky-50"
                          title="Sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setOpenDel(u)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 text-[11px] text-slate-500 border-t border-slate-100 flex justify-between">
          <span>Hiển thị {filtered.length} / {users.length}</span>
          <span>Trang 1 / 1</span>
        </div>
      </div>

      {/* Modal thêm/sửa */}
      <UserForm
        open={openForm}
        edit={edit}
        onClose={() => { setOpenForm(false); setEdit(null); }}
        onSave={handleSave}
      />

      {/* Modal xóa */}
      <Modal
        open={!!openDel}
        onClose={() => setOpenDel(null)}
        title="Xóa tài khoản?"
        size="sm"
        footer={
          <>
            <button onClick={() => setOpenDel(null)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Hủy</button>
            <button onClick={handleDelete} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white">Xóa</button>
          </>
        }
      >
        <p className="text-sm text-slate-600">Tài khoản <strong>{openDel?.name}</strong> sẽ bị xóa vĩnh viễn.</p>
      </Modal>
    </div>
  );
}

function UserForm({ open, edit, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'STUDENT', status: 'active', assigned: '' });

  React.useEffect(() => {
    if (edit) setForm({ ...edit });
    else setForm({ name: '', email: '', role: 'STUDENT', status: 'active', assigned: '' });
  }, [edit, open]);

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={edit ? 'Sửa tài khoản' : 'Thêm người dùng'}
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Hủy</button>
          <button form="user-form" type="submit" className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white">
            {edit ? 'Lưu' : 'Tạo'}
          </button>
        </>
      }
    >
      <form id="user-form" onSubmit={submit} className="space-y-3 text-sm">
        <Field label="Họ và tên" required>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vai trò">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="STUDENT">Sinh viên</option>
              <option value="LECTURER">Giảng viên</option>
              <option value="ADMIN">Admin</option>
            </select>
          </Field>
          <Field label="Trạng thái">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="active">Hoạt động</option>
              <option value="pending">Chờ xác thực</option>
            </select>
          </Field>
        </div>
        <Field label="Phân công">
          <input
            value={form.assigned}
            onChange={(e) => setForm({ ...form, assigned: e.target.value })}
            placeholder="VD: CS301, SE1905..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </Field>
      </form>
    </Modal>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label}{required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
