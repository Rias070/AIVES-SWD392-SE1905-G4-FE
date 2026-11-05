import React from 'react';

export function StatCard({ icon: Icon, label, value, hint, color = 'sky' }) {
  const colors = {
    sky:    'bg-sky-50 text-sky-600',
    emerald:'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber:  'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{value}</p>
      {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`w-full ${sizes[size]} bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg leading-none">×</button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">{footer}</div>}
      </div>
    </div>
  );
}

export function RoleBadge({ role }) {
  const map = {
    ADMIN:   { label: 'Admin',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    LECTURER:{ label: 'GV',      cls: 'bg-sky-50 text-sky-700 border-sky-200' },
    STUDENT: { label: 'SV',      cls: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  };
  const m = map[role] || { label: role, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  return <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${m.cls}`}>{m.label}</span>;
}

export function StatusDot({ status }) {
  const isActive = status === 'active' || status === 'ACTIVE';
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {isActive ? 'Hoạt động' : 'Chờ'}
    </span>
  );
}
