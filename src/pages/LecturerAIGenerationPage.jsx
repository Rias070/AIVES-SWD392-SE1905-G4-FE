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
      <div className="border-b border-[#5C554C]/60 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#C9A876]/15 text-[#E8E2D8] border border-[#C9A876]/30">
            Giảng Viên - Module AI RAG
          </span>
          <span className="text-xs text-[#B8B0A6]">
            Tạo câu hỏi bằng AI RAG Pipeline & Vector Database
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#F5F0E8] flex items-center gap-2.5">
          <Sparkles className="w-8 h-8 text-[#C9A876]" />
          AI Sinh Câu Hỏi Vấn Đáp
        </h1>
        <p className="text-sm text-[#B8B0A6] mt-2">
          Tải lên đề cương (Syllabus), bài giảng (Slides) để hệ thống AI trích xuất nội dung và sinh ra danh sách câu hỏi theo chuẩn thang Bloom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upload and Source */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-[28px] border border-[#C9A876]/30 space-y-4 relative overflow-hidden">
            {/* Ambient metallic glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#C9A876]/10 blur-3xl rounded-full pointer-events-none" />

            <h2 className="text-lg font-bold text-[#F5F0E8] flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#C9A876]" />
              Tải lên tài liệu môn học
            </h2>
            <p className="text-xs text-[#B8B0A6]">Hỗ trợ PDF, DOCX, TXT. Dung lượng tối đa 50MB.</p>

            {/* Drag and Drop Area */}
            <div className={`border-2 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center text-center transition-all ${
              file 
                ? 'border-[#C9A876] bg-[#C9A876]/10 shadow-[0_0_25px_rgba(201,168,118,0.15)]' 
                : 'border-[#5C554C]/70 bg-[#1C1815]/50 hover:border-[#C9A876]/60 hover:bg-[#3A332C]/40'
            }`}>
              {!file ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#3A332C]/80 border border-[#5C554C]/50 flex items-center justify-center mb-4 shadow-inner">
                    <UploadCloud className="w-8 h-8 text-[#C9A876]" />
                  </div>
                  <p className="text-sm font-semibold text-[#F5F0E8] mb-1">Kéo thả file vào đây hoặc</p>
                  <label className="cursor-pointer text-sm font-bold text-[#C9A876] hover:text-[#E8E2D8] transition-colors underline underline-offset-4">
                    Duyệt file từ máy tính
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
                  </label>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#C9A876]/20 border border-[#C9A876]/40 flex items-center justify-center mb-4 text-[#E8E2D8] shadow-md">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-[#F5F0E8] mb-1">{file.name}</p>
                  <p className="text-xs text-[#B8B0A6] mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button onClick={() => setFile(null)} className="text-xs text-red-300 hover:text-red-200 font-semibold underline underline-offset-2">
                    Hủy tải lên
                  </button>
                </>
              )}
            </div>
          </div>

          {isGenerating && (
            <div className="glass-panel p-6 rounded-[24px] border border-[#C9A876]/50 bg-[#3A332C]/85 space-y-4 shadow-[0_0_30px_rgba(201,168,118,0.2)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#E8E2D8] flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#C9A876] animate-pulse" />
                  Đang xử lý Vector Embedding & Sinh câu hỏi...
                </span>
                <span className="text-sm font-mono font-bold text-[#C9A876]">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#1C1815] rounded-full overflow-hidden p-0.5 border border-[#5C554C]/40">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#B8B0A6] via-[#C9A876] to-[#E8E2D8] transition-all duration-300 ease-out shadow-sm" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-[#B8B0A6] text-center animate-pulse">
                Hệ thống đang trích xuất ngữ cảnh (RAG) và tạo câu hỏi theo thang Bloom chuẩn hóa...
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Settings */}
        <div className="space-y-6">
          <div className="glass-panel p-6 md:p-7 rounded-[28px] border border-[#C9A876]/30 space-y-5">
            <h2 className="text-lg font-bold text-[#F5F0E8] flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#C9A876]" />
              Cấu hình AI
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#E8E2D8] mb-1.5">Số lượng câu hỏi</label>
                <select className="liquid-input w-full">
                  <option value="10">10 Câu hỏi</option>
                  <option value="20">20 Câu hỏi</option>
                  <option value="30">30 Câu hỏi</option>
                  <option value="50">50 Câu hỏi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E8E2D8] mb-1.5">Môn học</label>
                <select className="liquid-input w-full">
                  <option value="PRJ301">PRJ301 - Java Web</option>
                  <option value="SWP391">SWP391 - Software Project</option>
                  <option value="CSD201">CSD201 - Data Structures</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#E8E2D8] mb-2">Phân bổ Thang Bloom</label>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B8B0A6] font-medium">Nhớ (Remember)</span>
                    <span className="text-[#F5F0E8] font-bold">20%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1C1815] rounded-full overflow-hidden"><div className="h-full bg-[#B8B0A6] w-[20%]"></div></div>
                  
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#C9A876] font-medium">Hiểu (Understand)</span>
                    <span className="text-[#F5F0E8] font-bold">30%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1C1815] rounded-full overflow-hidden"><div className="h-full bg-[#C9A876] w-[30%]"></div></div>
                  
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#E8E2D8] font-medium">Vận dụng (Apply)</span>
                    <span className="text-[#F5F0E8] font-bold">30%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1C1815] rounded-full overflow-hidden"><div className="h-full bg-[#E8E2D8] w-[30%]"></div></div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#8B6F47] font-medium">Phân tích (Analyze)</span>
                    <span className="text-[#F5F0E8] font-bold">20%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1C1815] rounded-full overflow-hidden"><div className="h-full bg-[#8B6F47] w-[20%]"></div></div>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!file || isGenerating}
              className={`w-full py-3.5 px-4 font-bold text-sm rounded-[20px] transition-all flex items-center justify-center gap-2 ${
                !file || isGenerating
                  ? 'bg-[#3A332C]/60 text-[#B8B0A6]/40 cursor-not-allowed border border-[#5C554C]/40'
                  : 'btn-liquid-gold'
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

          <div className="glass-panel p-5 rounded-[22px] border border-[#5C554C]/60 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#C9A876] shrink-0 mt-0.5" />
            <p className="text-xs text-[#B8B0A6] leading-relaxed">
              Các câu hỏi được tạo ra sẽ nằm ở trạng thái <strong className="text-[#F5F0E8]">Chờ Duyệt</strong>. Giảng viên có toàn quyền chỉnh sửa nội dung, Bloom tag và bộ Rubric trước khi đưa vào kho chính thức.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
