import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Mic,
  MicOff,
  Volume2,
  Video,
  FileText,
  Search,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Bot,
  User,
  Radio,
  SlidersHorizontal,
  X,
  RefreshCw,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export default function StudentDashboardPage({ currentUser }) {
  const navigate = useNavigate();
  const studentName = currentUser?.fullName || 'Nguyễn Văn An';
  const studentId = currentUser?.email ? currentUser.email.split('@')[0].toUpperCase() : '20210456';

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'mic-check' | 'ai-feedback' | 'course-detail' | 'mock-register'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedExamReview, setSelectedExamReview] = useState(null);

  // Audio test states
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    let timer;
    if (isMicTesting) {
      timer = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 55) + 35);
      }, 150);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(timer);
  }, [isMicTesting]);

  // Mock student data
  const registeredCourses = [
    {
      id: 'CS301',
      code: 'CS301',
      title: 'Cấu trúc Dữ liệu & Giải thuật',
      lecturer: 'PGS. TS. Hoàng Nam',
      examTag: 'Ca thi: 25/11',
      tagColor: 'amber',
      ragCount: 12,
      ragStatus: '12 học liệu RAG chuẩn hóa',
      progress: 85,
      actionText: 'Ôn luyện với AI',
      primaryAction: () => navigate('/viva?subject=CS301'),
    },
    {
      id: 'AI204',
      code: 'AI204',
      title: 'Học máy & Thị giác máy tính',
      lecturer: 'TS. Lê Quang',
      examTag: 'Ca thi: 30/11',
      tagColor: 'blue',
      ragCount: 18,
      ragStatus: '18 học liệu RAG chuẩn hóa',
      progress: 65,
      actionText: 'Ôn luyện với AI',
      primaryAction: () => navigate('/viva?subject=AI204'),
    },
    {
      id: 'SE102',
      code: 'SE102',
      title: 'Kiến trúc Phần mềm nâng cao',
      lecturer: 'ThS. Trần Đình Trọng',
      examTag: 'Sẵn sàng thi',
      tagColor: 'emerald',
      ragCount: 15,
      ragStatus: '15 học liệu RAG chuẩn hóa',
      progress: 92,
      actionText: 'Chi tiết môn',
      primaryAction: () => {
        setSelectedCourse(registeredCourses[2]);
        setActiveModal('course-detail');
      },
    },
    {
      id: 'NE302',
      code: 'NE302',
      title: 'An toàn Mạng & Mật mã học',
      lecturer: 'TS. Vũ Hải Nam',
      examTag: 'Đang nạp RAG',
      tagColor: 'slate',
      ragCount: 8,
      ragStatus: 'Đang cập nhật câu hỏi RAG',
      progress: 40,
      actionText: 'Chi tiết môn',
      primaryAction: () => {
        setSelectedCourse(registeredCourses[3]);
        setActiveModal('course-detail');
      },
    },
  ];

  const upcomingExams = [
    {
      id: 1,
      code: 'CS301',
      name: 'Cấu trúc Dữ liệu & Giải thuật',
      session: 'Ca #04',
      time: '14:30 - 15:00 Hôm nay',
      duration: 'Thời lượng 30 phút',
      room: 'AI - B2',
      status: 'opening_soon',
      statusText: 'Phòng mở sau 15p',
      canEnter: true,
    },
    {
      id: 2,
      code: 'AI204',
      name: 'Học máy & Thị giác máy tính',
      session: 'Ca #09',
      time: '09:00 - 09:30 Ngày 28/11/2026',
      duration: 'Thời lượng 30 phút',
      room: 'AI - B5',
      status: 'confirmed',
      statusText: 'Đã xác nhận phòng',
      canEnter: false,
    },
    {
      id: 3,
      code: 'SE102',
      name: 'Kiến trúc phần mềm nâng cao',
      session: 'Mock Viva',
      isMock: true,
      time: 'Tự do luyện thi 24/7',
      duration: 'Không giới hạn số lượt',
      room: 'SANDBOX',
      status: 'ready',
      statusText: 'Sẵn sàng',
      canEnter: true,
    },
  ];

  const recentExams = [
    {
      id: 1,
      code: 'CS201',
      title: 'Thuật toán ứng dụng',
      score: '8.8 / 10',
      description: 'Đạt chuẩn Bloom cấp 4 (Phân tích thuật toán phức tạp)',
      rubricBadge: 'Rubric: Excellent',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionText: 'Xem nhận xét AI →',
      details: {
        date: '18/11/2026',
        rubric: {
          accuracy: '9.2 / 10',
          reasoning: '8.5 / 10',
          fluency: '8.7 / 10',
        },
        aiComment:
          'Sinh viên nắm rất vững thuật toán Dynamic Programming (Quy hoạch động) và Đồ thị DFS/BFS. Khả năng biện luận về Trade-off giữa Time Complexity và Memory rất sáng tạo.',
        advice: 'Cần chú ý thêm về các Corner Cases của thuật toán Dijkstra khi đồ thị có trọng số âm.',
      },
    },
    {
      id: 2,
      code: 'DB101',
      title: 'Cơ sở Dữ liệu quan hệ',
      score: '8.2 / 10',
      description: 'Lượt đối đáp: 5/5 turns • Đã cấp chứng chỉ số',
      rubricBadge: 'Hội đồng AI: Ver 3.8',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      actionText: 'Ghi lại file video',
      details: {
        date: '10/11/2026',
        rubric: {
          accuracy: '8.4 / 10',
          reasoning: '8.0 / 10',
          fluency: '8.2 / 10',
        },
        aiComment:
          'Giải thích rõ ràng về các chuẩn hóa 1NF, 2NF, 3NF và BCNF. Áp dụng tốt chiến lược Indexing B-Tree trên bảng dữ liệu lớn.',
        advice: 'Nên củng cố thêm kiến thức về Isolation Level và cơ chế xử lý Deadlock trong Transaction.',
      },
    },
    {
      id: 3,
      code: 'PR102',
      title: 'Lập trình hướng đối tượng',
      score: '9.0 / 10',
      description: 'Phản biện mẫu thiết kế (Design Patterns) xuất sắc',
      rubricBadge: 'Rubric: Outstanding',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      actionText: 'Báo cáo viva',
      details: {
        date: '02/11/2026',
        rubric: {
          accuracy: '9.5 / 10',
          reasoning: '8.8 / 10',
          fluency: '8.8 / 10',
        },
        aiComment:
          'Phản biện cực kỳ thuyết phục về việc áp dụng Factory Method và Observer Pattern vào kiến trúc sự kiện Event-Driven.',
        advice: 'Duy trì phong độ và tiếp tục phát huy ở các môn chuyên ngành sâu.',
      },
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* ================= GREETING & STATUS BAR ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 md:px-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold text-slate-900">
              Xin chào, {studentName}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            MSSV: {studentId} • Khoa Công nghệ Thông tin • Khóa K21
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Audio readiness badge */}
          <button
            onClick={() => {
              setActiveModal('mic-check');
              setIsMicTesting(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Mic className="w-3.5 h-3.5" />
            <span>Micro: Chuẩn bị tốt</span>
          </button>

          {/* Quick Mock Practice CTA */}
          <Link
            to="/viva"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-xs font-semibold hover:from-sky-700 hover:to-cyan-700 shadow-sm shadow-sky-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bắt đầu ôn luyện</span>
          </Link>
        </div>
      </div>

      {/* ================= HERO BANNER: GLACIER LIGHT ================= */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-r from-white/90 via-sky-50/50 to-white/90 backdrop-blur-xl p-6 md:p-8 shadow-xs">
        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-300/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-cyan-300/20 rounded-full blur-2xl pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text */}
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Ca thi tiếp theo: <strong>CS301</strong> lúc <strong>14:30 hôm nay</strong></span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              Bảng điều khiển học tập & Thi vấn đáp AI
            </h2>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Chuẩn bị hệ thống kiểm tra nhận dạng giọng nói, kiến thức cơ sở dữ liệu học liệu RAG và tương tác mô phỏng hội đồng viva cùng AI Giám khảo.
            </p>
          </div>

          {/* Right Action Cards */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              to="/viva"
              className="flex-1 group relative p-4 rounded-xl border border-sky-300/80 bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Radio className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">Vào phòng thi ngay</h3>
                    <p className="text-[11px] text-sky-100 font-medium mt-0.5">Phòng AI - B2 sẵn sàng</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <button
              onClick={() => setActiveModal('mock-register')}
              className="flex-1 group p-4 rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-md text-slate-800 hover:bg-slate-50 transition-all shadow-2xs hover:border-sky-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">Đăng ký luyện thi thử</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Mock Exam cùng AI 24/7</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT / CENTER (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: MÔN HỌC ĐÃ ĐĂNG KÝ (4 MÔN) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Môn học đã đăng ký (4 môn)
                </h2>
              </div>
              <button 
                onClick={() => {
                  setSelectedCourse(registeredCourses[0]);
                  setActiveModal('course-detail');
                }}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
              >
                <span>Tất cả học phần</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid 2 Columns of Courses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {registeredCourses.map((c) => {
                const isAmber = c.tagColor === 'amber';
                const isBlue = c.tagColor === 'blue';
                const isEmerald = c.tagColor === 'emerald';
                return (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {c.code}
                        </span>

                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            isAmber
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : isBlue
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : isEmerald
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {c.examTag}
                        </span>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {c.title}
                      </h3>

                      {/* Lecturer Info */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.lecturer}</span>
                      </div>

                      {/* RAG Status */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
                        <Layers className="w-3.5 h-3.5 text-sky-600" />
                        <span>{c.ragStatus}</span>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Tiến độ ôn tập</span>
                          <span className="font-bold text-slate-800">{c.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              c.progress >= 85
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                                : 'bg-gradient-to-r from-sky-500 to-cyan-500'
                            }`}
                            style={{ width: `${c.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={c.primaryAction}
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        {c.actionText.includes('AI') && <Sparkles className="w-3.5 h-3.5 text-sky-600" />}
                        <span>{c.actionText}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: LỊCH CA THI VẤN ĐÁP SẮP TỚI */}
          <div className="p-5 md:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Lịch ca thi vấn đáp sắp tới
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Phòng thi mã hóa 2 chiều WebRTC</span>
              </div>
            </div>

            {/* Exams Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Môn thi & Ca</th>
                    <th className="pb-3 px-4">Ngày & Giờ</th>
                    <th className="pb-3 px-4">Phòng thi AI</th>
                    <th className="pb-3 px-4">Trạng thái</th>
                    <th className="pb-3 pl-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcomingExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Course & Session */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-start gap-2">
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              exam.status === 'opening_soon'
                                ? 'bg-amber-500 animate-ping'
                                : exam.status === 'confirmed'
                                ? 'bg-sky-500'
                                : 'bg-emerald-500'
                            }`}
                          ></span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{exam.code}</span>
                              <span className="text-slate-400">•</span>
                              <span className="font-semibold text-slate-700">{exam.session}</span>
                              {exam.isMock && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">
                                  Thi thử
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              {exam.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800">{exam.time}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{exam.duration}</p>
                      </td>

                      {/* AI Room */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {exam.room}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {exam.status === 'opening_soon' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {exam.statusText}
                          </span>
                        ) : exam.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                            <CheckCircle2 className="w-3 h-3 text-sky-600" />
                            {exam.statusText}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            {exam.statusText}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                        {exam.status === 'opening_soon' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setActiveModal('mic-check');
                                setIsMicTesting(true);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                            >
                              Kiểm tra mic
                            </button>
                            <Link
                              to="/viva"
                              className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-colors"
                            >
                              Vào thi
                            </Link>
                          </div>
                        ) : exam.status === 'confirmed' ? (
                          <button
                            onClick={() => alert(`Yêu cầu đổi ca thi môn ${exam.code} đã được gửi tới phòng đào tạo!`)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                          >
                            Đổi ca thi
                          </button>
                        ) : (
                          <Link
                            to="/viva"
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-semibold shadow-xs transition-all"
                          >
                            Thi thử ngay
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: TỔNG QUAN KẾT QUẢ & NĂNG LỰC */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Tổng quan kết quả & Năng lực
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                Kỳ 1 - 2026
              </span>
            </div>

            {/* 2 Stats Mini Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
                <span className="text-[11px] text-slate-500 font-medium">Số ca đã thi</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-slate-900">6</span>
                  <span className="text-xs text-slate-500">ca</span>
                </div>
                <span className="inline-block text-[10px] font-semibold text-emerald-700 mt-1">
                  100% hoàn thành
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100">
                <span className="text-[11px] text-slate-500 font-medium">Điểm TB AI Viva</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-sky-700">8.6</span>
                  <span className="text-xs text-slate-500">/ 10</span>
                </div>
                <span className="inline-block text-[10px] font-semibold text-sky-700 mt-1">
                  Top 5% toàn khoá
                </span>
              </div>
            </div>

            {/* AI Rubric Competency Breakdown */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                PHÂN TÍCH KỸ NĂNG VIVA (AI RUBRIC)
              </h3>

              {/* Skill 1 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">Độ chính xác kiến thức</span>
                  <span className="font-bold text-slate-900">90%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: '90%' }}></div>
                </div>
              </div>

              {/* Skill 2 (Highlighted) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">Phản biện & Logic câu trả lời</span>
                  <span className="font-bold text-blue-700">65%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                  <div className="h-full rounded-full bg-blue-600 shadow-xs" style={{ width: '65%' }}></div>
                </div>
              </div>

              {/* Skill 3 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">Lưu loát & Tự tin diễn đạt</span>
                  <span className="font-bold text-slate-900">85%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: LỊCH SỬ THI VẤN ĐÁP GẦN ĐÂY */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Lịch sử thi vấn đáp gần đây
              </h2>
            </div>

            {/* Exam History Items */}
            <div className="space-y-3">
              {recentExams.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-sky-50/30 hover:border-sky-200 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {item.code} - {item.title}
                    </span>
                    <span className="text-xs font-extrabold text-sky-700 font-mono">
                      {item.score}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className={`px-2 py-0.5 rounded border font-semibold ${item.badgeColor}`}>
                      {item.rubricBadge}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedExamReview(item);
                        setActiveModal('ai-feedback');
                      }}
                      className="font-semibold text-sky-600 hover:text-sky-800 transition-colors"
                    >
                      {item.actionText}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedExamReview(recentExams[0]);
                  setActiveModal('ai-feedback');
                }}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1"
              >
                <span>Xem toàn bộ lịch sử & Bảng điểm chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CARD 3: LỜI KHUYÊN TỪ AI TUTOR */}
          <div className="p-5 rounded-2xl bg-sky-50/60 backdrop-blur-xl border border-sky-200/80 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-sky-800">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold">Lời khuyên từ AI Tutor</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Ở môn <strong className="text-sky-800 font-semibold">CS301</strong> thi hôm nay, AI Examiner thường đặt câu hỏi đào sâu về độ phức tạp thời gian giải thuật đồ thị (Dijkstra và A*) khi phản biện. Hãy xem lại slide chương 3!
            </p>
          </div>
        </div>
      </div>

      {/* ================= MODAL: MICROPHONE & DIAGNOSTICS ================= */}
      {activeModal === 'mic-check' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kiểm tra thiết bị âm thanh & Mic</h3>
                  <p className="text-[11px] text-slate-500">Chuẩn bị trước khi vào phòng vấn đáp AI</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setIsMicTesting(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Animation Waveform */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Mức tín hiệu Micro:</span>
                <span className="font-mono font-bold text-sky-600">{audioLevel}%</span>
              </div>

              {/* Progress Level */}
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-blue-600 transition-all duration-150"
                  style={{ width: `${audioLevel}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Tần số: 48,000 Hz</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Độ trễ: 12ms (Tốt)
                </span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Microphone tích hợp / tai nghe nhận diện rõ ràng.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Khử tiếng ồn môi trường AI WebRTC đã kích hoạt.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tốc độ đường truyền mạng: 85 Mbps (Đạt chuẩn HD).</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveModal(null);
                  setIsMicTesting(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setIsMicTesting(false);
                  navigate('/viva');
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs"
              >
                Vào Phòng Thi Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: AI FEEDBACK & REVIEW ================= */}
      {activeModal === 'ai-feedback' && selectedExamReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedExamReview.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedExamReview.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ngày thi: {selectedExamReview.details?.date || 'Gần đây'} • Điểm tổng kết:{' '}
                  <strong className="text-sky-700 font-mono">{selectedExamReview.score}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rubric Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Chính xác</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                  {selectedExamReview.details?.rubric.accuracy}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Phản biện logic</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                  {selectedExamReview.details?.rubric.reasoning}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Lưu loát</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                  {selectedExamReview.details?.rubric.fluency}
                </p>
              </div>
            </div>

            {/* AI Examiner Comment */}
            <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
                <Bot className="w-4 h-4 text-sky-600" />
                <span>Nhận xét từ AI Examiner:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                "{selectedExamReview.details?.aiComment}"
              </p>
            </div>

            {/* Advice */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Khuyến nghị cải thiện:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedExamReview.details?.advice}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: COURSE DETAIL ================= */}
      {activeModal === 'course-detail' && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedCourse.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedCourse.title}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p><strong>Giảng viên phụ trách:</strong> {selectedCourse.lecturer}</p>
              <p><strong>Học liệu RAG tích hợp:</strong> {selectedCourse.ragCount} tài liệu chuẩn hoá (Syllabus, Slide bài giảng, Ngân hàng đề thi tham khảo).</p>
              <p><strong>Trạng thái ca thi:</strong> {selectedCourse.examTag}</p>
              <p><strong>Tiến độ hoàn thành ôn luyện:</strong> {selectedCourse.progress}%</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
              Bạn có thể bắt đầu phiên hỏi đáp giả lập 1-1 với AI Tutor của môn học này bất kỳ lúc nào để làm quen với phong cách đặt câu hỏi phản biện.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  navigate(`/viva?subject=${selectedCourse.code}`);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs"
              >
                Luyện Tập Môn Này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MOCK EXAM REGISTRATION ================= */}
      {activeModal === 'mock-register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Đăng ký ca thi thử (Mock Exam)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn môn học cần luyện thi</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-sky-500">
                  <option value="CS301">CS301 - Cấu trúc Dữ liệu & Giải thuật</option>
                  <option value="AI204">AI204 - Học máy & Thị giác máy tính</option>
                  <option value="SE102">SE102 - Kiến trúc Phần mềm nâng cao</option>
                  <option value="NE302">NE302 - An toàn Mạng & Mật mã học</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mức độ thử thách của AI Examiner</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" className="p-2 rounded-lg border border-slate-200 hover:border-sky-400 text-center font-medium">Cơ bản</button>
                  <button type="button" className="p-2 rounded-lg border border-sky-500 bg-sky-50 text-sky-700 text-center font-bold">Chuẩn đề</button>
                  <button type="button" className="p-2 rounded-lg border border-slate-200 hover:border-sky-400 text-center font-medium">Hỏi xoáy</button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  navigate('/viva?mode=mock');
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs"
              >
                Bắt Đầu Ngay (Sandbox)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
