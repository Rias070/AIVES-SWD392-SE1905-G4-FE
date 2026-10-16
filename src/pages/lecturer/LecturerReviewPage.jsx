import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Edit3,
  Trash2,
  Check,
  Save,
  Layers,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { lecturerQuestionApi } from '../../services/api';

export default function LecturerReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editExpectedAnswer, setEditExpectedAnswer] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const passedQuestions = location.state?.generatedQuestions;
  const passedSubject = location.state?.subjectCode || 'CS301';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpandAll = () => {
    if (expandedIds.size === questions.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(questions.map((q) => q.id)));
    }
  };

  const fetchPendingQuestions = async () => {
    setLoading(true);
    try {
      const res = await lecturerQuestionApi.getQuestions({ status: 'PENDING' });
      if (res?.data?.result) {
        setQuestions(res.data.result);
        return;
      }
    } catch (err) {
      console.warn('Could not fetch pending questions from API:', err);
    } finally {
      setLoading(false);
    }
    setQuestions([]);
  };

  useEffect(() => {
    if (passedQuestions && Array.isArray(passedQuestions) && passedQuestions.length > 0) {
      setQuestions(passedQuestions);
      showToast(`Đã nạp ${passedQuestions.length} câu hỏi AI vừa sinh để kiểm duyệt.`);
    } else {
      fetchPendingQuestions();
    }
  }, [passedQuestions]);

  const handleApproveAll = async () => {
    try {
      await lecturerQuestionApi.approveAll({ subjectCode: passedSubject });
    } catch (e) {
      console.warn('API approve all warning, updating UI:', e);
    }
    setQuestions(questions.map((q) => ({ ...q, isApproved: true, status: 'ACTIVE' })));
    showToast('Đã phê duyệt toàn bộ câu hỏi vào Ngân hàng chính thức.');
  };

  const handleApproveOne = async (id) => {
    try {
      await lecturerQuestionApi.toggleApprove(id);
    } catch (e) {
      console.warn('API toggle approve warning, updating UI:', e);
    }
    setQuestions(questions.map((q) => (q.id === id ? { ...q, isApproved: true, status: 'ACTIVE' } : q)));
    showToast('Đã duyệt câu hỏi thành công.');
  };

  const handleRemove = async (id) => {
    try {
      await lecturerQuestionApi.deleteQuestion(id);
    } catch (e) {
      console.warn('API delete warning, updating UI:', e);
    }
    setQuestions(questions.filter((q) => q.id !== id));
    showToast('Đã loại bỏ câu hỏi.');
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
    } catch (e) {
      console.warn('API update warning, updating UI:', e);
    }

    setQuestions(
      questions.map((item) =>
        item.id === q.id ? { ...item, content: editContent, expectedAnswer: editExpectedAnswer } : item
      )
    );
    setEditingId(null);
    showToast('Đã lưu nội dung chỉnh sửa.');
  };

  const pendingCount = questions.filter((q) => !q.isApproved).length;

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold shadow-lg flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer ml-1">✕</button>
        </div>
      )}

      {/* Top Action Header */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500">Môn: {passedSubject}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              {pendingCount} câu chờ duyệt
            </span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
            Kiểm duyệt câu hỏi & Rubric AI
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {questions.length > 0 && (
            <button
              onClick={toggleExpandAll}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              {expandedIds.size === questions.length ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
            </button>
          )}

          <Link
            to="/generate"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Sinh thêm</span>
          </Link>

          <button
            onClick={handleApproveAll}
            disabled={questions.length === 0 || pendingCount === 0}
            className="btn-glacier-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Duyệt tất cả</span>
          </button>
        </div>
      </div>

      {/* Questions Compact Accordion List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
            Đang tải danh sách câu hỏi...
          </div>
        ) : questions.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Không còn câu hỏi nào chờ duyệt</h3>
            <p className="text-xs text-slate-500">Tất cả câu hỏi đã được phê duyệt vào Ngân hàng chính thức.</p>
            <div className="pt-1">
              <Link to="/question-bank" className="btn-glacier-primary px-4 py-2 text-xs inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Xem Ngân hàng câu hỏi</span>
              </Link>
            </div>
          </div>
        ) : (
          questions.map((q) => {
            const isApproved = q.isApproved || q.status === 'ACTIVE';
            const rubricsList = q.rubrics || [];
            const isExpanded = expandedIds.has(q.id) || editingId === q.id;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isApproved
                    ? 'border-emerald-200 bg-white'
                    : 'border-slate-200 bg-white hover:border-sky-300'
                }`}
              >
                {/* Accordion Row Header */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {q.code || 'Q-DRAFT'}
                      </span>
                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${q.bloomColor || 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                        {q.bloomLevel || 'Bloom 3 - Vận dụng'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {rubricsList.length || q.rubricCount || 3} tiêu chí Rubric
                      </span>
                      {isApproved && (
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã duyệt
                        </span>
                      )}
                    </div>

                    {/* Question Summary (2 lines if collapsed) */}
                    <p className={`text-xs font-semibold text-slate-800 leading-snug ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {q.content}
                    </p>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {editingId === q.id ? (
                      <button
                        onClick={() => handleSaveEdit(q)}
                        className="p-2 btn-glacier-primary text-xs rounded-xl flex items-center justify-center cursor-pointer"
                        title="Lưu chỉnh sửa"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(q)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                        title="Chỉnh sửa nội dung"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isApproved && (
                      <button
                        onClick={() => handleApproveOne(q.id)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                        title="Duyệt câu hỏi này"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleRemove(q.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                      title="Loại bỏ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Expected Answer & Rubric Table */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 bg-slate-50/50 text-xs">
                    {editingId === q.id ? (
                      <div className="space-y-2 pt-2">
                        <label className="block text-[11px] font-bold text-slate-700">Nội dung câu hỏi:</label>
                        <textarea
                          rows={2}
                          className="w-full p-2.5 text-xs bg-white border border-sky-400 rounded-xl text-slate-900 focus:outline-none"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <label className="block text-[11px] font-bold text-slate-700">Gợi ý câu trả lời:</label>
                        <textarea
                          rows={2}
                          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                          value={editExpectedAnswer}
                          onChange={(e) => setEditExpectedAnswer(e.target.value)}
                        />
                      </div>
                    ) : (
                      q.expectedAnswer && (
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                          <span className="font-bold text-slate-700 text-[11px] block mb-0.5">Câu trả lời mẫu / Gợi ý:</span>
                          <p className="text-slate-600 leading-relaxed text-[11px]">{q.expectedAnswer}</p>
                        </div>
                      )
                    )}

                    {/* Rubric Criteria Grid */}
                    {rubricsList.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-sky-600" />
                          Tiêu chí chấm điểm (Rubric):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {rubricsList.map((r, rIdx) => (
                            <div key={r.uuid || rIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                              <div className="flex items-center justify-between font-bold text-slate-800">
                                <span className="line-clamp-1">{r.criterionName}</span>
                                <span className="text-sky-700 font-mono text-[11px] shrink-0 ml-1">{r.maxScore}đ</span>
                              </div>
                              <p className="text-[10.5px] text-slate-500 leading-snug line-clamp-2">{r.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
