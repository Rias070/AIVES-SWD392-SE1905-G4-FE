import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, BookOpen, Settings, LogOut, Shield, ChevronLeft } from 'lucide-react';

const NAV = [
  { to: '/admin/users',       icon: Users,    label: 'Tài khoản' },
  { to: '/admin/assignments', icon: BookOpen, label: 'Phân công' },
  { to: '/admin/settings',    icon: Settings, label: 'Cấu hình' },
];

export default function AdminLayout({ currentUser, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - hẹp, chỉ icon + label ngắn */}
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-4 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 leading-none">Admin</p>
            <p className="text-[10px] text-slate-500 mt-1">AIVES Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <n.icon className="w-4 h-4" />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + Back */}
        <div className="p-2 border-t border-slate-200 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Về trang chính</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">
              {currentUser?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">{currentUser?.name || 'Admin'}</p>
            </div>
            <button onClick={onLogout} className="text-slate-400 hover:text-rose-600 p-1" title="Đăng xuất">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet context={{ currentUser }} />
      </main>
    </div>
  );
}
