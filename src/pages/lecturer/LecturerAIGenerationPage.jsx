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
      <div className="pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            Giảng Viên - Module AI RAG
          </span>
          <span className="text-xs text-slate-500">
            Tạo câu hỏi bằng AI RAG Pipeline & Vector Database
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <Sparkles className="w-8 h-8 text-sky-600" />
          AI Sinh Câu Hỏi Vấn Đáp Tự Động
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Tải lên đề cương (Syllabus), bài giảng (Slides) để hệ thống AI trích xuất nội dung và sinh ra danh sách câu hỏi theo chuẩn thang Bloom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upload and Source */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glacier-light-panel p-6 md:p-8 rounded-2xl space-y-4 relative overflow-hidden">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-600" />
              Tải lên tài liệu môn học
            </h2>
            <p className="text-xs text-slate-500">Hỗ trợ PDF, DOCX, TXT. Dung lượng tối đa 50MB.</p>

            {/* Drag and Drop Area */}
            <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all ${
              file 
                ? 'border-sky-500 bg-sky-50/50' 
                : 'border-slate-300 bg-slate-50/80 hover:border-sky-400 hover:bg-sky-50/30'
            }`}>
              {!file ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm text-sky-600">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">Kéo thả file vào đây hoặc</p>
                  <label className="cursor-pointer text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors underline underline-offset-4">
                    Duyệt file từ máy tính
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
                  </label>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center mb-4 text-sky-700 shadow-sm">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{file.name}</p>
                  <p className="text-xs text-slate-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button onClick={() => setFile(null)} className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2">
                    Hủy tải lên
                  </button>
                </>
              )}
            </div>
          </div>

          {isGenerating && (
            <div className="glacier-light-card p-6 rounded-2xl border-l-4 border-l-sky-600 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-600 animate-pulse" />
                  Đang xử lý Vector Embedding & Sinh câu hỏi...
                </span>
                <span className="text-sm font-mono font-bold text-sky-700">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 text-center animate-pulse">
                Hệ thống đang trích xuất ngữ cảnh (RAG) và tạo câu hỏi theo thang Bloom chuẩn hóa...
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Settings */}
        <div className="space-y-6">
          <div className="glacier-light-panel p-6 rounded-2xl space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-sky-600" />
              Cấu hình AI
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Số lượng câu hỏi</label>
                <select className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500">
                  <option value="10">10 Câu hỏi</option>
                  <option value="20">20 Câu hỏi</option>
                  <option value="30">30 Câu hỏi</option>
                  <option value="50">50 Câu hỏi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Môn học</label>
                <select className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500">
                  <option value="PRJ301">PRJ301 - Java Web</option>
                  <option value="SWP391">SWP391 - Software Project</option>
                  <option value="CSD201">CSD201 - Data Structures</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Phân bổ Thang Bloom</label>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Nhớ (Remember)</span>
                    <span className="text-slate-800 font-bold">20%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-slate-400 w-[20%]"></div></div>
                  
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-sky-700 font-medium">Hiểu (Understand)</span>
                    <span className="text-slate-800 font-bold">35%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-sky-600 w-[35%]"></div></div>
                  
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-cyan-700 font-medium">Phân tích (Analyze)</span>
                    <span className="text-slate-800 font-bold">30%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-[30%]"></div></div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-indigo-700 font-medium">Đánh giá & Tổng hợp</span>
                    <span className="text-slate-800 font-bold">15%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[15%]"></div></div>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!file || isGenerating}
              className={`w-full py-3 px-4 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                !file || isGenerating
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'btn-glacier-primary'
              }`}
            >
              {isGenerating ? (
                <>Đang tạo câu hỏi...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Bắt đầu tạo câu hỏi
                </>
              )}
            </button>
          </div>

          <div className="glacier-light-card p-4 rounded-2xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Các câu hỏi được tạo ra sẽ nằm ở trạng thái <strong className="text-slate-800">Chờ Duyệt</strong>. Giảng viên có toàn quyền chỉnh sửa nội dung, Bloom tag và bộ Rubric trước khi đưa vào kho chính thức.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
