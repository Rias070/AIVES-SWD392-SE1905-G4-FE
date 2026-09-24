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
      <div className="glacier-light-panel p-5 md:p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shadow-sm">
            <Bot className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                PHÒNG THI VẤN ĐÁP TRỰC TIẾP (LIVE)
              </span>
              <span className="text-xs text-slate-500">Mã ca: AIVES-SES-2026-991</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 mt-1">
              Học phần: Software Architecture & Project (SWP391)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-mono text-slate-800 shadow-xs">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Thời gian còn: {formatTime(timerSeconds)}</span>
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Lượt hỏi: <span className="text-sky-700 font-bold text-sm">{currentTurn}</span> / {totalTurns}
          </div>
        </div>
      </div>

      {/* Main Examination Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Examiner & Student Voice Interaction */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI Question Card */}
          <div className="glacier-light-card p-6 md:p-7 rounded-2xl border-l-4 border-l-sky-600 relative overflow-hidden space-y-3 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
                <Bot className="w-4 h-4 text-sky-600" /> AI Giám Khảo Đặt Câu Hỏi (Lượt {currentTurn})
              </div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-700 transition-colors">
                <Volume2 className="w-4 h-4 text-sky-600" /> Phát lại giọng đọc AI
              </button>
            </div>
            <p className="text-slate-900 text-base md:text-lg font-medium leading-relaxed">
              "Bạn hãy phân tích sự khác biệt giữa hai mô hình bảo mật JWT Stateless và Session-based Authentication trong ứng dụng Microservices. Trường hợp nào bắt buộc cần cơ chế Token Revocation?"
            </p>
          </div>

          {/* Student Live Response & Audio Recorder */}
          <div className="glacier-light-panel p-6 md:p-7 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <User className="w-4 h-4 text-sky-600" /> Thí sinh trả lời (Speech-to-Text trực tiếp)
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border ${
                isRecording 
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse font-semibold' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {isRecording ? 'Microphone: Đang ghi âm...' : 'Microphone: Tạm dừng'}
              </span>
            </div>

            {/* Transcript simulation */}
            <div className="min-h-[140px] p-4 bg-slate-50/90 border border-slate-200/90 rounded-xl text-sm text-slate-800 leading-relaxed font-mono shadow-xs">
              {isRecording ? (
                <span>
                  "Thưa thầy/cô và ban giám khảo AI, đối với mô hình JWT Stateless, máy chủ không cần lưu trạng thái phiên trong bộ nhớ RAM, giúp việc mở rộng quy mô Microservices dễ dàng hơn... Đối với việc Token Revocation, khi người dùng đổi mật khẩu hoặc đăng xuất, ta có thể dùng Redis Blacklist hoặc Refresh Token Rotation..."
                </span>
              ) : (
                <span className="text-slate-400 italic">
                  Nhấn nút microphone bên dưới để bắt đầu nói câu trả lời của bạn...
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={isRecording ? 'px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md flex items-center gap-2' : 'btn-glacier-primary px-6 py-2.5 text-xs'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'Dừng trả lời (Stop)' : 'Bật Mic & Bắt đầu nói'}
              </button>

              <button
                onClick={() => setCurrentTurn((prev) => Math.min(prev + 1, totalTurns))}
                className="btn-glacier-secondary px-5 py-2.5 text-xs font-semibold"
              >
                Gửi câu trả lời & Sang câu tiếp <ChevronRight className="w-4 h-4 text-sky-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Instant Evaluation & Rubric Preview */}
        <div className="space-y-5">
          <div className="glacier-light-card p-6 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
              <Award className="w-4 h-4 text-sky-600" /> Tiêu Chí Chấm Điểm (Rubric)
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">1. Độ chính xác kiến trúc</span>
                  <span className="text-sky-700 font-bold">4.0 / 4.0</span>
                </div>
                <p className="text-[11px] text-slate-500">Phân biệt chính xác Stateless vs Stateful trong Microservices.</p>
              </div>

              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">2. Giải pháp Token Revocation</span>
                  <span className="text-sky-700 font-bold">3.5 / 4.0</span>
                </div>
                <p className="text-[11px] text-slate-500">Nêu được kỹ thuật Blacklist hoặc Rotation có tính khả thi.</p>
              </div>

              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">3. Kỹ năng diễn đạt & phản xạ</span>
                  <span className="text-sky-700 font-bold">1.8 / 2.0</span>
                </div>
                <p className="text-[11px] text-slate-500">Phát âm rõ ràng, tốc độ phản xạ đạt tiêu chuẩn.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Điểm số tạm tính lượt này: <strong className="text-sky-900">9.3 / 10.0</strong>. AI đang đối chiếu kho vector kiến thức để sinh câu hỏi đào sâu thích ứng tiếp theo.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
