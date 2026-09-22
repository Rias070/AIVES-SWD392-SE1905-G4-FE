import React, { useState } from 'react';
import { Database, Search, Plus, Filter, BookOpen, Layers, CheckCircle, Sparkles, Cpu } from 'lucide-react';

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Dành Cho Giảng Viên
            </span>
            <span className="text-xs text-gray-400">
              Quản lý câu hỏi & chuẩn hóa Rubric
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Database className="w-8 h-8 text-indigo-400" />
            Ngân Hàng Câu Hỏi & Vector Embedding
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Quản lý kho tri thức kiểm thử vấn đáp, gắn nhãn độ khó và tự động vector hóa cho mô hình AI RAG.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20">
            <Plus className="w-4 h-4" /> Thêm Câu Hỏi Mới
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm rounded-xl border border-gray-700 transition-all">
            <Sparkles className="w-4 h-4 text-amber-400" /> AI Auto-Generate
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung câu hỏi, từ khóa, mã môn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5" /> Lọc theo:
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-900/60 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Tất cả môn học</option>
            <option value="PRJ301">PRJ301 - Java Web</option>
            <option value="SWP391">SWP391 - Software Project</option>
            <option value="CSD201">CSD201 - Data Structures</option>
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-900/60 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500"
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
            className="glass-card p-5 rounded-2xl border border-gray-800 hover:border-indigo-500/40 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-gray-800 text-indigo-300">
                  {q.code}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-gray-500" /> {q.subject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 font-medium rounded-full ${
                    q.difficulty === 'HARD'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : q.difficulty === 'MEDIUM'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {q.difficulty}
                </span>
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-500/30">
                  <CheckCircle className="w-3 h-3 text-indigo-400" /> {q.vectorStatus}
                </span>
              </div>
            </div>

            <p className="text-gray-200 text-sm font-medium leading-relaxed">
              {q.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800/60 text-xs text-gray-400">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-gray-500">Keywords:</span>
                {q.keywords.map((k, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-900 rounded text-gray-300">
                    #{k}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-gray-500" /> {q.rubricCount} Rubric tiêu chí
                </span>
                <button className="text-indigo-400 hover:text-indigo-300 font-medium ml-2">
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
