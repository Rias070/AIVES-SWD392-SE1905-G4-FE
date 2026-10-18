import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, Plus, X, Check, Search } from 'lucide-react';
import { PageHeader, EmptyState, RoleBadge } from './adminComponents';

const COURSES = [
  { code: 'SWD392', title: 'Software Architecture & Design' },
  { code: 'SWP391', title: 'Software Development Project' },
  { code: 'PRJ301', title: 'Java Web Applications' },
  { code: 'ML101',  title: 'Machine Learning Fundamentals' },
  { code: 'CS301',  title: 'Cấu trúc dữ liệu & Thuật toán' },
  { code: 'AI204',  title: 'Xử lý Ngôn ngữ Tự nhiên & LLM' },
  { code: 'SE401',  title: 'Kiến trúc Phần mềm Nâng cao' },
];

const SEED_LECTURERS = [
  {
    id: 'GV-10294', name: 'TS. Lê Quang', email: 'quanglt@fpt.edu.vn', courses: ['CS301', 'AI204'],
  },
  {
    id: 'GV-10042', name: 'ThS. Trần Hạnh', email: 'hanhtt@fpt.edu.vn', courses: ['SE401'],
  },
  {
    id: 'GV-10310', name: 'TS. Phạm Đức Anh', email: 'anhpd@fpt.edu.vn', courses: ['SWD392', 'PRJ301'],
  },
];

export default function AssignmentsPage() {
  const { currentUser } = useOutletContext();
  const [lecturers, setLecturers] = useState(SEED_LECTURERS);
  const [selected, setSelected] = useState(SEED_LECTURERS[0]);
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [pickCourse, setPickCourse] = useState('');

  const filtered = lecturers.filter((l) => `${l.name} ${l.email}`.toLowerCase().includes(q.toLowerCase()));

  const toggle = (code) => {
    setSelected((prev) => ({
      ...prev,
      courses: prev.courses.includes(code) ? prev.courses.filter((c) => c !== code) : [...prev.courses, code],
    }));
  };

  const save = () => {
    setLecturers((prev) => prev.map((l) => (l.id === selected.id ? selected : l)));
    setAdding(false);
  };

  const assignedCourses = COURSES.filter((c) => selected.courses.includes(c.code));
  const availableCourses = COURSES.filter((c) => !selected.courses.includes(c.code));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Phân công giảng viên"
        subtitle={`${lecturers.length} giảng viên · ${COURSES.length} môn học`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: danh sách GV */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm giảng viên..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
              {filtered.length === 0 ? (
                <EmptyState icon={Search} title="Không có GV" />
              ) : (
                filtered.map((l) => {
                  const isSel = selected.id === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setSelected(l)}
                      className={`w-full text-left px-3 py-3 flex items-center gap-3 transition border-b border-slate-100 ${
                        isSel ? 'bg-sky-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSel ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {l.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{l.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{l.email}</p>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <span className="text-[10px] text-slate-500">{l.courses.length} môn</span>
                          {l.courses.slice(0, 2).map((c) => (
                            <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">{c}</span>
                          ))}
                          {l.courses.length > 2 && <span className="text-[10px] text-slate-400">+{l.courses.length - 2}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: chi tiết phân công */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            {/* Header GV */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-base font-bold">
                {selected.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-slate-900">{selected.name}</h2>
                <p className="text-xs text-slate-500">{selected.email} · {selected.id}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-sky-700 tabular-nums">{selected.courses.length}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">môn phụ trách</p>
              </div>
            </div>

            {/* Danh sách môn đã phân công */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Môn đang phụ trách</h3>
                <button
                  onClick={() => setAdding(true)}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm môn
                </button>
              </div>

              {assignedCourses.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="Chưa có môn nào"
                  hint="Bấm Thêm môn để phân công"
                  action={
                    <button onClick={() => setAdding(true)} className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold flex items-center gap-1 mx-auto">
                      <Plus className="w-3.5 h-3.5" /> Thêm môn ngay
                    </button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {assignedCourses.map((c) => (
                    <div key={c.code} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-sky-300 group">
                      <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-mono font-bold text-xs">
                        {c.code.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono font-bold text-xs text-sky-700">{c.code}</p>
                        <p className="text-[11px] text-slate-600 truncate">{c.title}</p>
                      </div>
                      <button
                        onClick={() => toggle(c.code)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
                        title="Bỏ phân công"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer save */}
            {assignedCourses.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setSelected(SEED_LECTURERS.find((l) => l.id === selected.id))}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  onClick={save}
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Lưu phân công
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal thêm môn */}
      {adding && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setAdding(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Thêm môn cho {selected.name}</h3>
              <button onClick={() => setAdding(false)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">×</button>
            </div>
            <div className="p-5 space-y-2 max-h-80 overflow-y-auto">
              {availableCourses.length === 0 ? (
                <EmptyState icon={BookOpen} title="Đã phân công hết" hint="Tất cả môn đã được gán" />
              ) : (
                availableCourses.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => toggle(c.code)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition"
                  >
                    <Plus className="w-4 h-4 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-bold text-xs text-sky-700">{c.code}</p>
                      <p className="text-xs text-slate-600 truncate">{c.title}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Đóng</button>
              <button onClick={save} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
