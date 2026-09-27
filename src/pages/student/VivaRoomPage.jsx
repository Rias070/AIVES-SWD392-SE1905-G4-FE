import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Bookmark,
  Send,
  Sparkles,
  Bot,
  User,
  Radio,
  LogOut,
  Maximize2,
  Eye,
  Camera
} from 'lucide-react';

export default function VivaRoomPage() {
  const navigate = useNavigate();

  // Session state
  const [timerSeconds, setTimerSeconds] = useState(1122); // 18:42
  const [isRecording, setIsRecording] = useState(true);
  const [speechTurn, setSpeechTurn] = useState(1);
  const maxTurns = 3;
  const [micLevel, setMicLevel] = useState(65);
  const [liveTranscript, setLiveTranscript] = useState(
    'Dạ thưa Hội đồng, thuật toán Dijkstra sử dụng chiến lược tham lam (Greedy). Khi một đỉnh đã được đưa vào tập hợp đã xét (settled), Dijkstra mặc định khoảng cách đó là tối ưu vĩnh viễn và không bao giờ cập nhật lại. Do đó, nếu đồ thị tồn tại cạnh âm, đặc biệt là chu trình âm, Dijkstra sẽ cho kết quả sai lệch hoặc rơi vào vòng lặp vô tận...'
  );
  const [isMarked, setIsMarked] = useState(false);
  const transcriptBottomRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mic level animation
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setMicLevel(Math.floor(Math.random() * 40) + 45);
    }, 200);
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinishExam = () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc ca thi vấn đáp này và nộp bài để AI chấm điểm?')) {
      navigate('/exam-result');
    }
  };

  const handleCompleteAnswer = () => {
    if (speechTurn < maxTurns) {
      setSpeechTurn(prev => prev + 1);
      alert(`Đã nộp lượt trả lời ${speechTurn}/${maxTurns}. AI Giám khảo đang phân tích câu hỏi phản biện tiếp theo.`);
    } else {
      alert('Đã hoàn thành toàn bộ các lượt hỏi đáp cho câu hỏi này. Chuyển sang tổng kết kết quả thi.');
      navigate('/exam-result');
    }
  };

  return (
    <div className="space-y-4 max-w-[1550px] mx-auto pb-8 animate-fade-in">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="p-3.5 px-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Exam Room Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            ExamRoom Intelligence
          </span>
        </div>

        {/* Middle Status Indicators */}
        <div className="flex items-center gap-4 text-xs">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{formatTime(timerSeconds)} còn lại</span>
          </div>

          {/* WebRTC */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>WebRTC ổn định • 12ms</span>
          </div>

          {/* Question Stepper */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
            <span>Question 12 of 30 • [CS301]</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1">
            Hỗ trợ sự cố
          </button>
          <button
            onClick={handleFinishExam}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Finish Exam</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN EXAM LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ================= LEFT COLUMN: AI EXAMINER ORB & QUESTION (7 COLS) ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Question Card */}
          <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  CÂU HỎI 05 / 10
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Bloom: Phân tích & Đánh giá
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                Hỏi đáp trực tiếp
              </span>
            </div>

            <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              Hãy phân tích ưu và nhược điểm của thuật toán Dijkstra khi áp dụng cho đồ thị có trọng số âm, và giải thích tại sao thuật toán Bellman-Ford lại giải quyết được vấn đề này?
            </h2>
          </div>

          {/* Glowing AI Examiner Avatar Orb Stage */}
          <div className="relative min-h-[380px] rounded-3xl bg-gradient-to-b from-sky-50/40 via-white/80 to-sky-50/30 border border-sky-100 shadow-xs flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Ambient Background Glow Circles */}
            <div className="absolute w-72 h-72 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none -z-10 animate-pulse"></div>
            <div className="absolute w-96 h-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none -z-10"></div>

            {/* Concentric Pulsing Ripples */}
            <div className="relative flex items-center justify-center">
              {/* Ripple Ring 1 */}
              <div className="absolute w-64 h-64 rounded-full border border-sky-300/40 animate-ping opacity-30"></div>
              {/* Ripple Ring 2 */}
              <div className="absolute w-52 h-52 rounded-full border border-cyan-400/50"></div>
              {/* Ripple Ring 3 */}
              <div className="absolute w-40 h-40 rounded-full border-2 border-sky-400/60 shadow-[0_0_24px_rgba(2,132,199,0.25)]"></div>

              {/* Central Glowing AI Orb */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-sky-500 via-sky-400 to-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.5)] p-1 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white/95 backdrop-blur-md flex flex-col items-center justify-center space-y-1 shadow-inner">
                  <Bot className="w-8 h-8 text-sky-600 animate-bounce" />
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span className="w-1 h-4 rounded-full bg-sky-500 animate-pulse delay-75"></span>
                    <span className="w-1 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Listening State Badge */}
            <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200 shadow-sm text-xs font-semibold text-sky-800">
              <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>AI Giám khảo đang lắng nghe...</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>

            {/* Meta text */}
            <p className="mt-3 text-[11px] text-slate-500 text-center max-w-md">
              Chủ đề: Đồ thị & Đường đi ngắn nhất • Rubric: Chính xác giải thuật (40%), Tư duy phản biện (30%), Diễn giải (30%)
            </p>
          </div>

          {/* Bottom Controls Bar */}
          <div className="p-3 md:px-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isRecording
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isRecording ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                <span>{isRecording ? 'Mic Đang Thu' : 'Mic Tạm Dừng'}</span>
                <span className="text-[10px] opacity-80 border-l border-white/30 pl-1.5">
                  Lượt nói: {speechTurn} / {maxTurns}
                </span>
              </button>

              <button
                onClick={() => alert('AI Giám khảo đang phát lại âm thanh câu hỏi...')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Nhắc lại đề</span>
              </button>

              <button
                onClick={() => setIsMarked(!isMarked)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                  isMarked
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Đánh dấu</span>
              </button>
            </div>

            <button
              onClick={handleCompleteAnswer}
              className="btn-glacier-primary px-5 py-2 text-xs font-bold shadow-md shadow-sky-500/25 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoàn thành câu trả lời</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: REAL-TIME TRANSCRIPT & CAMERA PIP (5 COLS) ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Transcript Panel */}
          <div className="flex-1 p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 min-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Real-time Transcript
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Whisper v3: 99.4%
              </span>
            </div>

            {/* Dialogue Stream */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[360px]">
              {/* Turn 1: AI */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-700">AI Giám khảo</span>
                    <span>14:02:30</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Chào thí sinh, mời bạn nêu định nghĩa cơ bản về bài toán tìm đường đi ngắn nhất nguồn đơn.
                  </p>
                </div>
              </div>

              {/* Turn 1: Student */}
              <div className="flex items-start gap-2.5 flex-row-reverse">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-sky-50/50 border border-sky-100 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-sky-800">Bạn (Thí sinh)</span>
                    <span>14:03:15</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Dạ, bài toán tìm đường đi ngắn nhất nguồn đơn là tìm khoảng cách tối thiểu từ một đỉnh gốc s đến tất cả các đỉnh còn lại trong đồ thị có hướng hoặc vô hướng.
                  </p>
                </div>
              </div>

              {/* Turn 2: AI */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-700">AI Giám khảo</span>
                    <span>14:03:45</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Rất chính xác. Hãy so sánh nhanh độ phức tạp thời gian khi dùng Binary Heap và Fibonacci Heap trong Dijkstra.
                  </p>
                </div>
              </div>

              {/* Turn 2: Student */}
              <div className="flex items-start gap-2.5 flex-row-reverse">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-sky-50/50 border border-sky-100 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-sky-800">Bạn (Thí sinh)</span>
                    <span>14:04:20</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Với Binary Heap ta đạt O((V + E) log V), còn Fibonacci Heap lý thuyết giảm xuống còn O(E + V log V).
                  </p>
                </div>
              </div>

              {/* Main Question Bubble */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-sky-800">
                    <span className="font-bold">AI Giám khảo • Câu hỏi chính</span>
                    <span>14:05:01</span>
                  </div>
                  <p className="text-slate-900 font-semibold leading-relaxed">
                    Phân tích ưu/nhược của Dijkstra với đồ thị trọng số âm và lý giải tại sao Bellman-Ford giải quyết được?
                  </p>
                </div>
              </div>

              {/* Current Active Live Speech Recording */}
              <div className="p-3.5 rounded-xl bg-white border-2 border-sky-400 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-sky-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Bản ghi trực tiếp giọng nói
                  </span>
                  <span className="text-slate-400 italic">Đang phân tích...</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-sans">
                  {liveTranscript}
                  <span className="inline-block w-1.5 h-3.5 bg-sky-600 ml-1 animate-pulse align-middle"></span>
                </p>
              </div>

              <div ref={transcriptBottomRef}></div>
            </div>

            {/* Bottom Audio Meter & Floating Camera PIP */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
              {/* Mic Audio Level Meter */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-medium flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-sky-600" />
                    Âm lượng mic
                  </span>
                  <span className="font-mono font-bold text-sky-700">-18 dB</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-cyan-500 transition-all duration-150"
                    style={{ width: `${micLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* Floating Camera PIP Thumbnail */}
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-md shrink-0 group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Student Webcam PIP"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-[8px] font-mono text-white">
                  LIVE
                </div>
                <div className="absolute inset-1.5 border border-cyan-400/80 rounded pointer-events-none"></div>
                <div className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-[8px] font-mono text-cyan-300">
                  LOCKED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
