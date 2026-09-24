import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  Printer,
  RotateCcw,
  Shield,
  FileSpreadsheet,
  Check,
  ChevronDown
} from 'lucide-react';

export default function TransactionRevenuePage() {
  const navigate = useNavigate();

  // Filter tabs
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    {
      id: 'ATX-89310',
      studentName: 'Trần Nhật Nam',
      studentId: '20210375',
      course: 'Kiến trúc Máy tính & Vi xử lý',
      method: 'MoMo',
      methodType: 'Ví điện tử',
      methodColor: 'bg-pink-50 text-pink-700 border-pink-200',
      amount: '50.000 đ',
      time: '29/11/2026 14:32:05',
      status: 'SUCCESS',
      statusText: 'SUCCESS',
      action: 'In biên lai',
    },
    {
      id: 'ATX-89309',
      studentName: 'Nguyễn Hoàng Anh',
      studentId: '20210411',
      course: 'Hệ thống Phân tán (Distributed Sys)',
      method: 'VNPay-QR',
      methodType: 'VietQR Interbank',
      methodColor: 'bg-sky-50 text-sky-700 border-sky-200',
      amount: '50.000 đ',
      time: '29/11/2026 14:10:22',
      status: 'SUCCESS',
      statusText: 'SUCCESS',
      action: 'In biên lai',
    },
    {
      id: 'ATX-89308',
      studentName: 'Lê Thị Mai',
      studentId: '20210134',
      course: 'Trí tuệ Nhân tạo Ứng dụng',
      method: 'MoMo',
      methodType: 'Ví điện tử',
      methodColor: 'bg-pink-50 text-pink-700 border-pink-200',
      amount: '50.000 đ',
      time: '29/11/2026 13:55:40',
      status: 'PENDING',
      statusText: 'PENDING',
      action: 'Kiểm tra lại',
    },
    {
      id: 'ATX-89307',
      studentName: 'Phạm Minh Quân',
      studentId: '20209142',
      course: 'An toàn & Bảo mật Thông tin',
      method: 'Napas ATM',
      methodType: 'Thẻ nội địa',
      methodColor: 'bg-slate-100 text-slate-700 border-slate-200',
      amount: '50.000 đ',
      time: '29/11/2026 13:52:11',
      status: 'SUCCESS',
      statusText: 'SUCCESS',
      action: 'In biên lai',
    },
    {
      id: 'ATX-89306',
      studentName: 'Đỗ Tiến Dũng',
      studentId: '20210712',
      course: 'Xử lý Ngôn ngữ Tự nhiên (NLP)',
      method: 'VNPay-QR',
      methodType: 'Hết hạn giao dịch',
      methodColor: 'bg-rose-50 text-rose-700 border-rose-200',
      amount: '50.000 đ',
      time: '29/11/2026 13:42:09',
      status: 'FAILED',
      statusText: 'FAILED',
      action: 'Chi hoàn lại',
    },
    {
      id: 'ATX-89305',
      studentName: 'Vũ Thùy Trang',
      studentId: '20210198',
      course: 'Học máy Nâng cao (Advanced ML)',
      method: 'MoMo',
      methodType: 'Ví điện tử',
      methodColor: 'bg-pink-50 text-pink-700 border-pink-200',
      amount: '50.000 đ',
      time: '29/11/2026 13:28:15',
      status: 'SUCCESS',
      statusText: 'SUCCESS',
      action: 'In biên lai',
    },
  ];

  const filtered = transactions.filter((t) => {
    if (filterTab !== 'ALL' && t.status !== filterTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.studentName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.studentId.includes(q) ||
        t.course.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header Breadcrumb & Actions */}
      <div className="p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Tài chính & Doanh thu</span>
            <span className="text-slate-300">›</span>
            <span className="text-sky-700 font-semibold">Lịch sử giao dịch & Thu chi</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 mt-1">
            Quản trị giao dịch & Doanh thu khảo thí
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi dòng tiền tự động, đối soát tài khoản các cổng ví và thống kê lượt mở ca thi vấn đáp AI.
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Tháng 11/2026</span>
          </div>

          <button
            onClick={() => alert('Xuất file CSV/Excel bảng đối soát giao dịch thành công!')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất CSV/Excel</span>
          </button>

          <button
            onClick={() => alert('Khởi tạo phiên đối soát tự động với ngân hàng BIDV & Napas')}
            className="btn-glacier-primary px-3.5 py-1.5 text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <span>+ Đối soát ngân hàng</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Doanh thu */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            TỔNG DOANH THU THÁNG
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              184,500,000
            </span>
            <span className="text-xs text-slate-500 font-bold">VNĐ</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.2% so với tháng trước</span>
          </div>
        </div>

        {/* Metric 2: Ca thi kích hoạt */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            CA THI THỬ KÍCH HOẠT
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-sky-700 font-mono tracking-tight">
              3,690
            </span>
            <span className="text-xs text-slate-500 font-bold">lượt</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-600 font-semibold pt-1">
            <span className="bg-sky-100 px-1.5 py-0.2 rounded text-[10px] font-bold">+450 ca</span>
            <span>đạt 92% chỉ tiêu</span>
          </div>
        </div>

        {/* Metric 3: Tỷ lệ thành công */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            TỶ LỆ THÀNH CÔNG
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-700 font-mono tracking-tight">
              99.1%
            </span>
            <span className="text-xs text-slate-500 font-bold">(3,711 giao dịch)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
            <span>35 thất bại / hoàn tiền</span>
          </div>
        </div>

        {/* Metric 4: Kênh thanh toán */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            KÊNH THANH TOÁN
          </span>
          <div className="space-y-1.5 text-xs pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600">MoMo</span>
              <span className="font-bold text-pink-600 font-mono">56%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-pink-500" style={{ width: '56%' }}></div>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600">VNPay-QR</span>
              <span className="font-bold text-sky-600 font-mono">34%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-sky-500" style={{ width: '34%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Revenue & Sessions Bar Chart */}
      <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Diễn biến Doanh thu & Ca thi kích hoạt theo tuần
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Phân loại các đợt tăng trưởng đăng ký thi vấn đáp qua các chu kỳ tuần trong tháng 11/2026
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-sky-800"></span>
              <span className="text-slate-600 font-medium">Doanh thu (Triệu VNĐ)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cyan-500"></span>
              <span className="text-slate-600 font-medium">Số ca thi (Lượt)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">4 tuần gần nhất</span>
          </div>
        </div>

        {/* Simulated Bar Visualizer */}
        <div className="grid grid-cols-5 gap-4 pt-4 pb-2 items-end h-52 border-b border-slate-100 px-4">
          {/* Week 1 */}
          <div className="flex flex-col items-center gap-2 h-full justify-end">
            <div className="flex items-end gap-1.5 w-full justify-center h-full">
              <div className="w-6 rounded-t-lg bg-sky-800 shadow-xs" style={{ height: '48%' }}></div>
              <div className="w-6 rounded-t-lg bg-cyan-400 shadow-xs" style={{ height: '40%' }}></div>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-slate-800 block">Tuần 1</span>
              <span className="text-[10px] text-slate-400 font-mono">01/11 - 07/11</span>
            </div>
          </div>

          {/* Week 2 */}
          <div className="flex flex-col items-center gap-2 h-full justify-end">
            <div className="flex items-end gap-1.5 w-full justify-center h-full">
              <div className="w-6 rounded-t-lg bg-sky-800 shadow-xs" style={{ height: '65%' }}></div>
              <div className="w-6 rounded-t-lg bg-cyan-400 shadow-xs" style={{ height: '55%' }}></div>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-slate-800 block">Tuần 2</span>
              <span className="text-[10px] text-slate-400 font-mono">08/11 - 14/11</span>
            </div>
          </div>

          {/* Week 3 (Peak) */}
          <div className="flex flex-col items-center gap-2 h-full justify-end">
            <div className="flex items-end gap-1.5 w-full justify-center h-full">
              <div className="w-6 rounded-t-lg bg-sky-800 shadow-xs" style={{ height: '90%' }}></div>
              <div className="w-6 rounded-t-lg bg-cyan-400 shadow-xs" style={{ height: '80%' }}></div>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-sky-800 block">Tuần 3</span>
              <span className="text-[10px] text-slate-400 font-mono">15/11 - 21/11</span>
            </div>
          </div>

          {/* Week 4 */}
          <div className="flex flex-col items-center gap-2 h-full justify-end">
            <div className="flex items-end gap-1.5 w-full justify-center h-full">
              <div className="w-6 rounded-t-lg bg-sky-800 shadow-xs" style={{ height: '75%' }}></div>
              <div className="w-6 rounded-t-lg bg-cyan-400 shadow-xs" style={{ height: '68%' }}></div>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-slate-800 block">Tuần 4</span>
              <span className="text-[10px] text-slate-400 font-mono">22/11 - 28/11</span>
            </div>
          </div>

          {/* Forecast */}
          <div className="flex flex-col items-center gap-2 h-full justify-end">
            <div className="flex items-end gap-1.5 w-full justify-center h-full">
              <div className="w-6 rounded-t-lg border-2 border-dashed border-sky-400" style={{ height: '35%' }}></div>
              <div className="w-6 rounded-t-lg border-2 border-dashed border-cyan-400" style={{ height: '30%' }}></div>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-slate-500 block">Dự kiến</span>
              <span className="text-[10px] text-slate-400 font-mono">29/11 - 30/11</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Danh sách Giao dịch & Hóa đơn khảo thí
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Lịch sử nạp & ghi nhận tự động qua cổng thanh toán
            </p>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterTab === 'ALL' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Tất cả (3,711)
            </button>
            <button
              onClick={() => setFilterTab('SUCCESS')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterTab === 'SUCCESS' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Thành công (3,690)
            </button>
            <button
              onClick={() => setFilterTab('PENDING')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterTab === 'PENDING' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Đang chờ (12)
            </button>
            <button
              onClick={() => setFilterTab('FAILED')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterTab === 'FAILED' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Thất bại / Hoàn tiền (21)
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã GD, tên thí sinh, MSSV..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-3">Mã giao dịch</th>
                <th className="pb-3 px-3">Thí sinh nộp</th>
                <th className="pb-3 px-3">Môn thi đăng ký</th>
                <th className="pb-3 px-3">Cổng thanh toán</th>
                <th className="pb-3 px-3">Số tiền</th>
                <th className="pb-3 px-3">Thời gian</th>
                <th className="pb-3 px-3">Trạng thái</th>
                <th className="pb-3 pl-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pr-3 font-mono font-bold text-sky-700">
                    {t.id}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div>
                      <span className="font-bold text-slate-900 block">{t.studentName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">MSSV: {t.studentId}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700 font-medium">
                    {t.course}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${t.methodColor}`}>
                      {t.method}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{t.methodType}</span>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap font-mono font-bold text-slate-900">
                    {t.amount}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {t.time}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {t.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        SUCCESS
                      </span>
                    ) : t.status === 'PENDING' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        PENDING
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        FAILED
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => alert(`Thao tác: ${t.action} cho hóa đơn ${t.id}`)}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center justify-end gap-1 ml-auto"
                    >
                      <Printer className="w-3 h-3" />
                      <span>{t.action}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Hiển thị 1 - 6 trên tổng số 3,711 giao dịch</span>
          <div className="flex items-center gap-1 font-mono">
            <button className="px-2.5 py-1 rounded bg-sky-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200">3</button>
            <span>...</span>
            <button className="px-2.5 py-1 rounded border border-slate-200">619</button>
          </div>
        </div>
      </div>
    </div>
  );
}
