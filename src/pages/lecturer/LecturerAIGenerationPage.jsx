import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Sparkles, Settings, ArrowRight, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { lecturerDocumentApi, lecturerQuestionApi, subjectApi } from '../../services/api';

export default function LecturerAIGenerationPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form states
  const [subjects, setSubjects] = useState([
    { code: 'CS301', name: 'Cấu trúc Dữ liệu & Giải thuật nâng cao' },
    { code: 'PRJ301', name: 'Java Web Applications' },
    { code: 'SWD392', name: 'Software Architecture & Design' },
  ]);
  const [selectedSubject, setSelectedSubject] = useState('CS301');
  const [topic, setTopic] = useState('');
  const [bloomLevel, setBloomLevel] = useState('ALL');
  const [questionCount, setQuestionCount] = useState(3);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await subjectApi.getSubjects();
        if (res?.data?.result && res.data.result.length > 0) {
          setSubjects(res.data.result);
          setSelectedSubject(res.data.result[0].code);
        }
      } catch (e) {
        // Fallback to initial subjects
      }
    };
    loadSubjects();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(15);
    setErrorMessage(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 400);

    try {
      let uploadedDoc = null;
      // Step 1: If file attached, upload first
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subjectCode', selectedSubject);

        try {
          const uploadRes = await lecturerDocumentApi.uploadDocumentFile(formData);
          uploadedDoc = uploadRes?.data?.result;
        } catch (uploadErr) {
          console.warn('Upload file warning, continuing with topic-based RAG:', uploadErr);
        }
      }

      setProgress(60);

      // Step 2: Call RAG Question Generation API
      const reqPayload = {
        subjectCode: selectedSubject,
        documentUuid: uploadedDoc?.id,
        topic: topic || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Kiến thức cốt lõi học phần'),
        bloomLevel: bloomLevel,
        count: Number(questionCount),
      };

      const res = await lecturerQuestionApi.generateQuestionsRAG(reqPayload);
      const generatedList = res?.data?.result || [];

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        navigate('/review', {
          state: {
            generatedQuestions: generatedList,
            subjectCode: selectedSubject,
            count: generatedList.length,
          },
        });
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setProgress(0);
      setErrorMessage(err.friendlyMessage || 'Không thể sinh câu hỏi từ tài liệu. Vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200/80">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <Sparkles className="w-8 h-8 text-sky-600" />
          Tạo câu hỏi từ tài liệu
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tải lên đề cương hoặc chọn học phần để tự động trích xuất ngữ cảnh và tạo bộ câu hỏi thi vấn đáp.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upload and Source */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glacier-light-panel p-6 md:p-8 rounded-2xl space-y-4 relative overflow-hidden">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-600" />
              Tài liệu học liệu môn học (Tùy chọn)
            </h2>
            <p className="text-xs text-slate-500">
              Hỗ trợ PDF, DOCX, TXT. Hệ thống sẽ tự động băm đoạn và đối chiếu ngữ cảnh RAG.
            </p>

            {/* Drag and Drop Area */}
            <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
              file 
                ? 'border-sky-500 bg-sky-50/50' 
                : 'border-slate-300 bg-slate-50/80 hover:border-sky-400 hover:bg-sky-50/30'
            }`}>
              {!file ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm text-sky-600">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">Kéo thả tài liệu vào đây hoặc</p>
                  <label className="cursor-pointer text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors underline underline-offset-4">
                    Chọn tệp từ thiết bị
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
                  </label>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center mb-3 text-sky-700 shadow-sm">
                    <FileText className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{file.name}</p>
                  <p className="text-xs text-slate-500 mb-3">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button onClick={() => setFile(null)} className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2">
                    Hủy tải lên
                  </button>
                </>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Chủ đề / Chương bài giảng trọng tâm
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Cây AVL & Đồ thị Dijkstra, Quản lý Session trong Spring Boot..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          {isGenerating && (
            <div className="glacier-light-card p-6 rounded-2xl border-l-4 border-l-sky-600 space-y-4 shadow-md animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-600 animate-pulse" />
                  Đang phân tích tri thức RAG và sinh câu hỏi kèm Rubric...
                </span>
                <span className="text-sm font-mono font-bold text-sky-700">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Settings */}
        <div className="space-y-6">
          <div className="glacier-light-panel p-6 rounded-2xl space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-sky-600" />
              Thiết lập câu hỏi
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Môn học</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
                >
                  {subjects.map((s, idx) => (
                    <option key={s.code || idx} value={s.code}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Số lượng câu hỏi</label>
                <select 
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value={3}>3 Câu hỏi</option>
                  <option value={5}>5 Câu hỏi</option>
                  <option value={8}>8 Câu hỏi</option>
                  <option value={10}>10 Câu hỏi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thang đo nhận thức Bloom</label>
                <select 
                  value={bloomLevel}
                  onChange={(e) => setBloomLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="ALL">Mọi mức độ Bloom (Hỗn hợp)</option>
                  <option value="Bloom 1 - Nhớ">Bloom 1 - Nhớ (Remember)</option>
                  <option value="Bloom 2 - Hiểu">Bloom 2 - Hiểu (Understand)</option>
                  <option value="Bloom 3 - Vận dụng">Bloom 3 - Vận dụng (Apply)</option>
                  <option value="Bloom 4 - Phân tích">Bloom 4 - Phân tích (Analyze)</option>
                  <option value="Bloom 5 - Đánh giá">Bloom 5 - Đánh giá (Evaluate)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 px-4 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                isGenerating
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'btn-glacier-primary cursor-pointer'
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
              Câu hỏi tạo mới sẽ ở trạng thái <strong className="text-slate-800">Chờ duyệt</strong> để giảng viên xem xét trước khi đưa vào ngân hàng đề thi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
