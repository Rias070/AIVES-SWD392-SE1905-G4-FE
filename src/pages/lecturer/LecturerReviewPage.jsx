import React, { useState } from 'react';
import { CheckCircle2, Edit3, Trash2, X, Check, Save, Layers, List } from 'lucide-react';

export default function LecturerReviewPage() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      content: 'Trình bày cách thức hoạt động của Inversion of Control (IoC) trong Spring Framework. So sánh với cách khởi tạo object truyền thống.',
      bloom: 'Hiểu (Understand)',
      bloomColor: 'text-sky-700 bg-sky-50 border-sky-200',
      rubrics: 3,
      status: 'pending'
    },
    {
      id: 2,
      content: 'Phân tích một tình huống cụ thể (Use Case) khi áp dụng Singleton Pattern có thể gây ra hiện tượng Thread-Safety issues trong môi trường Multi-threading.',
      bloom: 'Phân tích (Analyze)',
      bloomColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      rubrics: 4,
      status: 'pending'
    }
  ]);

  const [editingId, setEditingId] = useState(null);

  const approveAll = () => {
    setQuestions(questions.map(q => ({ ...q, status: 'approved' })));
  };

  const approveQuestion = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, status: 'approved' } : q));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              Kiểm Duyệt Đề (Review)
            </span>
            <span className="text-xs text-slate-500">
              PRJ301 - Java Web Application
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <CheckCircle2 className="w-8 h-8 text-sky-600" />
            Duyệt & Chỉnh Sửa Câu Hỏi AI Sinh
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Giảng viên xem xét nội dung, tag độ khó/Bloom và hệ thống Rubric gợi ý trước khi lưu vào Ngân hàng chính thức.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={approveAll}
            className="btn-glacier-primary px-5 py-2.5 text-xs font-semibold"
          >
            <Check className="w-4 h-4" /> Duyệt Tất Cả
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="glacier-light-panel p-10 rounded-2xl text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-70" />
            <h3 className="text-base font-bold text-slate-900">Không còn câu hỏi nào chờ duyệt</h3>
            <p className="text-sm text-slate-500">Tất cả câu hỏi đã được đưa vào ngân hàng chính thức.</p>
          </div>
        ) : (
          questions.map(q => (
            <div 
              key={q.id} 
              className={`glacier-light-card p-6 rounded-2xl border-l-4 transition-all space-y-4 ${
                q.status === 'approved' 
                  ? 'border-l-emerald-600 bg-emerald-50/20' 
                  : 'border-l-sky-600'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${q.bloomColor}`}>
                      {q.bloom}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <List className="w-3.5 h-3.5 text-sky-600" /> {q.rubrics} Tiêu chí (Rubric)
                    </span>
                    {q.status === 'approved' && (
                      <span className="text-xs text-emerald-700 flex items-center gap-1 font-bold ml-2 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã duyệt vào kho
                      </span>
                    )}
                  </div>
                  
                  {editingId === q.id ? (
                    <textarea 
                      className="w-full h-28 p-3 text-sm bg-slate-50 border border-sky-400 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      defaultValue={q.content}
                    />
                  ) : (
                    <p className="text-slate-800 text-sm font-medium leading-relaxed">
                      {q.content}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                  {editingId === q.id ? (
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="p-2.5 btn-glacier-primary text-xs rounded-xl" 
                      title="Lưu"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditingId(q.id)} 
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors" 
                      title="Chỉnh sửa nội dung"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  {q.status !== 'approved' && (
                    <button 
                      onClick={() => approveQuestion(q.id)} 
                      className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors" 
                      title="Duyệt câu hỏi này"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => removeQuestion(q.id)} 
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors" 
                    title="Xóa bỏ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rubric preview */}
              <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-sky-600" /> Gợi ý Rubric chấm điểm:
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="text-sky-700 font-bold shrink-0">30%</span> 
                    <span><strong className="text-slate-800">Mức Khá:</strong> Trả lời được định nghĩa cơ bản, thiếu so sánh chuyên sâu.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sky-700 font-bold shrink-0">70%</span> 
                    <span><strong className="text-slate-800">Mức Tốt:</strong> Nêu rõ sự khác biệt, đưa ra được ví dụ áp dụng.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sky-700 font-bold shrink-0">100%</span> 
                    <span><strong className="text-slate-800">Xuất sắc:</strong> Giải thích cặn kẽ cơ chế dưới hood, phân tích pros/cons rõ ràng.</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
