import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Bookmark,
  Sparkles,
  Bot,
  User,
  Radio,
  LogOut,
  Maximize2,
  Eye,
  Camera,
  FastForward,
  Play,
  Square,
  ShieldCheck,
  Cpu
} from 'lucide-react';

// Finite State Machine States
const STATES = {
  AI_SPEAKING: 'AI_SPEAKING',
  STUDENT_ANSWERING: 'STUDENT_ANSWERING',
  AI_THINKING: 'AI_THINKING',
  FOLLOW_UP: 'FOLLOW_UP',
  FINISHED: 'FINISHED'
};

// Adaptive follow-up question bank for CS301
const ADAPTIVE_FOLLOW_UPS = [
  {
    keywords: ['âm', 'chu trình âm', 'negative', 'trọng số âm'],
    question:
      'Bạn vừa nhắc đến chu trình trọng số âm. Vậy thuật toán Bellman-Ford làm thế nào để phát hiện được sự tồn tại của chu trình âm trong đồ thị? Số lần duyệt tối đa là bao nhiêu và tại sao?',
    bloom: 'Bloom 5 - Đánh giá phản biện'
  },
  {
    keywords: ['tham lam', 'greedy', 'chọn đỉnh', 'nhỏ nhất'],
    question:
      'Chính xác là tính tham lam của Dijkstra. Khi một đỉnh đã cố định khoảng cách (settled), tại sao Dijkstra không thể quay lại cập nhật nếu gặp cạnh có trọng số âm phía sau? Hãy nêu một ví dụ phản chứng ngắn gọn.',
    bloom: 'Bloom 4 - Phân tích logic'
  },
  {
    keywords: ['heap', 'hàng đợi', 'priority queue', 'độ phức tạp', 'log'],
    question:
      'Về mặt tối ưu hóa cấu trúc dữ liệu, tại sao việc dùng Fibonacci Heap lại tối ưu hơn Binary Heap trong Dijkstra? Thao tác Decrease-Key giảm độ phức tạp từ bao nhiêu xuống bao nhiêu?',
    bloom: 'Bloom 4 - Cấu trúc dữ liệu'
  },
  {
    keywords: ['bellman', 'nới lỏng', 'relax', 'spfa'],
    question:
      'Trong Bellman-Ford, tại sao ta cần nới lỏng (Relaxation) đúng V - 1 lần cho toàn bộ các cạnh? Nếu sau V - 1 lần mà khoảng cách vẫn tiếp tục giảm thì kết luận điều gì về đồ thị?',
    bloom: 'Bloom 3 - Áp dụng giải thuật'
  }
];

const FALLBACK_FOLLOW_UPS = [
  {
    question:
      'Để đánh giá sâu hơn, theo bạn trong trường hợp đồ thị có chu trình trọng số âm nhưng không tiếp cận được từ đỉnh nguồn (unreachable), kết quả của Bellman-Ford sẽ bị ảnh hưởng như thế nào?',
    bloom: 'Bloom 5 - Phản biện nâng cao'
  },
  {
    question:
      'Câu hỏi phản biện tổng kết: Nếu đồ thị là DAG (đồ thị có hướng không chu trình) nhưng vẫn có trọng số âm, ta có thể dùng thuật toán sắp xếp Topo (Topological Sort) để đạt độ phức tạp O(V + E) thay vì Bellman-Ford không?',
    bloom: 'Bloom 6 - Sáng tạo & Tối ưu'
  }
];

