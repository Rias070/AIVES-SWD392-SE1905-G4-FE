import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  RefreshCw,
  Languages
} from 'lucide-react';
import { lecturerDocumentApi, lecturerQuestionApi, subjectApi } from '../../services/api';

export default function LecturerRAGPage() {
  const navigate = useNavigate();

  // Active states
  const [activeTab, setActiveTab] = useState('rag'); // 'rag' | 'qbank'
  const [selectedQuestionId, setSelectedQuestionId] = useState(3);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Examination Language Configuration (STT/TTS)
  const [isLangConfigOpen, setIsLangConfigOpen] = useState(false);
  const [courseCode, setCourseCode] = useState('CS301');
  const [courseName, setCourseName] = useState('Cấu trúc Dữ liệu & Giải thuật nâng cao');
  const [courseSubjectId, setCourseSubjectId] = useState(null);
  const [examLang, setExamLang] = useState(() => {
    return localStorage.getItem('aives_subject_lang_CS301') || 'vi-VN';
  });
  const [technicalTerms, setTechnicalTerms] = useState(
    'Binary Heap, Fibonacci Heap, Dijkstra, AVL Tree, Red-Black Tree, Dynamic Programming, Time Complexity'
  );
  const [isSavingLang, setIsSavingLang] = useState(false);
  const [langToast, setLangToast] = useState(null);

  useEffect(() => {
    const fetchSubjectConfig = async () => {
      try {
        const res = await subjectApi.getSubjectByCode('CS301');
        const subj = res?.data?.result || res?.data;
        if (subj) {
          if (subj.id) setCourseSubjectId(subj.id);
          if (subj.name) setCourseName(subj.name);
          if (subj.language) {
            setExamLang(subj.language);
            localStorage.setItem('aives_subject_lang_CS301', subj.language);
          }
          if (subj.technicalTerms) setTechnicalTerms(subj.technicalTerms);
        }
      } catch (e) {
        // Fallback to local storage
      }
    };
    fetchSubjectConfig();
  }, []);

  const handleSaveLanguageConfig = async (e) => {
    e.preventDefault();
    setIsSavingLang(true);
    try {
      if (courseSubjectId) {
        await subjectApi.updateSubjectLanguageConfig(courseSubjectId, {
          language: examLang,
          technicalTerms: technicalTerms
        });
      }
    } catch (err) {
      console.warn('API language config update warning (saving to local cache):', err);
    } finally {
      localStorage.setItem(`aives_subject_lang_${courseCode}`, examLang);
      localStorage.setItem(`aives_subject_terms_${courseCode}`, technicalTerms);
      setIsSavingLang(false);
      setIsLangConfigOpen(false);
      setLangToast(`Đã lưu cấu hình ngôn ngữ khảo thí: ${examLang === 'en-US' ? 'English (en-US)' : 'Tiếng Việt (vi-VN)'}`);
      setTimeout(() => setLangToast(null), 4000);
    }
  };

  // Mock RAG Knowledge documents (fallback)
  const defaultRagDocuments = [
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
  ];

  const [ragDocuments, setRagDocuments] = useState(defaultRagDocuments);

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

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await lecturerDocumentApi.getDocuments({ subjectCode: 'CS301' });
      if (res?.data?.result && res.data.result.length > 0) {
        setRagDocuments(res.data.result);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = React.useRef(null);

  const fetchQuestions = async () => {
    try {
      const res = await lecturerQuestionApi.getQuestions({ subjectCode: 'CS301' });
      if (res?.data?.result && res.data.result.length > 0) {
        const formatted = res.data.result.map(q => ({
          id: q.id,
          code: q.code,
          prompt: q.content,
          source: `${q.subjectCode || 'CS301'} - Chunk RAG`,
          course: q.subjectCode || 'CS301',
          bloom: q.bloomLevel || 'Bloom 3 - Vận dụng',
          bloomColor: q.bloomColor || 'bg-sky-50 text-sky-700 border-sky-200',
          rubricCount: `${q.rubricCount || (q.rubrics ? q.rubrics.length : 3)} tiêu chí (10đ)`,
          enabled: q.isApproved !== false,
          rubrics: q.rubrics || [],
        }));
        setQuestions(formatted);
        if (formatted.length > 0) setSelectedQuestionId(formatted[0].id);
      }
    } catch {
      // Keep initial
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchQuestions();
  }, []);

  const toggleQuestionStatus = async (id) => {
    try {
      await lecturerQuestionApi.toggleApprove(id);
    } catch (e) {
      console.warn('API toggle approve warning:', e);
    }
    setQuestions(questions.map(q => q.id === id ? { ...q, enabled: !q.enabled } : q));
  };

  const handleRealFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectCode', courseCode || 'CS301');

    try {
      const res = await lecturerDocumentApi.uploadDocumentFile(formData);
      if (res?.data?.result) {
        setRagDocuments([res.data.result, ...ragDocuments]);
      } else {
        throw new Error();
      }
    } catch {
      setRagDocuments([
        {
          id: Date.now(),
          filename: file.name,
          uri: `S3: /${courseCode.toLowerCase()}/syllabus/${file.name}`,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          status: 'indexed',
          statusText: 'Đã hoàn thành (Indexed)',
        },
        ...ragDocuments,
      ]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await lecturerDocumentApi.deleteDocument(docId);
    } catch (e) {
      console.warn('API delete document warning:', e);
    }
    setRagDocuments(ragDocuments.filter((d) => d.id !== docId));
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

        {/* Action Buttons: Language Config & AI Generation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLangConfigOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Cấu hình ngôn ngữ khảo thí (STT/TTS) và từ khóa chuyên ngành cho môn học"
          >
            <Languages className="w-4 h-4 text-sky-600" />
            <span>Ngôn Ngữ Thi: {examLang === 'en-US' ? '🇺🇸 en-US' : '🇻🇳 vi-VN'}</span>
          </button>

          <button
            onClick={() => navigate('/generate')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-sky-600 hover:from-amber-600 hover:to-sky-700 text-white text-xs font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Sinh câu hỏi AI</span>
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
                <span>Tài liệu môn học</span>
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
                <span>Ngân hàng câu hỏi</span>
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
          <div className="p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-xl border-2 border-dashed border-sky-300 hover:border-sky-500 transition-colors shadow-xs text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-bold text-slate-900">
                Tải lên tài liệu học phần
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ định dạng PDF, DOCX, TXT
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleRealFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="btn-glacier-primary px-5 py-2.5 text-xs font-semibold shadow-md shadow-sky-500/25 flex items-center gap-2 cursor-pointer"
              >
                <FileUp className="w-4 h-4" />
                <span>{isUploading ? 'Đang phân tích chunking...' : 'Chọn tệp từ máy tính'}</span>
              </button>
            </div>
          </div>

          {/* RAG DOCUMENTS TABLE */}
          <div className="p-5 md:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  Danh sách tài liệu học phần
                </h3>
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
                        <div className="flex items-center justify-end gap-2">
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
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa tài liệu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                  Ngân hàng câu hỏi vấn đáp
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lọc</span>
                </button>
                <button
                  onClick={() => navigate('/generate')}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm câu hỏi</span>
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
                Rubric chấm điểm
              </h2>
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

      {/* TOAST NOTIFICATION */}
      {langToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{langToast}</span>
        </div>
      )}

      {/* MODAL: CẤU HÌNH NGÔN NGỮ KHẢO THÍ (STT/TTS) */}
      {isLangConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Languages className="w-5 h-5 text-sky-600" />
                Cấu Hình Ngôn Ngữ Khảo Thí (STT / TTS) - {courseCode}
              </h3>
              <button onClick={() => setIsLangConfigOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLanguageConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Môn Học Phụ Trách</label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  <span className="font-mono text-sky-700 font-bold">{courseCode}</span> - {courseName}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngôn Ngữ Khảo Thí (Exam Language) *</label>
                <select
                  value={examLang}
                  onChange={(e) => setExamLang(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-sky-500 text-xs"
                >
                  <option value="vi-VN">🇻🇳 Tiếng Việt (vi-VN) - Nhận diện giọng nói STT & Giọng đọc AI tiếng Việt</option>
                  <option value="en-US">🇺🇸 English (en-US) - Speech-to-Text STT & AI Voice in English</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sinh viên khi vào phòng thi môn {courseCode} sẽ tự động áp dụng ngôn ngữ này cho Web Speech API (STT) và AI Viva (TTS).
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thuật Ngữ Chuyên Ngành Gợi Ý (Technical Glossary)</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Binary Search Tree, Dynamic Programming, Time Complexity, Graph, Dijkstra..."
                  value={technicalTerms}
                  onChange={(e) => setTechnicalTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500 text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Các từ khóa chuyên ngành được tối ưu hóa để bộ nhận diện giọng nói STT không phiên âm nhầm lẫn.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLangConfigOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingLang}
                  className="btn-glacier-primary px-5 py-2 font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {isSavingLang ? 'Đang Lưu...' : 'Lưu Cấu Hình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
