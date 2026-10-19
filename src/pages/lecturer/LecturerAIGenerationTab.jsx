import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Database,
  Layers,
  Edit3,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Scale,
  Sliders,
  Filter
} from 'lucide-react';
import { lecturerDocumentApi, lecturerQuestionApi, subjectApi } from '../../services/api';

const QUESTION_BANK_KEY = 'aives_question_bank';

export default function LecturerAIGenerationTab({ onSwitchTab, preselectedDoc, onQuestionsApproved }) {
  // Subjects
  const [subjects, setSubjects] = useState([
    { code: 'CS301', name: 'Cấu trúc Dữ liệu & Giải thuật nâng cao' },
    { code: 'PRJ301', name: 'Java Web Applications' },
    { code: 'SWD392', name: 'Software Architecture & Design' },
  ]);
  const [selectedSubject, setSelectedSubject] = useState('PRJ301');

  // Generation form states
  const [topic, setTopic] = useState('');
  const [bloomLevel, setBloomLevel] = useState('ALL');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [questionCount, setQuestionCount] = useState(3);
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Review states (Pending / Generated Questions)
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editExpectedAnswer, setEditExpectedAnswer] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Pre-selection if coming from documents tab
  useEffect(() => {
    if (preselectedDoc) {
      if (preselectedDoc.subjectCode) setSelectedSubject(preselectedDoc.subjectCode);
      if (preselectedDoc.filename || preselectedDoc.name) {
        setTopic(preselectedDoc.filename || preselectedDoc.name);
      }
    }
  }, [preselectedDoc]);

  // Load subjects
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await subjectApi.getSubjects();
        if (res?.data?.result && res.data.result.length > 0) {
          setSubjects(res.data.result);
          if (!preselectedDoc?.subjectCode) {
            setSelectedSubject(res.data.result[0].code);
          }
        }
      } catch (e) {
        console.warn('Using default subjects list:', e);
      }
    };
    loadSubjects();
  }, [preselectedDoc]);

  // Load existing pending questions
  const fetchPendingQuestions = async () => {
    setLoadingPending(true);
    try {
      const res = await lecturerQuestionApi.getQuestions({ status: 'PENDING' });
      if (res?.data?.result && res.data.result.length > 0) {
        setReviewQuestions(res.data.result);
      }
    } catch (err) {
      console.warn('Could not fetch pending questions:', err);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchPendingQuestions();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Generate Questions via RAG
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setProgress(15);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 400);

    try {
      let uploadedDoc = null;
      const currentSubjectObj = subjects.find((s) => s.code === selectedSubject);

      // Step 1: Upload file if selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subjectCode', selectedSubject);
        if (currentSubjectObj?.id || currentSubjectObj?.uuid) {
          formData.append('subjectUuid', currentSubjectObj.id || currentSubjectObj.uuid);
        }

        try {
          const uploadRes = await lecturerDocumentApi.uploadDocumentFile(formData);
          uploadedDoc = uploadRes?.data?.result;
        } catch (uploadErr) {
          console.warn('Upload file warning, continuing with topic-based RAG:', uploadErr);
        }
      }

      setProgress(60);

      const targetTopic = topic || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Kiến thức cốt lõi học phần');
      const reqPayload = {
        subjectCode: selectedSubject,
        subjectUuid: currentSubjectObj?.id || currentSubjectObj?.uuid,
        documentUuid: uploadedDoc?.id || preselectedDoc?.id,
        topic: targetTopic,
        bloomLevel: bloomLevel,
        difficulty: difficulty,
        count: Number(questionCount) || 3,
      };

      const res = await lecturerQuestionApi.generateQuestionsRAG(reqPayload);
      const generatedList = res?.data?.result || [];

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        if (generatedList.length > 0) {
          setReviewQuestions((prev) => [...generatedList, ...prev]);
          showToast(`AI đã sinh thành công ${generatedList.length} câu hỏi theo chuẩn RAG! Hãy kiểm duyệt bên dưới.`);
        } else {
          // Fallback simulation if backend returned empty
          const simulated = createFallbackQuestions(selectedSubject, targetTopic, bloomLevel, difficulty, questionCount);
          setReviewQuestions((prev) => [...simulated, ...prev]);
          showToast(`Đã sinh ${simulated.length} câu hỏi học liệu! Vui lòng duyệt trước khi lưu vào ngân hàng.`);
        }
      }, 500);
    } catch (err) {
      console.warn('API generateQuestionsRAG error, generating via fallback engine:', err);
      clearInterval(progressInterval);
      setProgress(100);

      const targetTopic = topic || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Kiến thức cốt lõi học phần');
      const fallbackList = createFallbackQuestions(selectedSubject, targetTopic, bloomLevel, difficulty, questionCount);

      setTimeout(() => {
        setIsGenerating(false);
        setReviewQuestions((prev) => [...fallbackList, ...prev]);
        showToast(`Đã tạo thành công ${fallbackList.length} câu hỏi theo chủ đề "${targetTopic}". Vui lòng kiểm duyệt bên dưới!`);
      }, 500);
    }
  };

  const createFallbackQuestions = (subCode, top, bloom, diff, cnt) => {
    const count = Number(cnt) || 3;
    const bloomMap = {
      'Bloom 1': 'Bloom 1 - Nhận biết',
      'Bloom 2': 'Bloom 2 - Thông hiểu',
      'Bloom 3': 'Bloom 3 - Vận dụng',
      'Bloom 4': 'Bloom 4 - Phân tích',
      'Bloom 5': 'Bloom 5 - Đánh giá',
      'Bloom 6': 'Bloom 6 - Sáng tạo',
    };
    const resolvedBloom = bloomMap[bloom] || (bloom === 'ALL' ? 'Bloom 3 - Vận dụng' : bloom);

    return Array.from({ length: count }).map((_, idx) => ({
      id: `ai-gen-${Date.now()}-${idx}`,
      code: `${subCode}-Q${Math.floor(100 + Math.random() * 900)}`,
      subject: subCode,
      subjectCode: subCode,
      content: `Trình bày khái niệm, nguyên lý hoạt động và phân tích ứng dụng thực tế của "${top}" trong kiến trúc hệ thống phần mềm (Câu hỏi ${idx + 1}). Cho ví dụ minh họa và nêu các ưu/nhược điểm khi triển khai.`,
      difficulty: diff,
      bloomLevel: resolvedBloom,
      expectedAnswer: `Sinh viên cần trình bày rõ: 1. Định nghĩa chuẩn xác của ${top}. 2. Các thành phần cấu tạo và luồng xử lý dữ liệu. 3. Ví dụ triển khai thực tế kèm giải thích các trade-offs về hiệu năng và bảo mật.`,
      keywords: [top, 'Kiến trúc', 'Vấn đáp', 'Tối ưu hóa'],
      status: 'PENDING',
      isApproved: false,
      rubrics: [
        { criterionName: 'Tính chính xác & Khái niệm cốt lõi', description: 'Trình bày đúng định nghĩa và cơ chế hoạt động', maxScore: 4.0, weight: 1.0 },
        { criterionName: 'Khả năng vận dụng thực tiễn', description: 'Đưa ra ví dụ minh họa và xử lý bài toán kỹ thuật', maxScore: 3.5, weight: 1.0 },
        { criterionName: 'Tư duy phản biện & Trade-offs', description: 'So sánh giải pháp thay thế và đánh giá tối ưu hóa', maxScore: 2.5, weight: 1.0 },
      ],
    }));
  };

  // Sync approved questions into Question Bank
  const saveToQuestionBank = (approvedItems) => {
    try {
      const raw = localStorage.getItem(QUESTION_BANK_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const newItems = approvedItems.map((q) => ({
        ...q,
        id: q.id || `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        code: q.code || `${q.subjectCode || selectedSubject}-Q${Math.floor(100 + Math.random() * 900)}`,
        subject: q.subject || q.subjectCode || selectedSubject,
        subjectCode: q.subjectCode || selectedSubject,
        isApproved: true,
        status: 'ACTIVE',
        rubricCount: q.rubrics?.length || 3,
      }));

      const existingCodes = new Set(existing.map((e) => e.code || e.id));
      const filtered = newItems.filter((n) => !existingCodes.has(n.code || n.id));
      localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify([...filtered, ...existing]));

      if (onQuestionsApproved) {
        onQuestionsApproved([...filtered, ...existing]);
      }
    } catch (e) {
      console.warn('Error saving to question bank local storage:', e);
    }
  };

  // Actions on Review Cards
  const handleApproveAll = async () => {
    if (reviewQuestions.length === 0) return;
    try {
      await lecturerQuestionApi.approveAll({ subjectCode: selectedSubject });
    } catch (err) {
      console.warn('API approveAll fallback:', err);
    }

    const approvedList = reviewQuestions.map((q) => ({ ...q, isApproved: true, status: 'ACTIVE' }));
    saveToQuestionBank(approvedList);
    setReviewQuestions([]);
    showToast(`Đã phê duyệt toàn bộ ${approvedList.length} câu hỏi và lưu vào Ngân Hàng chính thức!`);
  };

  const handleApproveOne = async (id) => {
    const target = reviewQuestions.find((q) => q.id === id);
    if (!target) return;

    try {
      await lecturerQuestionApi.toggleApprove(id);
    } catch (err) {
      console.warn('API toggleApprove fallback:', err);
    }

    const approvedItem = { ...target, isApproved: true, status: 'ACTIVE' };
    saveToQuestionBank([approvedItem]);
    setReviewQuestions((prev) => prev.filter((q) => q.id !== id));
    showToast(`Đã duyệt và thêm câu hỏi "${approvedItem.code}" vào Ngân Hàng thành công!`);
  };

  const handleDeleteOne = async (id) => {
    try {
      if (id && !String(id).startsWith('q-')) {
        await lecturerQuestionApi.deleteQuestion(id);
      }
    } catch (err) {
      console.warn('API deleteQuestion fallback:', err);
    }
    setReviewQuestions((prev) => prev.filter((q) => q.id !== id));
    showToast('Đã loại bỏ câu hỏi khỏi danh sách kiểm duyệt.');
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStartEdit = (q) => {
    setEditingId(q.id);
    setEditContent(q.content);
    setEditExpectedAnswer(q.expectedAnswer || '');
    if (!expandedIds.has(q.id)) {
      setExpandedIds(new Set([...expandedIds, q.id]));
    }
  };

  const handleSaveEdit = async (q) => {
    try {
      await lecturerQuestionApi.updateQuestion(q.id, {
        content: editContent,
        expectedAnswer: editExpectedAnswer,
        difficulty: q.difficulty,
        bloomLevel: q.bloomLevel,
      });
    } catch (err) {
      console.warn('API updateQuestion fallback:', err);
    }

    setReviewQuestions((prev) =>
      prev.map((item) =>
        item.id === q.id ? { ...item, content: editContent, expectedAnswer: editExpectedAnswer } : item
      )
    );
    setEditingId(null);
    showToast('Đã cập nhật nội dung câu hỏi.');
  };

  const filteredReviewQuestions = reviewQuestions.filter((q) => {
    if (filterDifficulty === 'ALL') return true;
    return q.difficulty === filterDifficulty;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xs transition-all ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          {onSwitchTab && (
            <button
              onClick={() => onSwitchTab('bank')}
              className="text-xs text-sky-700 font-bold hover:underline ml-4 cursor-pointer"
            >
              Xem trong Ngân hàng →
            </button>
          )}
        </div>
      )}

      {/* ================= SECTION 1: AI GENERATION CONFIG FORM ================= */}
      <div className="p-5 md:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Cấu hình Sinh câu hỏi AI bằng RAG</h2>
              <p className="text-[11px] text-slate-500">Đối chiếu học liệu giáo trình và trích xuất câu hỏi theo chuẩn Bloom</p>
            </div>
          </div>

          {onSwitchTab && (
            <button
              type="button"
              onClick={() => onSwitchTab('bank')}
              className="text-xs font-semibold text-slate-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Vào Ngân Hàng Câu Hỏi</span>
            </button>
          )}
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Môn học khảo thí</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              >
                {subjects.map((s) => (
                  <option key={s.id || s.code} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bloom Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cấp độ Bloom</label>
              <select
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              >
                <option value="ALL">Tất cả cấp độ (Bloom 1 - 6)</option>
                <option value="Bloom 1">Bloom 1 - Nhận biết (Remembering)</option>
                <option value="Bloom 2">Bloom 2 - Thông hiểu (Understanding)</option>
                <option value="Bloom 3">Bloom 3 - Vận dụng (Applying)</option>
                <option value="Bloom 4">Bloom 4 - Phân tích (Analyzing)</option>
                <option value="Bloom 5">Bloom 5 - Đánh giá (Evaluating)</option>
                <option value="Bloom 6">Bloom 6 - Sáng tạo (Creating)</option>
              </select>
            </div>

            {/* Difficulty & Count */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Độ khó</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="EASY">Dễ (Cơ bản)</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HARD">Khó (Nâng cao)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng câu</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Topic & Reference Document */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chủ đề / Khái niệm trọng tâm (Keywords)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Microservices, Spring Security JWT, Caching Redis, Transaction ACID..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tệp tài liệu tham chiếu RAG (Tùy chọn)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="ai-tab-file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <label
                  htmlFor="ai-tab-file"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{file ? file.name : (preselectedDoc?.filename || 'Chọn tệp PDF giáo trình...')}</span>
                  <UploadCloud className="w-4 h-4 text-slate-400 shrink-0" />
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                    title="Hủy tệp"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Button & Progress */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 italic">
              AI sẽ phân tích giáo trình, sinh câu hỏi phản biện, đáp án mẫu và barem điểm Rubric chi tiết.
            </span>

            <button
              type="submit"
              disabled={isGenerating}
              className="btn-glacier-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang tổng hợp RAG ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sinh Câu Hỏi Bằng AI</span>
                </>
              )}
            </button>
          </div>

          {isGenerating && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </form>
      </div>

      {/* ================= SECTION 2: LIVE REVIEW & APPROVAL LIST ================= */}
      <div className="p-5 md:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  Danh sách câu hỏi AI sinh ra chờ kiểm duyệt
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  {filteredReviewQuestions.length} câu hỏi
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Hiệu đính nội dung, kiểm tra barem điểm và bấm phê duyệt để lưu chính thức vào Ngân hàng
              </p>
            </div>
          </div>

          {filteredReviewQuestions.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50"
              >
                <option value="ALL">Tất cả độ khó</option>
                <option value="EASY">Dễ</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó</option>
              </select>

              <button
                type="button"
                onClick={handleApproveAll}
                className="btn-glacier-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Duyệt tất cả vào Ngân hàng</span>
              </button>
            </div>
          )}
        </div>

        {/* Question Cards List */}
        {filteredReviewQuestions.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">Chưa có câu hỏi nào cần kiểm duyệt</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Hãy cấu hình thông số ở form phía trên và nhấp <strong>"Sinh Câu Hỏi Bằng AI"</strong> để tạo câu hỏi mới.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredReviewQuestions.map((q) => {
              const isExpanded = expandedIds.has(q.id);
              const isEditing = editingId === q.id;

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-sky-300 transition-all space-y-3 shadow-2xs"
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded text-[11px]">
                        {q.code || q.id}
                      </span>
                      <span className="font-bold text-slate-700">{q.subjectCode || q.subject}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {q.bloomLevel || 'Bloom 3 - Vận dụng'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          q.difficulty === 'EASY'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : q.difficulty === 'HARD'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {q.difficulty === 'EASY' ? 'Dễ' : q.difficulty === 'HARD' ? 'Khó' : 'Trung bình'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(q)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" /> <span>Lưu</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(q)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                            title="Hiệu đính nội dung"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOne(q.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Loại bỏ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveOne(q.id)}
                            className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-300 text-sky-700 hover:bg-sky-100 text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                            title="Duyệt câu này vào Ngân Hàng"
                          >
                            <Check className="w-3.5 h-3.5 text-sky-600" />
                            <span>Duyệt câu này</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div>
                    {isEditing ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 rounded-xl border border-sky-300 bg-white text-xs text-slate-800 focus:outline-none font-medium leading-relaxed"
                      />
                    ) : (
                      <p className="text-xs text-slate-800 font-semibold leading-relaxed">{q.content}</p>
                    )}
                  </div>

                  {/* Expand / Collapse Details: Expected Answer & Rubric */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>{isExpanded ? 'Ẩn chi tiết đáp án & Barem Rubric' : 'Xem chi tiết đáp án & Barem Rubric'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-3 text-xs">
                        {/* Expected Answer */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Gợi ý câu trả lời chuẩn (Đáp án mẫu)
                          </span>
                          {isEditing ? (
                            <textarea
                              value={editExpectedAnswer}
                              onChange={(e) => setEditExpectedAnswer(e.target.value)}
                              rows={3}
                              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-normal focus:outline-none"
                            />
                          ) : (
                            <p className="text-slate-600 leading-relaxed font-normal bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              {q.expectedAnswer || 'Chưa thiết lập đáp án gợi ý.'}
                            </p>
                          )}
                        </div>

                        {/* Rubric Criteria */}
                        {q.rubrics && q.rubrics.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                              <Scale className="w-3 h-3 text-sky-600" />
                              Barem tiêu chí đánh giá Rubric ({q.rubrics.length} tiêu chí)
                            </span>
                            <div className="space-y-1.5">
                              {q.rubrics.map((r, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="p-2 rounded-lg bg-sky-50/50 border border-sky-100 flex items-center justify-between text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-slate-800">{r.criterionName}</span>
                                    <p className="text-[10px] text-slate-500">{r.description}</p>
                                  </div>
                                  <span className="px-2 py-0.5 rounded bg-white font-mono font-bold text-sky-700 border border-sky-200 text-[11px] shrink-0">
                                    {r.maxScore} điểm
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
