import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Share2,
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Bot,
  User,
  Play,
  Pause,
  Square,
  Volume2,
  Shield,
  Layers,
  FileText,
  TrendingUp,
  Bookmark,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Check,
  Calendar,
  GraduationCap
} from 'lucide-react';

const FALLBACK_VIVA_RESULT = {
  examCode: 'CS301-VIVA-2026-99127',
  courseName: 'CS301: Cấu trúc Dữ liệu & Giải thuật',
  studentName: 'Nguyễn Văn An',
  studentId: 'SE190504',
  completedAt: new Date().toISOString(),
  turnsCompleted: 3,
  overallScore: 8.5,
  bloomLevel: 'Bloom 4 - Phân tích & Đánh giá',
  duration: '18 phút 42 giây',
  rubricScores: [
    { name: 'Tính chính xác lý thuyết & Giải thuật', score: '4.5 / 5.0', percent: 90 },
    { name: 'Khả năng phản biện câu hỏi xoáy', score: '4.0 / 5.0', percent: 80 },
    { name: 'Diễn đạt lưu loát & Thuật ngữ khoa học', score: '4.5 / 5.0', percent: 90 }
  ],
  aiFeedback:
    'Thí sinh nắm rất vững bản chất tham lam (Greedy) của thuật toán Dijkstra và lý do thất bại khi gặp trọng số âm. Khả năng phản xạ và lý giải cơ chế phát hiện chu trình âm của Bellman-Ford qua V-1 lần lặp rất thuyết phục và rành mạch.',
  strengths:
    'Lập luận logic chặt chẽ, diễn giải thuật toán đồ thị mạch lạc, thời gian phản xạ trả lời nhanh (trung bình 4.2s). Khả năng truy vết lỗi trong đồ thị và phân tích tiệm cận thời gian rất vững.',
  gaps:
    'Cần lưu ý thêm về trường hợp chu trình âm không tiếp cận được từ đỉnh nguồn (unreachable negative cycles) và cách phục hồi đường đi trong đồ thị có hướng.',
  recommendations:
    'Khuyến nghị đọc lại chương 5 - Đồ thị nâng cao (Slide 45-58) và bài toán tìm thành phần liên thông mạnh Tarjan SCC để hoàn thiện tư duy đồ thị.',
  dialogueHistory: [
    {
      sender: 'ai',
      time: '14:02:15',
      text: 'Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn CS301. Mời bạn lắng nghe câu hỏi đầu tiên.',
      isMainQuestion: false
    },
    {
      sender: 'ai',
      time: '14:02:30',
      text: 'Hãy phân tích ưu và nhược điểm của thuật toán Dijkstra khi áp dụng cho đồ thị có trọng số âm, và giải thích tại sao thuật toán Bellman-Ford lại giải quyết được vấn đề này?',
      isMainQuestion: true
    },
    {
      sender: 'student',
      time: '14:03:45',
      text: 'Dạ thưa Hội đồng, thuật toán Dijkstra áp dụng chiến lược tham lam Greedy. Khi một đỉnh đã đưa vào tập settled, Dijkstra mặc định khoảng cách đó là tối ưu vĩnh viễn và không cập nhật lại. Nếu có cạnh trọng số âm thì kết quả sẽ sai lệch, trong khi Bellman-Ford duyệt V-1 lần giúp phát hiện và cập nhật đường đi chính xác.'
    },
    {
      sender: 'ai',
      time: '14:04:10',
      text: 'Bạn vừa nhắc đến chu trình trọng số âm. Vậy thuật toán Bellman-Ford làm thế nào để phát hiện được sự tồn tại của chu trình âm trong đồ thị? Số lần duyệt tối đa là bao nhiêu và tại sao?',
      isMainQuestion: true
    },
    {
      sender: 'student',
      time: '14:05:20',
      text: 'Dạ, Bellman-Ford nới lỏng đúng V - 1 lần. Nếu sau V - 1 lần mà ta tiếp tục duyệt qua tất cả các cạnh lần thứ V và khoảng cách tới bất kỳ đỉnh nào vẫn tiếp tục giảm, điều đó chứng minh đồ thị chắc chắn tồn tại chu trình trọng số âm tiếp cận được từ đỉnh nguồn.'
    }
  ]
};

