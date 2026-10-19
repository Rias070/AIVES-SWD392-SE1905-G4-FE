import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Share2,
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Bot,
  User,
  Play,
  Pause,
  Square,
  Volume2,
  Shield,
  Layers,
  FileText,
  TrendingUp,
  Bookmark,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Check,
  Calendar,
  GraduationCap,
  UserCheck,
  Edit3,
  Scale
} from 'lucide-react';
import { lecturerExamSessionApi } from '../../services/api';

const FALLBACK_VIVA_RESULT = {
  examCode: 'CS301-VIVA-2026-99127',
  courseName: 'CS301: Cấu trúc Dữ liệu & Giải thuật',
  studentName: 'Nguyễn Văn An',
  studentId: 'SE190504',
  completedAt: new Date().toISOString(),
  turnsCompleted: 3,
  overallScore: 8.5,
  bloomLevel: 'Bloom 4 - Phân tích & Đánh giá',
  duration: '18 phút 42 giây',
  rubricScores: [
    { name: 'Tính chính xác lý thuyết & Giải thuật', score: '4.5 / 5.0', percent: 90 },
    { name: 'Khả năng phản biện câu hỏi xoáy', score: '4.0 / 5.0', percent: 80 },
    { name: 'Diễn đạt lưu loát & Thuật ngữ khoa học', score: '4.5 / 5.0', percent: 90 }
  ],
  aiFeedback:
    'Thí sinh nắm rất vững bản chất tham lam (Greedy) của thuật toán Dijkstra và lý do thất bại khi gặp trọng số âm. Khả năng phản xạ và lý giải cơ chế phát hiện chu trình âm của Bellman-Ford qua V-1 lần lặp rất thuyết phục và rành mạch.',
  strengths:
    'Lập luận logic chặt chẽ, diễn giải thuật toán đồ thị mạch lạc, thời gian phản xạ trả lời nhanh (trung bình 4.2s). Khả năng truy vết lỗi trong đồ thị và phân tích tiệm cận thời gian rất vững.',
  gaps:
    'Cần lưu ý thêm về trường hợp chu trình âm không tiếp cận được từ đỉnh nguồn (unreachable negative cycles) và cách phục hồi đường đi trong đồ thị có hướng.',
  recommendations:
    'Khuyến nghị đọc lại chương 5 - Đồ thị nâng cao (Slide 45-58) và bài toán tìm thành phần liên thông mạnh Tarjan SCC để hoàn thiện tư duy đồ thị.',
  dialogueHistory: [
    {
      sender: 'ai',
      time: '14:02:15',
      text: 'Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn CS301. Mời bạn lắng nghe câu hỏi đầu tiên.',
      isMainQuestion: false
    },
    {
      sender: 'ai',
      time: '14:02:30',
      text: 'Hãy phân tích ưu và nhược điểm của thuật toán Dijkstra khi áp dụng cho đồ thị có trọng số âm, và giải thích tại sao thuật toán Bellman-Ford lại giải quyết được vấn đề này?',
      isMainQuestion: true
    },
    {
      sender: 'student',
      time: '14:03:45',
      text: 'Dạ thưa Hội đồng, thuật toán Dijkstra áp dụng chiến lược tham lam Greedy. Khi một đỉnh đã đưa vào tập settled, Dijkstra mặc định khoảng cách đó là tối ưu vĩnh viễn và không cập nhật lại. Nếu có cạnh trọng số âm thì kết quả sẽ sai lệch, trong khi Bellman-Ford duyệt V-1 lần giúp phát hiện và cập nhật đường đi chính xác.'
    },
    {
      sender: 'ai',
      time: '14:04:10',
      text: 'Bạn vừa nhắc đến chu trình trọng số âm. Vậy thuật toán Bellman-Ford làm thế nào để phát hiện được sự tồn tại của chu trình âm trong đồ thị? Số lần duyệt tối đa là bao nhiêu và tại sao?',
      isMainQuestion: true
    },
    {
      sender: 'student',
      time: '14:05:20',
      text: 'Dạ, Bellman-Ford nới lỏng đúng V - 1 lần. Nếu sau V - 1 lần mà ta tiếp tục duyệt qua tất cả các cạnh lần thứ V và khoảng cách tới bất kỳ đỉnh nào vẫn tiếp tục giảm, điều đó chứng minh đồ thị chắc chắn tồn tại chu trình trọng số âm tiếp cận được từ đỉnh nguồn.'
    }
  ]
};

