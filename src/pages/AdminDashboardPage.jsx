import React from 'react';
import { ShieldCheck, Users, Activity, Database, Server, UserCheck, CheckCircle, AlertTriangle, Key } from 'lucide-react';

export default function AdminDashboardPage() {
  const usersList = [
    {
      id: 'usr-1',
      code: 'ADM-001',
      name: 'AIVES Administrator',
      email: 'admin@aives.edu.vn',
      role: 'ADMIN',
      status: 'ACTIVE',
      lastActive: 'Hôm nay, 10:24',
    },
    {
      id: 'usr-2',
      code: 'LEC-001',
      name: 'Dr. Nguyen Van Giang',
      email: 'lecturer@aives.edu.vn',
      role: 'LECTURER',
      status: 'ACTIVE',
      lastActive: 'Hôm qua, 16:40',
    },
    {
      id: 'usr-3',
      code: 'STU-001',
      name: 'Tran Thi Mai',
      email: 'student@aives.edu.vn',
      role: 'STUDENT',
      status: 'ACTIVE',
      lastActive: 'Hôm nay, 09:15',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Feature 3
            </span>
            <span className="text-xs text-gray-400">Hạ tầng & Phân quyền RBAC</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-1.5 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            Quản Trị Hệ Thống & Phân Quyền Tài Khoản
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Theo dõi trạng thái dịch vụ, cấu hình AI engine, quản lý tài khoản Giảng viên và Thí sinh.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Tổng ca thi đã tổ chức</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">1,248</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            +14.2% so với học kỳ trước
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Tài khoản thí sinh & GV</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">3,850</div>
          <div className="text-xs text-cyan-400">3 roles: ADMIN, LECTURER, STUDENT</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Vector Kho Tri Thức RAG</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">15,400</div>
          <div className="text-xs text-purple-400">pgvector pg16 (1536 dimensions)</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Độ chính xác chấm điểm AI</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">96.8%</div>
          <div className="text-xs text-emerald-400">Tương quan cao với GV chấm chéo</div>
        </div>
      </div>

      {/* System Service Health Status */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-400" /> Trạng thái hạ tầng dịch vụ AIVES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center justify-between">
            <div className="text-xs">
              <div className="font-semibold text-white">PostgreSQL pgvector</div>
              <div className="text-gray-400 text-[11px]">Port 5432 / aives_db</div>
            </div>
            <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Running
            </span>
          </div>

          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center justify-between">
            <div className="text-xs">
              <div className="font-semibold text-white">Spring Security JWT</div>
              <div className="text-gray-400 text-[11px]">Bearer Token / Nimbus JOSE</div>
            </div>
            <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Active
            </span>
          </div>

          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center justify-between">
            <div className="text-xs">
              <div className="font-semibold text-white">Payment Gateways</div>
              <div className="text-gray-400 text-[11px]">MoMo & VNPay Sandboxes</div>
            </div>
            <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* User Accounts Management Table */}
      <div className="glass-card rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" /> Danh Sách Tài Khoản Mẫu (DataInitializer)
          </h2>
          <span className="text-xs text-gray-400">Mật khẩu mặc định khởi tạo qua BCrypt</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Mã / ID</th>
                <th className="px-5 py-3 font-semibold">Họ và Tên</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Vai Trò (Role)</th>
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
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">
                      Phân quyền →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
