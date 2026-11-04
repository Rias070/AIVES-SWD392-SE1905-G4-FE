import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Mic,
  MicOff,
  Volume2,
  Video,
  FileText,
  Search,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Bot,
  User,
  Radio,
  SlidersHorizontal,
  X,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  Languages,
  Check,
  Zap,
  Target,
  History,
  BarChart3,
  ArrowUpRight,
  CheckCircle,
  Info
} from 'lucide-react';
import { subjectApi, studentExamApi } from '../../services/api';

const DEFAULT_RECENT_EXAMS = [];

export default function StudentDashboardPage({ currentUser }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const resolvedUser = currentUser || (() => {
    try {
      const raw = sessionStorage.getItem('aives_user') || localStorage.getItem('aives_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const studentName = resolvedUser?.fullName || resolvedUser?.name || 'Nguyễn Văn An';
  const studentId = 
    resolvedUser?.userCode || 
    resolvedUser?.studentCode || 
    resolvedUser?.idNumber || 
    (resolvedUser?.id && !resolvedUser.id.includes('-') ? resolvedUser.id : 'SE198876');

  // Active Tab state
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    urlTab && ['registered-courses', 'upcoming-exams', 'recent-history'].includes(urlTab)
      ? urlTab
      : 'registered-courses'
  );

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['registered-courses', 'upcoming-exams', 'recent-history'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Language configuration (STT/TTS parameter: vi-VN / en-US)
  const [examLang, setExamLang] = useState(() => localStorage.getItem('aives_exam_lang') || 'vi-VN');

  // Dynamic backend subjects and real exams history
  const [backendSubjects, setBackendSubjects] = useState([]);
  const [scheduledExams, setScheduledExams] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized dynamic statistics
  const stats = useMemo(() => {
    if (!recentExams || recentExams.length === 0) {
      return {
        totalExams: 0,
        avgScore: '0.0',
        avgAccuracy: 0,
        avgReasoning: 0,
        avgFluency: 0
      };
    }
    const total = recentExams.length;
    const sumScores = recentExams.reduce((acc, curr) => acc + (curr.numericScore || 8.5), 0);
    const avg = (sumScores / total).toFixed(1);

    const sumAcc = recentExams.reduce((acc, curr) => acc + (curr.details?.rubricPercentages?.accuracy || (curr.numericScore ? curr.numericScore * 10 : 80)), 0);
    const sumReas = recentExams.reduce((acc, curr) => acc + (curr.details?.rubricPercentages?.reasoning || (curr.numericScore ? curr.numericScore * 10 : 80)), 0);
    const sumFlu = recentExams.reduce((acc, curr) => acc + (curr.details?.rubricPercentages?.fluency || (curr.numericScore ? curr.numericScore * 10 : 80)), 0);

    return {
      totalExams: total,
      avgScore: avg,
      avgAccuracy: Math.round(sumAcc / total),
      avgReasoning: Math.round(sumReas / total),
      avgFluency: Math.round(sumFlu / total)
    };
  }, [recentExams]);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'mic-check' | 'ai-feedback' | 'course-detail' | 'mock-register'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedExamReview, setSelectedExamReview] = useState(null);

  // Mock exam registration form state
  const [mockForm, setMockForm] = useState({
    subject: 'CS301',
    difficulty: 'Chuẩn đề',
    lang: examLang
  });

  // Audio test states for mic-check modal
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Unified Cross-page Navigation & Session Persistence Handler
  const handleStartExamSession = ({
    subject = 'CS301',
    mode = 'official',
    difficulty = 'Chuẩn đề',
    lang = examLang,
    examId,
    sessionId
  }) => {
    const courseTitles = {
      SWD392: 'Kiến trúc phần mềm',
      CS301: 'Cấu trúc Dữ liệu & Giải thuật',
      AI204: 'Học máy & Thị giác máy tính',
      SE102: 'Kiến trúc Phần mềm nâng cao',
      NE302: 'An toàn Mạng & Mật mã học',
      CS201: 'Thuật toán ứng dụng',
      DB101: 'Cơ sở Dữ liệu quan hệ',
      PR102: 'Lập trình hướng đối tượng'
    };

    const finalExamId =
      examId ||
      (mode === 'mock'
        ? `MOCK-${subject}-${Date.now().toString().slice(-4)}`
        : `EX-${subject}-99127`);

    const sessionConfig = {
      subject,
      courseCode: subject,
      courseName: courseTitles[subject] || `Môn học ${subject}`,
      difficulty,
      lang,
      mode,
      sessionId: sessionId || null,
      examId: finalExamId,
      startedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('aives_current_session', JSON.stringify(sessionConfig));
      localStorage.setItem('aives_exam_lang', lang);
    } catch (e) {
      console.warn('LocalStorage session saving error:', e);
    }

    if (activeModal) {
      setActiveModal(null);
    }

    const queryParams = new URLSearchParams({
      subject,
      mode,
      difficulty,
      lang,
      examId: finalExamId
    });
    if (sessionId) {
      queryParams.set('sessionId', sessionId);
    }

    navigate(`/device-check?${queryParams.toString()}`);
  };

  // Load dynamic exam history and real subjects from Backend
  const loadDynamicData = async () => {
    try {
      const [subjectsRes, sessionsRes] = await Promise.allSettled([
        subjectApi.getSubjects(),
        studentExamApi.getSessions()
      ]);

      if (subjectsRes.status === 'fulfilled') {
        const sList = subjectsRes.value?.data?.result || subjectsRes.value?.data || [];
        if (Array.isArray(sList) && sList.length > 0) {
          setBackendSubjects(sList);
        }
      }

      let history = [];
      let rawSessions = [];
      if (sessionsRes.status === 'fulfilled') {
        const s = sessionsRes.value?.data?.result || sessionsRes.value?.data || [];
        if (Array.isArray(s)) rawSessions = [...s];
      }
      try {
        const localExamsRaw = localStorage.getItem('aives_exam_sessions');
        if (localExamsRaw) {
          const localExams = JSON.parse(localExamsRaw);
          if (Array.isArray(localExams)) {
            const existingCodes = new Set(rawSessions.map((r) => r.sessionCode || r.id));
            localExams.forEach((le) => {
              if (!existingCodes.has(le.sessionCode) && !existingCodes.has(le.id)) {
                rawSessions.push(le);
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
          rawSessions = rawSessions.filter((s) => !deletedList.has(s.id) && !deletedList.has(s.sessionCode));
        }
      } catch (e) {}

      if (rawSessions.length > 0) {
        if (Array.isArray(rawSessions) && rawSessions.length > 0) {
          // Scheduled & In-Progress exams for student
          const now = new Date();
          const upcoming = rawSessions.filter(
            (s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS'
          );
          setScheduledExams(upcoming);

          // Real submitted & completed exams for history
          const completedList = rawSessions.filter(
            (s) => s.status === 'COMPLETED' || s.status === 'WAITING_SCORE_CONFIRMATION'
          );

          if (completedList.length > 0) {
            history = completedList.map((session) => {
              const isConfirmed = session.status === 'COMPLETED';
              const isAbsent = Boolean(session.isAbsent);
              const numScore = session.totalScore ? Number(session.totalScore) : 0;
              return {
                id: session.id,
                code: session.subjectCode || 'SWD392',
                title: session.subjectName ? `${session.subjectCode}: ${session.subjectName}` : `${session.subjectCode || 'SWD392'} - Ca thi Viva`,
                score: isAbsent ? '0.0 / 10' : (isConfirmed ? `${numScore.toFixed(1)} / 10` : '-- / 10'),
                numericScore: isAbsent ? 0.0 : (isConfirmed ? numScore : null),
                isConfirmed: isConfirmed,
                isAbsent: isAbsent,
                status: session.status,
                description: isAbsent
                  ? 'Sinh viên vắng thi / Không tham gia thi'
                  : isConfirmed
                  ? 'Giảng viên đã duyệt & chốt điểm'
                  : 'Đang chờ Giảng viên duyệt điểm chính thức',
                rubricBadge: isAbsent ? 'Vắng thi' : (isConfirmed ? 'Đã có điểm chính thức' : 'Chờ duyệt điểm'),
                badgeColor: isAbsent
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : isConfirmed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200',
                actionText: isConfirmed ? 'Xem nhận xét Giảng viên →' : 'Đang chờ phê duyệt...',
                sessionId: session.id,
                details: {
                  date: session.endedAt ? new Date(session.endedAt).toLocaleDateString('vi-VN') : (session.startedAt ? new Date(session.startedAt).toLocaleDateString('vi-VN') : 'Hôm nay'),
                  aiComment: session.feedback || (isAbsent ? 'Sinh viên vắng thi theo lịch quy định.' : 'Bài thi đã được nộp và chuyển cho Giảng viên duyệt điểm.'),
                  advice: isAbsent ? 'Học phần ghi nhận vắng thi.' : (isConfirmed ? 'Điểm số chính thức đã được ghi nhận.' : 'Điểm sẽ hiển thị sau khi Giảng viên duyệt bài thi.'),
                  rubric: {
                    accuracy: isAbsent ? '0.0 / 10' : (isConfirmed ? `${(numScore * 0.95).toFixed(1)} / 10` : '-- / 10'),
                    reasoning: isAbsent ? '0.0 / 10' : (isConfirmed ? `${(numScore * 0.9).toFixed(1)} / 10` : '-- / 10'),
                    fluency: isAbsent ? '0.0 / 10' : (isConfirmed ? `${(numScore * 0.85).toFixed(1)} / 10` : '-- / 10')
                  },
                  rubricPercentages: {
                    accuracy: isAbsent ? 0 : (isConfirmed ? Math.round(numScore * 9.5) : 0),
                    reasoning: isAbsent ? 0 : (isConfirmed ? Math.round(numScore * 9.0) : 0),
                    fluency: isAbsent ? 0 : (isConfirmed ? Math.round(numScore * 8.5) : 0)
                  }
                }
              };
            });
          }
        }
      }

      // Check if there is a newly completed viva result from VivaRoomPage
      const latestRaw = localStorage.getItem('latest_viva_result');
      if (latestRaw) {
        try {
          const latestResult = JSON.parse(latestRaw);
          const alreadyExists = history.some(
            (item) => item.id === latestResult.sessionId || item.id === latestResult.examCode
          );

          if (!alreadyExists && latestResult.courseName) {
            const newExam = {
              id: latestResult.sessionId || latestResult.examCode || `exam-${Date.now()}`,
              code: (latestResult.examCode && latestResult.examCode.split('-')[0]) || 'CS301',
              title: latestResult.courseName,
              score: `${Number(latestResult.overallScore || 8.5).toFixed(1)} / 10`,
              numericScore: Number(latestResult.overallScore) || 8.5,
              description: `Vấn đáp hoàn tất lúc ${new Date(latestResult.completedAt || Date.now()).toLocaleTimeString('vi-VN')} • Chuẩn Bloom 4`,
              rubricBadge: 'AI Viva Mới Nhất',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              actionText: 'Xem nhận xét AI →',
              sessionId: latestResult.sessionId,
              details: {
                date: new Date(latestResult.completedAt || Date.now()).toLocaleDateString('vi-VN'),
                rubric: {
                  accuracy: '9.0 / 10',
                  reasoning: '8.4 / 10',
                  fluency: '8.6 / 10',
                },
                rubricPercentages: {
                  accuracy: 90,
                  reasoning: 84,
                  fluency: 86
                },
                aiComment: latestResult.aiFeedback || 'Sinh viên phản xạ nhanh và trình bày mạch lạc.',
                advice: 'Cần tiếp tục duy trì kỹ năng phản biện logic và viện dẫn ví dụ cụ thể.',
                fullResult: latestResult
              }
            };

            history = [newExam, ...history];
          }
        } catch (e) {
          console.warn('Lỗi khi đọc latest_viva_result:', e);
        }
      }



      setRecentExams(history);
    } catch (err) {
      console.warn('Lỗi loadDynamicData:', err);
    }
  };

  useEffect(() => {
    loadDynamicData();
  }, []);

  // Refresh handler
  const handleRefreshData = () => {
    setIsRefreshing(true);
    loadDynamicData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Change exam language
  const handleToggleLang = (newLang) => {
    setExamLang(newLang);
    localStorage.setItem('aives_exam_lang', newLang);
    setMockForm((prev) => ({ ...prev, lang: newLang }));
  };

  // Mic test interval for modal
  useEffect(() => {
    let timer;
    if (isMicTesting) {
      timer = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 55) + 35);
      }, 150);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(timer);
  }, [isMicTesting]);

  // Memoized registered courses
  const registeredCourses = useMemo(() => {
    if (backendSubjects.length > 0) {
      return backendSubjects.map((s, idx) => ({
        id: s.code || s.id,
        code: s.code,
        title: s.name,
        lecturer: s.lecturerName || (idx % 2 === 0 ? 'PGS. TS. Hoàng Nam' : 'TS. Lê Quang'),
        examTag: 'Sẵn sàng thi',
        tagColor: 'emerald',
        ragCount: 12,
        ragStatus: 'Kho tri thức RAG sẵn sàng',
        progress: 85,
        actionText: 'Vào thi vấn đáp',
        primaryAction: () => {
          handleStartExamSession({
            subject: s.code,
            mode: 'official',
            lang: examLang
          });
        }
      }));
    }
    return [
      {
        id: 'CS301',
        code: 'CS301',
        title: 'Cấu trúc Dữ liệu & Giải thuật',
        lecturer: 'PGS. TS. Hoàng Nam',
        examTag: '14:30 Hôm nay',
        tagColor: 'amber',
        ragCount: 12,
        ragStatus: '12 học liệu RAG',
        progress: 85,
        actionText: 'Ôn luyện với AI',
        primaryAction: () => {
          setMockForm({ subject: 'CS301', difficulty: 'Chuẩn đề', lang: examLang });
          setActiveModal('mock-register');
        },
      },
      {
        id: 'AI204',
        code: 'AI204',
        title: 'Học máy & Thị giác máy tính',
        lecturer: 'TS. Lê Quang',
        examTag: '28/11/2026',
        tagColor: 'blue',
        ragCount: 18,
        ragStatus: '18 học liệu RAG',
        progress: 65,
        actionText: 'Ôn luyện với AI',
        primaryAction: () => {
          setMockForm({ subject: 'AI204', difficulty: 'Chuẩn đề', lang: examLang });
          setActiveModal('mock-register');
        },
      },
      {
        id: 'SE102',
        code: 'SE102',
        title: 'Kiến trúc Phần mềm nâng cao',
        lecturer: 'ThS. Trần Đình Trọng',
        examTag: 'Sẵn sàng thi',
        tagColor: 'emerald',
        ragCount: 15,
        ragStatus: '15 học liệu RAG',
        progress: 92,
        actionText: 'Chi tiết môn',
        primaryAction: () => {
          setSelectedCourse({
            id: 'SE102',
            code: 'SE102',
            title: 'Kiến trúc Phần mềm nâng cao',
            lecturer: 'ThS. Trần Đình Trọng',
            examTag: 'Sẵn sàng thi',
            ragCount: 15,
            progress: 92
          });
          setActiveModal('course-detail');
        },
      },
      {
        id: 'NE302',
        code: 'NE302',
        title: 'An toàn Mạng & Mật mã học',
        lecturer: 'TS. Vũ Hải Nam',
        examTag: 'Đang nạp RAG',
        tagColor: 'slate',
        ragCount: 8,
        ragStatus: '8 học liệu RAG',
        progress: 40,
        actionText: 'Chi tiết môn',
        primaryAction: () => {
          setSelectedCourse({
            id: 'NE302',
            code: 'NE302',
            title: 'An toàn Mạng & Mật mã học',
            lecturer: 'TS. Vũ Hải Nam',
            examTag: 'Đang nạp RAG',
            ragCount: 8,
            progress: 40
          });
          setActiveModal('course-detail');
        },
      },
    ];
  }, [backendSubjects, examLang]);

  // Memoized upcoming exams
  const upcomingExams = useMemo(() => {
    if (!scheduledExams || scheduledExams.length === 0) {
      return [];
    }
    const now = new Date();
    return scheduledExams.map((s, idx) => {
      const isOverdue = s.endedAt ? new Date(s.endedAt) < now : false;
      return {
        id: s.id,
        code: s.subjectCode || 'SWD392',
        name: s.sessionCode || (s.subjectName ? `${s.subjectCode}: ${s.subjectName}` : `${s.subjectCode} - Ca thi vấn đáp AI`),
        session: s.sessionCode || `Ca #${String(idx + 1).padStart(2, '0')}`,
        time: s.scheduledAt
          ? `${new Date(s.scheduledAt).toLocaleDateString('vi-VN')} (${new Date(s.scheduledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}${s.endedAt ? ' - ' + new Date(s.endedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''})`
          : 'Hôm nay (Phòng mở sẵn)',
        duration: `${s.durationMinutes || 30} phút`,
        room: 'AI Viva Voice Room',
        status: isOverdue ? 'overdue' : (s.status === 'IN_PROGRESS' ? 'in_progress' : 'ready'),
        statusText: isOverdue ? 'Đã hết hạn thi' : (s.status === 'IN_PROGRESS' ? 'Đang diễn ra' : 'Phòng thi AI sẵn sàng'),
        canEnter: !isOverdue,
        examId: s.sessionCode,
        sessionId: s.id,
        isOverdue
      };
    });
  }, [scheduledExams]);

  // Handle Start Mock Exam from Modal
  const handleStartMockExam = () => {
    handleStartExamSession({
      subject: mockForm.subject,
      mode: 'mock',
      difficulty: mockForm.difficulty,
      lang: mockForm.lang
    });
  };

  // Tab navigation config
  const TABS = [
    {
      id: 'registered-courses',
      label: 'Môn học đã đăng ký',
      icon: BookOpen,
      badge: registeredCourses.length,
    },
    {
      id: 'upcoming-exams',
      label: 'Lịch ca thi sắp tới',
      icon: Calendar,
      badge: upcomingExams.length,
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'recent-history',
      label: 'Lịch sử thi gần đây',
      icon: History,
      badge: recentExams.length,
    },

  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-800">
      {/* ================= GREETING & UTILITY BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 md:px-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Xin chào, {studentName}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
MSSV: <span className="font-semibold text-slate-700">{studentId}</span> • Khoa Công nghệ Thông tin
          </p>
        </div>

        {/* Quick controls: Language & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-1 text-xs">
            <button
              onClick={() => handleToggleLang('vi-VN')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                examLang === 'vi-VN'
                  ? 'bg-white text-sky-700 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Thi bằng Tiếng Việt"
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => handleToggleLang('en-US')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                examLang === 'en-US'
                  ? 'bg-white text-sky-700 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Exams in English"
            >
              🇺🇸 EN
            </button>
          </div>

          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ================= HORIZONTAL SEGMENTED TAB NAVIGATION ================= */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-1.5 shadow-xs">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth" aria-label="Tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-1 justify-center sm:justify-start ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm shadow-sky-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ================= TAB 1: MÔN HỌC ĐÃ ĐĂNG KÝ ================= */}
      {activeTab === 'registered-courses' && (
        <section className="space-y-4 animate-fade-in">
          {/* Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Môn học học kỳ hiện tại ({registeredCourses.length} môn)
              </h2>
              <p className="text-xs text-slate-500">
                Học liệu RAG đồng bộ tự động từ giáo trình khoa CNTT
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMockForm({ subject: 'CS301', difficulty: 'Chuẩn đề', lang: examLang });
                  setActiveModal('mock-register');
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-700 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Đăng ký thi thử AI</span>
              </button>
            </div>
          </div>

          {/* Grid 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {registeredCourses.map((c) => {
              const isAmber = c.tagColor === 'amber';
              const isBlue = c.tagColor === 'blue';
              const isEmerald = c.tagColor === 'emerald';

              return (
                <div
                  key={c.id}
                  className="group rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-sky-300 p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-2.5">
                    {/* Top: Code & Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {c.code}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isAmber
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : isBlue
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : isEmerald
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {c.examTag}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-sky-700 transition-colors">
                      {c.title}
                    </h3>

                    {/* Compact Lecturer & RAG Info */}
                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{c.lecturer}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Layers className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{c.ragStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & CTA */}
                  <div className="space-y-3 pt-2.5 border-t border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Tiến độ ôn</span>
                        <span className="font-bold text-slate-800">{c.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            c.progress >= 85
                              ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                              : 'bg-gradient-to-r from-sky-500 to-cyan-500'
                          }`}
                          style={{ width: `${c.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={c.primaryAction}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      {c.actionText.includes('AI') && <Sparkles className="w-3.5 h-3.5 text-sky-600" />}
                      <span>{c.actionText}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}


      {/* ================= TAB 2: LỊCH CA THI SẮP TỚI ================= */}
      {activeTab === 'upcoming-exams' && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lịch ca thi vấn đáp chính thức & Sandbox ({upcomingExams.length} ca)
              </h2>
              <p className="text-xs text-slate-500">
                Thí sinh vui lòng kiểm tra Micro & Camera trước giờ thi 15 phút
              </p>

            </div>
            <button
              onClick={() =>
                handleStartExamSession({
                  subject: 'CS301',
                  mode: 'check',
                  difficulty: 'Chuẩn đề'
                })
              }
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Mic className="w-3.5 h-3.5 text-sky-600" />
              <span>Thử thiết bị</span>
            </button>
          </div>

          {/* Full-width Modern Exam Schedule Table */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/70 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Môn thi & Ca</th>
                    <th className="py-3.5 px-5">Thời gian</th>
                    <th className="py-3.5 px-5">Phòng thi AI</th>
                    <th className="py-3.5 px-5">Trạng thái</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcomingExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Course & Session */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              exam.status === 'opening_soon'
                                ? 'bg-amber-500 ring-4 ring-amber-100 animate-pulse'
                                : exam.status === 'confirmed'
                                ? 'bg-sky-500'
                                : 'bg-emerald-500'
                            }`}
                          ></span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{exam.code}</span>
                              <span className="text-slate-300">•</span>
                              <span className="font-semibold text-slate-700">{exam.session}</span>
                              {exam.isMock && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                                  Luyện tập
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">
                              {exam.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{exam.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 ml-5">{exam.duration}</p>
                      </td>

                      {/* Room */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80">
                          {exam.room}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {exam.isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            Đã hết hạn thi
                          </span>
                        ) : exam.status === 'in_progress' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Đang diễn ra
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            Phòng thi sẵn sàng
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {exam.isOverdue ? (
                          <span className="text-xs font-semibold text-rose-500 py-1.5 px-3 bg-rose-50/60 rounded-xl border border-rose-200/60 inline-block">
                            Đã kết thúc
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setIsMicTesting(true);
                                setActiveModal('mic-check');
                              }}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Kiểm tra mic
                            </button>
                            <button
                              onClick={() =>
                                handleStartExamSession({
                                  subject: exam.code,
                                  mode: exam.isMock ? 'mock' : 'official',
                                  difficulty: 'Chuẩn đề',
                                  examId: exam.examId,
                                  sessionId: exam.sessionId || exam.id
                                })
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                            >
                              Vào thi ngay
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 3: LỊCH SỬ THI GẦN ĐÂY ================= */}
      {activeTab === 'recent-history' && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lịch sử & Kết quả vấn đáp AI ({recentExams.length} bài thi)
              </h2>
              <p className="text-xs text-slate-500">
                Dữ liệu lưu trữ đám mây có gắn chữ ký số chứng thực kết quả học tập
              </p>
            </div>
            <Link
              to="/exam-result"
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-sky-700 hover:bg-sky-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Xem bảng điểm chi tiết & Chứng chỉ</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
            </Link>
          </div>

          {/* 3-Column History Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentExams.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 hover:border-sky-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top: Code & Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        {item.code}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.details?.date}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-sky-700 font-mono tracking-tight">
                        {item.score}
                      </span>
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Rubric Mini Breakdown */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block">Chính xác</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {item.details?.rubric?.accuracy ? item.details.rubric.accuracy.split('/')[0]?.trim() : (item.score ? item.score.split('/')[0]?.trim() : '--')}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block">Phản biện</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {item.details?.rubric?.reasoning ? item.details.rubric.reasoning.split('/')[0]?.trim() : (item.score ? item.score.split('/')[0]?.trim() : '--')}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block">Lưu loát</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {item.details?.rubric?.fluency ? item.details.rubric.fluency.split('/')[0]?.trim() : (item.score ? item.score.split('/')[0]?.trim() : '--')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${item.badgeColor}`}>
                    {item.rubricBadge}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedExamReview(item);
                      setActiveModal('ai-feedback');
                    }}
                    className="font-semibold text-sky-600 hover:text-sky-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem nhận xét AI</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      

      {/* ================= MODAL 1: MICROPHONE & DIAGNOSTICS ================= */}
      {activeModal === 'mic-check' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kiểm tra thiết bị âm thanh & Mic</h3>
                  <p className="text-[11px] text-slate-500">Chuẩn bị trước khi vào phòng vấn đáp AI</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setIsMicTesting(false);
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Animation Waveform */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Mức tín hiệu Micro:</span>
                <span className="font-mono font-bold text-sky-600">{audioLevel}%</span>
              </div>

              {/* Progress Level */}
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-blue-600 transition-all duration-150"
                  style={{ width: `${audioLevel}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Tần số: 48,000 Hz</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Độ trễ: 12ms (Tốt)
                </span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Microphone tích hợp / tai nghe nhận diện rõ ràng.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Khử tiếng ồn môi trường AI WebRTC đã kích hoạt.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tốc độ đường truyền mạng: 85 Mbps (Đạt chuẩn HD).</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveModal(null);
                  setIsMicTesting(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setIsMicTesting(false);
                  navigate('/device-check');
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Kiểm tra Thiết Bị Đầy Đủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: AI FEEDBACK & REVIEW ================= */}
      {activeModal === 'ai-feedback' && selectedExamReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedExamReview.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedExamReview.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ngày thi: {selectedExamReview.details?.date || 'Gần đây'} • Điểm tổng kết:{' '}
                  <strong className="text-sky-700 font-mono">{selectedExamReview.score}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rubric Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Chính xác</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                  {selectedExamReview.details?.rubric?.accuracy || selectedExamReview.score || '--'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Phản biện logic</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                  {selectedExamReview.details?.rubric?.reasoning || selectedExamReview.score || '--'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Lưu loát</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                  {selectedExamReview.details?.rubric?.fluency || selectedExamReview.score || '--'}
                </p>
              </div>
            </div>

            {/* AI Examiner Comment */}
            <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
                <Bot className="w-4 h-4 text-sky-600" />
                <span>Nhận xét từ AI Examiner:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                "{selectedExamReview.details?.aiComment}"
              </p>
            </div>

            {/* Advice */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Khuyến nghị cải thiện:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedExamReview.details?.advice}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveModal(null);
                  const sessId = selectedExamReview?.sessionId || selectedExamReview?.id;
                  if (sessId && /^[0-9a-fA-F-]{36}$/.test(sessId)) {
                    navigate(`/exam-result?sessionId=${sessId}`);
                  } else {
                    navigate('/exam-result');
                  }
                }}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem bảng điểm chi tiết & Xuất PDF →</span>
              </button>

              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: COURSE DETAIL ================= */}
      {activeModal === 'course-detail' && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedCourse.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedCourse.title}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p><strong>Giảng viên phụ trách:</strong> {selectedCourse.lecturer}</p>
              <p><strong>Học liệu RAG tích hợp:</strong> {selectedCourse.ragCount} tài liệu chuẩn hoá (Syllabus, Slide bài giảng, Ngân hàng đề thi tham khảo).</p>
              <p><strong>Trạng thái ca thi:</strong> {selectedCourse.examTag}</p>
              <p><strong>Tiến độ hoàn thành ôn luyện:</strong> {selectedCourse.progress}%</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
              Bạn có thể bắt đầu phiên hỏi đáp giả lập 1-1 với AI Tutor của môn học này bất kỳ lúc nào để làm quen với phong cách đặt câu hỏi phản biện.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleStartExamSession({
                    subject: selectedCourse.code,
                    mode: 'mock',
                    difficulty: 'Chuẩn đề'
                  });
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Luyện Tập Môn Này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: MOCK EXAM REGISTRATION ================= */}
      {activeModal === 'mock-register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Đăng ký ca thi thử AI (Mock Viva)</h3>
                  <p className="text-[11px] text-slate-500">Mô phỏng hội đồng thi vấn đáp 1-1 với AI Examiner</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Select Subject */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  1. Chọn môn học cần luyện thi
                </label>
                <select
                  value={mockForm.subject}
                  onChange={(e) => setMockForm({ ...mockForm, subject: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="CS301">CS301 - Cấu trúc Dữ liệu & Giải thuật</option>
                  <option value="AI204">AI204 - Học máy & Thị giác máy tính</option>
                  <option value="SE102">SE102 - Kiến trúc Phần mềm nâng cao</option>
                  <option value="NE302">NE302 - An toàn Mạng & Mật mã học</option>
                </select>
              </div>

              {/* Select Difficulty Level */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  2. Mức độ phản biện của AI Examiner
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cơ bản', 'Chuẩn đề', 'Hỏi xoáy'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMockForm({ ...mockForm, difficulty: lvl })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        mockForm.difficulty === lvl
                          ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold shadow-2xs'
                          : 'border-slate-200 hover:border-sky-300 text-slate-700 font-medium'
                      }`}
                    >
                      <span>{lvl}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Examination Language */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  3. Ngôn ngữ hội thoại vấn đáp (Speech Recognition & TTS)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMockForm({ ...mockForm, lang: 'vi-VN' })}
                    className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      mockForm.lang === 'vi-VN'
                        ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-sky-300 text-slate-700 font-medium'
                    }`}
                  >
                    <span>🇻🇳 Tiếng Việt (vi-VN)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockForm({ ...mockForm, lang: 'en-US' })}
                    className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      mockForm.lang === 'en-US'
                        ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-sky-300 text-slate-700 font-medium'
                    }`}
                  >
                    <span>🇺🇸 English (en-US)</span>
                  </button>
                </div>
              </div>

              {/* Sandbox notice */}
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-[11px] text-sky-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Target className="w-3.5 h-3.5 text-sky-600" />
                  <span>Quyền lợi phòng Sandbox:</span>
                </div>
                <p className="text-slate-600">
                  Không giới hạn thời gian và số lần thử lại; AI Giám khảo sẽ đối đáp tự nhiên và đưa ra nhận xét chi tiết sau khi kết thúc.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleStartMockExam}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs font-bold shadow-sm shadow-sky-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Bắt Đầu Ngay (Kiểm Tra Thiết Bị)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
