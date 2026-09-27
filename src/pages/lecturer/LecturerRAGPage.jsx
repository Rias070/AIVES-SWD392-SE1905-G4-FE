import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  UploadCloud,
  FileText,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Edit3,
  Trash2,
  ExternalLink,
  ChevronRight,
  Database,
  Sliders,
  Check,
  X,
  FileUp,
  Cpu,
  ChevronDown
} from 'lucide-react';

export default function LecturerRAGPage() {
  const navigate = useNavigate();

  // Active states
  const [activeTab, setActiveTab] = useState('rag'); // 'rag' | 'qbank'
  const [selectedQuestionId, setSelectedQuestionId] = useState(3);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock RAG Knowledge documents
  const [ragDocuments, setRagDocuments] = useState([
    {
      id: 1,
      filename: 'Giao_trinh_Giai_thuat_Nang_cao_CS301.pdf',
      uri: 'AWS S3: /cs301/syllabus/doc_01.pdf',
      size: '12.2 MB',
      status: 'vectorizing',
      statusText: 'Vectorizing (82%)',
    },
    {
      id: 2,
      filename: 'Slide_Chuong_4_Do_Thi_Dijkstra_BellmanFord.pdf',
      uri: 'AWS S3: /cs301/slides/ch04_graph.pdf',
      size: '4.8 MB',
      status: 'indexed',
      statusText: 'Đã hoàn thành (Indexed)',
    },
    {
      id: 3,
      filename: 'De_cuong_chi_tiet_Cay_AVL_BTree.docx',
      uri: 'AWS S3: /cs301/syllabus/tree_spec.docx',
      size: '1.1 MB',
      status: 'chunking',
      statusText: 'Chunking (500 tokens)',
    },
    {
      id: 4,
      filename: 'Bai_tap_Lon_Max_Flow_FordFulkerson.pdf',
      uri: 'AWS S3: /cs301/assignment/maxflow.pdf',
      size: '2.2 MB',
      status: 'indexed',
      statusText: 'Đã hoàn thành (Indexed)',
    },
  ]);

  // Mock Questions Bank
  const [questions, setQuestions] = useState([
    {
      id: 1,
      code: 'HQ-104',
      prompt: 'Phân tích độ phức tạp thời gian Binary Heap vs Fibonacci Heap trong thuật toán Dijkstra...',
      source: 'Slide_Chuong_4 - Chunk #38',
      course: 'CS301',
      bloom: 'Bloom 4 - Phân Tích',
      bloomColor: 'bg-purple-50 text-purple-700 border-purple-200',
      rubricCount: '3 tiêu chí (10đ)',
      enabled: true,
    },
    {
      id: 2,
      code: 'HQ-103',
      prompt: 'Trình bày điều kiện cân bằng trong cây AVL và phân tích 4 phép xoay cơ bản...',
      source: 'De_cuong_chi_tiet_Cay_AVL - Chunk #14',
      course: 'CS301',
      bloom: 'Bloom 2 - Hiểu',
      bloomColor: 'bg-blue-50 text-blue-700 border-blue-200',
      rubricCount: '4 tiêu chí (10đ)',
      enabled: true,
    },
    {
      id: 3,
      code: 'HQ-105',
      prompt: 'Tại sao Dijkstra thất bại trên đồ thị có trọng số âm? Trình bày phản ví dụ và đối chiếu Bellman-Ford.',
      source: 'Slide_Chuong_4 - Chunk #42',
      course: 'CS301',
      bloom: 'Bloom 5 - Đánh giá',
      bloomColor: 'bg-amber-50 text-amber-700 border-amber-200',
      rubricCount: '3 tiêu chí (10đ)',
      enabled: true,
      hasBarem: true,
    },
    {
      id: 4,
      code: 'HQ-107',
      prompt: 'Ứng dụng thực tiễn của B+Tree trong cấu trúc Indexing cơ sở dữ liệu quan hệ...',
      source: 'Giao_trinh_CS301 - Chunk #125',
      course: 'CS301',
      bloom: 'Bloom 3 - Áp dụng',
      bloomColor: 'bg-sky-50 text-sky-700 border-sky-200',
      rubricCount: '2 tiêu chí (10đ)',
      enabled: false,
    },
  ]);

  const toggleQuestionStatus = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, enabled: !q.enabled } : q));
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setRagDocuments([
        {
          id: Date.now(),
          filename: 'Syllabus_Moi_Cap_Nhat_2026.pdf',
          uri: 'AWS S3: /cs301/syllabus/syllabus_2026.pdf',
          size: '3.4 MB',
          status: 'vectorizing',
          statusText: 'Vectorizing (5%)',
        },
        ...ragDocuments,
      ]);
      alert('Tài liệu đã được tải lên S3 và bắt đầu Chunking + Vectorizing!');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner Navigation */}
      <div className="p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Cổng Giảng viên</span>
          <span className="text-slate-300">›</span>
          <span className="text-slate-500 font-medium">Quản lý học liệu</span>
          <span className="text-slate-300">›</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">CS301</span>
            <span>Cấu trúc Dữ liệu & Giải thuật nâng cao</span>
          </div>
        </div>

        {/* Generate CTA Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/generate')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-sky-600 hover:from-amber-600 hover:to-sky-700 text-white text-xs font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ AI Generate Questions</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Left Knowledge & Questions (8 cols) / Right Rubric Barem (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT MAIN (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Selector Tabs & Filters */}
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('rag')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'rag'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4 text-sky-600" />
                <span>Tài liệu môn học (RAG Knowledge Base)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 font-mono">
                  12 files
                </span>
              </button>

              <button
                onClick={() => setActiveTab('qbank')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'qbank'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Ngân hàng câu hỏi & Barem</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-mono">
                  45 câu
                </span>
              </button>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 text-xs">
              <select className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none">
                <option>Học kỳ 1 (2024-2025)</option>
                <option>Học kỳ 2 (2024-2025)</option>
              </select>
              <select className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none">
                <option>Học phần: CS301 (CTDL&GT)</option>
                <option>Học phần: AI204 (Machine Learning)</option>
              </select>
            </div>
          </div>

          {/* DRAG AND DROP UPLOAD PANEL */}
          <div className="p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-xl border-2 border-dashed border-sky-300 hover:border-sky-500 transition-colors shadow-xs text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-sm">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-bold text-slate-900">
                Kéo-thả tài liệu giáo trình, slide bài giảng hoặc đề cương môn học vào đây
              </h3>
              <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
                Hệ thống hỗ trợ <strong>PDF, DOCX, TXT</strong>. Tài liệu được mã hóa lưu trữ trên <strong>AWS S3</strong> và tự động thực hiện tiến trình:
              </p>
            </div>

            {/* Pipeline Step Badges */}
            <div className="flex items-center justify-center flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Uploading → S3
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                Chunking (500 tokens)
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold">
                Vectorizing (OpenAI text-embed-3)
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSimulateUpload}
                disabled={isUploading}
                className="btn-glacier-primary px-5 py-2.5 text-xs font-semibold shadow-md shadow-sky-500/25 flex items-center gap-2"
              >
                <FileUp className="w-4 h-4" />
                <span>{isUploading ? 'Đang nạp S3 & Chunking...' : 'Duyệt tập tin từ máy tính'}</span>
              </button>

              <button
                onClick={() => alert('Kết nối LMS Canvas / Moodle API đồng bộ đề cương')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
              >
                Nhập từ Google Drive / LMS Moodle
              </button>
            </div>
          </div>

          {/* RAG DOCUMENTS TABLE */}
          <div className="p-5 md:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  Danh sách học liệu đã nạp & Trạng thái Vector RAG
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Quản trị kho tri thức phục vụ sinh đề thi vấn đáp thông minh
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Tên tài liệu & Định dạng</th>
                    <th className="pb-3 px-4">Dung lượng</th>
                    <th className="pb-3 pl-4 text-right">Trạng thái xử lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ragDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-snug">
                              {doc.filename}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {doc.uri}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono">
                        {doc.size}
                      </td>

                      <td className="py-3 pl-4 text-right whitespace-nowrap">
                        {doc.status === 'indexed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {doc.statusText}
                          </span>
                        ) : doc.status === 'vectorizing' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            <Cpu className="w-3 h-3 text-amber-600 animate-spin" />
                            {doc.statusText}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                            <Clock className="w-3 h-3 text-sky-600" />
                            {doc.statusText}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QUESTIONS BANK WITH BLOOM LEVEL */}
          <div className="p-5 md:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Ngân hàng câu hỏi vấn đáp AI & Phân loại Bloom
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Trích xuất tự động từ RAG chuẩn hoặc do giảng viên tinh chỉnh
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lọc Bloom</span>
                </button>
                <button
                  onClick={() => navigate('/generate')}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Soạn câu hỏi thủ công</span>
                </button>
              </div>
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Nội dung câu hỏi (Prompt)</th>
                    <th className="pb-3 px-3">Môn học</th>
                    <th className="pb-3 px-3">Cấp độ Bloom</th>
                    <th className="pb-3 px-3">Barem/Rubric</th>
                    <th className="pb-3 px-3">Duyệt thi</th>
                    <th className="pb-3 pl-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {questions.map((q) => {
                    const isSelected = selectedQuestionId === q.id;
                    return (
                      <tr
                        key={q.id}
                        onClick={() => setSelectedQuestionId(q.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-sky-50/80' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Prompt */}
                        <td className="py-3.5 pr-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {q.code}
                            </span>
                            <p className="font-semibold text-slate-800 line-clamp-2 leading-snug">
                              {q.prompt}
                            </p>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Nguồn: {q.source}
                            </span>
                          </div>
                        </td>

                        {/* Course */}
                        <td className="py-3.5 px-3 whitespace-nowrap font-mono text-slate-700 font-bold">
                          {q.course}
                        </td>

                        {/* Bloom */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${q.bloomColor}`}>
                            {q.bloom}
                          </span>
                        </td>

                        {/* Rubric */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-[11px] text-slate-600 font-medium">
                            {q.rubricCount}
                          </span>
                        </td>

                        {/* Toggle */}
                        <td className="py-3.5 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleQuestionStatus(q.id)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                              q.enabled ? 'bg-sky-600' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                q.enabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            ></div>
                          </button>
                        </td>

                        {/* Edit Icon */}
                        <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                          <button className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= RIGHT DRAWER: RUBRIC & BAREM (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Mã: RUB-CS301-03
              </span>
              <h2 className="text-sm font-bold text-slate-900 mt-2">
                Chi tiết Rubric & Barem điểm chấm thi
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Dành cho câu hỏi: <strong>"Thuật toán Dijkstra trên đồ thị có trọng số âm & Cho ví dụ phản biện"</strong>
              </p>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Tổng thang điểm</span>
                <p className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">10.0</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Số tiêu chí</span>
                <p className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">3 mục</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Bloom Target</span>
                <p className="text-sm font-extrabold text-amber-700 font-mono mt-0.5">Mức 5</p>
              </div>
            </div>

            {/* Criteria 1 */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  Tiêu chí 1
                </span>
                <span className="font-mono font-bold text-slate-900">
                  Điểm tối đa: <strong className="text-sky-700">4.0 / 10</strong>
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                Tính chính xác giải thuật (Core Algorithm Accuracy)
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Giải thích rõ ràng cơ chế Greedy gán nhãn cố định (permanent label) khi chọn đỉnh u có d[u] nhỏ nhất và lý do không thể đảo ngược khi gặp trọng số âm.
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500">
                <span>Độ khắt khe: <strong>Cao (Strict)</strong></span>
                <button className="text-sky-600 hover:underline">Sửa mô tả ›</button>
              </div>
            </div>

            {/* Criteria 2 */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  Tiêu chí 2
                </span>
                <span className="font-mono font-bold text-slate-900">
                  Điểm tối đa: <strong className="text-sky-700">3.5 / 10</strong>
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                Tư duy phản biện & Minh họa phản ví dụ (Counter-example)
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Đưa ra đồ thị 3 đỉnh tối thiểu (A → B: 4, A → C: 2, C → B: -3) chứng minh sai số tìm đường đi ngắn nhất của Dijkstra.
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500">
                <span>Độ khắt khe: <strong>Trung bình</strong></span>
                <button className="text-sky-600 hover:underline">Sửa mô tả ›</button>
              </div>
            </div>

            {/* Criteria 3 */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  Tiêu chí 3
                </span>
                <span className="font-mono font-bold text-slate-900">
                  Điểm tối đa: <strong className="text-sky-700">2.5 / 10</strong>
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                So sánh phương án thay thế (Bellman-Ford / SPFA)
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Nêu được nguyên lý Relaxing |V|-1 lần, độ phức tạp O(V*E) và cơ chế phát hiện Negative Cycle qua lần lặp thứ |V|.
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500">
                <span>Độ khắt khe: <strong>Cơ bản</strong></span>
                <button className="text-sky-600 hover:underline">Sửa mô tả ›</button>
              </div>
            </div>

            {/* Add new criteria button */}
            <button
              onClick={() => alert('Thêm tiêu chí đánh giá mới vào Rubric Barem')}
              className="w-full py-2.5 rounded-xl border border-dashed border-sky-300 hover:bg-sky-50 text-xs font-semibold text-sky-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tiêu chí chấm điểm mới</span>
            </button>

            {/* Save Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => alert('Barem điểm chấm thi đã được cập nhật thành công lên Vector Database!')}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-sky-600 hover:from-amber-600 hover:to-sky-700 text-white text-xs font-bold shadow-sm shadow-amber-500/20 transition-all text-center"
              >
                Lưu thay đổi Barem
              </button>
              <button
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
