import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bot, Database, Mic, ShieldCheck, Sparkles, BookOpen, ExternalLink, Cpu, ChevronRight, GraduationCap } from 'lucide-react';
import QuestionBankPage from './pages/QuestionBankPage';
import VivaRoomPage from './pages/VivaRoomPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function NavigationBar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Ngân Hàng Câu Hỏi (RAG)', path: '/questions', icon: Database, badge: 'Feature 1' },
    { name: 'Phòng Thi Vấn Đáp AI', path: '/viva', icon: Mic, badge: 'Feature 2' },
    { name: 'Quản Trị Hệ Thống', path: '/admin', icon: ShieldCheck, badge: 'Feature 3' },
  ];

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white font-['Outfit']">
                AIVES
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Viva Exam AI
              </span>
            </div>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 text-indigo-400" />}
                  {link.name}
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-mono">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Swagger */}
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-all"
            >
              <span>Swagger API</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  const featureCards = [
    {
      title: 'Ngân Hàng Câu Hỏi & pgvector RAG',
      featureNumber: 'Feature 1',
      description: 'Quản lý kho câu hỏi thi vấn đáp, hỗ trợ tìm kiếm ngữ nghĩa theo Vector Embeddings 1536 chiều và gắn kết bộ tiêu chí Rubric chuẩn xác.',
      icon: Database,
      link: '/questions',
      color: 'from-indigo-600/20 to-indigo-900/10',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'Phòng Thi Vấn Đáp AI Thời Gian Thực',
      featureNumber: 'Feature 2',
      description: 'Môi trường thi trực tuyến có AI Giám Khảo tương tác giọng nói, chuyển đổi giọng nói thành văn bản (STT) và chấm điểm tự động tức thì.',
      icon: Mic,
      link: '/viva',
      color: 'from-cyan-600/20 to-cyan-900/10',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Quản Trị Hệ Thống & Phân Quyền RBAC',
      featureNumber: 'Feature 3',
      description: 'Quản trị viên theo dõi trạng thái cụm dịch vụ CSDL pgvector, quản lý tài khoản 3 cấp độ ADMIN, LECTURER, STUDENT và giám sát ca thi.',
      icon: ShieldCheck,
      link: '/admin',
      color: 'from-purple-600/20 to-purple-900/10',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          AIVES Scaffold Boilerplate V1.0 Ready
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] leading-tight">
          AI-powered <span className="gradient-text">Viva Exam System</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
          Nền tảng thi vấn đáp tự động ứng dụng trí tuệ nhân tạo. Kế thừa hạ tầng kỹ thuật hiện đại: Spring Boot 3, PostgreSQL tích hợp pgvector, bảo mật JWT Bearer, cùng giao diện React 18 & Tailwind CSS.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/viva"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25"
          >
            <Mic className="w-4 h-4" /> Trải Nghiệm Phòng Thi AI
          </Link>
          <Link
            to="/questions"
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-gray-200 font-semibold text-sm rounded-xl border border-gray-700 transition-all"
          >
            <Database className="w-4 h-4 text-indigo-400" /> Ngân Hàng RAG
          </Link>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`glass-card p-6 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} hover:scale-[1.02] transition-all group flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gray-900/80 border border-gray-700 flex items-center justify-center ${card.iconColor}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-900 text-gray-300 border border-gray-800 font-mono">
                  {card.featureNumber}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {card.title}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-800/60 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
              <span>Khám phá tính năng</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Tech Stack Indicator */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" /> Hạ tầng kỹ thuật đã khởi tạo hoàn tất
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
            <span className="font-bold text-white block">Spring Boot 3</span>
            <span className="text-[10px] text-gray-400">Java 17 & WebMVC</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
            <span className="font-bold text-white block">PostgreSQL 16</span>
            <span className="text-[10px] text-gray-400">pgvector Extension</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
            <span className="font-bold text-white block">Spring Security</span>
            <span className="text-[10px] text-gray-400">JWT & Nimbus JOSE</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
            <span className="font-bold text-white block">React 18 + Vite</span>
            <span className="text-[10px] text-gray-400">Fast Bundling</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
            <span className="font-bold text-white block">Tailwind CSS</span>
            <span className="text-[10px] text-gray-400">Modern Dark Theme</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
            <span className="font-bold text-white block">Payment Ready</span>
            <span className="text-[10px] text-gray-400">MoMo & VNPay</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100">
        <NavigationBar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questions" element={<QuestionBankPage />} />
            <Route path="/viva" element={<VivaRoomPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <footer className="glass-panel border-t border-gray-800 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            <p>© 2026 AIVES - AI-powered Viva Exam System. All rights reserved.</p>
            <p className="mt-1 text-gray-600">Được tối ưu hóa cho công tác khảo thí và thi vấn đáp tự động ứng dụng AI.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
