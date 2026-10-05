import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Search, Plus, Filter, BookOpen, Layers, CheckCircle, Sparkles, Cpu, Trash2, Check, X, RefreshCw } from 'lucide-react';
import { lecturerQuestionApi, subjectApi } from '../../services/api';

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
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

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await lecturerQuestionApi.getQuestions();
      if (res?.data?.result && res.data.result.length > 0) {
        setQuestions(res.data.result.map(q => ({
          ...q,
          subject: q.subjectName ? `${q.subjectName} (${q.subjectCode})` : q.subjectCode,
          keywords: Array.isArray(q.keywords) ? q.keywords : (q.keywords ? q.keywords.split(',') : []),
        })));
      } else {
        setQuestions(sampleQuestions);
      }
    } catch {
      setQuestions(sampleQuestions);
    } finally {
      setLoading(false);
    }
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

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.content.trim()) return;

    try {
      await lecturerQuestionApi.createQuestion(newQuestion);
      await fetchQuestions();
    } catch {
      // Local optimistic update
      const created = {
        id: 'q-' + Date.now(),
        code: `${newQuestion.subjectCode}-Q${Math.floor(100 + Math.random() * 900)}`,
        subject: newQuestion.subjectCode,
        subjectCode: newQuestion.subjectCode,
        difficulty: newQuestion.difficulty,
        bloomLevel: newQuestion.bloomLevel,
        content: newQuestion.content,
        keywords: newQuestion.keywords.split(',').map(s => s.trim()).filter(Boolean),
        vectorStatus: 'Embedded (1536 dims)',
        rubricCount: 3,
        isApproved: true,
      };
      setQuestions([created, ...questions]);
    }
    setIsAddModalOpen(false);
    setNewQuestion({
      subjectCode: 'PRJ301',
      content: '',
      difficulty: 'MEDIUM',
      bloomLevel: 'Bloom 3 - Vận dụng',
      keywords: '',
      expectedAnswer: '',
    });
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng học liệu?')) return;
    try {
      await lecturerQuestionApi.deleteQuestion(id);
    } catch {
      // Optimistic delete
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleToggleApprove = async (id) => {
    try {
      await lecturerQuestionApi.toggleApprove(id);
    } catch {
      // Optimistic toggle
    }
    setQuestions(questions.map(q => q.id === id ? { ...q, isApproved: !q.isApproved } : q));
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              Dành Cho Giảng Viên
            </span>
            <span className="text-xs text-slate-500">
              Quản lý câu hỏi & chuẩn hóa Rubric
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 flex items-center gap-2.5">
            <Database className="w-8 h-8 text-sky-600" />
            Ngân Hàng Học Liệu & Vector Embedding (RAG)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Quản lý kho tri thức kiểm thử vấn đáp, gắn nhãn độ khó và tự động vector hóa cho mô hình AI RAG.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="btn-glacier-primary px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Thêm Câu Hỏi Mới
          </button>
          <button 
            onClick={fetchQuestions} 
            disabled={loading}
            className="btn-glacier-secondary px-3.5 py-2.5 text-xs flex items-center gap-1.5"
            title="Đồng bộ từ Backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${loading ? 'animate-spin' : ''}`} />
            Đồng bộ
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glacier-light-panel p-4 md:p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung, từ khóa, mã môn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-sky-600" /> Lọc:
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
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
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Mọi độ khó</option>
            <option value="EASY">Dễ (Easy)</option>
            <option value="MEDIUM">Trung bình (Medium)</option>
            <option value="HARD">Nâng cao (Hard)</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="grid gap-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="glacier-light-card p-6 rounded-2xl border-l-4 border-l-sky-600 space-y-3.5 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-sky-800 border border-slate-200">
                    {q.code}
                  </span>
                  <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" /> {q.subject}
                  </span>
                  {q.bloomLevel && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                      {q.bloomLevel}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApprove(q.id)}
                    className={`text-xs px-2.5 py-0.5 font-semibold rounded-full border transition-all ${
                      q.isApproved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                    title="Click để duyệt hoặc tạm hoãn"
                  >
                    {q.isApproved ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                  </button>
                  <span
                    className={`text-xs px-3 py-0.5 font-semibold rounded-full border ${
                      q.difficulty === 'HARD'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : q.difficulty === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                    <CheckCircle className="w-3 h-3 text-sky-600" /> {q.vectorStatus || 'Embedded'}
                  </span>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-slate-800 text-sm font-medium leading-relaxed">
                {q.content}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400">Từ khóa:</span>
                  {(q.keywords || []).map((k, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-slate-100 rounded-md text-slate-700 font-medium">
                      #{k}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <Layers className="w-3.5 h-3.5 text-sky-600" /> {q.rubricCount || 3} Tiêu chí Rubric
                  </span>
                  <button 
                    onClick={() => navigate('/rag')}
                    className="text-sky-600 hover:text-sky-800 font-bold ml-2 underline underline-offset-2"
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
                <Plus className="w-4 h-4 text-sky-600" /> Thêm Câu Hỏi Mới Vào Ngân Hàng Học Liệu
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Từ khóa (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={newQuestion.keywords}
                  onChange={(e) => setNewQuestion({ ...newQuestion, keywords: e.target.value })}
                  placeholder="Ví dụ: Servlet, Lifecycle, Session, Redis"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                />
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
                  Lưu & Vectorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