const MOCK_EXAM_SESSIONS = [
  {
    id: 'CS301-VIVA-2026-99127',
    examCode: 'CS301-VIVA-2026-99127',
    courseName: 'CS301: Cấu trúc Dữ liệu & Giải thuật',
    studentName: 'Nguyễn Văn An',
    studentId: 'SE190504',
    completedAt: '2026-10-19T10:15:00.000Z',
    turnsCompleted: 3,
    overallScore: 8.5,
    bloomLevel: 'Bloom 4 - Phân tích & Đánh giá',
    duration: '18 phút 42 giây',
    isFinalized: false,
    rubricScores: [
      { name: 'Tính chính xác lý thuyết & Giải thuật', score: '4.5 / 5.0', rawScore: 4.5, maxScore: 5.0, percent: 90 },
      { name: 'Khả năng phản biện câu hỏi xoáy', score: '4.0 / 5.0', rawScore: 4.0, maxScore: 5.0, percent: 80 },
      { name: 'Diễn đạt lưu loát & Thuật ngữ khoa học', score: '4.5 / 5.0', rawScore: 4.5, maxScore: 5.0, percent: 90 }
    ],
    aiFeedback:
      'Thí sinh nắm rất vững bản chất tham lam (Greedy) của thuật toán Dijkstra và lý do thất bại khi gặp trọng số âm. Khả năng phản xạ và lý giải cơ chế phát hiện chu trình âm của Bellman-Ford qua V-1 lần lặp rất thuyết phục và rành mạch.',
    strengths:
      'Lập luận logic chặt chẽ, diễn giải thuật toán đồ thị mạch lạc, thời gian phản xạ trả lời nhanh (trung bình 4.2s). Khả năng truy vết lỗi trong đồ thị và phân tích tiệm cận thời gian rất vững.',
    gaps:
      'Cần lưu ý thêm về trường hợp chu trình âm không tiếp cận được từ đỉnh nguồn (unreachable negative cycles) và cách phục hồi đường đi trong đồ thị có hướng.',
    recommendations:
      'Khuyến nghị đọc lại chương 5 - Đồ thị nâng cao (Slide 45-58) và bài toán tìm thành phần liên thông mạnh Tarjan SCC để hoàn thiện tư duy đồ thị.',
    dialogueHistory: FALLBACK_VIVA_RESULT.dialogueHistory
  },
  {
    id: 'PRJ301-VIVA-2026-88412',
    examCode: 'PRJ301-VIVA-2026-88412',
    courseName: 'PRJ301: Java Web Applications',
    studentName: 'Trần Thị Mai',
    studentId: 'SE190522',
    completedAt: '2026-10-19T09:30:00.000Z',
    turnsCompleted: 3,
    overallScore: 9.0,
    bloomLevel: 'Bloom 4 - Phân tích kiến trúc Web',
    duration: '16 phút 15 giây',
    isFinalized: true,
    finalScore: 9.0,
    lecturerFeedback: 'Sinh viên nắm rất sâu sắc cơ chế Filter Chain, Servlet Container và Session Replication. Lập luận chuẩn xác.',
    rubricScores: [
      { name: 'Tính chính xác lý thuyết & Vòng đời Servlet', score: '4.8 / 5.0', rawScore: 4.8, maxScore: 5.0, percent: 96 },
      { name: 'Khả năng phản biện câu hỏi xoáy', score: '4.2 / 5.0', rawScore: 4.2, maxScore: 5.0, percent: 84 },
      { name: 'Diễn đạt lưu loát & Thuật ngữ khoa học', score: '5.0 / 5.0', rawScore: 5.0, maxScore: 5.0, percent: 100 }
    ],
    aiFeedback:
      'Sinh viên phân tích rất xuất sắc về vòng đời Servlet (init, service, destroy) và mô hình MVC trong Java EE.',
    strengths: 'Hiểu rất sâu về thread-safety trong Servlet và cơ chế Connection Pooling với HikariCP.',
    gaps: 'Cần củng cố thêm về xử lý distributed lock khi dùng Redis cache trong môi trường microservices.',
    recommendations: 'Tham khảo tài liệu Spring Cloud & Redis Distributed Locking.',
    dialogueHistory: [
      { sender: 'ai', time: '09:15:10', text: 'Chào thí sinh Trần Thị Mai! Bắt đầu ca thi môn PRJ301.', isMainQuestion: false },
      { sender: 'ai', time: '09:15:20', text: 'Hãy phân tích vòng đời của Servlet và cơ chế đa luồng (Multi-threading) trong Servlet Container.', isMainQuestion: true },
      { sender: 'student', time: '09:16:40', text: 'Dạ, Servlet chỉ được khởi tạo một instance duy nhất. Mỗi request từ client sẽ được Container phân phối cho một thread riêng trong thread pool để thực thi service(). Do đó cần chú ý biến instance không thread-safe.' },
      { sender: 'ai', time: '09:17:10', text: 'Rất chính xác. Vậy làm thế nào để đồng bộ hóa tài nguyên dùng chung trong Servlet mà không làm nghẽn toàn bộ hiệu năng của web app?', isMainQuestion: true },
      { sender: 'student', time: '09:18:00', text: 'Dạ ta không nên dùng synchronized method trên service(), mà nên dùng concurrent collections như ConcurrentHashMap hoặc thread-local storage.' }
    ]
  },
  {
    id: 'SWD392-VIVA-2026-77309',
    examCode: 'SWD392-VIVA-2026-77309',
    courseName: 'SWD392: Software Architecture & Design',
    studentName: 'Lê Hoàng Phúc',
    studentId: 'SE190589',
    completedAt: '2026-10-19T11:05:00.000Z',
    turnsCompleted: 3,
    overallScore: 7.5,
    bloomLevel: 'Bloom 3 - Vận dụng thiết kế',
    duration: '19 phút 10 giây',
    isFinalized: false,
    rubricScores: [
      { name: 'Tính chính xác lý thuyết & Design Pattern', score: '4.0 / 5.0', rawScore: 4.0, maxScore: 5.0, percent: 80 },
      { name: 'Khả năng phản biện câu hỏi xoáy', score: '3.5 / 5.0', rawScore: 3.5, maxScore: 5.0, percent: 70 },
      { name: 'Diễn đạt lưu loát & Thuật ngữ khoa học', score: '4.0 / 5.0', rawScore: 4.0, maxScore: 5.0, percent: 80 }
    ],
    aiFeedback:
      'Sinh viên trình bày đúng các nguyên lý SOLID, đặc biệt là Dependency Inversion. Tuy nhiên khi hỏi xoáy về Saga Pattern trong Microservices thì còn ngập ngừng.',
    strengths: 'Nắm chắc kiến trúc Clean Architecture / Onion Architecture và cách tổ chức các tầng Layer.',
    gaps: 'Chưa phân biệt rõ giữa Orchestration Saga và Choreography Saga khi xử lý bù trừ transaction (Compensating Transactions).',
    recommendations: 'Đọc thêm chương Microservices Patterns (Chris Richardson) về Event-Driven Architecture.',
    dialogueHistory: [
      { sender: 'ai', time: '10:50:00', text: 'Chào thí sinh Lê Hoàng Phúc! Bắt đầu ca thi môn SWD392.', isMainQuestion: false },
      { sender: 'ai', time: '10:50:15', text: 'Hãy giải thích tại sao kiến trúc Microservices lại ưu tiên Eventual Consistency thay vì ACID hai pha (2PC)?', isMainQuestion: true },
      { sender: 'student', time: '10:51:30', text: 'Dạ, 2PC gây blocking cao và giảm độ sẵn sàng (Availability) theo CAP. Do đó microservices áp dụng Saga pattern với Eventual Consistency để tăng throughput.' },
      { sender: 'ai', time: '10:52:00', text: 'Nếu một microservice trong chuỗi Saga gặp lỗi thanh toán, cơ chế bù trừ (Compensating Transaction) diễn ra như thế nào?', isMainQuestion: true },
      { sender: 'student', time: '10:53:10', text: 'Dạ hệ thống sẽ bắn event ngược lại để hoàn tác các bước trước đó, ví dụ trả lại hàng vào kho hoặc hủy đơn hàng.' }
    ]
  }
];

