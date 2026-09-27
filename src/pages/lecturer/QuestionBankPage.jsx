import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Search, Plus, Filter, BookOpen, Layers, CheckCircle, Sparkles, Cpu } from 'lucide-react';

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const navigate = useNavigate();

  // Sample data showcasing RAG Question Bank with Vector Embeddings
  const sampleQuestions = [
    {
      id: 'q-1',
      code: 'PRJ301-Q102',
      subject: 'Java Web Application (PRJ301)',
      difficulty: 'MEDIUM',
      content: 'Explain the lifecycle of a Java Servlet and how Session Management is maintained in distributed environments.',
      keywords: ['Servlet Lifecycle', 'HttpSession', 'Cookies', 'Distributed Cache'],
      vectorStatus: 'Embedded (1536 dims)',
      rubricCount: 3,
    },
    {
      id: 'q-2',
      code: 'SWP391-Q045',
      subject: 'Software Development Project (SWP391)',
      difficulty: 'HARD',
      content: 'How does an event-driven architecture prevent cascading failures during high concurrent traffic peaks?',
      keywords: ['Kafka', 'Circuit Breaker', 'Backpressure', 'Idempotency'],
      vectorStatus: 'Embedded (1536 dims)',
      rubricCount: 4,
    },
    {
      id: 'q-3',
      code: 'CSD201-Q088',
      subject: 'Data Structures & Algorithms (CSD201)',
      difficulty: 'EASY',
      content: 'Compare the time complexity and memory overhead between AVL Tree and Red-Black Tree in balancing operations.',
      keywords: ['Binary Search Tree', 'Rotation', 'Worst-case', 'Tree Height'],
      vectorStatus: 'Embedded (1536 dims)',
      rubricCount: 2,
    },
  ];

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
            onClick={() => navigate('/generate')} 
            className="btn-glacier-primary px-4 py-2.5 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Thêm Câu Hỏi Mới
          </button>
          <button 
            onClick={() => navigate('/generate')} 
            className="btn-glacier-secondary px-4 py-2.5 text-xs"
          >
            <Sparkles className="w-4 h-4 text-sky-600" /> AI Auto-Generate
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
            <option value="PRJ301">PRJ301 - Java Web</option>
            <option value="SWP391">SWP391 - Software Project</option>
            <option value="CSD201">CSD201 - Data Structures</option>
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
        {sampleQuestions.map((q) => (
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
              </div>
              <div className="flex items-center gap-2">
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
                  <CheckCircle className="w-3 h-3 text-sky-600" /> {q.vectorStatus}
                </span>
              </div>
            </div>

            <p className="text-slate-800 text-sm font-medium leading-relaxed">
              {q.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400">Keywords:</span>
                {q.keywords.map((k, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-slate-100 rounded-md text-slate-700 font-medium">
                    #{k}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Layers className="w-3.5 h-3.5 text-sky-600" /> {q.rubricCount} Rubric tiêu chí
                </span>
                <button className="text-sky-600 hover:text-sky-800 font-bold ml-2 underline underline-offset-2">
                  Chi tiết →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
