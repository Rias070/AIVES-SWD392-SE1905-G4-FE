import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Radio,
  BookOpen,
  Calendar,
  Volume2,
  FileText,
  User,
  ExternalLink
} from 'lucide-react';

export default function MockPaymentPage({ currentUser }) {
  const navigate = useNavigate();
  const studentName = currentUser?.fullName || 'Đặng Nhật Minh';
  const studentId = currentUser?.email ? currentUser.email.split('@')[0].toUpperCase() : '20210692';

  // State
  const [selectedMethod, setSelectedMethod] = useState('vnpay'); // 'vnpay' | 'momo' | 'napas' | 'smartcard'
  const [examinerVoice, setExaminerVoice] = useState('male_north'); // 'male_north' | 'female_south'
  const [enableRadarReport, setEnableRadarReport] = useState(true);
  const [countdown, setCountdownSeconds] = useState(894); // 14:54
  const [isCopied, setIsCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' | 'success'

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('98214-AIVES');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      alert('Hệ thống đã nhận diện thanh toán thành công qua cổng VietQR Napas! Chuyển tiếp bạn sang bước Kiểm tra thiết bị.');
      navigate('/device-check');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Breadcrumb & User Bar */}
      <div className="p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Sinh viên</span>
            <span className="text-slate-300">›</span>
            <span>Luyện thi thử</span>
            <span className="text-slate-300">›</span>
            <span className="text-sky-700 font-semibold">Thanh toán</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-base md:text-lg font-bold text-slate-900">
              Đăng ký ca thi thử & Thanh toán lệ phí
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              CS301-MOCK
            </span>
          </div>
        </div>

        {/* Right Student Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="font-bold text-slate-800 block">{studentName}</span>
            <span className="text-[10px] text-slate-400 font-mono">MSSV: {studentId} • Khoa CNTT</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-sky-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {studentName.charAt(0)}
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT MAIN (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Exam Info & Adaptive Pipeline */}
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                THÔNG TIN PHIÊN VẤN ĐÁP AI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono">
                Mock Exam #04
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  CS301 - Cấu trúc dữ liệu & Giải thuật nâng cao
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mô phỏng hội đồng viva học thuật theo giáo trình chuẩn quốc tế ACM/IEEE
                </p>
              </div>
            </div>

            {/* 3 Stats Mini Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Giảng viên cố vấn</span>
                <p className="text-xs font-bold text-slate-800">TS. Lê Quang</p>
                <span className="text-[10px] text-slate-500 block">Bộ môn Khoa học Máy tính</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Thời lượng thi</span>
                <p className="text-xs font-bold text-slate-800">30 phút</p>
                <span className="text-[10px] text-slate-500 block">5 câu hỏi phân loại Bloom 1-5</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Ngân hàng đề thi</span>
                <p className="text-xs font-bold text-sky-700">RAG v4.2 Vector</p>
                <span className="text-[10px] text-slate-500 block">Cập nhật 24h trước</span>
              </div>
            </div>

            {/* Bloom Adaptive Difficulty Pipeline */}
            <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Phổ độ khó thích ứng (Adaptive Viva Pipeline)</span>
                <span className="text-[10px] font-bold text-sky-700 font-mono">Active Pipeline</span>
              </div>

              <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                <div className="p-1.5 rounded-lg bg-white border border-sky-200 font-medium text-slate-700">
                  B1: Nhớ
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-sky-200 font-medium text-slate-700">
                  B2: Hiểu
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-sky-200 font-medium text-slate-700">
                  B3: Áp dụng
                </div>
                <div className="p-1.5 rounded-lg bg-sky-500 text-white font-bold shadow-xs">
                  B4: Phân tích
                </div>
                <div className="p-1.5 rounded-lg bg-cyan-600 text-white font-bold shadow-xs">
                  B5: Đánh giá
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Examiner Parameters Config */}
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Cấu hình tham số ca thi & AI Giám khảo
              </h3>
              <span className="text-xs text-slate-400 font-mono">Option Settings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Rubric mode */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CHẾ ĐỘ CHẤM CHUẨN</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Rubric Khoa CNTT 2024</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Đánh giá logic thuật toán, độ phức tạp Time/Space và khả năng biện luận trực tiếp.
                </p>
              </div>

              {/* Box 2: AI Voice Selection */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GIỌNG ĐỌC AI GIÁM KHẢO</span>
                <div className="space-y-1.5">
                  <label
                    onClick={() => setExaminerVoice('male_north')}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      examinerVoice === 'male_north'
                        ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <span>Giọng Nam miền Bắc (Chuẩn hàn lâm)</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-200 text-sky-800">
                      Fast TTS
                    </span>
                  </label>

                  <label
                    onClick={() => setExaminerVoice('female_south')}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      examinerVoice === 'female_south'
                        ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <span>Giọng Nữ miền Nam (Tự nhiên)</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      Neutral
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Toggle Radar report */}
            <div className="p-3.5 rounded-xl bg-sky-50/40 border border-sky-200/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Báo cáo chuyên sâu STT & Biện luận phản biện</h4>
                  <p className="text-[11px] text-slate-500">
                    Xuất file PDF phân tích biểu đồ Radar điểm mạnh/yếu ngay sau khi hoàn thành.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEnableRadarReport(!enableRadarReport)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                  enableRadarReport ? 'bg-sky-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    enableRadarReport ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Card 3: Payment Methods Selection */}
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-600" />
                Phương thức thanh toán
              </h3>
              <span className="text-xs text-slate-400 font-medium">Bảo mật mã hóa SSL 256-bit</span>
            </div>

            {/* 4 Methods Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* VNPay-QR */}
              <button
                type="button"
                onClick={() => setSelectedMethod('vnpay')}
                className={`p-3.5 rounded-xl border text-center space-y-2 transition-all ${
                  selectedMethod === 'vnpay'
                    ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-xs ring-2 ring-sky-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 mx-auto rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">VNPay-QR</span>
                  <span className="text-[10px] text-sky-600 font-semibold">Quét tức thì</span>
                </div>
              </button>

              {/* MoMo */}
              <button
                type="button"
                onClick={() => setSelectedMethod('momo')}
                className={`p-3.5 rounded-xl border text-center space-y-2 transition-all ${
                  selectedMethod === 'momo'
                    ? 'border-pink-500 bg-pink-50 text-pink-800 shadow-xs ring-2 ring-pink-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 mx-auto rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                  MoMo
                </div>
                <div>
                  <span className="text-xs font-bold block">Ví MoMo</span>
                  <span className="text-[10px] text-slate-400">Ví điện tử</span>
                </div>
              </button>

              {/* ATM Napas */}
              <button
                type="button"
                onClick={() => setSelectedMethod('napas')}
                className={`p-3.5 rounded-xl border text-center space-y-2 transition-all ${
                  selectedMethod === 'napas'
                    ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-xs ring-2 ring-sky-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 mx-auto rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Thẻ ATM nội địa</span>
                  <span className="text-[10px] text-slate-400">Napas 24/7</span>
                </div>
              </button>

              {/* SmartCard */}
              <button
                type="button"
                onClick={() => setSelectedMethod('smartcard')}
                className={`p-3.5 rounded-xl border text-center space-y-2 transition-all ${
                  selectedMethod === 'smartcard'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs ring-2 ring-amber-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 mx-auto rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  🎓
                </div>
                <div>
                  <span className="text-xs font-bold block">Thẻ Sinh Viên</span>
                  <span className="text-[10px] text-slate-400">SmartCard</span>
                </div>
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Giao dịch được bảo hộ bởi Cổng Thanh toán Quốc gia. Hoàn trả lệ phí 100% nếu có sự cố đường truyền AI Server.</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT INVOICE & QR (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  HÓA ĐƠN THANH TOÁN LỆ PHÍ
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Xác nhận đăng ký thi</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-sky-700 block">#VIVA-PAY-98214</span>
                <span className="text-[10px] text-slate-400">Hạn 15 phút</span>
              </div>
            </div>

            {/* QR Box with countdown */}
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-center space-y-3">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Đang chờ quét mã...
                </span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {formatCountdown(countdown)}
                </span>
              </div>

              {/* VietQR Visualizer */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-inner flex flex-col items-center justify-center space-y-2">
                <div className="relative w-44 h-44 rounded-lg bg-slate-900 p-3 flex items-center justify-center">
                  {/* Simulated SVG QR pattern */}
                  <div className="w-full h-full bg-white rounded p-2 flex items-center justify-center relative">
                    <div className="grid grid-cols-6 gap-1 w-full h-full opacity-80">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            (i % 2 === 0 || i % 5 === 0) ? 'bg-slate-900' : 'bg-transparent'
                          }`}
                        ></div>
                      ))}
                    </div>
                    {/* Center Icon */}
                    <div className="absolute inset-0 m-auto w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-md">
                      <QrCode className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-800">VietQR Pro • BIDV</p>
                  <div className="flex items-center justify-center gap-1 font-mono text-sky-700 font-bold">
                    <span>98214-AIVES</span>
                    <button onClick={handleCopyAccount} className="text-slate-400 hover:text-slate-700">
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                Mở ứng dụng ngân hàng hoặc MoMo / VNPay để quét mã QR chuyển khoản tự động
              </p>
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-slate-600">
                <span>Mức phí thi thử (30 phút AI Viva)</span>
                <span className="font-mono font-semibold text-slate-800">50.000 VNĐ</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Phí đối soát WebRTC & AI Token</span>
                <span className="text-emerald-600 font-semibold">0 VNĐ (Miễn phí)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Thuế VAT (0% Giáo dục)</span>
                <span className="font-mono text-slate-400">0 VNĐ</span>
              </div>

              <div className="flex items-center justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-2">
                <span>Tổng thanh toán</span>
                <span className="text-lg font-extrabold text-sky-700 font-mono">50.000 VNĐ</span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">Bao gồm bản ghi âm & báo cáo rubric</p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận đã chuyển khoản</span>
              </button>

              <Link
                to="/device-check"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Vào phòng kiểm tra thiết bị</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Status box */}
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-medium">Trạng thái phòng thi:</span>
                <p className="font-bold text-amber-700">PENDING</p>
                <p className="text-[10px] text-slate-400">Đang kết nối cổng đối soát ngân hàng Napas...</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Chờ lệ phí
              </span>
            </div>
          </div>

          {/* Quick tip */}
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Quy chuẩn phòng thi ảo Viva</span>
            </div>
            <p>
              Sinh viên cần chuẩn bị Microphone, Webcam HD và giữ không gian yên tĩnh trong suốt 30 phút thi vấn đáp AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
