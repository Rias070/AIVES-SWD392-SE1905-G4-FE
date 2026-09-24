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
      <div className="glass-panel p-5 md:p-6 rounded-[24px] border border-[#C9A876]/35 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-[16px] bg-[#C9A876]/20 border border-[#C9A876]/40 flex items-center justify-center text-[#E8E2D8] shadow-md">
            <Bot className="w-6 h-6 text-[#C9A876]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-0.5 rounded-full bg-[#C9A876]/15 text-[#E8E2D8] border border-[#C9A876]/35 font-bold tracking-wide">
                PHÒNG THI VẤN ĐÁP TRỰC TIẾP
              </span>
              <span className="text-xs text-[#B8B0A6]">Mã ca: AIVES-SES-2026-991</span>
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-[#F5F0E8] mt-1">
              Học phần: Software Architecture & Project (SWP391)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-[16px] bg-[#1C1815]/90 border border-[#5C554C]/60 text-sm font-mono text-[#E8E2D8] shadow-inner">
            <Clock className="w-4 h-4 text-[#C9A876]" />
            <span>Thời gian còn: {formatTime(timerSeconds)}</span>
          </div>
          <div className="text-xs text-[#B8B0A6]">
            Lượt hỏi: <span className="text-[#F5F0E8] font-bold text-sm">{currentTurn}</span> / {totalTurns}
          </div>
        </div>
      </div>

      {/* Main Examination Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Examiner & Student Voice Interaction */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI Question Card */}
          <div className="glass-card p-6 md:p-7 rounded-[26px] border border-[#C9A876]/45 bg-[#3A332C]/80 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A876]/10 blur-3xl pointer-events-none rounded-full" />
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2 text-[#C9A876] text-xs font-bold uppercase tracking-wider">
                <Bot className="w-4 h-4" /> AI Giám Khảo Đặt Câu Hỏi (Lượt {currentTurn})
              </div>
              <button className="flex items-center gap-1.5 text-xs text-[#B8B0A6] hover:text-[#F5F0E8] transition-colors">
                <Volume2 className="w-4 h-4 text-[#C9A876]" /> Phát lại giọng đọc AI
              </button>
            </div>
            <p className="text-[#F5F0E8] text-base md:text-lg font-medium leading-relaxed">
              "Bạn hãy phân tích sự khác biệt giữa hai mô hình bảo mật JWT Stateless và Session-based Authentication trong ứng dụng Microservices. Trường hợp nào bắt buộc cần cơ chế Token Revocation?"
            </p>
          </div>

          {/* Student Live Response & Audio Recorder */}
          <div className="glass-panel p-6 md:p-7 rounded-[26px] border border-[#5C554C]/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F5F0E8]">
                <User className="w-4 h-4 text-[#C9A876]" /> Thí sinh trả lời (Speech-to-Text trực tiếp)
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border ${
                isRecording 
                  ? 'bg-red-500/20 text-red-300 border-red-500/35 animate-pulse' 
                  : 'bg-[#1C1815]/70 text-[#B8B0A6] border-[#5C554C]/50'
              }`}>
                {isRecording ? 'Microphone: Đang ghi âm...' : 'Microphone: Tạm dừng'}
              </span>
            </div>

            {/* Transcript simulation */}
            <div className="min-h-[140px] p-4 bg-[#1C1815]/85 border border-[#5C554C]/60 rounded-[20px] text-sm text-[#F5F0E8] leading-relaxed font-mono shadow-inner">
              {isRecording ? (
                <span>
                  "Thưa thầy/cô và ban giám khảo AI, đối với mô hình JWT Stateless, máy chủ không cần lưu trạng thái phiên trong bộ nhớ RAM, giúp việc mở rộng quy mô Microservices dễ dàng hơn... Đối với việc Token Revocation, khi người dùng đổi mật khẩu hoặc đăng xuất, ta có thể dùng Redis Blacklist hoặc Refresh Token Rotation..."
                </span>
              ) : (
                <span className="text-[#B8B0A6]/70 italic">
                  Nhấn nút microphone bên dưới để bắt đầu nói câu trả lời của bạn...
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={isRecording ? 'px-6 py-3 rounded-[20px] font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all' : 'btn-liquid-gold px-6 py-3 text-xs'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'Dừng trả lời (Stop)' : 'Bật Mic & Bắt đầu nói'}
              </button>

              <button
                onClick={() => setCurrentTurn((prev) => Math.min(prev + 1, totalTurns))}
                className="btn-liquid-secondary px-5 py-3 text-xs"
              >
                Gửi câu trả lời & Sang câu tiếp <ChevronRight className="w-4 h-4 text-[#C9A876]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Instant Evaluation & Rubric Preview */}
        <div className="space-y-5">
          <div className="glass-card p-6 rounded-[26px] border border-[#C9A876]/35 space-y-4">
            <h3 className="text-sm font-bold text-[#F5F0E8] uppercase tracking-wider flex items-center gap-2 border-b border-[#5C554C]/60 pb-3">
              <Award className="w-4 h-4 text-[#C9A876]" /> Tiêu Chí Chấm Điểm (Rubric)
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#1C1815]/75 rounded-[18px] border border-[#5C554C]/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F5F0E8]">1. Độ chính xác kiến trúc</span>
                  <span className="text-[#C9A876] font-bold">4.0 / 4.0</span>
                </div>
                <p className="text-[11px] text-[#B8B0A6]">Phân biệt chính xác Stateless vs Stateful trong Microservices.</p>
              </div>

              <div className="p-3.5 bg-[#1C1815]/75 rounded-[18px] border border-[#5C554C]/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F5F0E8]">2. Giải pháp Token Revocation</span>
                  <span className="text-[#C9A876] font-bold">3.5 / 4.0</span>
                </div>
                <p className="text-[11px] text-[#B8B0A6]">Nêu được kỹ thuật Blacklist hoặc Rotation có tính khả thi.</p>
              </div>

              <div className="p-3.5 bg-[#1C1815]/75 rounded-[18px] border border-[#5C554C]/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F5F0E8]">3. Kỹ năng diễn đạt & phản xạ</span>
                  <span className="text-[#C9A876] font-bold">1.8 / 2.0</span>
                </div>
                <p className="text-[11px] text-[#B8B0A6]">Phát âm rõ ràng, tốc độ phản xạ đạt tiêu chuẩn.</p>
              </div>
            </div>

            <div className="p-4 rounded-[18px] bg-[#C9A876]/15 border border-[#C9A876]/35 text-xs text-[#E8E2D8] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C9A876] shrink-0 mt-0.5" />
              <span>Điểm số tạm tính lượt này: <strong className="text-[#F5F0E8]">9.3 / 10.0</strong>. AI đang đối chiếu kho vector kiến thức để sinh câu hỏi đào sâu thích ứng tiếp theo.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