export default function VivaRoomPage() {
  const navigate = useNavigate();

  // FSM State
  const [fsmState, setFsmState] = useState(STATES.AI_SPEAKING);
  const fsmStateRef = useRef(fsmState);
  fsmStateRef.current = fsmState;

  // Turn management (1 to 3)
  const [speechTurn, setSpeechTurn] = useState(1);
  const maxTurns = 3;

  // Current Question
  const [currentQuestion, setCurrentQuestion] = useState({
    title:
      'Hãy phân tích ưu và nhược điểm của thuật toán Dijkstra khi áp dụng cho đồ thị có trọng số âm, và giải thích tại sao thuật toán Bellman-Ford lại giải quyết được vấn đề này?',
    bloom: 'Bloom: Phân tích & Đánh giá'
  });

  // Dialogue History
  const [dialogue, setDialogue] = useState([
    {
      sender: 'ai',
      time: '14:02:15',
      text: 'Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn CS301. Mời bạn lắng nghe câu hỏi đầu tiên.'
    }
  ]);

  // STT Live Transcript
  const [liveTranscript, setLiveTranscript] = useState('');
  const liveTranscriptRef = useRef('');
  liveTranscriptRef.current = liveTranscript;

  // Timers
  const [timerSeconds, setTimerSeconds] = useState(1122); // 18:42 exam countdown
  const [turnSeconds, setTurnSeconds] = useState(90); // 90s answer timer
  const [isMarked, setIsMarked] = useState(false);
  const [micLevel, setMicLevel] = useState(15);

  // Audio & Media Refs
  const pipVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const transcriptBottomRef = useRef(null);
  const isSpeechSynthesizingRef = useRef(false);

  // Auto-scroll transcript to bottom
  const scrollToBottom = () => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dialogue, liveTranscript, fsmState]);

  // Main Exam Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Answer Turn Countdown Timer (runs only in STUDENT_ANSWERING)
  useEffect(() => {
    let turnTimer;
    if (fsmState === STATES.STUDENT_ANSWERING) {
      setTurnSeconds(90);
      turnTimer = setInterval(() => {
        setTurnSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(turnTimer);
            handleCompleteAnswer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(turnTimer);
  }, [fsmState]);

  // Setup Webcam PIP & Audio Volume Meter
  useEffect(() => {
    let isCancelled = false;

    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        mediaStreamRef.current = stream;
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = stream;
        }

        // Web Audio API for real-time Mic Volume
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass && stream.getAudioTracks().length > 0) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const avg = sum / bufferLength;
            // Map 0-255 to percentage 10-100
            const level = Math.max(10, Math.min(100, Math.round((avg / 128) * 100)));
            setMicLevel(level);

            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      } catch (err) {
        console.warn('Webcam/Microphone access error:', err);
      }
    };

    setupMedia();

    return () => {
      isCancelled = true;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => { });
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) { }
      }
    };
  }, []);

  // Text-To-Speech (TTS) Native Function
  const speakAIQuestion = (text, onFinished) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Browser does not support SpeechSynthesis');
      if (onFinished) onFinished();
      return;
    }

    window.speechSynthesis.cancel();
    isSpeechSynthesizingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick best Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => {
      isSpeechSynthesizingRef.current = false;
      if (onFinished) onFinished();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      isSpeechSynthesizingRef.current = false;
      if (onFinished) onFinished();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Speech-To-Text (STT) Native Function
  const startSpeechRecognition = () => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      console.warn('Trình duyệt không hỗ trợ Web SpeechRecognition');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) { }
      }

      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'vi-VN';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setLiveTranscript(transcript.trim());
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
      };

      recognition.onend = () => {
        // Automatically keep alive while student is in answering state
        if (fsmStateRef.current === STATES.STUDENT_ANSWERING) {
          try {
            recognition.start();
          } catch (e) { }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Lỗi khi bắt đầu nhận diện giọng nói:', err);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
    }
  };

  // Trigger AI Speaking on mount or when current question changes
  useEffect(() => {
    if (fsmState === STATES.AI_SPEAKING) {
      // Add Question to Dialogue
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setDialogue((prev) => [
        ...prev,
        {
          sender: 'ai',
          time: timeStr,
          text: currentQuestion.title,
          isMainQuestion: true
        }
      ]);

      // Speak question via TTS
      speakAIQuestion(currentQuestion.title, () => {
        transitionToStudentAnswering();
      });
    }
  }, [currentQuestion]);

  // Transition to STUDENT_ANSWERING
  const transitionToStudentAnswering = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setFsmState(STATES.STUDENT_ANSWERING);
    setLiveTranscript('');
    startSpeechRecognition();
  };

  // Student clicks "Hoàn thành câu trả lời" or Timer expires
  const handleCompleteAnswer = () => {
    stopSpeechRecognition();
    setFsmState(STATES.AI_THINKING);

    const studentAnswer =
      liveTranscriptRef.current.trim() ||
      'Dạ thưa Hội đồng, thuật toán Dijkstra áp dụng chiến lược tham lam Greedy. Khi một đỉnh đã xét xong, Dijkstra mặc định khoảng cách đó là tối ưu vĩnh viễn và không cập nhật lại. Nếu có cạnh trọng số âm thì kết quả sẽ sai lệch, trong khi Bellman-Ford duyệt V-1 lần giúp phát hiện và cập nhật đường đi chính xác.';

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Add student's response to dialogue
    setDialogue((prev) => [
      ...prev,
      {
        sender: 'student',
        time: timeStr,
        text: studentAnswer
      }
    ]);

    // AI Thinking Delay (1.8s) before follow-up or finished
    setTimeout(() => {
      if (speechTurn >= maxTurns) {
        // Exam Finished!
        finishExamSession();
      } else {
        // Generate Adaptive Follow-up
        generateFollowUpQuestion(studentAnswer);
      }
    }, 1800);
  };

  // Mock Engine sinh câu hỏi xoáy thích ứng dựa trên từ khóa câu trả lời
  const generateFollowUpQuestion = (answerText) => {
    const lower = answerText.toLowerCase();
    let selected = null;

    // Search keyword match
    for (const item of ADAPTIVE_FOLLOW_UPS) {
      if (item.keywords.some((k) => lower.includes(k))) {
        selected = item;
        break;
      }
    }

    // Fallback if no specific keyword matched
    if (!selected) {
      const fallbackIdx = (speechTurn - 1) % FALLBACK_FOLLOW_UPS.length;
      selected = FALLBACK_FOLLOW_UPS[fallbackIdx];
    }

    setSpeechTurn((prev) => prev + 1);
    setCurrentQuestion({
      title: selected.question,
      bloom: selected.bloom || 'Bloom: Phản biện thích ứng'
    });
    setFsmState(STATES.AI_SPEAKING);
  };

  // Finish exam and navigate to /exam-result
  const finishExamSession = () => {
    setFsmState(STATES.FINISHED);

    const latestResult = {
      examCode: 'CS301-VIVA-2026-99127',
      courseName: 'CS301: Cấu trúc Dữ liệu & Giải thuật',
      studentName: 'Nguyễn Văn An',
      completedAt: new Date().toISOString(),
      turnsCompleted: maxTurns,
      overallScore: 8.5,
      dialogueHistory: dialogue,
      rubricScores: [
        { name: 'Tính chính xác giải thuật & Cấu trúc', score: '4.5 / 5.0' },
        { name: 'Khả năng phản biện câu hỏi xoáy', score: '4.0 / 5.0' },
        { name: 'Diễn đạt lưu loát & Tự tin', score: '4.5 / 5.0' }
      ],
      aiFeedback:
        'Thí sinh phản xạ nhanh với các câu hỏi xoáy về chu trình âm và tối ưu cấu trúc Heap trong Dijkstra. Lập luận chặt chẽ và mạch lạc.'
    };

    try {
      localStorage.setItem('latest_viva_result', JSON.stringify(latestResult));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Speak closing message
    speakAIQuestion(
      'Cảm ơn thí sinh đã hoàn thành xuất sắc ca thi vấn đáp. Hệ thống AI đang tổng hợp kết quả.',
      () => {
        navigate('/exam-result');
      }
    );

    // Timeout fallback if speech is cancelled/blocked
    setTimeout(() => {
      navigate('/exam-result');
    }, 2500);
  };

  const handleManualExit = () => {
    if (window.confirm('Bạn có chắc chắn muốn nộp bài sớm và kết thúc ca thi vấn đáp để AI chấm điểm?')) {
      finishExamSession();
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 max-w-[1550px] mx-auto pb-8 animate-fade-in">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="p-3.5 px-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">ExamRoom Intelligence</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">AI VIVA</span>
            </div>
            <p className="text-[11px] text-slate-500">Môn: CS301 - Cấu trúc dữ liệu & Giải thuật</p>
          </div>
        </div>

        {/* Middle Status Indicators */}
        <div className="flex items-center gap-3 md:gap-4 text-xs">
          {/* Main Exam Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{formatTime(timerSeconds)} còn lại</span>
          </div>

          {/* Turn Countdown Timer */}
          {fsmState === STATES.STUDENT_ANSWERING && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold animate-pulse">
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span>Thời gian nói: {turnSeconds}s</span>
            </div>
          )}

          {/* Turn Counter */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
            <span>Lượt hỏi xoáy: {speechTurn} / {maxTurns}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((turn) => (
                <span
                  key={turn}
                  className={`w-2 h-2 rounded-full transition-colors ${turn <= speechTurn ? 'bg-sky-600' : 'bg-slate-300'
                    }`}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualExit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kết thúc ca thi</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN EXAM LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ================= LEFT COLUMN: AI EXAMINER ORB & QUESTION (7 COLS) ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Question Card */}
          <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  LƯỢT HỎI {speechTurn} / {maxTurns}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentQuestion.bloom}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                Vấn đáp trực tiếp
              </span>
            </div>

            <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.title}
            </h2>
          </div>

          {/* Glowing AI Examiner Avatar Orb Stage */}
          <div className="relative min-h-[380px] rounded-3xl bg-gradient-to-b from-sky-50/40 via-white/80 to-sky-50/30 border border-sky-100 shadow-xs flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Ambient Background Glow Circles */}
            <div
              className={`absolute w-80 h-80 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700 ${fsmState === STATES.AI_SPEAKING
                  ? 'bg-cyan-300/40 scale-125 animate-pulse'
                  : fsmState === STATES.AI_THINKING
                    ? 'bg-indigo-300/40 scale-110 animate-spin'
                    : 'bg-sky-200/30'
                }`}
            ></div>

            {/* Concentric Pulsing Ripples */}
            <div className="relative flex items-center justify-center">
              {/* Ripple Ring 1 */}
              <div
                className={`absolute w-64 h-64 rounded-full border border-sky-300/40 transition-all duration-500 ${fsmState === STATES.AI_SPEAKING ? 'animate-ping opacity-40' : 'opacity-20'
                  }`}
              ></div>

              {/* Ripple Ring 2 */}
              <div
                className={`absolute w-52 h-52 rounded-full border border-cyan-400/50 transition-all duration-500 ${fsmState === STATES.AI_SPEAKING ? 'scale-110 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : ''
                  }`}
              ></div>

              {/* Ripple Ring 3 */}
              <div className="absolute w-40 h-40 rounded-full border-2 border-sky-400/60 shadow-[0_0_24px_rgba(2,132,199,0.25)]"></div>

              {/* Central Glowing AI Orb */}
              <div
                className={`w-28 h-28 rounded-full p-1 flex items-center justify-center transition-all duration-500 ${fsmState === STATES.AI_SPEAKING
                    ? 'bg-gradient-to-tr from-sky-500 via-cyan-400 to-blue-500 shadow-[0_0_45px_rgba(6,182,212,0.8)] scale-105'
                    : fsmState === STATES.AI_THINKING
                      ? 'bg-gradient-to-tr from-indigo-500 via-purple-400 to-sky-400 shadow-[0_0_40px_rgba(99,102,241,0.7)] animate-pulse'
                      : 'bg-gradient-to-tr from-sky-400 via-slate-300 to-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                  }`}
              >
                <div className="w-full h-full rounded-full bg-white/95 backdrop-blur-md flex flex-col items-center justify-center space-y-1 shadow-inner">
                  {fsmState === STATES.AI_THINKING ? (
                    <Cpu className="w-8 h-8 text-indigo-600 animate-spin" />
                  ) : (
                    <Bot
                      className={`w-8 h-8 text-sky-600 ${fsmState === STATES.AI_SPEAKING ? 'animate-bounce' : ''
                        }`}
                    />
                  )}
                  <div className="flex items-center gap-0.5">
                    <span
                      className={`w-1 rounded-full bg-cyan-500 ${fsmState === STATES.AI_SPEAKING
                          ? 'h-4 animate-pulse'
                          : fsmState === STATES.STUDENT_ANSWERING
                            ? 'h-2'
                            : 'h-1'
                        }`}
                    ></span>
                    <span
                      className={`w-1 rounded-full bg-sky-500 ${fsmState === STATES.AI_SPEAKING
                          ? 'h-6 animate-pulse delay-75'
                          : fsmState === STATES.STUDENT_ANSWERING
                            ? 'h-3'
                            : 'h-2'
                        }`}
                    ></span>
                    <span
                      className={`w-1 rounded-full bg-blue-500 ${fsmState === STATES.AI_SPEAKING
                          ? 'h-3 animate-pulse delay-150'
                          : fsmState === STATES.STUDENT_ANSWERING
                            ? 'h-2'
                            : 'h-1'
                        }`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current State Status Badge */}
            <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200 shadow-sm text-xs font-semibold">
              {fsmState === STATES.AI_SPEAKING && (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-600 animate-bounce" />
                  <span className="text-sky-800">AI Giám khảo đang đọc câu hỏi...</span>
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                </>
              )}
              {fsmState === STATES.STUDENT_ANSWERING && (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  <span className="text-rose-800">Sinh viên đang trả lời (Mic Đang Thu)</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </>
              )}
              {fsmState === STATES.AI_THINKING && (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span className="text-indigo-800">AI đang phân tích câu trả lời & chuẩn bị câu hỏi xoáy...</span>
                </>
              )}
              {fsmState === STATES.FINISHED && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800">Ca thi hoàn thành! Đang tổng hợp điểm...</span>
                </>
              )}
            </div>

            {/* Meta text */}
            <p className="mt-3 text-[11px] text-slate-500 text-center max-w-md">
              Hệ thống AI Speech-To-Text & TTS thời gian thực • Rubric: Chính xác giải thuật (40%), Tư duy phản biện (30%), Diễn đạt (30%)
            </p>
          </div>

          {/* Bottom Controls Bar */}
          <div className="p-3 md:px-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Skip reading button when AI is speaking */}
              {fsmState === STATES.AI_SPEAKING ? (
                <button
                  onClick={transitionToStudentAnswering}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Bỏ qua đọc (Bắt đầu nói ngay)</span>
                </button>
              ) : (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${fsmState === STATES.STUDENT_ANSWERING
                      ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                      : 'bg-slate-100 text-slate-600'
                    }`}
                >
                  {fsmState === STATES.STUDENT_ANSWERING ? (
                    <Mic className="w-4 h-4 animate-pulse" />
                  ) : (
                    <MicOff className="w-4 h-4" />
                  )}
                  <span>{fsmState === STATES.STUDENT_ANSWERING ? 'Mic Đang Thu' : 'Mic Khóa'}</span>
                </div>
              )}

              {/* Repeat Question Button */}
              <button
                onClick={() => speakAIQuestion(currentQuestion.title)}
                disabled={fsmState === STATES.AI_THINKING}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Nhắc lại đề</span>
              </button>

              {/* Mark Question */}
              <button
                onClick={() => setIsMarked(!isMarked)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${isMarked
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isMarked ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
              </button>
            </div>

            {/* Complete Answer Button */}
            <button
              onClick={handleCompleteAnswer}
              disabled={fsmState !== STATES.STUDENT_ANSWERING}
              className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${fsmState === STATES.STUDENT_ANSWERING
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:from-sky-700 hover:to-cyan-700 shadow-md shadow-sky-500/25 hover:scale-[1.02]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoàn thành câu trả lời</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: REAL-TIME TRANSCRIPT & CAMERA PIP (5 COLS) ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Transcript Panel */}
          <div className="flex-1 p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 min-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Real-time Transcript
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Web Speech API: vi-VN
              </span>
            </div>

            {/* Dialogue Stream */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[360px]">
              {dialogue.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${item.sender === 'student' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.sender === 'ai'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-cyan-100 text-cyan-700'
                      }`}
                  >
                    {item.sender === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`flex-1 rounded-xl p-3 text-xs space-y-1 ${item.sender === 'ai'
                        ? item.isMainQuestion
                          ? 'bg-sky-50 border border-sky-200'
                          : 'bg-slate-50 border border-slate-100'
                        : 'bg-sky-50/50 border border-sky-100'
                      }`}
                  >
                    <div
                      className={`flex items-center justify-between text-[10px] ${item.sender === 'ai' ? 'text-slate-400' : 'text-sky-800'
                        }`}
                    >
                      <span className="font-bold">
                        {item.sender === 'ai'
                          ? item.isMainQuestion
                            ? 'AI Giám khảo • Câu hỏi vấn đáp'
                            : 'AI Giám khảo'
                          : 'Bạn (Thí sinh)'}
                      </span>
                      <span>{item.time}</span>
                    </div>
                    <p
                      className={`leading-relaxed ${item.isMainQuestion ? 'font-semibold text-slate-900' : 'text-slate-700'
                        }`}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}

              {/* Current Active Live Speech Recording Frame */}
              {fsmState === STATES.STUDENT_ANSWERING && (
                <div className="p-3.5 rounded-xl bg-white border-2 border-rose-400 shadow-sm space-y-1.5 animate-pulse">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-rose-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      Bản ghi trực tiếp giọng nói thí sinh
                    </span>
                    <span className="text-slate-400 italic">Đang nhận diện giọng nói...</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-sans min-h-[30px]">
                    {liveTranscript || (
                      <span className="text-slate-400 italic">
                        Hãy nói câu trả lời của bạn vào micro...
                      </span>
                    )}
                    <span className="inline-block w-1.5 h-3.5 bg-rose-600 ml-1 animate-pulse align-middle"></span>
                  </p>
                </div>
              )}

              {/* AI Thinking Bubble */}
              {fsmState === STATES.AI_THINKING && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="flex-1 bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-xs space-y-1">
                    <span className="font-bold text-indigo-800 text-[10px]">AI Giám khảo</span>
                    <p className="text-indigo-700 italic">
                      Đang phân tích cấu trúc luận điểm, đối chiếu rubric và trích xuất câu hỏi xoáy phản biện...
                    </p>
                  </div>
                </div>
              )}

              <div ref={transcriptBottomRef}></div>
            </div>

            {/* Bottom Audio Meter & Floating Real Camera PIP */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
              {/* Mic Audio Level Meter */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-medium flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    Âm lượng mic
                  </span>
                  <span className="font-mono font-bold text-sky-700">
                    {fsmState === STATES.STUDENT_ANSWERING ? `${micLevel}%` : 'Muted'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-100 ${fsmState === STATES.STUDENT_ANSWERING
                        ? 'bg-gradient-to-r from-emerald-400 via-sky-500 to-cyan-500'
                        : 'bg-slate-300'
                      }`}
                    style={{
                      width: `${fsmState === STATES.STUDENT_ANSWERING ? micLevel : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Floating Real Camera PIP Thumbnail */}
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-md shrink-0 group">
                <video
                  ref={pipVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-[8px] font-mono text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  LIVE
                </div>
                <div className="absolute inset-1.5 border border-cyan-400/80 rounded pointer-events-none"></div>
                <div className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-[8px] font-mono text-cyan-300">
                  LOCKED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
