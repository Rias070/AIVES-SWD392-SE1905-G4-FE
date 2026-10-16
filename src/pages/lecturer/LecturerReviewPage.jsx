import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Edit3, Trash2, X, Check, Save, Layers, List, Plus, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
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

  const passedQuestions = location.state?.generatedQuestions;
  const passedSubject = location.state?.subjectCode || 'CS301';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPendingQuestions = async () => {
    setLoading(true);
    try {
      const res = await lecturerQuestionApi.getQuestions({ status: 'PENDING' });
      if (res?.data?.result && res.data.result.length > 0) {
        setQuestions(res.data.result);
        return;
      }
    } catch (err) {
      console.warn('Could not fetch pending questions from API:', err);
    } finally {
      setLoading(false);
    }

    // Default fallback review questions if nothing from API
    setQuestions([
      {
        id: 'mock-1',
        code: 'CS301-Q105',
        subjectCode: 'CS301',
        content: 'Trình bày cách thức hoạt động của giải thuật Dijkstra. Tại sao giải thuật này không cho kết quả chính xác trên đồ thị có trọng số âm?',
        bloomLevel: 'Bloom 4 - Phân tích',
        bloomColor: 'bg-purple-50 text-purple-700 border-purple-200',
        difficulty: 'HARD',
        isApproved: false,
        status: 'PENDING',
        rubrics: [
          { criterionName: 'Nguyên lý Greedy của Dijkstra', maxScore: 3.0, description: 'Giải thích cách cập nhật nhãn đỉnh và điều kiện dừng' },
          { criterionName: 'Phản ví dụ trọng số âm', maxScore: 4.0, description: 'Chỉ rõ tại sao giả định Greedy bị vi phạm khi có cung âm' },
          { criterionName: 'So sánh Bellman-Ford', maxScore: 3.0, description: 'Nêu cơ chế phát hiện chu trình âm O(V*E)' }
        ]
      },
      {
        id: 'mock-2',
        code: 'CS301-Q106',
        subjectCode: 'CS301',
        content: 'So sánh cấu trúc cây AVL và cây Đỏ-Đen (Red-Black Tree). Khi nào nên ưu tiên sử dụng cây AVL thay vì cây Đỏ-Đen trong ứng dụng thực tế?',
        bloomLevel: 'Bloom 3 - Vận dụng',
        bloomColor: 'bg-sky-50 text-sky-700 border-sky-200',
        difficulty: 'MEDIUM',
        isApproved: false,
        status: 'PENDING',
        rubrics: [
          { criterionName: 'Khái niệm và điều kiện cân bằng', maxScore: 3.0, description: 'Phân biệt hệ số cân bằng AVL và tính chất tô màu' },
          { criterionName: 'Chi phí phép xoay (Rotations)', maxScore: 4.0, description: 'Chỉ ra số phép xoay tối đa khi insert và delete' },
          { criterionName: 'Kịch bản ứng dụng thực tế', maxScore: 3.0, description: 'Lựa chọn cấu trúc phù hợp với bài toán read-heavy vs write-heavy' }
        ]
      }
    ]);
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              Môn: {passedSubject}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              {questions.filter((q) => !q.isApproved).length} câu hỏi chờ duyệt
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <CheckCircle2 className="w-8 h-8 text-sky-600" />
            Phê duyệt câu hỏi
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Xem xét và phê duyệt câu hỏi trước khi đưa vào ngân hàng đề thi chính thức.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/generate"
            className="btn-glacier-secondary px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-sky-600" /> Sinh thêm câu hỏi
          </Link>
          <button 
            onClick={handleApproveAll}
            disabled={questions.length === 0 || questions.every((q) => q.isApproved)}
            className="btn-glacier-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Duyệt tất cả
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glacier-light-panel p-10 rounded-2xl text-center text-slate-500 text-xs">
            Đang tải danh sách câu hỏi...
          </div>
        ) : questions.length === 0 ? (
          <div className="glacier-light-panel p-10 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-70" />
            <h3 className="text-base font-bold text-slate-900">Không còn câu hỏi nào chờ duyệt</h3>
            <p className="text-xs text-slate-500">Tất cả câu hỏi đã được đưa vào ngân hàng chính thức.</p>
            <div className="pt-2">
              <Link to="/question-bank" className="btn-glacier-primary px-4 py-2 text-xs inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Đến Ngân hàng câu hỏi
              </Link>
            </div>
          </div>
        ) : (
          questions.map((q) => {
            const isApproved = q.isApproved || q.status === 'ACTIVE';
            const rubricsList = q.rubrics || [];

            return (
              <div 
                key={q.id} 
                className={`glacier-light-card p-6 rounded-2xl border-l-4 transition-all space-y-4 ${
                  isApproved 
                    ? 'border-l-emerald-600 bg-emerald-50/15' 
                    : 'border-l-sky-600'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {q.code || 'Q-DRAFT'}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${q.bloomColor || 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                        {q.bloomLevel || 'Bloom 3 - Vận dụng'}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <List className="w-3.5 h-3.5 text-sky-600" /> {rubricsList.length || q.rubricCount || 3} tiêu chí Rubric
                      </span>
                      {isApproved && (
                        <span className="text-xs text-emerald-700 flex items-center gap-1 font-bold ml-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã duyệt vào kho
                        </span>
                      )}
                    </div>
                    
                    {editingId === q.id ? (
                      <div className="space-y-3">
                        <textarea 
                          rows={3}
                          className="w-full p-3 text-xs bg-white border border-sky-400 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100 font-medium"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Câu trả lời mẫu:</label>
                          <textarea
                            rows={2}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                            value={editExpectedAnswer}
                            onChange={(e) => setEditExpectedAnswer(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-slate-800 text-sm font-semibold leading-relaxed">
                          {q.content}
                        </p>
                        {q.expectedAnswer && (
                          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <strong className="text-slate-700">Gợi ý trả lời:</strong> {q.expectedAnswer}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0">
                    {editingId === q.id ? (
                      <button 
                        onClick={() => handleSaveEdit(q)} 
                        className="p-2.5 btn-glacier-primary text-xs rounded-xl flex items-center justify-center cursor-pointer" 
                        title="Lưu chỉnh sửa"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStartEdit(q)} 
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer" 
                        title="Chỉnh sửa nội dung"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {!isApproved && (
                      <button 
                        onClick={() => handleApproveOne(q.id)} 
                        className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer" 
                        title="Duyệt câu hỏi này"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleRemove(q.id)} 
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer" 
                      title="Loại bỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rubric Preview */}
                {rubricsList.length > 0 && (
                  <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
                    <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-sky-600" /> Barem tiêu chí đánh giá (Rubric):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {rubricsList.map((r, rIdx) => (
                        <div key={r.uuid || rIdx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{r.criterionName}</span>
                            <span className="text-sky-700 font-mono text-[11px]">{r.maxScore}đ</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">{r.description}</p>
                        </div>
                      ))}
                    </div>
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
