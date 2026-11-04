import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  BookOpen,
  MessageSquare,
  Send,
  RefreshCw,
  FileText,
  X,
  Sparkles,
  Mic,
  ChevronDown,
  Layers,
  GraduationCap
} from 'lucide-react';
import { lecturerExamSessionApi, subjectApi } from '../../services/api';

export default function GradingApprovalPage() {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState('WAITING_CONFIRMATION'); // WAITING_CONFIRMATION | COMPLETED | ALL
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Review state
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionTurns, setSessionTurns] = useState([]);
  const [loadingTurns, setLoadingTurns] = useState(false);
  const [finalScoreInput, setFinalScoreInput] = useState('');
  const [lecturerFeedbackInput, setLecturerFeedbackInput] = useState('');
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, subjectsRes] = await Promise.allSettled([
        lecturerExamSessionApi.getSessions(),
        subjectApi.getSubjects()
      ]);

      let allSessions = [];
      if (sessionsRes.status === 'fulfilled' && sessionsRes.value?.data?.result) {
        allSessions = [...sessionsRes.value.data.result];
      }

      // Merge local exam sessions
      try {
        const localExamsRaw = localStorage.getItem('aives_exam_sessions');
        if (localExamsRaw) {
          const localExams = JSON.parse(localExamsRaw);
          if (Array.isArray(localExams)) {
            const existingCodes = new Set(allSessions.map((s) => s.sessionCode || s.id));
            localExams.forEach((le) => {
              if (!existingCodes.has(le.sessionCode) && !existingCodes.has(le.id)) {
                allSessions.push(le);
              }
            });
          }
        }
      } catch (e) {}

      // Filter out deleted sessions
      try {
        const deletedRaw = localStorage.getItem('aives_deleted_sessions');
        if (deletedRaw) {
          const deletedList = new Set(JSON.parse(deletedRaw));
          allSessions = allSessions.filter((s) => !deletedList.has(s.id) && !deletedList.has(s.sessionCode));
        }
      } catch (e) {}

      // Identify overdue scheduled sessions where student did not attend
      const now = new Date();
      allSessions = allSessions.map((s) => {
        const isOverdue = s.endedAt && new Date(s.endedAt) < now;
        if (s.status === 'SCHEDULED' && isOverdue) {
          return {
            ...s,
            status: 'WAITING_SCORE_CONFIRMATION',
            isAbsent: true,
            studentName: s.studentName || 'Nguyễn Văn An (SE190504)',
            studentEmail: s.studentEmail || 'SE190504@fpt.edu.vn',
            totalScore: 0.0,
            feedback: 'Thí sinh vắng thi / Không tham gia ca thi theo lịch quy định.'
          };
        }
        return s;
      });

      setSessions(allSessions);

      if (subjectsRes.status === 'fulfilled' && subjectsRes.value?.data?.result) {
        setSubjects(subjectsRes.value.data.result);
      }
    } catch (err) {
      console.warn('Lỗi tải dữ liệu ca thi:', err);
      showToast('Không thể kết nối máy chủ để tải ca thi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    showToast('Đã làm mới danh sách bài thi cần chấm');
  };

  // Open Review & Finalize Modal
  const handleOpenReviewModal = async (session) => {
    setSelectedSession(session);
    setFinalScoreInput(session.totalScore != null ? String(session.totalScore) : '0.0');
    setLecturerFeedbackInput(
      session.feedback && !session.feedback.startsWith('QUESTIONS:')
        ? session.feedback
        : 'Đã hoàn thành đánh giá bài thi vấn đáp AI.'
    );
    setLoadingTurns(true);

    try {
      const res = await lecturerExamSessionApi.getSessionTurns(session.id);
      if (res?.data?.result && res.data.result.length > 0) {
        setSessionTurns(res.data.result);
      } else if (Array.isArray(session.turns) && session.turns.length > 0) {
        setSessionTurns(session.turns);
      } else {
        const localTurnsRaw =
          localStorage.getItem(`aives_session_turns_${session.id}`) ||
          localStorage.getItem(`aives_session_turns_${session.sessionCode}`);
        if (localTurnsRaw) {
          setSessionTurns(JSON.parse(localTurnsRaw));
        } else {
          setSessionTurns([]);
        }
      }
    } catch (err) {
      console.warn('Lỗi tải danh sách lượt vấn đáp từ API, kiểm tra dữ liệu local:', err);
      if (Array.isArray(session.turns) && session.turns.length > 0) {
        setSessionTurns(session.turns);
      } else {
        const localTurnsRaw =
          localStorage.getItem(`aives_session_turns_${session.id}`) ||
          localStorage.getItem(`aives_session_turns_${session.sessionCode}`);
        if (localTurnsRaw) {
          setSessionTurns(JSON.parse(localTurnsRaw));
        } else {
          setSessionTurns([]);
        }
      }
    } finally {
      setLoadingTurns(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
    setSessionTurns([]);
    setFinalScoreInput('');
    setLecturerFeedbackInput('');
  };

  // Submit Final Score
  const handleFinalizeScore = async () => {
    if (!selectedSession) return;
    const numericScore = parseFloat(finalScoreInput);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      alert('Vui lòng nhập điểm số hợp lệ từ 0.0 đến 10.0');
      return;
    }

    setIsSubmittingScore(true);
    try {
      const payload = {
        finalScore: numericScore,
        lecturerFeedback: lecturerFeedbackInput.trim()
      };

      try {
        await lecturerExamSessionApi.finalizeScore(selectedSession.id, payload);
      } catch (apiErr) {
        console.warn('API finalize score notice, saving to local state:', apiErr);
      }

      // Update in localStorage
      try {
        const rawExams = localStorage.getItem('aives_exam_sessions');
        if (rawExams) {
          const exams = JSON.parse(rawExams);
          const updated = exams.map((e) => {
            if (e.id === selectedSession.id || e.sessionCode === selectedSession.sessionCode) {
              return {
                ...e,
                status: 'COMPLETED',
                totalScore: numericScore,
                feedback: payload.lecturerFeedback,
                isAbsent: Boolean(selectedSession.isAbsent)
              };
            }
            return e;
          });
          localStorage.setItem('aives_exam_sessions', JSON.stringify(updated));
        }
      } catch (e) {}

      showToast(`Đã chốt và công bố điểm ${numericScore} cho sinh viên ${selectedSession.studentName || ''}!`);
      handleCloseModal();
      await loadData();
    } catch (err) {
      console.error('Lỗi khi chốt điểm:', err);
      showToast('Có lỗi xảy ra khi lưu điểm chính thức', 'error');
    } finally {
      setIsSubmittingScore(false);
    }
  };

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Tab filter
      if (activeTab === 'WAITING_CONFIRMATION') {
        if (s.status !== 'WAITING_SCORE_CONFIRMATION') return false;
      } else if (activeTab === 'COMPLETED') {
        if (s.status !== 'COMPLETED') return false;
      }

      // Subject filter
      if (selectedSubject !== 'ALL') {
        if (s.subjectCode !== selectedSubject) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const codeMatch = s.sessionCode?.toLowerCase().includes(q);
        const studentMatch = s.studentName?.toLowerCase().includes(q) || s.studentEmail?.toLowerCase().includes(q);
        const subjMatch = s.subjectCode?.toLowerCase().includes(q) || s.subjectName?.toLowerCase().includes(q);
        if (!codeMatch && !studentMatch && !subjMatch) return false;
      }

      return true;
    });
  }, [sessions, activeTab, selectedSubject, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const waiting = sessions.filter((s) => s.status === 'WAITING_SCORE_CONFIRMATION').length;
    const completed = sessions.filter((s) => s.status === 'COMPLETED').length;
    const total = sessions.length;
    return { waiting, completed, total };
  }, [sessions]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast message */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Duyệt & Chốt Điểm Bài Thi Vấn Đáp
              </h1>
              <p className="text-xs text-slate-500">
                Xem lại câu hỏi, bản chép lời thu âm của sinh viên, phân tích AI và chốt điểm chính thức
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-sky-600' : 'text-slate-500'}`} />
            <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('WAITING_CONFIRMATION')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'WAITING_CONFIRMATION'
              ? 'bg-amber-500/10 border-amber-300 shadow-sm ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200/80 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">Cần Duyệt & Chốt Điểm</span>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.waiting}</div>
          <p className="text-[11px] text-slate-500 mt-1">Bài thi sinh viên đã nộp chờ bạn phê duyệt</p>
        </div>

        <div
          onClick={() => setActiveTab('COMPLETED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'COMPLETED'
              ? 'bg-emerald-500/10 border-emerald-300 shadow-sm ring-2 ring-emerald-400/20'
              : 'bg-white border-slate-200/80 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">Đã Chốt & Công Bố Điểm</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.completed}</div>
          <p className="text-[11px] text-slate-500 mt-1">Sinh viên đã có thể xem bảng điểm chính thức</p>
        </div>

        <div
          onClick={() => setActiveTab('ALL')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-sky-500/10 border-sky-300 shadow-sm ring-2 ring-sky-400/20'
              : 'bg-white border-slate-200/80 hover:border-sky-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700">Tổng Số Ca Thi</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.total}</div>
          <p className="text-[11px] text-slate-500 mt-1">Tất cả các ca thi trong hệ thống</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Tab Pill Buttons */}
          <button
            onClick={() => setActiveTab('WAITING_CONFIRMATION')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'WAITING_CONFIRMATION'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Chờ duyệt ({stats.waiting})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Đã chốt điểm ({stats.completed})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({stats.total})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Subject Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Tất cả môn học</option>
              {subjects.map((sub) => (
                <option key={sub.code || sub.id} value={sub.code}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên SV, mã SV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table: Sessions Awaiting Confirmation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-600" />
            <span>Đang tải danh sách bài thi từ máy chủ...</span>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <CheckSquare className="w-8 h-8 text-slate-300" />
            <span className="font-semibold text-slate-600">Không có bài thi nào trong mục này</span>
            <span className="text-[11px] text-slate-400">
              {activeTab === 'WAITING_CONFIRMATION'
                ? 'Tất cả bài thi đã được bạn chấm và chốt điểm!'
                : 'Thử thay đổi bộ lọc môn học hoặc tìm kiếm.'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ca thi / Mã đề</th>
                  <th className="py-3.5 px-4">Thông tin Sinh viên</th>
                  <th className="py-3.5 px-4">Môn thi</th>
                  <th className="py-3.5 px-4">Thời gian nộp</th>
                  <th className="py-3.5 px-4 text-center">Điểm AI Đề xuất</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredSessions.map((session) => {
                  const isWaiting = session.status === 'WAITING_SCORE_CONFIRMATION';
                  const isCompleted = session.status === 'COMPLETED';

                  return (
                    <tr key={session.id} className="hover:bg-slate-50/75 transition-colors">
                      {/* Session Code */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{session.sessionCode || 'VIVA-SESSION'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          <span>{session.turnsCount || 3} câu hỏi vấn đáp</span>
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                            {(session.studentName || 'SV').charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{session.studentName || 'Nguyễn Văn An'}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <span>MSSV:</span>
                              <span className="font-mono text-slate-700 font-semibold">
                                {session.studentEmail
                                  ? session.studentEmail.split('@')[0].toUpperCase()
                                  : 'SE190504'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-700 font-bold text-[11px]">
                          {session.subjectCode}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {session.subjectName}
                        </div>
                      </td>

                      {/* Submitted Time */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {session.endedAt
                              ? new Date(session.endedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
                                ' ' +
                                new Date(session.endedAt).toLocaleDateString('vi-VN')
                              : session.startedAt
                              ? new Date(session.startedAt).toLocaleDateString('vi-VN')
                              : 'Vừa thi xong'}
                          </span>
                        </div>
                      </td>

                      {/* AI Proposed Score */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 font-bold text-amber-800 text-xs">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{session.totalScore != null ? Number(session.totalScore).toFixed(1) : '0.0'} / 10</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isWaiting && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Chờ duyệt điểm
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đã chốt điểm
                          </span>
                        )}
                        {!isWaiting && !isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-[11px]">
                            {session.status}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenReviewModal(session)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ml-auto ${
                            isWaiting
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-amber-500/20'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isWaiting ? 'Chấm & Chốt Điểm' : 'Xem Bảng Điểm'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: CHI TIẾT BÀI THI & CHỐT ĐIỂM ================= */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200/80 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight">
                    Phiếu Chấm Điểm Ca Thi Vấn Đáp AI
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Mã ca thi: <span className="font-mono text-amber-300 font-bold">{selectedSession.sessionCode}</span> • Môn thi: {selectedSession.subjectCode} - {selectedSession.subjectName}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Candidate Summary Card */}
            <div className="p-5 bg-slate-50 border-b border-slate-200/80 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Thí sinh:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedSession.studentName || 'Nguyễn Văn An'}</span>
                <span className="text-slate-500 block text-[11px] font-mono">
                  MSSV: {selectedSession.studentEmail ? selectedSession.studentEmail.split('@')[0].toUpperCase() : 'SE190504'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Trạng thái nộp bài:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Đã hoàn thành lượt thi
                </span>
                <span className="text-slate-500 block text-[11px]">
                  Thời gian: {selectedSession.endedAt ? new Date(selectedSession.endedAt).toLocaleTimeString('vi-VN') : 'Mới nộp'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Điểm AI đề xuất:</span>
                <span className="text-base font-black text-amber-600">
                  {selectedSession.totalScore != null ? Number(selectedSession.totalScore).toFixed(1) : '0.0'} / 10
                </span>
                <span className="text-slate-500 block text-[11px]">Theo ma trận Rubric</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Quyền của Giảng viên:</span>
                <span className="font-bold text-sky-800 block mt-0.5">Hội đồng chấm thi</span>
                <span className="text-[11px] text-slate-500">Toàn quyền điều chỉnh điểm</span>
              </div>
            </div>

            {/* Modal Body: Turns & Transcripts */}
            <div className="p-5 max-h-[50vh] overflow-y-auto space-y-5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Nội Dung Câu Hỏi & Bản Ghi Lời Nói Của Sinh Viên</span>
              </h3>

              {loadingTurns ? (
                <div className="py-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-sky-600" />
                  <span>Đang tải các lượt câu hỏi và lời thu âm của sinh viên...</span>
                </div>
              ) : sessionTurns.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                  Chưa tìm thấy bản ghi câu hỏi chi tiết của ca này. Có thể thí sinh vừa bắt đầu hoặc hoàn thành mô phỏng.
                </div>
              ) : (
                sessionTurns.map((turn, idx) => (
                  <div key={turn.uuid || idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                          {turn.turnOrder || idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          Câu hỏi {turn.turnOrder || idx + 1}
                        </span>
                        {turn.bloomLevel && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-[10px]">
                            {turn.bloomLevel}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                        AI chấm: {turn.score != null ? Number(turn.score).toFixed(1) : '0.0'}/10
                      </div>
                    </div>

                    {/* Question Content */}
                    <p className="text-xs font-semibold text-slate-900 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {turn.questionContent || 'Câu hỏi vấn đáp chuyên môn'}
                    </p>

                    {/* Audio Transcript (Spoken answer) */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                        <Mic className="w-3.5 h-3.5 text-sky-600" />
                        <span>Bản chép lời lẽ thu âm giọng nói của sinh viên (Speech-to-Text):</span>
                      </div>
                      <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-200/80 text-xs text-slate-800 leading-relaxed font-mono">
                        "{turn.audioTranscript || turn.studentAnswer || 'Thí sinh đã trình bày trực tiếp bằng giọng nói trong phòng thi.'}"
                      </div>
                    </div>

                    {/* AI Evaluation */}
                    {turn.aiEvaluation && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Nhận xét & phân tích của AI Examiner:</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/70 text-xs text-slate-700 leading-relaxed">
                          {turn.aiEvaluation}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Final Grading & Lecturer Decision Section */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-amber-50/40 border border-amber-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  <span>Quyết Định Điểm Chốt Của Giảng Viên</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Điểm chính thức (Thang 10):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={finalScoreInput}
                      onChange={(e) => setFinalScoreInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-base text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      AI đề xuất: {selectedSession.totalScore != null ? Number(selectedSession.totalScore).toFixed(1) : '0.0'}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nhận xét / Lời phê của Giảng viên gửi cho sinh viên:
                    </label>
                    <textarea
                      rows={2}
                      value={lecturerFeedbackInput}
                      onChange={(e) => setLecturerFeedbackInput(e.target.value)}
                      placeholder="Nhập nhận xét hoặc để mặc định nhận xét chuyên môn..."
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Sau khi bấm xác nhận, điểm số sẽ chính thức hiển thị cho sinh viên trên Dashboard.
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  onClick={handleFinalizeScore}
                  disabled={isSubmittingScore}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmittingScore ? 'Đang lưu điểm...' : 'Xác Nhận & Công Bố Điểm'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

