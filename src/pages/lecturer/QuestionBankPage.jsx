import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Search,
  Plus,
  Filter,
  BookOpen,
  Layers,
  CheckCircle,
  Sparkles,
  Cpu,
  Trash2,
  Check,
  X,
  RefreshCw,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Languages
} from 'lucide-react';
import { lecturerQuestionApi, subjectApi } from '../../services/api';

const QUESTION_BANK_KEY = 'aives_question_bank';

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRubricQuestion, setSelectedRubricQuestion] = useState(null);
  const [pageToast, setPageToast] = useState(null);

  // Subject Exam Language Configuration State
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [configSubject, setConfigSubject] = useState(null);
  const [modalExamLang, setModalExamLang] = useState('vi-VN');
  const [modalTechnicalTerms, setModalTechnicalTerms] = useState('');
  const [isSavingSubjectLang, setIsSavingSubjectLang] = useState(false);

  const showToast = (text, type = 'success') => {
    setPageToast({ text, type });
    setTimeout(() => setPageToast(null), 3500);
  };

  const [newQuestion, setNewQuestion] = useState({
    subjectCode: 'PRJ301',
    content: '',
    difficulty: 'MEDIUM',
    bloomLevel: 'Bloom 3 - Vận dụng',
    keywords: '',
    expectedAnswer: '',
    rubrics: [
      { criterionName: 'Tính chính xác & Bản chất khái niệm', description: 'Nêu đúng định nghĩa, các thành phần và cơ chế hoạt động', maxScore: 4.0, weight: 1.0 },
      { criterionName: 'Vận dụng thực tế & Triển khai', description: 'Đưa ra ví dụ minh họa và giải quyết tình huống kỹ thuật', maxScore: 3.5, weight: 1.0 },
      { criterionName: 'Phản biện & Tối ưu hóa', description: 'So sánh giải pháp thay thế, trade-offs và tối ưu hiệu năng', maxScore: 2.5, weight: 1.0 },
    ],
  });

  const [editingQuestion, setEditingQuestion] = useState({
    id: null,
    code: '',
    subjectCode: 'PRJ301',
    content: '',
    difficulty: 'MEDIUM',
    bloomLevel: 'Bloom 3 - Vận dụng',
    keywords: '',
    expectedAnswer: '',
  });

  const navigate = useNavigate();

  // Sample data showcasing RAG Question Bank with Vector Embeddings (fallback)
  const sampleQuestions = [
    {
      id: 'q-1',
      code: 'PRJ301-Q102',
      subject: 'Java Web Application (PRJ301)',
      subjectCode: 'PRJ301',
      difficulty: 'MEDIUM',
      bloomLevel: 'Bloom 3 - Vận dụng',
      content: 'Explain the lifecycle of a Java Servlet and how Session Management is maintained in distributed environments.',
      keywords: ['Servlet Lifecycle', 'HttpSession', 'Cookies', 'Distributed Cache'],
      vectorStatus: 'Embedded (1536 dims)',
      rubricCount: 3,
      isApproved: true,
    },
    {
      id: 'q-2',
      code: 'SWP391-Q045',
      subject: 'Software Development Project (SWP391)',
      subjectCode: 'SWP391',
      difficulty: 'HARD',
      bloomLevel: 'Bloom 4 - Phân tích',
      content: 'How does an event-driven architecture prevent cascading failures during high concurrent traffic peaks?',
      keywords: ['Kafka', 'Circuit Breaker', 'Backpressure', 'Idempotency'],
      vectorStatus: 'Embedded (1536 dims)',
      rubricCount: 4,
      isApproved: true,
    },
    {
      id: 'q-3',
      code: 'CSD201-Q088',
      subject: 'Data Structures & Algorithms (CSD201)',
      subjectCode: 'CSD201',
      difficulty: 'EASY',
      bloomLevel: 'Bloom 2 - Hiểu',
      content: 'Compare the time complexity and memory overhead between AVL Tree and Red-Black Tree in balancing operations.',
      keywords: ['Binary Search Tree', 'Rotation', 'Worst-case', 'Tree Height'],
      vectorStatus: 'Embedded (1536 dims)',
      rubricCount: 2,
      isApproved: false,
    },
  ];

  const loadStoredQuestions = () => {
    try {
      const raw = localStorage.getItem(QUESTION_BANK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading QUESTION_BANK_KEY:', e);
    }
    return sampleQuestions;
  };

  const saveQuestions = (updatedList) => {
    setQuestions(updatedList);
    try {
      localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Error saving QUESTION_BANK_KEY:', e);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await lecturerQuestionApi.getQuestions();
      if (res?.data?.result && res.data.result.length > 0) {
        const formatted = res.data.result.map(q => ({
          ...q,
          subject: q.subjectName ? `${q.subjectName} (${q.subjectCode})` : q.subjectCode,
          keywords: Array.isArray(q.keywords) ? q.keywords : (q.keywords ? q.keywords.split(',') : []),
          rubricCount: q.rubrics?.length || q.rubricCount || 0,
        }));
        saveQuestions(formatted);
        return;
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
    saveQuestions(loadStoredQuestions());
  };

  const fetchSubjects = async () => {
    try {
      const res = await subjectApi.getSubjects();
      if (res?.data?.result) {
        setSubjectsList(res.data.result);
      }
    } catch {
      // Fallback subjects
      setSubjectsList([
        { code: 'PRJ301', name: 'Java Web Application' },
        { code: 'SWP391', name: 'Software Development Project' },
        { code: 'CSD201', name: 'Data Structures & Algorithms' },
      ]);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchSubjects();
  }, []);

  const handleOpenLangModal = (subjCode) => {
    const subjObj = subjectsList.find(s => s.code === subjCode) || { code: subjCode, name: subjCode };
    setConfigSubject(subjObj);
    const cachedLang = subjObj.language || localStorage.getItem(`aives_subject_lang_${subjCode}`) || 'vi-VN';
    setModalExamLang(cachedLang);
    setModalTechnicalTerms(subjObj.technicalTerms || localStorage.getItem(`aives_subject_terms_${subjCode}`) || '');
    setIsLangModalOpen(true);
  };

  const handleSaveSubjectLangConfig = async (e) => {
    e.preventDefault();
    if (!configSubject) return;
    setIsSavingSubjectLang(true);
    try {
      if (configSubject.id) {
        await subjectApi.updateSubjectLanguageConfig(configSubject.id, {
          language: modalExamLang,
          technicalTerms: modalTechnicalTerms
        });
      }
    } catch (err) {
      console.warn('API update warning:', err);
    } finally {
      localStorage.setItem(`aives_subject_lang_${configSubject.code}`, modalExamLang);
      localStorage.setItem(`aives_subject_terms_${configSubject.code}`, modalTechnicalTerms);
      setSubjectsList(prev => prev.map(s => s.code === configSubject.code ? { ...s, language: modalExamLang, technicalTerms: modalTechnicalTerms } : s));
      setIsSavingSubjectLang(false);
      setIsLangModalOpen(false);
      showToast(`Đã lưu cấu hình ngôn ngữ (${modalExamLang}) cho môn ${configSubject.code}!`);
    }
  };

  const getSubjectLangBadge = (subjCode) => {
    const subj = subjectsList.find(s => s.code === subjCode);
    const lang = subj?.language || localStorage.getItem(`aives_subject_lang_${subjCode}`) || 'vi-VN';
    return lang === 'en-US' ? '🇺🇸 en-US' : '🇻🇳 vi-VN';
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.content.trim()) {
      showToast('Vui lòng nhập nội dung câu hỏi!', 'error');
      return;
    }

    const currentSubj = subjectsList.find(s => s.code === newQuestion.subjectCode);
    const newCode = `${newQuestion.subjectCode}-Q${Math.floor(100 + Math.random() * 900)}`;
    const payload = {
      ...newQuestion,
      subjectUuid: currentSubj?.id || currentSubj?.uuid,
      questionCode: newCode,
      status: 'ACTIVE',
      rubrics: newQuestion.rubrics.map(r => ({
        criterionName: r.criterionName,
        description: r.description,
        maxScore: Number(r.maxScore) || 10,
        weight: Number(r.weight) || 1,
      })),
    };

    let createdId = 'q-' + Date.now();
    let backendResult = null;
    try {
      const res = await lecturerQuestionApi.createQuestion(payload);
      if (res?.data?.result) {
        backendResult = res.data.result;
        createdId = backendResult.id || backendResult.uuid || createdId;
      }
    } catch (err) {
      console.warn('API createQuestion fallback:', err);
    }

    const created = {
      id: createdId,
      code: backendResult?.questionCode || newCode,
      subject: backendResult?.subjectName ? `${backendResult.subjectName} (${newQuestion.subjectCode})` : newQuestion.subjectCode,
      subjectCode: newQuestion.subjectCode,
      difficulty: newQuestion.difficulty,
      bloomLevel: newQuestion.bloomLevel,
      content: newQuestion.content.trim(),
      keywords: newQuestion.keywords.split(',').map(s => s.trim()).filter(Boolean),
      expectedAnswer: newQuestion.expectedAnswer,
      vectorStatus: 'Embedded (1536 dims)',
      rubrics: backendResult?.rubrics || payload.rubrics,
      rubricCount: backendResult?.rubrics?.length || payload.rubrics.length,
      isApproved: true,
    };

    saveQuestions([created, ...questions]);
    setIsAddModalOpen(false);
    setNewQuestion({
      subjectCode: newQuestion.subjectCode,
      content: '',
      difficulty: 'MEDIUM',
      bloomLevel: 'Bloom 3 - Vận dụng',
      keywords: '',
      expectedAnswer: '',
      rubrics: [
        { criterionName: 'Tính chính xác & Bản chất khái niệm', description: 'Nêu đúng định nghĩa, các thành phần và cơ chế hoạt động', maxScore: 4.0, weight: 1.0 },
        { criterionName: 'Vận dụng thực tế & Triển khai', description: 'Đưa ra ví dụ minh họa và giải quyết tình huống kỹ thuật', maxScore: 3.5, weight: 1.0 },
        { criterionName: 'Phản biện & Tối ưu hóa', description: 'So sánh giải pháp thay thế, trade-offs và tối ưu hiệu năng', maxScore: 2.5, weight: 1.0 },
      ],
    });
    showToast('Đã tạo câu hỏi và thiết lập Barem Rubric thành công!');
    // Re-sync with backend in background
    fetchQuestions();
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion({
      id: q.id,
      code: q.code || '',
      subjectCode: q.subjectCode || 'PRJ301',
      content: q.content || '',
      difficulty: q.difficulty || 'MEDIUM',
      bloomLevel: q.bloomLevel || 'Bloom 3 - Vận dụng',
      keywords: Array.isArray(q.keywords) ? q.keywords.join(', ') : (q.keywords || ''),
      expectedAnswer: q.expectedAnswer || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    if (!editingQuestion.content.trim()) {
      showToast('Vui lòng nhập nội dung câu hỏi!', 'error');
      return;
    }

    const payload = {
      subjectCode: editingQuestion.subjectCode,
      questionCode: editingQuestion.code,
      content: editingQuestion.content.trim(),
      difficulty: editingQuestion.difficulty,
      bloomLevel: editingQuestion.bloomLevel,
      keywords: editingQuestion.keywords,
      expectedAnswer: editingQuestion.expectedAnswer,
    };

    try {
      await lecturerQuestionApi.updateQuestion(editingQuestion.id, payload);
    } catch (err) {
      console.warn('API updateQuestion fallback:', err);
    }

    const updatedList = questions.map(q => {
      if (q.id === editingQuestion.id) {
        return {
          ...q,
          ...payload,
          subject: editingQuestion.subjectCode,
          keywords: editingQuestion.keywords.split(',').map(s => s.trim()).filter(Boolean),
        };
      }
      return q;
    });

    saveQuestions(updatedList);
    setIsEditModalOpen(false);
    showToast('Cập nhật câu hỏi thành công!');
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng học liệu?')) return;
    try {
      await lecturerQuestionApi.deleteQuestion(id);
    } catch (err) {
      console.warn('API deleteQuestion fallback:', err);
    }
    const updatedList = questions.filter(q => q.id !== id);
    saveQuestions(updatedList);
    showToast('Đã xóa câu hỏi khỏi ngân hàng học liệu!');
  };

  const handleToggleApprove = async (id) => {
    try {
      await lecturerQuestionApi.toggleApprove(id);
    } catch (err) {
      console.warn('API toggleApprove fallback:', err);
    }
    const target = questions.find(q => q.id === id);
    const updatedList = questions.map(q => q.id === id ? { ...q, isApproved: !q.isApproved } : q);
    saveQuestions(updatedList);
    showToast(target?.isApproved ? 'Đã chuyển câu hỏi sang trạng thái chờ duyệt!' : 'Đã duyệt câu hỏi thành công!');
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(q.keywords) && q.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesSubject =
      selectedSubject === 'ALL' || q.subjectCode === selectedSubject || (q.subject && q.subject.includes(selectedSubject));
    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });
  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {pageToast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xs transition-all ${
            pageToast.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {pageToast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{pageToast.text}</span>
          </div>
          <button
            onClick={() => setPageToast(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-600" />
            Ngân hàng câu hỏi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý câu hỏi khảo thí vấn đáp và barem Rubric chấm điểm
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchQuestions} 
            disabled={loading}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Đồng bộ từ Backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Đồng bộ</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="btn-glacier-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> <span>Thêm câu hỏi</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo nội dung, mã môn, từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500 font-medium"
          >
            <option value="ALL">Tất cả môn học</option>
            {subjectsList.map((s, idx) => (
              <option key={s.code || idx} value={s.code}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500 font-medium"
          >
            <option value="ALL">Mọi độ khó</option>
            <option value="EASY">Dễ</option>
            <option value="MEDIUM">Trung bình</option>
            <option value="HARD">Nâng cao</option>
          </select>

          {selectedSubject !== 'ALL' && (
            <button
              onClick={() => handleOpenLangModal(selectedSubject)}
              className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold hover:bg-sky-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              title={`Cấu hình ngôn ngữ cho môn ${selectedSubject}`}
            >
              <Languages className="w-3.5 h-3.5 text-sky-600" />
              <span>{getSubjectLangBadge(selectedSubject)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="grid gap-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-sky-300 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {q.code}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" /> {q.subject}
                  </span>
                  {q.bloomLevel && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                      {q.bloomLevel}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApprove(q.id)}
                    className={`text-[11px] px-2.5 py-0.5 font-semibold rounded-full border transition-all cursor-pointer ${
                      q.isApproved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                    title="Click để duyệt hoặc tạm hoãn"
                  >
                    {q.isApproved ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                  </button>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 font-semibold rounded-full border ${
                      q.difficulty === 'HARD'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : q.difficulty === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <button
                    onClick={() => handleOpenEditModal(q)}
                    className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors ml-1 cursor-pointer"
                    title="Chỉnh sửa câu hỏi"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                {q.content}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 text-[11px]">Từ khóa:</span>
                  {(q.keywords || []).slice(0, 3).map((k, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-[11px] font-medium">
                      #{k}
                    </span>
                  ))}
                  {(q.keywords || []).length > 3 && (
                    <span className="text-[10px] text-slate-400">+{q.keywords.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-sky-600" /> {q.rubrics?.length || q.rubricCount || 0} tiêu chí Rubric
                  </span>
                  <button 
                    onClick={() => setSelectedRubricQuestion(q)}
                    className="text-sky-600 hover:text-sky-800 font-bold ml-1 text-xs cursor-pointer"
                  >
                    Xem Rubric →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Thêm Câu Hỏi Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" /> Thêm câu hỏi mới
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học</label>
                <select
                  value={newQuestion.subjectCode}
                  onChange={(e) => setNewQuestion({ ...newQuestion, subjectCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                >
                  {subjectsList.map((s, idx) => (
                    <option key={s.code || idx} value={s.code}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Độ khó</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                  >
                    <option value="EASY">Dễ (Easy)</option>
                    <option value="MEDIUM">Trung bình (Medium)</option>
                    <option value="HARD">Nâng cao (Hard)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chuẩn Bloom</label>
                  <select
                    value={newQuestion.bloomLevel}
                    onChange={(e) => setNewQuestion({ ...newQuestion, bloomLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Bloom 1 - Nhớ">Bloom 1 - Nhớ</option>
                    <option value="Bloom 2 - Hiểu">Bloom 2 - Hiểu</option>
                    <option value="Bloom 3 - Vận dụng">Bloom 3 - Vận dụng</option>
                    <option value="Bloom 4 - Phân tích">Bloom 4 - Phân tích</option>
                    <option value="Bloom 5 - Đánh giá">Bloom 5 - Đánh giá</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung câu hỏi vấn đáp *</label>
                <textarea
                  required
                  rows={3}
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi vấn đáp cho sinh viên..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gợi ý câu trả lời mẫu (Benchmark Answer)</label>
                <textarea
                  rows={2}
                  value={newQuestion.expectedAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, expectedAnswer: e.target.value })}
                  placeholder="Gợi ý câu trả lời kỳ vọng để hệ thống AI Viva và Giảng viên đối chiếu..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Rubric Criteria Builder */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    Barem Tiêu Chí Chấm Điểm (Rubrics)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewQuestion({
                        ...newQuestion,
                        rubrics: [
                          ...newQuestion.rubrics,
                          {
                            criterionName: `Tiêu chí #${newQuestion.rubrics.length + 1}`,
                            description: 'Mô tả yêu cầu đạt điểm',
                            maxScore: 3.0,
                            weight: 1.0,
                          },
                        ],
                      });
                    }}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm tiêu chí
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {newQuestion.rubrics.map((rubric, rIdx) => (
                    <div key={rIdx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={rubric.criterionName}
                          onChange={(e) => {
                            const updated = [...newQuestion.rubrics];
                            updated[rIdx].criterionName = e.target.value;
                            setNewQuestion({ ...newQuestion, rubrics: updated });
                          }}
                          placeholder="Tên tiêu chí (ví dụ: Tính chính xác)"
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 font-semibold focus:outline-none focus:border-sky-500"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max="10"
                            value={rubric.maxScore}
                            onChange={(e) => {
                              const updated = [...newQuestion.rubrics];
                              updated[rIdx].maxScore = parseFloat(e.target.value) || 0;
                              setNewQuestion({ ...newQuestion, rubrics: updated });
                            }}
                            className="w-16 px-2 py-1 text-xs font-mono font-bold rounded-lg bg-white border border-slate-200 text-center text-sky-700"
                            title="Điểm tối đa"
                          />
                          <span className="text-[10px] text-slate-500">đ</span>
                        </div>
                        {newQuestion.rubrics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = newQuestion.rubrics.filter((_, idx) => idx !== rIdx);
                              setNewQuestion({ ...newQuestion, rubrics: updated });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Xóa tiêu chí này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={rubric.description}
                        onChange={(e) => {
                          const updated = [...newQuestion.rubrics];
                          updated[rIdx].description = e.target.value;
                          setNewQuestion({ ...newQuestion, rubrics: updated });
                        }}
                        placeholder="Mô tả chuẩn đạt điểm cho sinh viên..."
                        className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-white border border-slate-200 text-slate-600 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-glacier-primary px-5 py-2 text-xs font-semibold shadow-xs"
                >
                  Lưu câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chỉnh Sửa Câu Hỏi */}
      {isEditModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-600" /> Chỉnh Sửa Câu Hỏi ({editingQuestion.code})
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingQuestion(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateQuestion} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học</label>
                <select
                  value={editingQuestion.subjectCode}
                  onChange={(e) => {
                    const sel = subjectsList.find(s => s.code === e.target.value);
                    setEditingQuestion({
                      ...editingQuestion,
                      subjectCode: e.target.value,
                      subject: sel ? `${sel.code} - ${sel.name}` : e.target.value
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                >
                  {subjectsList.map((s, idx) => (
                    <option key={s.code || idx} value={s.code}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Độ khó</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                  >
                    <option value="EASY">Dễ (Easy)</option>
                    <option value="MEDIUM">Trung bình (Medium)</option>
                    <option value="HARD">Nâng cao (Hard)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chuẩn Bloom</label>
                  <select
                    value={editingQuestion.bloomLevel}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, bloomLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Bloom 1 - Nhớ">Bloom 1 - Nhớ</option>
                    <option value="Bloom 2 - Hiểu">Bloom 2 - Hiểu</option>
                    <option value="Bloom 3 - Vận dụng">Bloom 3 - Vận dụng</option>
                    <option value="Bloom 4 - Phân tích">Bloom 4 - Phân tích</option>
                    <option value="Bloom 5 - Đánh giá">Bloom 5 - Đánh giá</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung câu hỏi vấn đáp *</label>
                <textarea
                  required
                  rows={3}
                  value={editingQuestion.content}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, content: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi vấn đáp..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Từ khóa (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={editingQuestion.keywords}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, keywords: e.target.value })}
                  placeholder="Ví dụ: Servlet, Lifecycle, Filter"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Câu trả lời chuẩn (Benchmark Rubric)</label>
                <textarea
                  rows={2}
                  value={editingQuestion.expectedBenchmark || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, expectedBenchmark: e.target.value })}
                  placeholder="Tiêu chí đánh giá trọng tâm câu trả lời..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingQuestion(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-glacier-primary px-5 py-2 text-xs font-semibold shadow-xs"
                >
                  Cập Nhật & Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CẤU HÌNH NGÔN NGỮ KHẢO THÍ CHO MÔN HỌC */}
      {isLangModalOpen && configSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Languages className="w-5 h-5 text-sky-600" />
                Cấu Hình Ngôn Ngữ Khảo Thí - {configSubject.code}
              </h3>
              <button onClick={() => setIsLangModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubjectLangConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Môn Học</label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  <span className="font-mono text-sky-700 font-bold">{configSubject.code}</span> - {configSubject.name}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngôn Ngữ Khảo Thí *</label>
                <select
                  value={modalExamLang}
                  onChange={(e) => setModalExamLang(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-sky-500 text-xs"
                >
                  <option value="vi-VN">🇻🇳 Tiếng Việt (vi-VN)</option>
                  <option value="en-US">🇺🇸 English (en-US)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ngôn ngữ nhận diện giọng nói và hội thoại trong phòng thi.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thuật Ngữ Chuyên Ngành</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Servlet, Lifecycle, Spring Boot, Dependency Injection..."
                  value={modalTechnicalTerms}
                  onChange={(e) => setModalTechnicalTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500 text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Các thuật ngữ trọng tâm giúp nhận diện giọng nói chính xác hơn.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLangModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingSubjectLang}
                  className="btn-glacier-primary px-5 py-2 font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {isSavingSubjectLang ? 'Đang Lưu...' : 'Lưu Cấu Hình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM BAREM CHẤM ĐIỂM RUBRIC */}
      {selectedRubricQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" /> Barem Chấm Điểm (Rubrics)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedRubricQuestion.code}</p>
              </div>
              <button
                onClick={() => setSelectedRubricQuestion(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nội dung câu hỏi</span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{selectedRubricQuestion.content}</p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  Tiêu chí đánh giá ({selectedRubricQuestion.rubrics?.length || 0})
                </span>
                {(!selectedRubricQuestion.rubrics || selectedRubricQuestion.rubrics.length === 0) ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Chưa có barem chấm điểm chi tiết cho câu hỏi này.
                  </div>
                ) : (
                  selectedRubricQuestion.rubrics.map((r, rIdx) => (
                    <div key={r.id || rIdx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{r.criterionName || `Tiêu chí #${rIdx + 1}`}</span>
                        <div className="flex items-center gap-2">
                          {r.weight && (
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              Trọng số: {r.weight}%
                            </span>
                          )}
                          <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">
                            Tối đa: {r.maxScore || 10}đ
                          </span>
                        </div>
                      </div>
                      {r.description && (
                        <p className="text-[11px] text-slate-600 leading-normal">{r.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRubricQuestion(null)}
                className="btn-glacier-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
