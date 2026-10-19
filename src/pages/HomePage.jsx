import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  UserPlus,
  LogIn,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Mic,
  Clock,
  Scale,
  ShieldCheck,
  ChevronRight,
  Database
} from 'lucide-react';

export default function HomePage({ onOpenAuth, currentUser, roleConfigs }) {
  const navigate = useNavigate();

  const handleRoleAction = () => {
    if (currentUser) {
      const defaultPath = roleConfigs?.[currentUser.role]?.defaultPath || '/student';
      navigate(defaultPath);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-300">
      {/* ==================== HERO SECTION ==================== */}
      <section className="text-center space-y-5 max-w-4xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Hệ thống Khảo thí Vấn đáp Trực tuyến AI (AIVES)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
          Khảo Thí Vấn Đáp Thông Minh <br />
          <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
            Tương Tác Giọng Nói AI
          </span>
        </h1>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Chuẩn hóa ngân hàng câu hỏi từ giáo trình bằng RAG, phỏng vấn trực tiếp bằng giọng nói thời gian thực và đánh giá minh bạch theo Rubric.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3">
          {!currentUser ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="btn-glacier-primary px-7 py-3 text-sm flex items-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng Ký Tài Khoản</span>
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Đăng Nhập</span>
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRoleAction}
              className="btn-glacier-primary px-8 py-3.5 text-sm flex items-center gap-2.5 shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Vào Không Gian {roleConfigs?.[currentUser.role]?.roleName || currentUser.role}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 4 Feature Badges */}
        <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center gap-2 text-slate-700 font-medium">
            <Mic className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Voice STT & TTS</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center gap-2 text-slate-700 font-medium">
            <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>Sinh Đề RAG</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center gap-2 text-slate-700 font-medium">
            <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Chấm Rubric Chuẩn</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center gap-2 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Lưu Vết Minh Bạch</span>
          </div>
        </div>
      </section>

      {/* ==================== 2 ROLE PORTALS ==================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Card 1: Giảng viên */}
        <div className="p-6 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-col justify-between space-y-5 hover:border-sky-300 transition-colors">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Phân Hệ Giảng Viên</span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Quản Trị Học Liệu, Ngân Hàng Câu Hỏi & Đánh Giá
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Tải tài liệu PDF băm đoạn RAG, cấu hình câu hỏi theo cấp độ Bloom, thẩm định barem Rubric và theo dõi kết quả ca thi.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Nạp học liệu RAG</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Sinh đề AI tự động</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Kiểm duyệt Rubric</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Ngân hàng câu hỏi</span>
              </div>
            </div>
          </div>

          <Link
            to="/questions"
            className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-sky-200 shadow-2xs"
          >
            <span>Vào Cổng Học Liệu Giảng Viên</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Sinh viên */}
        <div className="p-6 rounded-2xl bg-white border border-cyan-100 shadow-xs flex flex-col justify-between space-y-5 hover:border-cyan-300 transition-colors">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>Phân Hệ Sinh Viên</span>
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Phòng Thi Vấn Đáp Trực Tuyến Với AI Examiner
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Kiểm tra thiết bị camera & micro, tham gia phỏng vấn thời gian thực với AI, nhận phản hồi thích ứng và tra cứu bảng điểm.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Kiểm tra Mic & Cam</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Phỏng vấn giọng nói AI</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Hỏi xoáy thích ứng</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Bảng điểm & Transcript</span>
              </div>
            </div>
          </div>

          <Link
            to="/student"
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-cyan-200 shadow-2xs"
          >
            <span>Vào Dashboard Sinh Viên</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ==================== WORKFLOW TIMELINE ==================== */}
      <section className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Quy Trình Thi Vấn Đáp 4 Bước</h2>
            <p className="text-xs text-slate-500 mt-0.5">Quy trình khép kín từ chuẩn bị đề thi đến công bố kết quả</p>
          </div>
          <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
            AIVES Flow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">01</span>
            <h4 className="font-bold text-slate-900">Nạp Học Liệu RAG</h4>
            <p className="text-[11px] text-slate-500 leading-snug">Giảng viên tải tài liệu môn học, AI tự động trích xuất ngân hàng câu hỏi & barem.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">02</span>
            <h4 className="font-bold text-slate-900">Kiểm Tra Thiết Bị</h4>
            <p className="text-[11px] text-slate-500 leading-snug">Sinh viên kiểm tra micro, camera và đường truyền trước khi vào phòng thi.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">03</span>
            <h4 className="font-bold text-slate-900">Thi Vấn Đáp AI</h4>
            <p className="text-[11px] text-slate-500 leading-snug">AI đọc câu hỏi, sinh viên trả lời trực tiếp; AI tự động hỏi xoáy làm rõ luận điểm.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">04</span>
            <h4 className="font-bold text-slate-900">Chấm Rubric & Chốt Điểm</h4>
            <p className="text-[11px] text-slate-500 leading-snug">AI gợi ý điểm theo tiêu chí; Hội đồng giảng viên duyệt và công bố bảng điểm.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
