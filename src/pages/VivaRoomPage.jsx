import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Bot, User, Clock, CheckCircle2, Award, ChevronRight, AlertCircle } from 'lucide-react';

export default function VivaRoomPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [currentTurn, setCurrentTurn] = useState(2);
  const totalTurns = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                LIVE EXAM SESSION
              </span>
              <span className="text-xs text-gray-400">Mã ca thi: AIVES-SES-2026-991</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white mt-0.5">
              Học phần: Software Architecture & Project (SWP391)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-sm font-mono text-amber-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Thời gian còn lại: {formatTime(timerSeconds)}</span>
          </div>
          <div className="text-xs text-gray-400">
            Lượt hỏi: <span className="text-white font-bold">{currentTurn}</span> / {totalTurns}
          </div>
        </div>
      </div>

      {/* Main Examination Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Examiner & Student Voice Interaction */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI Question Card */}
          <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Bot className="w-4 h-4" /> AI Giám Khảo Đặt Câu Hỏi (Turn {currentTurn})
              </div>
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-all">
                <Volume2 className="w-4 h-4 text-indigo-400" /> Phát lại giọng đọc AI
              </button>
            </div>
            <p className="text-white text-base md:text-lg font-medium leading-relaxed">
              "Bạn hãy phân tích sự khác biệt giữa hai mô hình bảo mật JWT Stateless và Session-based Authentication trong ứng dụng Microservices. Trường hợp nào bắt buộc cần cơ chế Token Revocation?"
            </p>
          </div>

          {/* Student Live Response & Audio Recorder */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <User className="w-4 h-4 text-cyan-400" /> Thí sinh trả lời (Speech-to-Text trực tiếp)
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-800 text-gray-400'}`}>
                {isRecording ? 'Microphone: Đang ghi âm...' : 'Microphone: Tạm dừng'}
              </span>
            </div>

            {/* Transcript simulation */}
            <div className="min-h-[130px] p-4 bg-gray-950/70 border border-gray-800 rounded-xl text-sm text-gray-300 leading-relaxed font-mono">
              {isRecording ? (
                <span>
                  "Thưa thầy/cô và ban giám khảo AI, đối với mô hình JWT Stateless, máy chủ không cần lưu trạng thái phiên trong bộ nhớ RAM, giúp việc mở rộng quy mô Microservices dễ dàng hơn... Đối với việc Token Revocation, khi người dùng đổi mật khẩu hoặc đăng xuất, ta có thể dùng Redis Blacklist hoặc Refresh Token Rotation..."
                </span>
              ) : (
                <span className="text-gray-500 italic">
                  Nhấn nút microphone bên dưới để bắt đầu nói câu trả lời của bạn...
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'Dừng trả lời (Stop)' : 'Bật Mic & Bắt đầu nói'}
              </button>

              <button
                onClick={() => setCurrentTurn((prev) => Math.min(prev + 1, totalTurns))}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-xl border border-gray-700 transition-all"
              >
                Gửi câu trả lời & Sang câu tiếp <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Instant Evaluation & Rubric Preview */}
        <div className="space-y-5">
          <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
              <Award className="w-4 h-4 text-amber-400" /> Tiêu Chí Chấm Điểm (Rubric)
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-200">1. Độ chính xác kiến trúc</span>
                  <span className="text-indigo-400 font-bold">4.0 / 4.0</span>
                </div>
                <p className="text-[11px] text-gray-400">Phân biệt chính xác Stateless vs Stateful trong Microservices.</p>
              </div>

              <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-200">2. Giải pháp Token Revocation</span>
                  <span className="text-indigo-400 font-bold">3.5 / 4.0</span>
                </div>
                <p className="text-[11px] text-gray-400">Nêu được kỹ thuật Blacklist hoặc Rotation có tính khả thi.</p>
              </div>

              <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-200">3. Kỹ năng diễn đạt & phản xạ</span>
                  <span className="text-indigo-400 font-bold">1.8 / 2.0</span>
                </div>
                <p className="text-[11px] text-gray-400">Phát âm rõ ràng, tốc độ phản xạ đạt tiêu chuẩn.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Điểm số tạm tính lượt này: <strong>9.3 / 10.0</strong>. AI đang đối chiếu kho vector kiến thức để sinh câu hỏi đào sâu tiếp theo.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
