import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  Check,
  X,
  BookOpen,
  Layers,
  Bot,
  User,
  Award,
  ArrowRight,
  RefreshCw,
  Sparkles,
  HelpCircle,
  CheckSquare,
  Square,
  FileCheck,
  BarChart3,
  CalendarCheck
} from 'lucide-react';
import { lecturerExamSessionApi, lecturerQuestionApi, subjectApi } from '../../services/api';

export default function ExamManagementPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data states
  const [sessions, setSessions] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Organizing an Exam
  const getTomorrowDateStr = (hour = 9) => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [examForm, setExamForm] = useState({
    sessionCode: '',
    subjectCode: 'SWD392',
    scheduledAt: getTomorrowDateStr(9),
    endedAt: getTomorrowDateStr(17),
    durationMinutes: 30,
    questionTimeLimitSeconds: 90,
    maxFollowUpsPerQuestion: 1,
    selectedQuestionUuids: [],
    notes: 'Kỳ thi vấn đáp AI theo bộ câu hỏi chuẩn môn học.'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all required data from Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessRes, subjRes, qRes] = await Promise.allSettled([
        lecturerExamSessionApi.getSessions(),
        subjectApi.getSubjects(),
        lecturerQuestionApi.getQuestions({ status: 'ACTIVE' })
      ]);

      if (sessRes.status === 'fulfilled') {
        const list = sessRes.value?.data?.result || sessRes.value?.data || [];
        setSessions(Array.isArray(list) ? list : []);
      }

      if (subjRes.status === 'fulfilled') {
        const sList = subjRes.value?.data?.result || subjRes.value?.data || [];
        setSubjectsList(Array.isArray(sList) ? sList : []);
        if (sList.length > 0 && !examForm.subjectCode) {
          setExamForm((prev) => ({ ...prev, subjectCode: sList[0].code }));
        }
      }

      let mergedQList = [];
      if (qRes.status === 'fulfilled') {
        const qList = qRes.value?.data?.result || qRes.value?.data || [];
        if (Array.isArray(qList)) mergedQList = [...qList];
      }
      try {
        const localBankRaw = localStorage.getItem('aives_question_bank');
        if (localBankRaw) {
          const localBank = JSON.parse(localBankRaw);
          if (Array.isArray(localBank)) {
            const existingIds = new Set(mergedQList.map((q) => q.uuid || q.id));
            localBank.forEach((q) => {
              if (!existingIds.has(q.uuid || q.id)) {
                mergedQList.push(q);
              }
            });
          }
        }
      } catch (e) {}
      setQuestionsList(mergedQList);
    } catch (err) {
      console.warn('[AIVES ExamMgmt] Fetch data notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter questions for the modal STRICTLY by selected subject in form
  const formSubjectQuestions = useMemo(() => {
    const targetSubj = (examForm.subjectCode || 'SWD392').toUpperCase();
    return questionsList.filter((q) => {
      const qSubj = (q.subjectCode || '').toUpperCase();
      return qSubj === targetSubj || !q.subjectCode;
    });
  }, [questionsList, examForm.subjectCode]);

  // When form subject changes, auto-generate default code and clear question selection
  const handleFormSubjectChange = (newSubjCode) => {
    const randCode = Math.floor(1000 + Math.random() * 9000);
    setExamForm((prev) => ({
      ...prev,
      subjectCode: newSubjCode,
      sessionCode: `VIVA-${newSubjCode}-KTHI-${randCode}`,
      selectedQuestionUuids: []
    }));
  };

  // Open Create Modal with fresh data
  const handleOpenCreateModal = () => {
    const defaultSubj = subjectsList.length > 0 ? subjectsList[0].code : 'SWD392';
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const matchingQ = questionsList.filter(
      (q) => !q.subjectCode || q.subjectCode.toUpperCase() === defaultSubj.toUpperCase()
    );
    // Pre-select top 3 questions of this subject if available
    const initialSelected = matchingQ.slice(0, 3).map((q) => q.uuid || q.id);

    setExamForm({
      sessionCode: `VIVA-${defaultSubj}-KTHI-${randCode}`,
      subjectCode: defaultSubj,
      scheduledAt: getTomorrowDateStr(9),
      endedAt: getTomorrowDateStr(17),
      durationMinutes: 30,
      selectedQuestionUuids: initialSelected,
      notes: 'Kỳ thi vấn đáp AI trực tiếp. Thí sinh trả lời lần lượt qua giọng nói.'
    });
    setIsCreateModalOpen(true);
  };

  // Toggle selection of a single question
  const toggleQuestionSelection = (qUuid) => {
    setExamForm((prev) => {
      const isSelected = prev.selectedQuestionUuids.includes(qUuid);
      return {
        ...prev,
        selectedQuestionUuids: isSelected
          ? prev.selectedQuestionUuids.filter((id) => id !== qUuid)
          : [...prev.selectedQuestionUuids, qUuid]
      };
    });
  };

  // Select all questions of the current subject
  const handleSelectAllQuestions = () => {
    const allIds = formSubjectQuestions.map((q) => q.uuid || q.id);
    setExamForm((prev) => ({ ...prev, selectedQuestionUuids: allIds }));
  };

  // Randomly select 3 questions
  const handleSelectRandom3Questions = () => {
    const shuffled = [...formSubjectQuestions].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3).map((q) => q.uuid || q.id);
    setExamForm((prev) => ({ ...prev, selectedQuestionUuids: picked }));
  };

  // Clear question selection
  const handleClearQuestions = () => {
    setExamForm((prev) => ({ ...prev, selectedQuestionUuids: [] }));
  };

  // Submit create exam form to backend
  const handleSubmitExam = async (e) => {
    e.preventDefault();
    if (!examForm.sessionCode.trim()) {
      showToast('Vui lòng nhập Mã hoặc Tên kỳ thi!', 'error');
      return;
    }
    if (examForm.selectedQuestionUuids.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 câu hỏi vào đề thi của môn học này!', 'error');
      return;
    }

    const nowMs = Date.now();
    const scheduledTime = new Date(examForm.scheduledAt).getTime();
    const endedTime = new Date(examForm.endedAt).getTime();

    if (scheduledTime < nowMs - 2 * 60 * 1000) {
      showToast('Thời gian bắt đầu ca thi không được trong quá khứ so với thời gian thực!', 'error');
      return;
    }

    if (endedTime <= scheduledTime) {
      showToast('Thời gian kết thúc ca thi phải diễn ra sau thời gian bắt đầu!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const totalExamSeconds = (examForm.selectedQuestionUuids.length || 1) *
        (Number(examForm.questionTimeLimitSeconds) || 90) *
        (1 + (Number(examForm.maxFollowUpsPerQuestion) || 0));
      const autoDurationMinutes = Math.max(1, Math.ceil(totalExamSeconds / 60));

      const payload = {
        sessionCode: examForm.sessionCode.trim(),
        subjectCode: examForm.subjectCode.toUpperCase(),
        scheduledAt: examForm.scheduledAt,
        endedAt: examForm.endedAt,
        durationMinutes: autoDurationMinutes,
        questionUuids: examForm.selectedQuestionUuids,
        notes: examForm.notes.trim()
      };

      const createdRes = await lecturerExamSessionApi.createSession(payload);
      const createdObj = createdRes?.data?.result;
      const selectedQuestions = formSubjectQuestions.filter((q) =>
        payload.questionUuids.includes(q.uuid || q.id)
      );
      const sessionItem = {
        id: createdObj?.id || `sess-${Date.now()}`,
        sessionCode: payload.sessionCode,
        subjectCode: payload.subjectCode,
        subjectName: subjectsList.find((s) => s.code === payload.subjectCode)?.name || payload.subjectCode,
        scheduledAt: payload.scheduledAt,
        endedAt: payload.endedAt,
        durationMinutes: payload.durationMinutes,
        questionTimeLimitSeconds: Number(examForm.questionTimeLimitSeconds) || 90,
        maxFollowUpsPerQuestion: Number(examForm.maxFollowUpsPerQuestion) ?? 1,
        questionUuids: payload.questionUuids,
        questions: selectedQuestions,
        status: 'SCHEDULED'
      };

      try {
        const rawExams = localStorage.getItem('aives_exam_sessions');
        const existingExams = rawExams ? JSON.parse(rawExams) : [];
        const updatedExams = [sessionItem, ...existingExams.filter((e) => e.sessionCode !== sessionItem.sessionCode)];
        localStorage.setItem('aives_exam_sessions', JSON.stringify(updatedExams));
        localStorage.setItem('aives_latest_active_exam', JSON.stringify(sessionItem));
      } catch (e) {}

      showToast(`Tổ chức kỳ thi ${payload.sessionCode} thành công! Sinh viên đã có thể thấy để vào thi.`);
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      console.warn('[AIVES ExamMgmt] Create session error:', err);
      showToast(err.friendlyMessage || 'Lỗi khi tạo kỳ thi, vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an exam session
  const handleDeleteSession = async (sessionId, sessionCode) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa kỳ thi "${sessionCode}" không?`)) {
      return;
    }
    try {
      await lecturerExamSessionApi.deleteSession(sessionId);
    } catch (err) {
      console.warn('[AIVES ExamMgmt] Delete error on backend, cleaning up local storage:', err);
    }

    try {
      const rawExams = localStorage.getItem('aives_exam_sessions');
      if (rawExams) {
        const exams = JSON.parse(rawExams);
        const filtered = exams.filter((e) => e.id !== sessionId && e.sessionCode !== sessionCode);
        localStorage.setItem('aives_exam_sessions', JSON.stringify(filtered));
      }
      const latestRaw = localStorage.getItem('aives_latest_active_exam');
      if (latestRaw) {
        const latest = JSON.parse(latestRaw);
        if (latest.id === sessionId || latest.sessionCode === sessionCode) {
          localStorage.removeItem('aives_latest_active_exam');
        }
      }
      // Add to deleted sessions blacklist so student side never restores it
      const deletedRaw = localStorage.getItem('aives_deleted_sessions') || '[]';
      const deletedList = JSON.parse(deletedRaw);
      if (!deletedList.includes(sessionId)) deletedList.push(sessionId);
      if (sessionCode && !deletedList.includes(sessionCode)) deletedList.push(sessionCode);
      localStorage.setItem('aives_deleted_sessions', JSON.stringify(deletedList));
    } catch (e) {}

    showToast(`Đã xóa kỳ thi ${sessionCode} thành công!`);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId && s.sessionCode !== sessionCode));
  };

  // Filtered sessions for the main list
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchSubj =
        selectedSubjectFilter === 'ALL' ||
        (s.subjectCode && s.subjectCode.toUpperCase() === selectedSubjectFilter.toUpperCase());
      const matchSearch =
        !searchTerm.trim() ||
        (s.sessionCode && s.sessionCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.subjectCode && s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.studentName && s.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSubj && matchSearch;
    });
  }, [sessions, selectedSubjectFilter, searchTerm]);

  // Statistics
  const scheduledCount = sessions.filter((s) => s.status === 'SCHEDULED').length;
  const inProgressCount = sessions.filter((s) => s.status === 'IN_PROGRESS').length;
  const completedCount = sessions.filter((s) => s.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold animate-slide-in ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glacier-light-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-sky-600" />
              Khảo Thí & Đề Thi Vấn Đáp
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              Học kỳ II (2024 - 2025)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tổ Chức & Quản Lý Kỳ Thi Vấn Đáp AI
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Tạo ca thi mới, thiết lập thời hạn bắt đầu/kết thúc, phân bổ môn thi và lựa chọn các câu hỏi
            chính xác từ Ngân hàng câu hỏi vào đề thi. Sinh viên sẽ lập tức thấy kỳ thi và có thể vào thi.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="btn-glacier-primary px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo Kỳ Thi Mới</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glacier-light-panel rounded-2xl p-5 border border-slate-200 space-y-2">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tổng số kỳ thi</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{sessions.length}</span>
            <Calendar className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Toàn bộ các ca thi được tổ chức</p>
        </div>

        <div className="glacier-light-panel rounded-2xl p-5 border border-slate-200 space-y-2">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Sắp diễn ra</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-600">{scheduledCount}</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Đã lập lịch & đề thi sẵn sàng</p>
        </div>

        <div className="glacier-light-panel rounded-2xl p-5 border border-slate-200 space-y-2">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Đang diễn ra</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-sky-600">{inProgressCount}</span>
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></div>
          </div>
          <p className="text-xs text-slate-500 font-medium">Thí sinh đang phỏng vấn với AI</p>
        </div>

        <div className="glacier-light-panel rounded-2xl p-5 border border-slate-200 space-y-2">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Đã hoàn thành</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600">{completedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Đã nộp bài & chốt điểm</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSubjectFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubjectFilter === 'ALL'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
            }`}
          >
            Tất cả môn ({sessions.length})
          </button>
          {subjectsList.map((subj) => (
            <button
              key={subj.code}
              onClick={() => setSelectedSubjectFilter(subj.code)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubjectFilter === subj.code
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              {subj.code}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã kỳ thi, môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          />
        </div>
      </div>

      {/* Main Exams List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glacier-light-card rounded-2xl p-12 text-center">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Đang tải danh sách kỳ thi...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="glacier-light-card rounded-2xl p-12 text-center space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">Chưa có kỳ thi nào trong danh sách</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Giảng viên hãy bấm nút <strong>"Tạo Kỳ Thi Mới"</strong> phía trên để tổ chức ca thi vấn đáp,
                chọn thời hạn bắt đầu/kết thúc và gán các câu hỏi thuộc môn thi vào đề.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="btn-glacier-primary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Kỳ Thi Đầu Tiên</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSessions.map((exam) => {
              const isScheduled = exam.status === 'SCHEDULED';
              const isInProgress = exam.status === 'IN_PROGRESS';
              const isCompleted = exam.status === 'COMPLETED';

              // Extract question count from feedback if stored
              let questionsCountText = 'Bộ đề theo đề cương RAG';
              if (exam.feedback && exam.feedback.includes('QUESTIONS:')) {
                const parts = exam.feedback.split('|')[0].replace('QUESTIONS:', '').trim();
                const qIds = parts.split(',').filter(Boolean);
                questionsCountText = `${qIds.length} câu hỏi trong đề thi`;
              }

              const startDateStr = exam.scheduledAt
                ? new Date(exam.scheduledAt).toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : 'Lập lịch tự do';

              const endDateStr = exam.endedAt
                ? new Date(exam.endedAt).toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : 'Chưa đặt hạn';

              return (
                <div
                  key={exam.id}
                  className={`glacier-light-card rounded-2xl p-5 border-l-4 space-y-4 flex flex-col justify-between transition-all hover:shadow-md ${
                    isCompleted
                      ? 'border-l-emerald-600'
                      : isInProgress
                      ? 'border-l-sky-600'
                      : 'border-l-amber-500'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Subject Code Badge & Status */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-xs font-mono font-bold">
                        {exam.subjectCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isInProgress
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isInProgress && <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>}
                        {isCompleted && <Check className="w-3 h-3 text-emerald-600" />}
                        {isCompleted
                          ? 'Đã hoàn thành'
                          : isInProgress
                          ? 'Đang diễn ra'
                          : 'Sắp diễn ra'}
                      </span>
                    </div>

                    {/* Exam Title & Subject Name */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1" title={exam.sessionCode}>
                        {exam.sessionCode}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 font-medium">
                        {exam.subjectName || `Môn học ${exam.subjectCode}`}
                      </p>
                    </div>

                    {/* Schedule Time Range */}
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="font-semibold text-slate-800">Bắt đầu:</span>
                        <span>{startDateStr}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-semibold text-slate-800">Kết thúc:</span>
                        <span>{endDateStr}</span>
                      </div>
                    </div>

                    {/* Questions & Candidate info */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-sky-700">
                        <FileCheck className="w-3.5 h-3.5" />
                        {questionsCountText}
                      </span>
                      {exam.totalScore && (
                        <span className="font-bold text-emerald-700">
                          Điểm: {Number(exam.totalScore).toFixed(1)}/10
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleDeleteSession(exam.id, exam.sessionCode)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Xóa kỳ thi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <button
                          onClick={() => navigate(`/exam-result?sessionId=${exam.id}`)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Bảng điểm</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/viva?subject=${exam.subjectCode}&sessionId=${exam.id}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Vào quan sát / Thi</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MODAL: TỔ CHỨC KỲ THI MỚI ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-scale-in max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 text-sky-800 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Tổ Chức Kỳ Thi Vấn Đáp Mới</h2>
                  <p className="text-xs text-slate-500">
                    Cấu hình môn thi, lịch phỏng vấn và lọc câu hỏi chính xác vào đề thi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="createExamForm" onSubmit={handleSubmitExam} className="flex-1 overflow-y-auto space-y-5 pr-1">
              {/* Row 1: Session Code & Subject Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mã / Tên Kỳ Thi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={examForm.sessionCode}
                    onChange={(e) => setExamForm({ ...examForm, sessionCode: e.target.value })}
                    placeholder="Ví dụ: VIVA-SWD392-GIUAKY"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Môn Cho Thi <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={examForm.subjectCode}
                    onChange={(e) => handleFormSubjectChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {subjectsList.length > 0 ? (
                      subjectsList.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code} - {s.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="SWD392">SWD392 - Kiến trúc phần mềm</option>
                        <option value="CS301">CS301 - Cấu trúc Dữ liệu & Giải thuật</option>
                        <option value="AI204">AI204 - Học máy & Thị giác máy tính</option>
                        <option value="SE102">SE102 - Thiết kế hệ thống nâng cao</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Row 2: Start Time, End Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Thời Hạn Bắt Đầu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={examForm.scheduledAt}
                    onChange={(e) => setExamForm({ ...examForm, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Thời Hạn Kết Thúc <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={examForm.endedAt}
                    onChange={(e) => setExamForm({ ...examForm, endedAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Tổng Thời Lượng Ca Thi (Tự Động)</span>
                  </label>
                  <div className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-sky-800 flex items-center justify-between">
                    <span>
                      {Math.ceil(
                        ((examForm.selectedQuestionUuids.length || 1) *
                          (Number(examForm.questionTimeLimitSeconds) || 90) *
                          (1 + (Number(examForm.maxFollowUpsPerQuestion) || 0))) /
                          60
                      )}{' '}
                      phút ({
                        (examForm.selectedQuestionUuids.length || 1) *
                          (Number(examForm.questionTimeLimitSeconds) || 90) *
                          (1 + (Number(examForm.maxFollowUpsPerQuestion) || 0))
                      }s)
                    </span>
                    <span className="text-[10px] font-normal text-slate-500">
                      {examForm.selectedQuestionUuids.length} câu × {examForm.questionTimeLimitSeconds}s × {1 + (Number(examForm.maxFollowUpsPerQuestion) || 0)} lượt
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Viva Controls: Time Limit & Follow-up Questions Config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-sky-50/60 border border-sky-100">
                <div>
                  <label className="block text-xs font-bold text-sky-900 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Thời Gian Trả Lời Mỗi Câu</span>
                  </label>
                  <select
                    value={examForm.questionTimeLimitSeconds}
                    onChange={(e) => setExamForm({ ...examForm, questionTimeLimitSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-sky-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value={60}>60 giây (Nhanh & Tinh gọn)</option>
                    <option value={90}>90 giây (Chuẩn vấn đáp đại học)</option>
                    <option value={120}>120 giây (2 phút - Chuyên sâu)</option>
                    <option value={180}>180 giây (3 phút - Phân tích kiến trúc phức tạp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-sky-900 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-sky-600" />
                    <span>Số Lượt Hỏi Xoáy Tối Đa Mỗi Câu</span>
                  </label>
                  <select
                    value={examForm.maxFollowUpsPerQuestion}
                    onChange={(e) => setExamForm({ ...examForm, maxFollowUpsPerQuestion: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-sky-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value={0}>0 lượt (Chỉ hỏi câu chính, không hỏi xoáy)</option>
                    <option value={1}>1 lượt hỏi xoáy (Khuyên dùng - Chuẩn)</option>
                    <option value={2}>2 lượt hỏi xoáy (Đào sâu phản biện nâng cao)</option>
                  </select>
                </div>
              </div>

              {/* SECTION: SELECT QUESTIONS (FILTERED FOR THE CHOSEN SUBJECT) */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-sky-600" />
                      <span>Chọn Câu Hỏi Thuộc Đề Thi (Môn: {examForm.subjectCode})</span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">
                        Đã chọn: {examForm.selectedQuestionUuids.length} câu
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Bảng câu hỏi đã tự động lọc chỉ hiển thị câu hỏi thuộc môn {examForm.subjectCode}.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectRandom3Questions}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-200 cursor-pointer"
                    >
                      Chọn ngẫu nhiên 3 câu
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectAllQuestions}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                    >
                      Chọn tất cả
                    </button>
                    <button
                      type="button"
                      onClick={handleClearQuestions}
                      className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                {/* Question List Checkbox Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
                  {formSubjectQuestions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                      <p>Chưa có câu hỏi nào trong ngân hàng cho môn {examForm.subjectCode}.</p>
                      <p className="text-[11px] text-sky-600">
                        Bạn có thể vào tab <strong>"Ngân hàng câu hỏi"</strong> để sinh câu hỏi tự động qua RAG trước.
                      </p>
                    </div>
                  ) : (
                    formSubjectQuestions.map((q, idx) => {
                      const qId = q.uuid || q.id;
                      const isChecked = examForm.selectedQuestionUuids.includes(qId);

                      return (
                        <div
                          key={qId}
                          onClick={() => toggleQuestionSelection(qId)}
                          className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                            isChecked ? 'bg-sky-50/80' : 'hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="pt-0.5 shrink-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-sky-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-500">#{idx + 1}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                                {q.bloomLevel || 'Bloom 4 - Phân tích'}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">
                                Độ khó: {q.difficulty || 'Trung bình'}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-800 line-clamp-2">
                              {q.content}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi Chú & Hướng Dẫn Thí Sinh
                </label>
                <textarea
                  rows="2"
                  value={examForm.notes}
                  onChange={(e) => setExamForm({ ...examForm, notes: e.target.value })}
                  placeholder="Ghi chú thêm về quy chế ca thi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Kỳ thi sẽ tự động kích hoạt và hiển thị cho sinh viên trong môn {examForm.subjectCode}.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  form="createExamForm"
                  disabled={isSubmitting}
                  className="btn-glacier-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Tạo & Phát Hành Kỳ Thi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

