import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Share2,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Bot,
  Play,
  Pause,
  Volume2,
  Shield,
  Layers,
  FileText,
  TrendingUp,
  Bookmark,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export default function ExamResultPage() {
  const navigate = useNavigate();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(1);

  const questions = [
    {
      id: 1,
      title: 'Khái niệm & Cơ chế cân bằng trong cây AVL',
      score: '9.0 / 10',
      badge: 'MỨC TỐT',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bloom: 'Bloom 3 - Hiểu',
      time: 'Thời gian trả lời: 3 phút 12 giây • 2 lượt hỏi xoáy từ AI',
      rubrics: [
        { name: 'Tính chính xác lý thuyết', score: '4.5 / 5.0' },
        { name: 'Ví dụ minh họa xoay Single/Double', score: '4.5 / 5.0' },
      ],
      aiFeedback:
        'Thí sinh nắm rất chắc điều kiện mất cân bằng LL, RR, LR, RL và vẽ cơ chế xoay chính xác. Khi giảng viên đi sâu vào ca biến 3-node mất cân bằng kép, bạn đã giải quyết trong lúc nói không cần gợi ý.',
    },
    {
      id: 2,
      title: 'So sánh độ phức tạp thời gian Binary Heap vs Fibonacci Heap',
      score: '8.5 / 10',
      badge: 'TỐT',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bloom: 'Bloom 4 - Phân tích',
      time: 'Thời gian trả lời: 2 phút 45 giây • 1 lượt hỏi xoáy từ AI',
      rubrics: [
        { name: 'Amortized Analysis', score: '4.5 / 5.0' },
        { name: 'Giảm khóa Decrease-Key', score: '4.0 / 5.0' },
      ],
      aiFeedback:
        'Phân tích Amortized Time chính xác. Nêu rõ được sự khác biệt lý thuyết và thực nghiệm khi áp dụng cấu trúc dữ liệu này vào thuật toán Dijkstra.',
    },
    {
      id: 3,
      title: 'Thuật toán Dijkstra trên đồ thị có trọng số âm & Bellman-Ford',
      score: '8.0 / 10',
      badge: 'ĐẠT CHUẨN',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      bloom: 'Bloom 5 - Đánh giá',
      time: 'Thời gian trả lời: 4 phút 10 giây • 2 lượt hỏi xoáy từ AI',
      rubrics: [
        { name: 'Chứng minh sai số Dijkstra', score: '4.0 / 5.0' },
        { name: 'Nguyên lý Bellman-Ford / SPFA', score: '4.0 / 5.0' },
      ],
      aiFeedback:
        'Thí sinh giải thích tốt lý do Dijkstra thất bại do bản chất tham lam (Greedy). Tuy nhiên phần chứng minh chu trình âm (Negative Cycle) cần trình bày mạch lạc hơn.',
    },
    {
      id: 4,
      title: 'Ứng dụng B-Tree và B+Tree trong hệ quản trị CSDL',
      score: '8.5 / 10',
      badge: 'TỐT',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bloom: 'Bloom 3 - Ứng dụng',
      time: 'Thời gian trả lời: 3 phút 05 giây • 1 lượt hỏi xoáy từ AI',
      rubrics: [
        { name: 'Range Query & Leaf Linking', score: '4.5 / 5.0' },
        { name: 'Disk I/O Block Optimization', score: '4.0 / 5.0' },
      ],
      aiFeedback:
        'Rất xuất sắc khi chỉ ra lý do B+Tree được chuộng hơn B-Tree trong Disk I/O nhờ các node lá liên kết tuần tự phục vụ Range Scan.',
    },
    {
      id: 5,
      title: 'Bài toán Luồng cực đại Max-Flow & Ford-Fulkerson',
      score: '8.5 / 10',
      badge: 'TỐT',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bloom: 'Bloom 4 - Phân tích',
      time: 'Thời gian trả lời: 3 phút 40 giây • 1 lượt hỏi xoáy từ AI',
      rubrics: [
        { name: 'Định lý Max-Flow Min-Cut', score: '4.5 / 5.0' },
        { name: 'Thuật toán Edmonds-Karp (BFS)', score: '4.0 / 5.0' },
      ],
      aiFeedback:
        'Giải thích mạch lạc khái niệm Residual Graph (Đồ thị thặng dư) và Augmented Path. Định lý Lát cắt hẹp nhất (Min-Cut) được áp dụng chuẩn xác.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/student"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Quay lại Lịch sử thi"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold text-slate-900">
                Kết quả ca thi — CS301: Cấu trúc Dữ liệu & Giải thuật
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đã hoàn thành
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mã ca thi: AIVES-2026-99127 • Hoàn thành lúc 15:02 hôm nay • Hội đồng AI: Ver 4.2 Pro
            </p>
          </div>
        </div>

        {/* Right Actions: PDF & Share */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Đang xuất bảng điểm PDF chính thức có chữ ký số SHA-256...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất bảng điểm (PDF)</span>
          </button>

          <button
            onClick={() => alert('Đã sao chép liên kết chứng chỉ số Blockchain vào clipboard!')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs font-semibold shadow-sm shadow-sky-500/25 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia sẻ chứng chỉ</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: SCORE & METRICS (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Official Score Card */}
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ĐIỂM TỔNG KẾT CHÍNH THỨC
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                Hệ số AIVES Pro
              </span>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-36 h-36 rounded-full flex items-center justify-center p-2.5">
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-sky-600 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - 0.85)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Score Number inside Ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">8.5</span>
                    <span className="text-xs text-slate-400 font-medium">/10</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full mt-0.5">
                    ĐÃ HOÀN THÀNH
                  </span>
                </div>
              </div>

              {/* Distinction Ribbon */}
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Xuất sắc (Grade A) • Top 8% toàn khóa</span>
              </div>
            </div>

            {/* Meta Attributes */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-slate-600">
                <span>Môn học:</span>
                <span className="font-semibold text-slate-800">CS301 - CTDL & Giải thuật</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Thời gian vấn đáp:</span>
                <span className="font-semibold text-slate-800">26 phút 14 giây (5/5 câu)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Mức nhận thức Bloom:</span>
                <span className="font-semibold text-indigo-700">Cấp 4 (Phân tích) • 3.8/4.0</span>
              </div>
            </div>

            {/* Competency Skill Bars */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Kiến thức chuyên môn</span>
                  <span className="font-bold text-slate-900 font-mono">8.8 / 10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Phản biện logic & Lập luận</span>
                  <span className="font-bold text-slate-900 font-mono">8.4 / 10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-sky-600" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Diễn đạt mạch lạc & Tự tin</span>
                  <span className="font-bold text-slate-900 font-mono">8.2 / 10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>

            {/* AI Integrity Check Banner */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chỉ số liêm chính AI</span>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                100% Đạt chuẩn
              </span>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <Link
                to="/student"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-xs font-bold shadow-sm shadow-sky-500/20 hover:from-sky-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Về trang chủ</span>
              </Link>
              <button
                onClick={() => alert('Mở trình phát lại bản ghi âm đối đáp với AI Examiner...')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Xem lại bản ghi âm & Đối đáp STT</span>
              </button>
            </div>
          </div>

          {/* Quality Card */}
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-600" />
              <div>
                <p className="font-bold text-slate-800">Chất lượng âm thanh AI</p>
                <p className="text-[10px] text-slate-400">Whisper v3 HD • VAD SAMI (88 rừng)</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100 ms
            </span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: QUESTIONS & AI FEEDBACK (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: ACCORDION QUESTION DETAIL & RUBRICS */}
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                Chi tiết từng câu hỏi & Đánh giá Rubric
              </h2>
              <span className="text-xs text-slate-500 font-medium">Tổng số: 5 câu hỏi</span>
            </div>

            {/* Accordion Questions List */}
            <div className="space-y-3">
              {questions.map((q) => {
                const isExpanded = expandedQuestion === q.id;
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200/90 overflow-hidden bg-slate-50/40 hover:border-sky-300 transition-all"
                  >
                    {/* Header bar of question */}
                    <div
                      onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                      className="p-4 bg-white cursor-pointer flex items-center justify-between gap-3 select-none"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 mt-0.5">
                          Câu {q.id}
                        </span>
                        <div>
                          <h3 className="text-xs md:text-sm font-bold text-slate-900 leading-snug">
                            {q.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">{q.bloom}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${q.badgeColor}`}>
                          {q.badge}
                        </span>
                        <span className="text-sm font-extrabold text-sky-700 font-mono">
                          {q.score}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="p-4 pt-3 border-t border-slate-100 space-y-3.5 bg-slate-50/60 animate-fade-in text-xs">
                        <p className="text-[11px] text-slate-500">{q.time}</p>

                        {/* Rubric Breakdown Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.rubrics.map((r, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white border border-slate-100 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 font-medium">{r.name}</span>
                                <span className="font-bold text-slate-900 font-mono">{r.score}</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full rounded-full bg-sky-500" style={{ width: '90%' }}></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* AI Feedback Quote */}
                        <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1">
                          <div className="flex items-center gap-1.5 text-sky-800 font-bold text-[11px]">
                            <Bot className="w-3.5 h-3.5 text-sky-600" />
                            <span>Tóm tắt phản hồi AI:</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed italic">
                            "{q.aiFeedback}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: AI SUMMARY & ADVICE */}
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">
                  Tổng kết đánh giá năng lực từ AI Giám khảo
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                RAG Knowledge Engine & Vector Semantic Reasoning
              </span>
            </div>

            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Điểm mạnh nổi bật</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Lập luận logic chặt chẽ, diễn giải thuật toán đồ thị mạch lạc, thời gian phản xạ trả lời nhanh (trung bình 4.2s). Khả năng truy vết lỗi trong đồ thị và phân tích tiệm cận thời gian rất vững.
              </p>
            </div>

            {/* Knowledge Gaps */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Khoảng trống kiến thức cần lưu ý</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Cần đào sâu hơn về trường hợp chu trình âm (Negative Cycle) trong Bellman-Ford và cách phục hồi vết đường đi khi gặp đồ thị có hướng có trọng số âm.
              </p>
            </div>

            {/* Recommended Reading */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Tài liệu đề xuất ôn tập thêm (Đối chiếu RAG Giáo trình)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Khuyến nghị đọc lại chương 5 - Đồ thị nâng cao (Slide 45-58) và bài báo nghiên cứu Tarjan SCC để củng cố kỹ năng phân tích thành phần liên thông mạnh.
              </p>
            </div>

            {/* Audio Snippet Player */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-xs transition-colors shrink-0"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Nghe lại đoạn phản biện ấn tượng nhất
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Đoạn [03:12 - 05:40] • Đối đáp câu hỏi AVL Tree
                  </p>
                </div>
              </div>

              {/* Animated audio waves */}
              <div className="flex items-center gap-1">
                {[40, 70, 95, 60, 80, 50, 85, 30, 60, 45].map((val, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-sky-500 transition-all ${isPlayingAudio ? 'animate-pulse' : ''}`}
                    style={{ height: `${val * 0.25}px` }}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Blockchain Hash */}
      <div className="p-4 rounded-2xl bg-white/60 border border-slate-200/60 text-center text-[11px] text-slate-400">
        <span>Chứng thực bảo mật không thể đảo ngược số: <strong>AIVES-ETH-8942</strong> • Mã xác thực Blockchain: <strong>0x4F9E7B3A2C...88D1</strong></span>
      </div>
    </div>
  );
}
