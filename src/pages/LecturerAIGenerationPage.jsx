import React, { useState } from 'react';
import { UploadCloud, FileText, Sparkles, Settings, ArrowRight, CheckCircle, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LecturerAIGenerationPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = () => {
    if (!file) return;
    setIsGenerating(true);
    let currentProgress = 0;
    
    // Simulate generation progress
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress > 100) {
        clearInterval(interval);
        setIsGenerating(false);
        navigate('/review');
      } else {
        setProgress(currentProgress);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Giảng Viên - Module 1
          </span>
          <span className="text-xs text-gray-400">
            Tạo câu hỏi bằng AI (RAG Pipeline)
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-indigo-400" />
          AI Sinh Câu Hỏi Vấn Đáp
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Tải lên đề cương (Syllabus), bài giảng (Slides) để hệ thống AI trích xuất nội dung và sinh ra danh sách câu hỏi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upload and Source */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 relative overflow-hidden">
            {/* Background glowing effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              Tải lên tài liệu môn học
            </h2>
            <p className="text-xs text-gray-400">Hỗ trợ PDF, DOCX, TXT. Tối đa 50MB.</p>

            {/* Drag and Drop Area */}
            <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-700 bg-gray-900/50 hover:border-gray-500 hover:bg-gray-800/50'}`}>
              {!file ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">Kéo thả file vào đây hoặc</p>
                  <label className="cursor-pointer text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Duyệt file
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
                  </label>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{file.name}</p>
                  <p className="text-xs text-gray-400 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-300 font-medium">
                    Hủy tải lên
                  </button>
                </>
              )}
            </div>
          </div>

          {isGenerating && (
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-900/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                  <Database className="w-4 h-4 animate-pulse" />
                  Đang xử lý Vector Embedding & Sinh câu hỏi...
                </span>
                <span className="text-sm font-mono text-indigo-400">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 text-center animate-pulse">
                Hệ thống đang trích xuất ngữ cảnh (RAG) và tạo câu hỏi theo thang Bloom...
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Settings */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              Cấu hình AI
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Số lượng câu hỏi</label>
                <select className="w-full px-3 py-2 text-sm bg-gray-900/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500">
                  <option value="10">10 Câu hỏi</option>
                  <option value="20">20 Câu hỏi</option>
                  <option value="30">30 Câu hỏi</option>
                  <option value="50">50 Câu hỏi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Môn học</label>
                <select className="w-full px-3 py-2 text-sm bg-gray-900/60 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500">
                  <option value="PRJ301">PRJ301 - Java Web</option>
                  <option value="SWP391">SWP391 - Software Project</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-400 mb-2">Phân bổ Thang Bloom</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-medium">Nhớ (Remember)</span>
                    <span className="text-xs text-gray-300">20%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[20%]"></div></div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-blue-400 font-medium">Hiểu (Understand)</span>
                    <span className="text-xs text-gray-300">30%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[30%]"></div></div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-amber-400 font-medium">Vận dụng (Apply)</span>
                    <span className="text-xs text-gray-300">30%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[30%]"></div></div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-red-400 font-medium">Phân tích (Analyze)</span>
                    <span className="text-xs text-gray-300">20%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[20%]"></div></div>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!file || isGenerating}
              className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                !file || isGenerating
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isGenerating ? (
                <>Đang tạo...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Bắt đầu tạo câu hỏi
                </>
              )}
            </button>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Các câu hỏi được tạo ra sẽ nằm ở trạng thái <strong className="text-white">Chờ Duyệt</strong>. Bạn có quyền chỉnh sửa nội dung, Bloom tag và bộ Rubric trước khi đưa vào kho chính thức.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