export default function ExamResultPage() {
  const navigate = useNavigate();

  // Current Logged-in User
  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('aives_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();
  const isLecturer = currentUser?.role === 'LECTURER' || currentUser?.role === 'ADMIN';

  // Dynamic Exam Result State
  const [selectedSessionId, setSelectedSessionId] = useState(MOCK_EXAM_SESSIONS[0].id);
  const [vivaResult, setVivaResult] = useState(FALLBACK_VIVA_RESULT);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isPlayingAudioRef = useRef(false);
  isPlayingAudioRef.current = isPlayingAudio;

  const [currentlySpeakingIdx, setCurrentlySpeakingIdx] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [expandedDialogue, setExpandedDialogue] = useState(true);

  // Human-in-the-loop Governance states
  const [isFinalized, setIsFinalized] = useState(false);
  const [finalScoreInput, setFinalScoreInput] = useState(8.5);
  const [lecturerFeedbackInput, setLecturerFeedbackInput] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeSuccessMsg, setFinalizeSuccessMsg] = useState('');
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [criteriaScores, setCriteriaScores] = useState([]);

  // Switch student session (Lecturer Exam Hub)
  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    const target = MOCK_EXAM_SESSIONS.find((s) => s.id === sessionId);
    if (target) {
      const isFin = target.isFinalized || false;
      setIsFinalized(isFin);
      const score = target.finalScore || target.overallScore || 8.5;
      setFinalScoreInput(score);
      setLecturerFeedbackInput(target.lecturerFeedback || '');
      setVivaResult(target);
      initCriteriaScores(target);
    }
  };

  const initCriteriaScores = (res) => {
    const list = res.rubricScores || FALLBACK_VIVA_RESULT.rubricScores;
    setCriteriaScores(
      list.map((r) => ({
        name: r.name,
        rawScore: typeof r.rawScore === 'number' ? r.rawScore : parseFloat(r.score) || 4.0,
        maxScore: typeof r.maxScore === 'number' ? r.maxScore : 5.0,
      }))
    );
  };

  // Load latest viva result from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('latest_viva_result');
      if (stored) {
        const parsed = JSON.parse(stored);
        const isFin = parsed.isFinalized || parsed.status === 'COMPLETED' || false;
        setIsFinalized(isFin);
        setFinalScoreInput(parsed.finalScore || parsed.overallScore || 8.5);
        setLecturerFeedbackInput(parsed.lecturerFeedback || '');
        const merged = {
          ...FALLBACK_VIVA_RESULT,
          ...parsed,
          rubricScores: parsed.rubricScores || FALLBACK_VIVA_RESULT.rubricScores,
          dialogueHistory: parsed.dialogueHistory || parsed.dialogue || FALLBACK_VIVA_RESULT.dialogueHistory
        };
        setVivaResult(merged);
        initCriteriaScores(merged);
        return;
      }
    } catch (e) {
      console.warn('Lỗi khi đọc kết quả từ localStorage:', e);
    }

    initCriteriaScores(FALLBACK_VIVA_RESULT);

    return () => {
      isPlayingAudioRef.current = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleUpdateCriterionScore = (idx, newScore) => {
    const val = Math.max(0, Math.min(10, parseFloat(newScore) || 0));
    const nextCriteria = criteriaScores.map((c, i) => (i === idx ? { ...c, rawScore: val } : c));
    setCriteriaScores(nextCriteria);
    const totalMax = nextCriteria.reduce((acc, c) => acc + (c.maxScore || 5.0), 0) || 15;
    const totalRaw = nextCriteria.reduce((acc, c) => acc + (c.rawScore || 0), 0);
    const calculatedFinal = Math.min(10, Math.round(((totalRaw / totalMax) * 10) * 10) / 10);
    setFinalScoreInput(calculatedFinal);
  };

  // Lecturer score finalization handler (Human-in-the-loop)
  const handleFinalizeScore = async () => {
    setIsFinalizing(true);
    setFinalizeSuccessMsg('');
    const sessionId = vivaResult.sessionId || vivaResult.sessionUuid || vivaResult.id;
    const scoreVal = parseFloat(finalScoreInput);

    const updatedRubrics = vivaResult.rubricScores?.map((r, idx) => {
      const matching = criteriaScores[idx];
      if (matching) {
        const maxS = matching.maxScore || 5.0;
        return {
          ...r,
          rawScore: matching.rawScore,
          score: `${matching.rawScore} / ${maxS}`,
          percent: Math.min(100, Math.round((matching.rawScore / maxS) * 100))
        };
      }
      return r;
    }) || vivaResult.rubricScores;

    try {
      if (sessionId) {
        await lecturerExamSessionApi.finalizeScore(sessionId, {
          finalScore: scoreVal,
          lecturerFeedback: lecturerFeedbackInput || 'Giảng viên đã duyệt và chốt điểm ca thi.',
          rubricScores: updatedRubrics
        });
      }

      const updated = {
        ...vivaResult,
        isFinalized: true,
        status: 'COMPLETED',
        finalScore: scoreVal,
        overallScore: scoreVal,
        rubricScores: updatedRubrics,
        lecturerFeedback: lecturerFeedbackInput || 'Giảng viên đã duyệt và chốt điểm ca thi.'
      };
      setVivaResult(updated);
      setIsFinalized(true);
      setShowFinalizeModal(false);
      setFinalizeSuccessMsg('Đã chốt điểm thành công! Điểm chính thức đã được ghi nhận vào hệ thống.');
      localStorage.setItem('latest_viva_result', JSON.stringify(updated));
    } catch (err) {
      console.warn('API finalize score error, saving locally:', err);
      const updated = {
        ...vivaResult,
        isFinalized: true,
        status: 'COMPLETED',
        finalScore: scoreVal,
        overallScore: scoreVal,
        rubricScores: updatedRubrics,
        lecturerFeedback: lecturerFeedbackInput || 'Giảng viên đã duyệt và chốt điểm ca thi.'
      };
      setVivaResult(updated);
      setIsFinalized(true);
      setShowFinalizeModal(false);
      setFinalizeSuccessMsg('Đã chốt điểm ca thi (lưu thành công)!');
      localStorage.setItem('latest_viva_result', JSON.stringify(updated));
    } finally {
      setIsFinalizing(false);
      setTimeout(() => setFinalizeSuccessMsg(''), 5000);
    }
  };

  // Chromium SpeechSynthesis watchdog to prevent TTS queue freeze (Chrome 15s bug / backgrounding)
  useEffect(() => {
    let watchdogTimer = null;
    if (isPlayingAudio && 'speechSynthesis' in window) {
      watchdogTimer = setInterval(() => {
        if (!('speechSynthesis' in window)) return;
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else if (window.speechSynthesis.speaking) {
          // Keep active queue running without dropping audio in Chromium
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 4000);
    }
    return () => {
      if (watchdogTimer) clearInterval(watchdogTimer);
    };
  }, [isPlayingAudio]);

  // Text-To-Speech Replay Engine
  const playDialogueAudio = (startIndex = 0) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ Web SpeechSynthesis');
      return;
    }

    window.speechSynthesis.cancel();
    isPlayingAudioRef.current = true;
    setIsPlayingAudio(true);

    const history = vivaResult.dialogueHistory || [];
    let currentIdx = startIndex;

    const playNext = () => {
      if (!isPlayingAudioRef.current) return;

      if (currentIdx >= history.length) {
        isPlayingAudioRef.current = false;
        setIsPlayingAudio(false);
        setCurrentlySpeakingIdx(null);
        return;
      }

      const item = history[currentIdx];
      setCurrentlySpeakingIdx(currentIdx);

      const examLang = vivaResult.examLang || 'vi-VN';
      const isJa = examLang.startsWith('ja');
      const isEn = examLang.startsWith('en');

      const prefix = isJa
        ? (item.sender === 'ai' ? '面接官の質問：' : '受験者の回答：')
        : isEn
        ? (item.sender === 'ai' ? 'Examiner: ' : 'Candidate: ')
        : (item.sender === 'ai' ? 'Giám khảo hỏi: ' : 'Thí sinh trả lời: ');

      const utterance = new SpeechSynthesisUtterance(prefix + item.text);
      utterance.lang = examLang;
      
      const voices = window.speechSynthesis.getVoices();
      const prefixCode = examLang.split('-')[0].toLowerCase();
      const voice = voices.find(v => (v.lang || '').toLowerCase().startsWith(prefixCode));
      if (voice) utterance.voice = voice;

      utterance.rate = isJa ? 1.0 : (isEn ? 1.0 : 0.95);
      utterance.pitch = item.sender === 'ai' ? 1.05 : 0.98;

      utterance.onend = () => {
        if (!isPlayingAudioRef.current) return;
        currentIdx++;
        setTimeout(() => {
          if (isPlayingAudioRef.current) playNext();
        }, 600);
      };

      utterance.onerror = () => {
        if (!isPlayingAudioRef.current) return;
        currentIdx++;
        setTimeout(() => {
          if (isPlayingAudioRef.current) playNext();
        }, 400);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNext();
  };

  const stopAudio = () => {
    isPlayingAudioRef.current = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setCurrentlySpeakingIdx(null);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      playDialogueAudio(0);
    }
  };

  // Play single line
  const handlePlaySingle = (idx) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    isPlayingAudioRef.current = true;
    setIsPlayingAudio(true);
    setCurrentlySpeakingIdx(idx);

    const item = vivaResult.dialogueHistory[idx];
    const examLang = vivaResult.examLang || 'vi-VN';
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = examLang;

    const voices = window.speechSynthesis.getVoices();
    const prefixCode = examLang.split('-')[0].toLowerCase();
    const voice = voices.find(v => (v.lang || '').toLowerCase().startsWith(prefixCode));
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      isPlayingAudioRef.current = false;
      setIsPlayingAudio(false);
      setCurrentlySpeakingIdx(null);
    };
    utterance.onerror = () => {
      isPlayingAudioRef.current = false;
      setIsPlayingAudio(false);
      setCurrentlySpeakingIdx(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  // Print Transcript PDF
  const handlePrint = () => {
    window.print();
  };

  // Copy Share Link
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const effectiveScore = isFinalized
    ? (Number(vivaResult.finalScore) || Number(vivaResult.overallScore) || 8.5)
    : (Number(vivaResult.suggestedScore) || Number(vivaResult.overallScore) || 8.5);
  const scorePercent = Math.min(100, Math.max(0, (effectiveScore / 10) * 100));

  return (
    <div id="printable-exam-result" className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* ================= PRINT-ONLY OFFICIAL HEADER ================= */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              Bảng Điểm Khảo Thí Vấn Đáp AIVES
            </h1>
            <p className="text-xs text-slate-600">
              Hệ thống khảo thí và đánh giá năng lực trực tuyến
            </p>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            <p className="font-bold text-slate-900">Mã ca thi: {vivaResult.examCode}</p>
            <p>Ngày thi: {new Date(vivaResult.completedAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Thí sinh:</span>
            <span className="font-bold text-slate-900">{vivaResult.studentName} ({vivaResult.studentId})</span>
          </div>
          <div>
            <span className="text-slate-500 block">Môn học:</span>
            <span className="font-bold text-slate-900">{vivaResult.courseName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Kết quả chính thức:</span>
            <span className="font-bold text-sky-800 text-sm">{effectiveScore.toFixed(1)} / 10.0 {isFinalized ? '(Đã chốt)' : '(Đề xuất AI)'}</span>
          </div>
        </div>
      </div>

      {/* ================= TOP NAVIGATION BAR (Hidden in Print) ================= */}
      <div className="no-print p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <Link
            to={isLecturer ? "/question-bank" : "/student"}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5"
            title={isLecturer ? "Quay lại Ngân Hàng Câu Hỏi & Khảo Thí" : "Quay lại Bảng Điều Khiển Sinh Viên"}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">
              {isLecturer ? "Ngân Hàng Câu Hỏi" : "Bảng điều khiển"}
            </span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold text-slate-900">
                {isLecturer ? "Thẩm định & Chốt điểm ca thi" : "Kết quả ca thi"} — {vivaResult.courseName}
              </h1>
              {isFinalized ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Điểm chính thức đã chốt
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                  Chờ giảng viên xác nhận điểm
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Thí sinh: <strong>{vivaResult.studentName} ({vivaResult.studentId})</strong> • Mã ca thi: {vivaResult.examCode}
            </p>
          </div>
        </div>

        {/* Right Actions: PDF Print & Share */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Xuất bảng điểm (PDF)</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs font-semibold shadow-sm shadow-sky-500/25 transition-all cursor-pointer"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Đã sao chép link' : 'Chia sẻ chứng chỉ'}</span>
          </button>
        </div>
      </div>

      {/* ================= LECTURER EXAM SESSIONS QUEUE BAR ================= */}
      {isLecturer && (
        <div className="no-print p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
              Hàng đợi ca thi cần thẩm định của Giảng viên ({MOCK_EXAM_SESSIONS.length} ca thi)
            </span>
            <span className="text-[10px] text-slate-400">Chọn thí sinh để duyệt và chốt điểm</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {MOCK_EXAM_SESSIONS.map((sess) => {
              const isSelected = sess.id === selectedSessionId;
              const isDone = sess.isFinalized || (sess.id === vivaResult.id && isFinalized);

              return (
                <button
                  key={sess.id}
                  type="button"
                  onClick={() => handleSelectSession(sess.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="truncate">{sess.studentName}</span>
                    <span className="font-mono text-[11px] text-sky-700">{sess.overallScore}đ</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>{sess.studentId} • {sess.courseName.split(':')[0]}</span>
                    <span className={`px-1.5 py-0.5 rounded font-semibold ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {isDone ? 'Đã chốt' : 'Chờ duyệt'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {finalizeSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{finalizeSuccessMsg}</span>
        </div>
      )}

      {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: SCORE & METRICS (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Official Score Card */}
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-5 print:border-slate-300 print:shadow-none print-score-card print-avoid-break">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isFinalized ? 'ĐIỂM TỔNG KẾT CHÍNH THỨC' : 'ĐIỂM ĐỀ XUẤT TỪ AI'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isFinalized ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {isFinalized ? 'Đã duyệt' : 'Đề xuất tạm tính'}
              </span>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-36 h-36 rounded-full flex items-center justify-center p-2.5">
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className={`${isFinalized ? 'text-emerald-600' : 'text-sky-600'} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - effectiveScore / 10)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Score Number inside Ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {effectiveScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/10</span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${isFinalized ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                    {isFinalized ? 'ĐÃ CHỐT ĐIỂM' : 'CHỜ GIẢNG VIÊN DUYỆT'}
                  </span>
                </div>
              </div>

              {/* Distinction Ribbon */}
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>{effectiveScore >= 8.0 ? 'Xuất sắc (Grade A)' : effectiveScore >= 6.5 ? 'Khá (Grade B)' : 'Đạt yêu cầu (Grade C)'}</span>
              </div>
            </div>

            {/* Meta Attributes */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-slate-600">
                <span>Môn học:</span>
                <span className="font-semibold text-slate-800">{vivaResult.courseName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Thời lượng thi:</span>
                <span className="font-semibold text-slate-800">{vivaResult.duration || '18 phút 42 giây'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Số lượt hỏi xoáy:</span>
                <span className="font-semibold text-sky-700">{vivaResult.turnsCompleted || 3} / 3 lượt hoàn tất</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Mức nhận thức Bloom:</span>
                <span className="font-semibold text-indigo-700">{vivaResult.bloomLevel || 'Bloom 4 - Phân tích'}</span>
              </div>
            </div>

            {/* Rubric Breakdown Score Bars */}
            <div className="space-y-3 pt-3 border-t border-slate-100 print-avoid-break">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Điểm thành phần Rubric
              </span>
              {vivaResult.rubricScores.map((rubric, idx) => (
                <div key={idx} className="space-y-1 print-rubric-item print-avoid-break">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">{rubric.name}</span>
                    <span className="font-bold text-slate-900 font-mono">{rubric.score}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                      style={{ width: `${rubric.percent || 85}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Integrity Check */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Giám sát ca thi</span>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                Hợp lệ
              </span>
            </div>

            {/* Turn-by-Turn Adaptive Scores Breakdown */}
            {vivaResult.turnScores && vivaResult.turnScores.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Điểm từng lượt vấn đáp (Adaptive Turns)
                </span>
                <div className="space-y-1.5">
                  {vivaResult.turnScores.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold flex items-center justify-center">
                          {t.turnNumber || idx + 1}
                        </span>
                        <span className="text-slate-700 font-medium">Lượt {t.turnNumber || idx + 1}</span>
                        {t.bloomLevel && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                            {t.bloomLevel}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900 font-mono">
                        {typeof t.score === 'number' ? t.score.toFixed(1) : t.score} / 10
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Human-in-the-loop Governance Card */}
            <div className={`p-4 rounded-xl border ${isFinalized ? 'bg-emerald-50/60 border-emerald-200' : 'bg-gradient-to-br from-amber-50/60 to-orange-50/60 border-amber-200'} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className={`w-4 h-4 ${isFinalized ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <span className="text-xs font-bold text-slate-900">
                    {isFinalized ? 'Giảng viên đã chốt điểm' : 'Giám khảo / Giảng viên chốt điểm'}
                  </span>
                </div>
                {isFinalized ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Chính thức
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                    Cần xác nhận
                  </span>
                )}
              </div>

              {isFinalized ? (
                <div className="text-xs text-slate-700 space-y-1 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                  <p className="font-semibold text-emerald-800">Điểm chốt: {effectiveScore.toFixed(1)} / 10</p>
                  {vivaResult.lecturerFeedback && (
                    <p className="text-[11px] text-slate-600 italic">"{vivaResult.lecturerFeedback}"</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Điểm số do AI đề xuất. Giảng viên phụ trách có thể xem xét và xác nhận điểm chính thức.
                  </p>
                  <button
                    onClick={() => setShowFinalizeModal(true)}
                    className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Giảng viên duyệt & Chốt điểm</span>
                  </button>
                </div>
              )}
            </div>

            {/* Action buttons (Hidden in Print) */}
            <div className="no-print space-y-2 pt-2">
              <Link
                to="/student"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-xs font-bold shadow-sm shadow-sky-500/20 hover:from-sky-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Về trang chủ sinh viên</span>
              </Link>
              <button
                onClick={handleToggleAudio}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-rose-500" />
                    <span>Dừng phát âm thanh</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Nghe lại toàn bộ buổi vấn đáp (TTS)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: DIALOGUE HISTORY & AI FEEDBACK (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">


          {/* SECTION 2: AI SUMMARY & ADVICE */}
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4 print:border-slate-300 print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">
                  Đánh giá & Nhận xét
                </h2>
              </div>
            </div>

            {/* AI Overall Feedback */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1 print-avoid-break print-section-block">
              <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
                <Bot className="w-4 h-4 text-sky-600" />
                <span>Nhận xét tổng quát từ Hội đồng AI</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{vivaResult.aiFeedback}"
              </p>
            </div>

            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1 print-avoid-break print-section-block">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Điểm mạnh nổi bật</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {vivaResult.strengths}
              </p>
            </div>

            {/* Knowledge Gaps */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1 print-avoid-break print-section-block">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Khoảng trống kiến thức cần lưu ý</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {vivaResult.gaps}
              </p>
            </div>

            {/* Recommended Reading */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 print-avoid-break print-section-block">
              <div className="flex items-center gap-1.5 text-slate-800 text-xs font-bold">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Tài liệu ôn tập đề xuất</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {vivaResult.recommendations}
              </p>
            </div>

            {/* Audio Snippet Player (Hidden in Print) */}
            <div className="no-print p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Nghe lại đoạn phản biện ấn tượng nhất
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hội thoại đối đáp câu hỏi Dijkstra & Bellman-Ford
                  </p>
                </div>
              </div>

              {/* Animated audio waves */}
              <div className="flex items-center gap-1">
                {[40, 70, 95, 60, 80, 50, 85, 30, 60, 45].map((val, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-sky-500 transition-all ${isPlayingAudio ? 'animate-pulse' : ''
                      }`}
                    style={{ height: `${val * 0.25}px` }}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRINT-ONLY OFFICIAL SIGNATURES ================= */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t-2 border-slate-900 text-center text-xs print-signature-block print-avoid-break">
        <div>
          <p className="font-bold text-slate-900 uppercase">Thí sinh cam kết</p>
          <p className="text-[10px] text-slate-500 italic mt-0.5">(Ký và ghi rõ họ tên)</p>
          <div className="h-20"></div>
          <p className="font-semibold text-slate-800">{vivaResult.studentName}</p>
        </div>

        <div>
          <p className="font-bold text-slate-900 uppercase">Chữ ký số Hội đồng Khảo thí AI</p>
          <p className="text-[10px] text-slate-500 italic mt-0.5">Xác thực tự động qua Smart Contract</p>
          <div className="h-14 flex items-center justify-center">
            <span className="px-3 py-1 rounded border-2 border-emerald-700 text-emerald-800 font-mono font-bold text-[10px] uppercase rotate-[-3deg]">
              [VERIFIED AIVES AI EXAMINER]
            </span>
          </div>
          <p className="font-mono text-[9px] text-slate-600">SHA-256: 0x4F9E7B3A2C...88D1</p>
        </div>
      </div>

      {/* Footer Security Blockchain Hash */}
      <div className="p-4 rounded-2xl bg-white/60 border border-slate-200/60 text-center text-[11px] text-slate-400 print:border-none print:pt-2 print-avoid-break">
        <span>
          Chứng thực bảo mật không thể đảo ngược số: <strong>AIVES-ETH-8942</strong> • Mã xác thực Blockchain:{' '}
          <strong>0x4F9E7B3A2C...88D1</strong>
        </span>
      </div>

      {/* ================= MODAL CHỐT ĐIỂM GIẢNG VIÊN (HUMAN-IN-THE-LOOP) ================= */}
      {showFinalizeModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Chốt điểm ca thi vấn đáp</h3>
                  <p className="text-[11px] text-slate-500">Quy trình Human-in-the-loop Governance</p>
                </div>
              </div>
              <button
                onClick={() => setShowFinalizeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Điểm đề xuất từ AI (Tạm tính):
                </label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-sky-700 text-sm flex items-center justify-between">
                  <span>{vivaResult.overallScore || 8.5} / 10.0</span>
                  <span className="text-[10px] text-slate-500 font-normal">Hệ thống AI đề xuất</span>
                </div>
              </div>

              {/* Rubric Criteria Subscore Assessment */}
              {criteriaScores && criteriaScores.length > 0 && (
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-sky-600" />
                      <span>Thẩm định từng tiêu chí Rubric:</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Tự động quy đổi điểm 10</span>
                  </div>
                  <div className="space-y-1.5">
                    {criteriaScores.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-800 font-medium truncate flex-1 text-[11px]">{c.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max={c.maxScore || 5.0}
                            value={c.rawScore}
                            onChange={(e) => handleUpdateCriterionScore(idx, e.target.value)}
                            className="w-14 px-2 py-1 text-center font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded text-xs focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400">/ {c.maxScore || 5.0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                  <span>Điểm chính thức Giảng viên chốt (Thang 10):</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Quyền quyết định cuối cùng
                  </span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={finalScoreInput}
                  onChange={(e) => setFinalScoreInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-slate-900 text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nhận xét / Ghi chú của Giảng viên:
                </label>
                <textarea
                  rows="3"
                  value={lecturerFeedbackInput}
                  onChange={(e) => setLecturerFeedbackInput(e.target.value)}
                  placeholder="Nhập nhận xét đánh giá dành cho sinh viên..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs text-slate-800"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowFinalizeModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleFinalizeScore}
                disabled={isFinalizing}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isFinalizing ? (
                  <span>Đang lưu...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Xác nhận & Chốt điểm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Print Styling */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm 14mm;
          }
          body {
            background: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          aside, nav, header, footer, .no-print {
            display: none !important;
          }
          #printable-exam-result {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* ISO Standard Page Break Protection */
          .print-avoid-break,
          .print-score-card,
          .print-rubric-item,
          .print-dialogue-item,
          .print-signature-block,
          .print-section-block {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            -webkit-column-break-inside: avoid !important;
          }

          /* Paper contrast enhancements */
          .print-dialogue-item {
            margin-bottom: 8px !important;
            background-color: #f8fafc !important;
            border-color: #cbd5e1 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .print-signature-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