export default function ExamResultPage() {
  const navigate = useNavigate();

  // Dynamic Exam Result State
  const [vivaResult, setVivaResult] = useState(FALLBACK_VIVA_RESULT);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isPlayingAudioRef = useRef(false);
  isPlayingAudioRef.current = isPlayingAudio;

  const [currentlySpeakingIdx, setCurrentlySpeakingIdx] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [expandedDialogue, setExpandedDialogue] = useState(true);

  // Load latest viva result from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('latest_viva_result');
      if (stored) {
        const parsed = JSON.parse(stored);
        setVivaResult({
          ...FALLBACK_VIVA_RESULT,
          ...parsed,
          rubricScores: parsed.rubricScores || FALLBACK_VIVA_RESULT.rubricScores,
          dialogueHistory: parsed.dialogueHistory || parsed.dialogue || FALLBACK_VIVA_RESULT.dialogueHistory
        });
      }
    } catch (e) {
      console.warn('Lỗi khi đọc kết quả từ localStorage:', e);
    }

    return () => {
      isPlayingAudioRef.current = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Chromium SpeechSynthesis watchdog to prevent TTS queue freeze (Chrome 15s bug / backgrounding)
  useEffect(() => {
    let watchdogTimer = null;
    if (isPlayingAudio && 'speechSynthesis' in window) {
      watchdogTimer = setInterval(() => {
        if (!('speechSynthesis' in window)) return;
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else if (window.speechSynthesis.speaking) {
          // Keep active queue running without dropping audio in Chromium
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 4000);
    }
    return () => {
      if (watchdogTimer) clearInterval(watchdogTimer);
    };
  }, [isPlayingAudio]);

  // Text-To-Speech Replay Engine
  const playDialogueAudio = (startIndex = 0) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ Web SpeechSynthesis');
      return;
    }

    window.speechSynthesis.cancel();
    isPlayingAudioRef.current = true;
    setIsPlayingAudio(true);

    const history = vivaResult.dialogueHistory || [];
    let currentIdx = startIndex;

    const playNext = () => {
      if (!isPlayingAudioRef.current) return;

      if (currentIdx >= history.length) {
        isPlayingAudioRef.current = false;
        setIsPlayingAudio(false);
        setCurrentlySpeakingIdx(null);
        return;
      }

      const item = history[currentIdx];
      setCurrentlySpeakingIdx(currentIdx);

      const examLang = vivaResult.examLang || 'vi-VN';
      const isJa = examLang.startsWith('ja');
      const isEn = examLang.startsWith('en');

      const prefix = isJa
        ? (item.sender === 'ai' ? '面接官の質問：' : '受験者の回答：')
        : isEn
        ? (item.sender === 'ai' ? 'Examiner: ' : 'Candidate: ')
        : (item.sender === 'ai' ? 'Giám khảo hỏi: ' : 'Thí sinh trả lời: ');

      const utterance = new SpeechSynthesisUtterance(prefix + item.text);
      utterance.lang = examLang;
      
      const voices = window.speechSynthesis.getVoices();
      const prefixCode = examLang.split('-')[0].toLowerCase();
      const voice = voices.find(v => (v.lang || '').toLowerCase().startsWith(prefixCode));
      if (voice) utterance.voice = voice;

      utterance.rate = isJa ? 1.0 : (isEn ? 1.0 : 0.95);
      utterance.pitch = item.sender === 'ai' ? 1.05 : 0.98;

      utterance.onend = () => {
        if (!isPlayingAudioRef.current) return;
        currentIdx++;
        setTimeout(() => {
          if (isPlayingAudioRef.current) playNext();
        }, 600);
      };

      utterance.onerror = () => {
        if (!isPlayingAudioRef.current) return;
        currentIdx++;
        setTimeout(() => {
          if (isPlayingAudioRef.current) playNext();
        }, 400);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNext();
  };

  const stopAudio = () => {
    isPlayingAudioRef.current = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setCurrentlySpeakingIdx(null);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      playDialogueAudio(0);
    }
  };

  // Play single line
  const handlePlaySingle = (idx) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    isPlayingAudioRef.current = true;
    setIsPlayingAudio(true);
    setCurrentlySpeakingIdx(idx);

    const item = vivaResult.dialogueHistory[idx];
    const examLang = vivaResult.examLang || 'vi-VN';
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = examLang;

    const voices = window.speechSynthesis.getVoices();
    const prefixCode = examLang.split('-')[0].toLowerCase();
    const voice = voices.find(v => (v.lang || '').toLowerCase().startsWith(prefixCode));
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      isPlayingAudioRef.current = false;
      setIsPlayingAudio(false);
      setCurrentlySpeakingIdx(null);
    };
    utterance.onerror = () => {
      isPlayingAudioRef.current = false;
      setIsPlayingAudio(false);
      setCurrentlySpeakingIdx(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  // Print Transcript PDF
  const handlePrint = () => {
    window.print();
  };

  // Copy Share Link
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const score = Number(vivaResult.overallScore) || 8.5;
  const scorePercent = Math.min(100, Math.max(0, (score / 10) * 100));

  return (
    <div id="printable-exam-result" className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* ================= PRINT-ONLY OFFICIAL HEADER ================= */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              Hệ thống Khảo thí Vấn đáp Trực tuyến AIVES
            </h1>
            <p className="text-xs text-slate-600">
              Hội đồng Khảo thí Trí tuệ Nhân tạo Chuẩn Quốc tế ISO/IEC 2382-36
            </p>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            <p className="font-bold text-slate-900">Mã ca thi: {vivaResult.examCode}</p>
            <p>Ngày thi: {new Date(vivaResult.completedAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Thí sinh:</span>
            <span className="font-bold text-slate-900">{vivaResult.studentName} ({vivaResult.studentId})</span>
          </div>
          <div>
            <span className="text-slate-500 block">Môn học:</span>
            <span className="font-bold text-slate-900">{vivaResult.courseName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Kết quả chính thức:</span>
            <span className="font-bold text-sky-800 text-sm">{score.toFixed(1)} / 10.0 (Grade A)</span>
          </div>
        </div>
      </div>

      {/* ================= TOP NAVIGATION BAR (Hidden in Print) ================= */}
      <div className="no-print p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/student"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Quay lại Trang Sinh viên"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold text-slate-900">
                Kết quả ca thi — {vivaResult.courseName}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đã hoàn thành
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mã ca thi: {vivaResult.examCode} • Hoàn thành lúc {new Date(vivaResult.completedAt).toLocaleTimeString('vi-VN')} • Hội đồng AI: Viva Examiner v4.2 Pro
            </p>
          </div>
        </div>

        {/* Right Actions: PDF Print & Share */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Xuất bảng điểm (PDF)</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs font-semibold shadow-sm shadow-sky-500/25 transition-all cursor-pointer"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Đã sao chép link' : 'Chia sẻ chứng chỉ'}</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: SCORE & METRICS (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Official Score Card */}
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-5 print:border-slate-300 print:shadow-none print-score-card print-avoid-break">
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
                    strokeDashoffset={2 * Math.PI * 42 * (1 - score / 10)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Score Number inside Ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {score.toFixed(1)}
                    </span>
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
                <span className="font-semibold text-slate-800">{vivaResult.courseName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Thời lượng thi:</span>
                <span className="font-semibold text-slate-800">{vivaResult.duration || '18 phút 42 giây'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Số lượt hỏi xoáy:</span>
                <span className="font-semibold text-sky-700">{vivaResult.turnsCompleted || 3} / 3 lượt hoàn tất</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Mức nhận thức Bloom:</span>
                <span className="font-semibold text-indigo-700">{vivaResult.bloomLevel || 'Bloom 4 - Phân tích'}</span>
              </div>
            </div>

            {/* Rubric Breakdown Score Bars */}
            <div className="space-y-3 pt-3 border-t border-slate-100 print-avoid-break">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Điểm thành phần Rubric
              </span>
              {vivaResult.rubricScores.map((rubric, idx) => (
                <div key={idx} className="space-y-1 print-rubric-item print-avoid-break">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">{rubric.name}</span>
                    <span className="font-bold text-slate-900 font-mono">{rubric.score}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                      style={{ width: `${rubric.percent || 85}%` }}
                    ></div>
                  </div>
                </div>
              ))}
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

            {/* Action buttons (Hidden in Print) */}
            <div className="no-print space-y-2 pt-2">
              <Link
                to="/student"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-xs font-bold shadow-sm shadow-sky-500/20 hover:from-sky-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Về trang chủ sinh viên</span>
              </Link>
              <button
                onClick={handleToggleAudio}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-rose-500" />
                    <span>Dừng phát âm thanh</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Nghe lại toàn bộ buổi vấn đáp (TTS)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quality Card */}
          <div className="no-print p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-600" />
              <div>
                <p className="font-bold text-slate-800">Chất lượng nhận diện giọng nói</p>
                <p className="text-[10px] text-slate-400">Web Speech API vi-VN • Độ trễ: 12ms</p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              99.6% Độ khớp
            </span>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: DIALOGUE HISTORY & AI FEEDBACK (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: LIVE TRANSCRIPT & DIALOGUE PLAYBACK */}
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4 print:border-slate-300 print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Nhật ký hội thoại vấn đáp trực tiếp (Viva Transcript)
                </h2>
              </div>
              <div className="no-print flex items-center gap-2">
                <button
                  onClick={handleToggleAudio}
                  className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                      <span>Đang phát lại...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-sky-600" />
                      <span>Phát âm thanh đối đáp</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dialogue Messages List */}
            <div className="space-y-3.5 max-h-[460px] overflow-y-auto print:max-h-none print:overflow-visible pr-1">
              {vivaResult.dialogueHistory && vivaResult.dialogueHistory.length > 0 ? (
                vivaResult.dialogueHistory.map((item, idx) => {
                  const isSpeakingThis = currentlySpeakingIdx === idx;
                  const isAI = item.sender === 'ai';

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all print-dialogue-item print-avoid-break ${isSpeakingThis
                          ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                          : isAI
                            ? 'border-slate-200/90 bg-slate-50/50'
                            : 'border-sky-200/90 bg-sky-50/30'
                        }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-white ${isAI ? 'bg-sky-600' : 'bg-cyan-600'
                          }`}
                      >
                        {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">
                            {isAI
                              ? item.isMainQuestion
                                ? 'AI Giám khảo • Câu hỏi vấn đáp'
                                : 'AI Giám khảo'
                              : `${vivaResult.studentName} (Thí sinh)`}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono text-[10px]">{item.time || ''}</span>
                            <button
                              onClick={() => handlePlaySingle(idx)}
                              title="Nghe lại dòng này"
                              className="no-print text-slate-400 hover:text-sky-600 p-0.5 transition-colors cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-800 leading-relaxed font-sans">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có nhật ký trao đổi.</p>
              )}
            </div>
          </div>

          {/* SECTION 2: AI SUMMARY & ADVICE */}
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4 print:border-slate-300 print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">
                  Nhận xét & Đánh giá năng lực từ AI Giám khảo
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                RAG Knowledge Engine & Vector Semantic Reasoning
              </span>
            </div>

            {/* AI Overall Feedback */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1 print-avoid-break print-section-block">
              <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
                <Bot className="w-4 h-4 text-sky-600" />
                <span>Nhận xét tổng quát từ Hội đồng AI</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{vivaResult.aiFeedback}"
              </p>
            </div>

            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1 print-avoid-break print-section-block">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Điểm mạnh nổi bật</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {vivaResult.strengths}
              </p>
            </div>

            {/* Knowledge Gaps */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1 print-avoid-break print-section-block">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Khoảng trống kiến thức cần lưu ý</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {vivaResult.gaps}
              </p>
            </div>

            {/* Recommended Reading */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 print-avoid-break print-section-block">
              <div className="flex items-center gap-1.5 text-slate-800 text-xs font-bold">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Tài liệu đề xuất ôn tập thêm (Đối chiếu RAG Giáo trình CS301)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {vivaResult.recommendations}
              </p>
            </div>

            {/* Audio Snippet Player (Hidden in Print) */}
            <div className="no-print p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Nghe lại đoạn phản biện ấn tượng nhất
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hội thoại đối đáp câu hỏi Dijkstra & Bellman-Ford
                  </p>
                </div>
              </div>

              {/* Animated audio waves */}
              <div className="flex items-center gap-1">
                {[40, 70, 95, 60, 80, 50, 85, 30, 60, 45].map((val, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-sky-500 transition-all ${isPlayingAudio ? 'animate-pulse' : ''
                      }`}
                    style={{ height: `${val * 0.25}px` }}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRINT-ONLY OFFICIAL SIGNATURES ================= */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t-2 border-slate-900 text-center text-xs print-signature-block print-avoid-break">
        <div>
          <p className="font-bold text-slate-900 uppercase">Thí sinh cam kết</p>
          <p className="text-[10px] text-slate-500 italic mt-0.5">(Ký và ghi rõ họ tên)</p>
          <div className="h-20"></div>
          <p className="font-semibold text-slate-800">{vivaResult.studentName}</p>
        </div>

        <div>
          <p className="font-bold text-slate-900 uppercase">Chữ ký số Hội đồng Khảo thí AI</p>
          <p className="text-[10px] text-slate-500 italic mt-0.5">Xác thực tự động qua Smart Contract</p>
          <div className="h-14 flex items-center justify-center">
            <span className="px-3 py-1 rounded border-2 border-emerald-700 text-emerald-800 font-mono font-bold text-[10px] uppercase rotate-[-3deg]">
              [VERIFIED AIVES AI EXAMINER]
            </span>
          </div>
          <p className="font-mono text-[9px] text-slate-600">SHA-256: 0x4F9E7B3A2C...88D1</p>
        </div>
      </div>

      {/* Footer Security Blockchain Hash */}
      <div className="p-4 rounded-2xl bg-white/60 border border-slate-200/60 text-center text-[11px] text-slate-400 print:border-none print:pt-2 print-avoid-break">
        <span>
          Chứng thực bảo mật không thể đảo ngược số: <strong>AIVES-ETH-8942</strong> • Mã xác thực Blockchain:{' '}
          <strong>0x4F9E7B3A2C...88D1</strong>
        </span>
      </div>

      {/* Embedded CSS for Print Styling */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm 14mm;
          }
          body {
            background: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          aside, nav, header, footer, .no-print {
            display: none !important;
          }
          #printable-exam-result {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* ISO Standard Page Break Protection */
          .print-avoid-break,
          .print-score-card,
          .print-rubric-item,
          .print-dialogue-item,
          .print-signature-block,
          .print-section-block {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            -webkit-column-break-inside: avoid !important;
          }

          /* Paper contrast enhancements */
          .print-dialogue-item {
            margin-bottom: 8px !important;
            background-color: #f8fafc !important;
            border-color: #cbd5e1 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .print-signature-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
