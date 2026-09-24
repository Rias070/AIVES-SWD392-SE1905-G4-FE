import React, { useState } from 'react';
import { CheckCircle2, Edit3, Trash2, X, Check, Save, Layers, List } from 'lucide-react';

export default function LecturerReviewPage() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      content: 'Trình bày cách thức hoạt động của Inversion of Control (IoC) trong Spring Framework. So sánh với cách khởi tạo object truyền thống.',
      bloom: 'Hiểu (Understand)',
      bloomColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      rubrics: 3,
      status: 'pending'
    },
    {
      id: 2,
      content: 'Phân tích một tình huống cụ thể (Use Case) khi áp dụng Singleton Pattern có thể gây ra hiện tượng Thread-Safety issues trong môi trường Multi-threading.',
      bloom: 'Phân tích (Analyze)',
      bloomColor: 'text-red-400 bg-red-500/10 border-red-500/20',
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Kiểm Duyệt Đề (Review)
            </span>
            <span className="text-xs text-gray-400">
              PRJ301 - Java Web
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-amber-400" />
            Duyệt & Chỉnh Sửa Câu Hỏi AI Sinh
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Giảng viên xem xét nội dung, tag độ khó/Bloom và hệ thống Rubric gợi ý trước khi lưu vào Ngân hàng chính thức.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={approveAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20"
          >
            <Check className="w-4 h-4" /> Duyệt Tất Cả
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl text-center border border-gray-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-white">Không còn câu hỏi nào chờ duyệt</h3>
            <p className="text-sm text-gray-400">Tất cả câu hỏi đã được đưa vào ngân hàng chính thức.</p>
          </div>
        ) : (
          questions.map(q => (
            <div key={q.id} className={`glass-card p-5 rounded-2xl border transition-all space-y-4 ${q.status === 'approved' ? 'border-emerald-500/30 bg-emerald-900/5' : 'border-gray-800 hover:border-gray-600'}`}>
              
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${q.bloomColor}`}>
                      {q.bloom}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <List className="w-3.5 h-3.5" /> {q.rubrics} Tiêu chí (Rubric)
                    </span>
                    {q.status === 'approved' && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold ml-2">
                        <CheckCircle2 className="w-4 h-4" /> Đã duyệt
                      </span>
                    )}
                  </div>
                  
                  {editingId === q.id ? (
                    <textarea 
                      className="w-full h-24 bg-gray-900/80 border border-indigo-500 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      defaultValue={q.content}
                    ></textarea>
                  ) : (
                    <p className="text-gray-200 text-sm font-medium leading-relaxed">
                      {q.content}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                  {editingId === q.id ? (
                    <button onClick={() => setEditingId(null)} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-colors" title="Lưu">
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => setEditingId(q.id)} className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center border border-gray-700 transition-colors" title="Chỉnh sửa nội dung">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  {q.status !== 'approved' && (
                    <button onClick={() => approveQuestion(q.id)} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/20 transition-colors" title="Duyệt câu hỏi này">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button onClick={() => removeQuestion(q.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center border border-red-500/20 transition-colors" title="Xóa bỏ">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Collapsed Rubric preview */}
              <div className="bg-gray-900/40 rounded-xl p-3 border border-gray-800/60">
                <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Gợi ý Rubric chấm điểm:
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold shrink-0">30%</span> Mức Khá: Trả lời được định nghĩa cơ bản, thiếu so sánh chuyên sâu.
                  </div>
                  <div className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold shrink-0">70%</span> Mức Tốt: Nêu rõ sự khác biệt, đưa ra được ví dụ áp dụng.
                  </div>
                  <div className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold shrink-0">100%</span> Xuất sắc: Giải thích cặn kẽ cơ chế dưới hood, phân tích pros/cons rõ ràng.
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
