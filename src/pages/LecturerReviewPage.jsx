import React, { useState } from 'react';
import { CheckCircle2, Edit3, Trash2, X, Check, Save, Layers, List } from 'lucide-react';

export default function LecturerReviewPage() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      content: 'Trình bày cách thức hoạt động của Inversion of Control (IoC) trong Spring Framework. So sánh với cách khởi tạo object truyền thống.',
      bloom: 'Hiểu (Understand)',
      bloomColor: 'text-[#E8E2D8] bg-[#C9A876]/20 border-[#C9A876]/40',
      rubrics: 3,
      status: 'pending'
    },
    {
      id: 2,
      content: 'Phân tích một tình huống cụ thể (Use Case) khi áp dụng Singleton Pattern có thể gây ra hiện tượng Thread-Safety issues trong môi trường Multi-threading.',
      bloom: 'Phân tích (Analyze)',
      bloomColor: 'text-[#E8E2D8] bg-[#8B6F47]/25 border-[#8B6F47]/45',
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#5C554C]/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#C9A876]/15 text-[#E8E2D8] border border-[#C9A876]/35">
              Kiểm Duyệt Đề (Review)
            </span>
            <span className="text-xs text-[#B8B0A6]">
              PRJ301 - Java Web Application
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F5F0E8] flex items-center gap-2.5">
            <CheckCircle2 className="w-8 h-8 text-[#C9A876]" />
            Duyệt & Chỉnh Sửa Câu Hỏi AI Sinh
          </h1>
          <p className="text-sm text-[#B8B0A6] mt-2">
            Giảng viên xem xét nội dung, tag độ khó/Bloom và hệ thống Rubric gợi ý trước khi lưu vào Ngân hàng chính thức.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={approveAll}
            className="btn-liquid-gold px-6 py-3 text-xs"
          >
            <Check className="w-4 h-4" /> Duyệt Tất Cả
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="glass-panel p-10 rounded-[28px] text-center border border-[#5C554C]/60">
            <CheckCircle2 className="w-12 h-12 text-[#C9A876] mx-auto mb-4 opacity-60" />
            <h3 className="text-lg font-bold text-[#F5F0E8]">Không còn câu hỏi nào chờ duyệt</h3>
            <p className="text-sm text-[#B8B0A6]">Tất cả câu hỏi đã được đưa vào ngân hàng chính thức.</p>
          </div>
        ) : (
          questions.map(q => (
            <div 
              key={q.id} 
              className={`glass-card p-6 rounded-[24px] border transition-all space-y-4 ${
                q.status === 'approved' 
                  ? 'border-[#C9A876]/70 bg-[#3A332C]/90 shadow-[0_0_25px_rgba(201,168,118,0.18)]' 
                  : 'border-[#5C554C]/60 hover:border-[#C9A876]/40'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${q.bloomColor}`}>
                      {q.bloom}
                    </span>
                    <span className="text-xs text-[#B8B0A6] flex items-center gap-1.5">
                      <List className="w-3.5 h-3.5 text-[#C9A876]" /> {q.rubrics} Tiêu chí (Rubric)
                    </span>
                    {q.status === 'approved' && (
                      <span className="text-xs text-[#E8E2D8] flex items-center gap-1.5 font-bold ml-2 bg-[#C9A876]/20 px-2.5 py-0.5 rounded-full border border-[#C9A876]/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A876]" /> Đã duyệt vào kho
                      </span>
                    )}
                  </div>
                  
                  {editingId === q.id ? (
                    <textarea 
                      className="liquid-input w-full h-28 text-sm"
                      defaultValue={q.content}
                    />
                  ) : (
                    <p className="text-[#F5F0E8] text-sm font-medium leading-relaxed">
                      {q.content}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                  {editingId === q.id ? (
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="p-2.5 btn-liquid-gold text-xs rounded-[14px]" 
                      title="Lưu"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditingId(q.id)} 
                      className="p-2.5 rounded-[14px] bg-[#1C1815]/70 hover:bg-[#3A332C] text-[#B8B0A6] hover:text-[#F5F0E8] border border-[#5C554C]/50 transition-colors" 
                      title="Chỉnh sửa nội dung"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  {q.status !== 'approved' && (
                    <button 
                      onClick={() => approveQuestion(q.id)} 
                      className="p-2.5 rounded-[14px] bg-[#C9A876]/15 hover:bg-[#C9A876]/25 text-[#E8E2D8] border border-[#C9A876]/35 transition-colors" 
                      title="Duyệt câu hỏi này"
                    >
                      <Check className="w-4 h-4 text-[#C9A876]" />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => removeQuestion(q.id)} 
                    className="p-2.5 rounded-[14px] bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/25 transition-colors" 
                    title="Xóa bỏ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rubric preview */}
              <div className="bg-[#1C1815]/60 rounded-[18px] p-4 border border-[#5C554C]/50">
                <div className="text-xs font-semibold text-[#B8B0A6] mb-2.5 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#C9A876]" /> Gợi ý Rubric chấm điểm:
                </div>
                <div className="space-y-1.5 text-xs text-[#B8B0A6]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#C9A876] font-bold shrink-0">30%</span> 
                    <span><strong className="text-[#F5F0E8]">Mức Khá:</strong> Trả lời được định nghĩa cơ bản, thiếu so sánh chuyên sâu.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#C9A876] font-bold shrink-0">70%</span> 
                    <span><strong className="text-[#F5F0E8]">Mức Tốt:</strong> Nêu rõ sự khác biệt, đưa ra được ví dụ áp dụng.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#C9A876] font-bold shrink-0">100%</span> 
                    <span><strong className="text-[#F5F0E8]">Xuất sắc:</strong> Giải thích cặn kẽ cơ chế dưới hood, phân tích pros/cons rõ ràng.</span>
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
