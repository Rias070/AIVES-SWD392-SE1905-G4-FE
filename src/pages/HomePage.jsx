import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  UserPlus,
  LogIn,
  LayoutDashboard,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Mic,
  Clock,
  Scale,
  ShieldCheck,
  Cpu,
  FileCheck,
  Video,
  Award,
  ChevronRight
} from 'lucide-react';

export default function HomePage({ onOpenAuth, currentUser, roleConfigs }) {
  const navigate = useNavigate();

  const handleRoleAction = () => {
    if (currentUser) {
      const defaultPath = roleConfigs?.[currentUser.role]?.defaultPath || '/student';
      navigate(defaultPath);
    } else if (onOpenAuth) {
      onOpenAuth('register');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-300">
      {/* ==================== HERO SECTION ==================== */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200/90 text-xs font-semibold text-sky-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Hệ Thống Thi Vấn Đáp Trực Tuyến Ứng Dụng Trí Tuệ Nhân Tạo (AIVES)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Nền Tảng Vấn Đáp Thông Minh <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">AIVES</span>
        </h1>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Hệ thống khảo thí vấn đáp trực tuyến với AI tương tác giọng nói, chuẩn hóa câu hỏi theo tài liệu và hỗ trợ chấm điểm minh bạch.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3">
          {!currentUser ? (
            <>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('register') : navigate('/register')}
                  className="btn-glacier-primary px-8 py-3.5 text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng Ký Trải Nghiệm</span>
                </button>

                <Link
                  to="/login"
                  onClick={(e) => {
                    if (onOpenAuth) {
                      e.preventDefault();
                      onOpenAuth('login');
                    }
                  }}
                  className="px-7 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-xs flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Đăng Nhập</span>
                </Link>
              </div>

              <p className="text-xs text-slate-500">
                Chưa có tài khoản trường?{' '}
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('register') : navigate('/register')}
                  className="text-sky-600 hover:text-sky-700 font-semibold underline underline-offset-2"
                >
                  Đăng ký ngay bây giờ
                </button>
              </p>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleRoleAction}
                className="btn-glacier-primary px-8 py-3.5 text-sm flex items-center gap-2.5 shadow-lg shadow-sky-500/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Vào Không Gian {roleConfigs?.[currentUser.role]?.roleName || currentUser.role}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-xs flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-sky-600" />
                <span>Xem Trung Tâm Khảo Thí</span>
              </Link>
            </div>
          )}
        </div>

        {/* Feature Pills */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs">
          <div className="p-3 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs flex items-center justify-center gap-2 text-slate-700 font-medium">
            <Mic className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Voice STT & TTS Chuẩn</span>
          </div>
          <div className="p-3 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs flex items-center justify-center gap-2 text-slate-700 font-medium">
            <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>AI Hỏi Xoáy Thích Ứng</span>
          </div>
          <div className="p-3 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs flex items-center justify-center gap-2 text-slate-700 font-medium">
            <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Chấm Rubric Khách Quan</span>
          </div>
          <div className="p-3 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs flex items-center justify-center gap-2 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Lưu Vết Ca Thi Minh Bạch</span>
          </div>
        </div>
      </section>

      {/* ==================== PROBLEM & SOLUTION SECTION ==================== */}
      <section id="about" className="glacier-light-panel p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-glacier-panel space-y-6 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Bối Cảnh & Giá Trị Thực Tiễn
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Tại Sao Cần Giải Pháp Vấn Đáp Thông Minh?
          </h2>
          <p className="text-xs text-slate-500">
            Thi vấn đáp (Viva Voice) đánh giá năng lực thực tế, nhưng đối mặt với nhiều rào cản tổ chức truyền thống.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Traditional Challenges */}
          <div className="p-5 md:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-amber-900">
                Thách Thức Của Thi Truyền Thống
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong className="text-slate-900">Tốn thời gian:</strong> Quá trình hỏi thi trực tiếp kéo dài nhiều ngày, quá tải cho hội đồng.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong className="text-slate-900">Khó chuẩn hóa:</strong> Khác biệt về độ khó câu hỏi và cách hỏi giữa các phòng thi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong className="text-slate-900">Giới hạn quy mô:</strong> Khó triển khai đồng thời cho hàng nghìn sinh viên.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong className="text-slate-900">Khó đối chiếu:</strong> Thiếu bản gỡ băng chi tiết khi có phản hồi điểm.</span>
              </li>
            </ul>
          </div>

          {/* AIVES Solutions */}
          <div className="p-5 md:p-6 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-sky-900">
                Giải Pháp Từ Hệ Thống AIVES
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Sinh câu hỏi theo giáo trình:</strong> AI trích xuất câu hỏi bám sát tài liệu môn học (RAG).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">AI phỏng vấn thích ứng:</strong> Đặt câu hỏi và làm rõ theo câu trả lời của thí sinh.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Đánh giá theo Rubric:</strong> Đề xuất điểm số khách quan theo barem định trước.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Minh bạch ca thi:</strong> Lưu bản ghi âm, transcript và gợi ý điểm đối chiếu.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ==================== CORE FEATURES BY ROLE ==================== */}
      <section id="features" className="space-y-6 scroll-mt-24">
        <div className="text-center space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Các Phân Hệ Tính Năng Trọng Tâm
          </h2>
          <p className="text-xs text-slate-500">
            Trải nghiệm chuyên biệt dành riêng cho Giảng viên và Sinh viên khảo thí
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Giảng viên */}
          <div className="glacier-light-panel p-6 md:p-7 rounded-3xl border border-sky-200/80 shadow-glacier-card flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wide">
                <BookOpen className="w-4 h-4" />
                Dành cho Giảng Viên
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">
                  Quản Lý Học Liệu RAG & Ngân Hàng Câu Hỏi
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Chuẩn bị đề thi vấn đáp thông minh theo thang Bloom và chuẩn hóa barem chấm điểm Rubric.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Nạp tài liệu giáo trình PDF làm tri thức RAG</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Phân loại câu hỏi theo 4 cấp độ Bloom</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Thiết lập barem điểm Rubric chi tiết từng tiêu chí</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Toàn quyền duyệt, sửa đổi và chốt điểm sau ca thi</span>
                </div>
              </div>
            </div>

            <Link
              to="/questions"
              className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-sky-200/80 shadow-2xs"
            >
              <span>Xem Cổng Học Liệu & Đề Thi</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Sinh viên */}
          <div className="glacier-light-panel p-6 md:p-7 rounded-3xl border border-cyan-200/80 shadow-glacier-card flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-wide">
                <GraduationCap className="w-4 h-4" />
                Dành cho Sinh Viên
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">
                  Phòng Thi Vấn Đáp Trực Tuyến Với AI
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Đối thoại vấn đáp trực tiếp với Trợ lý khảo thí AI bằng giọng nói thời gian thực qua WebSocket.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Kiểm tra thiết bị Mic & Camera (Pre-exam Check)</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Mic className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Tương tác giọng nói thời gian thực với AI Examiner</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>AI hỏi xoáy, làm rõ luận điểm theo ngữ cảnh</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Xem kết quả, transcript và nhận xét Rubric minh bạch</span>
                </div>
              </div>
            </div>

            <Link
              to="/student"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-cyan-200/80 shadow-2xs"
            >
              <span>Xem Dashboard Sinh Viên</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== WORKFLOW SECTION ==================== */}
      <section id="workflow" className="glacier-light-panel p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-glacier-panel space-y-6 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Quy Trình Hoạt Động
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            4 Bước Vận Hành Ca Thi Vấn Đáp AIVES
          </h2>
          <p className="text-xs text-slate-500">
            Khép kín từ chuẩn bị đề thi, tổ chức phòng thi đến chấm điểm và công bố kết quả
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
              01
            </div>
            <h4 className="text-xs font-bold text-slate-900">Tạo Học Liệu & Rubric</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Giảng viên nạp giáo trình, slide bài giảng; AI trích xuất câu hỏi và gắn barem chấm điểm.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
              02
            </div>
            <h4 className="text-xs font-bold text-slate-900">Kiểm Tra Thiết Bị</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sinh viên kiểm tra micro, camera và đường truyền mạng trước khi bước vào phòng thi chính thức.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              03
            </div>
            <h4 className="text-xs font-bold text-slate-900">Phỏng Vấn AI Hỏi Xoáy</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              AI đọc câu hỏi bằng giọng nói, sinh viên trả lời trực tiếp; AI tự động hỏi xoáy làm rõ luận điểm.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              04
            </div>
            <h4 className="text-xs font-bold text-slate-900">Chốt Điểm & Minh Bạch</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              AI đề xuất điểm kèm nhận xét chi tiết; Giảng viên hội đồng xem xét bản ghi và chốt điểm chính thức.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
