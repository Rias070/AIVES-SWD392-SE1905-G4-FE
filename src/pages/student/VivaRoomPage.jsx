import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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
  Cpu,
  Languages,
  Globe,
  X
} from 'lucide-react';
import { subjectApi } from '../../services/api';

import {
  STATES,
  SUPPORTED_LANGUAGES,
  COURSE_CATALOG,
  COURSE_MULTILANG_CONTENT,
  getCourseContent,
  MULTILANG_CONTENT
} from '../../domain/vivaConstants';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

// Re-export constants for backward compatibility with dependent pages
export {
  STATES,
  SUPPORTED_LANGUAGES,
  COURSE_CATALOG,
  COURSE_MULTILANG_CONTENT,
  getCourseContent,
  MULTILANG_CONTENT
};

export default function VivaRoomPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active session and course resolution from localStorage / URL
  const currentSession = (() => {
    try {
      const stored = localStorage.getItem('aives_current_session');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  const rawSubject = searchParams.get('subject') || currentSession?.subject || 'CS301';
  const activeSubject = (rawSubject || 'CS301').toUpperCase();

  // Language Resolution: Subject Config -> Session Config -> Subject LocalCache -> URL Param -> default 'vi-VN'
  const getInitialLang = () => {
    if (currentSession?.language) {
      const sl = currentSession.language.toLowerCase();
      if (sl.startsWith('en')) return 'en-US';
      if (sl.startsWith('vi')) return 'vi-VN';
    }
    if (activeSubject) {
      const subjectConfig = localStorage.getItem(`aives_subject_lang_${activeSubject}`);
      if (subjectConfig) {
        if (subjectConfig.toLowerCase().startsWith('en')) return 'en-US';
        if (subjectConfig.toLowerCase().startsWith('vi')) return 'vi-VN';
      }
    }
    const urlLang = searchParams.get('lang');
    if (urlLang) {
      const l = urlLang.toLowerCase();
      if (l === 'vi' || l === 'vi-vn') return 'vi-VN';
      if (l === 'en' || l === 'en-us') return 'en-US';
    }
    return 'vi-VN';
  };

  const [examLang, setExamLang] = useState(getInitialLang);
  const examLangRef = useRef(examLang);
  examLangRef.current = examLang;

  // Stable UUID for real-time WebSocket STOMP exam room
  const sessionUuid = useRef((() => {
    const urlId = searchParams.get('sessionId') || searchParams.get('id');
    if (urlId && /^[0-9a-fA-F-]{36}$/.test(urlId)) return urlId;
    if (currentSession?.sessionId && /^[0-9a-fA-F-]{36}$/.test(currentSession.sessionId)) return currentSession.sessionId;
    if (currentSession?.id && /^[0-9a-fA-F-]{36}$/.test(currentSession.id)) return currentSession.id;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  })()).current;

  // Real-time STOMP WebSocket Client & Turn Score Tracking
  const stompClientRef = useRef(null);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const turnScoresRef = useRef([]);
  const [turnScores, setTurnScores] = useState([]);
  const handleWsTurnResponseRef = useRef(null);

  // Dynamic Subject Language Synchronization from Backend
  useEffect(() => {
    let isMounted = true;
    const syncSubjectLanguage = async () => {
      try {
        const res = await subjectApi.getSubjectByCode(activeSubject);
        const subjData = res?.data?.result || res?.data;
        if (isMounted && subjData?.language) {
          const resolvedLang = subjData.language.toLowerCase().startsWith('en') ? 'en-US' : 'vi-VN';
          localStorage.setItem(`aives_subject_lang_${activeSubject}`, resolvedLang);
          if (resolvedLang !== examLangRef.current) {
            setExamLang(resolvedLang);
            examLangRef.current = resolvedLang;
            const updatedContent = getCourseContent(activeSubject, resolvedLang);
            if (speechTurnRef.current === 1) {
              setCurrentQuestion({
                title: updatedContent.initialQuestion.title,
                bloom: updatedContent.initialQuestion.bloom
              });
            }
          }
        }
      } catch (err) {
        console.warn('[AIVES VivaRoom] Subject language config fetch warning:', err);
      }
    };
    syncSubjectLanguage();
    return () => { isMounted = false; };
  }, [activeSubject]);

  const catalogEntry = COURSE_CATALOG[activeSubject] || {
    code: activeSubject,
    name: activeSubject === 'AI204' ? 'Học máy & Thị giác máy tính' : activeSubject === 'SE102' ? 'Kiến trúc Phần mềm' : 'Cấu trúc Dữ liệu & Giải thuật'
  };
  const activeCourseName = currentSession?.courseName || `${catalogEntry.code}: ${catalogEntry.name}`;

  // FSM State
  const [fsmState, setFsmState] = useState(STATES.AI_SPEAKING);
  const fsmStateRef = useRef(fsmState);
  fsmStateRef.current = fsmState;

  // Turn management (1 to 3)
  const [speechTurn, setSpeechTurn] = useState(1);
  const speechTurnRef = useRef(1);
  speechTurnRef.current = speechTurn;
  const maxTurns = 3;

  // Current Question
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const langContent = getCourseContent(activeSubject, getInitialLang());
    return {
      title: langContent.initialQuestion.title,
      bloom: langContent.initialQuestion.bloom
    };
  });

  // Dialogue History
  const [dialogue, setDialogue] = useState(() => {
    const langContent = getCourseContent(activeSubject, getInitialLang());
    return [
      {
        sender: 'ai',
        time: '14:02:15',
        text: langContent.greeting
      }
    ];
  });

  // Application Layer: Custom Hooks for Clean Architecture Speech Engine
  const {
    liveTranscript,
    setLiveTranscript,
    isListening,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition
  } = useSpeechToText({ lang: examLang });

  const {
    isSpeaking,
    detectedVoices,
    speakText,
    stopAllSpeech,
    findVoiceForLang
  } = useTextToSpeech({ defaultLang: examLang, subjectCode: activeSubject });

  const speakAIQuestion = (text, onFinished, explicitLang) => {
    speakText(text, onFinished, explicitLang || examLangRef.current);
  };

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
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const transcriptBottomRef = useRef(null);

  // Synchronization & Lifecycle Refs (Anti-race condition & safe cleanup)
  const isProcessingTurnRef = useRef(false);
  const isManuallyStoppedRef = useRef(false);

  // Voice Diagnostic Modal State
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceTestStatus, setVoiceTestStatus] = useState('');

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

  // STOMP WebSocket Room Connection & Subscription
  useEffect(() => {
    let isMounted = true;
    const wsUrl = 'http://localhost:8080/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        if (!isMounted) return;
        setIsWsConnected(true);
        console.log(`[AIVES STOMP] Connected to room: /topic/exam/${sessionUuid}`);

        client.subscribe(`/topic/exam/${sessionUuid}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log('[AIVES STOMP] Received AI turn payload:', data);
            handleWsTurnResponseRef.current?.(data);
          } catch (e) {
            console.error('[AIVES STOMP] Parse error on incoming turn message:', e);
          }
        });
      },
      onDisconnect: () => {
        if (isMounted) setIsWsConnected(false);
      },
      onStompError: (frame) => {
        console.warn('[AIVES STOMP] Broker error:', frame.headers['message']);
        if (isMounted) setIsWsConnected(false);
      },
      onWebSocketClose: () => {
        if (isMounted) setIsWsConnected(false);
      }
    });

    try {
      client.activate();
      stompClientRef.current = client;
    } catch (err) {
      console.warn('[AIVES STOMP] Activation caught:', err);
    }

    return () => {
      isMounted = false;
      if (stompClientRef.current) {
        try {
          stompClientRef.current.deactivate();
        } catch (e) { }
        stompClientRef.current = null;
      }
    };
  }, [sessionUuid]);

  // Answer Turn Countdown Timer (runs only in STUDENT_ANSWERING)
  useEffect(() => {
    let turnTimer;
    if (fsmState === STATES.STUDENT_ANSWERING) {
      setTurnSeconds(90);
      turnTimer = setInterval(() => {
        setTurnSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(turnTimer);
            if (!isProcessingTurnRef.current) {
              handleCompleteAnswer();
            }
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
      isManuallyStoppedRef.current = true;
      stopAllSpeech();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => { });
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) { }
        recognitionRef.current = null;
      }
    };
  }, []);

  // Dynamic Language Switching Handler
  const handleLanguageChange = (newLang) => {
    if (newLang === examLang) return;

    stopAllSpeech();
    setExamLang(newLang);
    examLangRef.current = newLang;
    try {
      localStorage.setItem('aives_exam_lang', newLang);
    } catch (e) { }

    // Sync URL parameter
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const shortCode = newLang === 'vi-VN' ? 'vi' : newLang === 'en-US' ? 'en' : 'ja';
        next.set('lang', shortCode);
        return next;
      },
      { replace: true }
    );

    const langContent = getCourseContent(activeSubject, newLang);

    // Update active question according to speech turn
    if (speechTurn === 1) {
      setCurrentQuestion({
        title: langContent.initialQuestion.title,
        bloom: langContent.initialQuestion.bloom
      });

      // Update dialogue greeting and first question
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setDialogue([
        {
          sender: 'ai',
          time: timeStr,
          text: langContent.greeting
        },
        {
          sender: 'ai',
          time: timeStr,
          text: langContent.initialQuestion.title,
          isMainQuestion: true
        }
      ]);

      if (fsmState === STATES.AI_SPEAKING) {
        speakAIQuestion(langContent.initialQuestion.title, () => {
          transitionToStudentAnswering();
        }, newLang);
      }
    } else {
      // If during turn 2 or 3, select question from corresponding language pack
      const followUps = langContent.adaptiveFollowUps;
      const fallbacks = langContent.fallbackFollowUps;
      const targetFollow =
        followUps[(speechTurn - 2) % followUps.length] || fallbacks[0];

      setCurrentQuestion({
        title: targetFollow.question,
        bloom: targetFollow.bloom
      });

      if (fsmState === STATES.AI_SPEAKING) {
        speakAIQuestion(targetFollow.question, () => {
          transitionToStudentAnswering();
        }, newLang);
      }
    }

    // If currently answering, restart recognition with newly chosen language
    if (fsmState === STATES.STUDENT_ANSWERING) {
      startSpeechRecognition(newLang);
    }
  };

  // Trigger AI Speaking on initial mount or when question changes
  useEffect(() => {
    if (fsmState === STATES.AI_SPEAKING) {
      // Speak question via TTS
      speakAIQuestion(currentQuestion.title, () => {
        transitionToStudentAnswering();
      });
    }
  }, [currentQuestion]);

  // Transition to STUDENT_ANSWERING
  const transitionToStudentAnswering = () => {
    isProcessingTurnRef.current = false;
    stopAllSpeech();
    setFsmState(STATES.STUDENT_ANSWERING);
    setLiveTranscript('');
    startSpeechRecognition(examLangRef.current);
  };

  // Handle broadcasted AI turn evaluation from Backend WebSocket STOMP (/topic/exam/{sessionId})
  const handleWsTurnResponse = (wsData) => {
    if (!wsData) return;

    const suggestedScore = wsData.suggestedScore != null ? Number(wsData.suggestedScore) : 8.5;
    const aiEval = wsData.aiEvaluation || 'Đánh giá AI: Luận điểm rõ ràng, phản xạ vấn đáp tốt.';
    const followup = wsData.followupQuestion;
    const bloom = wsData.bloomLevel || 'Bloom 4 - Phân tích';
    const isLast = wsData.lastTurn || speechTurnRef.current >= maxTurns;

    const newScore = {
      turnOrder: wsData.turnOrder || speechTurnRef.current,
      score: suggestedScore,
      aiEvaluation: aiEval,
      bloomLevel: bloom,
      ragContextSnippets: wsData.ragContextSnippets || []
    };
    turnScoresRef.current = [...turnScoresRef.current, newScore];
    setTurnScores([...turnScoresRef.current]);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    if (isLast) {
      finishExamSession(turnScoresRef.current, aiEval);
    } else {
      setSpeechTurn((prev) => prev + 1);

      setDialogue((prev) => [
        ...prev,
        {
          sender: 'ai',
          time: timeStr,
          text: followup,
          isMainQuestion: true
        }
      ]);

      setCurrentQuestion({
        title: followup,
        bloom: bloom
      });

      setFsmState(STATES.AI_SPEAKING);
      isProcessingTurnRef.current = false;

      // Speak adaptive follow-up immediately via Web Speech TTS
      speakAIQuestion(followup, () => {
        transitionToStudentAnswering();
      });
    }
  };
  handleWsTurnResponseRef.current = handleWsTurnResponse;

  // Student clicks "Hoàn thành câu trả lời" or Timer expires
  const handleCompleteAnswer = () => {
    if (isProcessingTurnRef.current) return;
    isProcessingTurnRef.current = true;

    stopAllSpeech();
    stopSpeechRecognition();
    setFsmState(STATES.AI_THINKING);

    const activeLangPack = getCourseContent(activeSubject, examLangRef.current);
    const studentAnswer = liveTranscriptRef.current.trim() || activeLangPack.defaultAnswer;

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

    const turnData = {
      sessionId: sessionUuid,
      questionUuid: null,
      questionContent: currentQuestion.title,
      turnOrder: speechTurnRef.current,
      studentTranscript: studentAnswer,
      studentAnswer: studentAnswer,
      turnDurationSeconds: 90 - turnSeconds,
      examLang: examLangRef.current
    };

    let sentViaWs = false;
    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        stompClientRef.current.publish({
          destination: `/app/exam/${sessionUuid}/submit-turn`,
          body: JSON.stringify(turnData)
        });
        sentViaWs = true;
        console.log(`[AIVES STOMP] Sent turn #${speechTurnRef.current} to /app/exam/${sessionUuid}/submit-turn`);
      } catch (wsErr) {
        console.warn('[AIVES STOMP] Publish error:', wsErr);
      }
    }

    // Safety fallback: if STOMP message doesn't receive a response within 6.5s or offline, execute local fallback
    if (sentViaWs) {
      const turnSnapshot = speechTurnRef.current;
      setTimeout(() => {
        if (isProcessingTurnRef.current && speechTurnRef.current === turnSnapshot && fsmStateRef.current === STATES.AI_THINKING) {
          console.warn('[AIVES STOMP] Response timeout, activating local reasoning fallback');
          executeLocalTurnFallback(studentAnswer);
        }
      }, 6500);
    } else {
      setTimeout(() => {
        executeLocalTurnFallback(studentAnswer);
      }, 1600);
    }
  };

  const executeLocalTurnFallback = (studentAnswer) => {
    const mockScore = Number((7.8 + Math.random() * 1.6).toFixed(1));
    const newScore = {
      turnOrder: speechTurnRef.current,
      score: mockScore,
      aiEvaluation: 'Đánh giá AI: Luận điểm tốt, lập luận tự tin và phản xạ nhanh.',
      bloomLevel: 'Bloom 4 - Phân tích'
    };
    turnScoresRef.current = [...turnScoresRef.current, newScore];
    setTurnScores([...turnScoresRef.current]);

    if (speechTurnRef.current >= maxTurns) {
      finishExamSession(turnScoresRef.current);
    } else {
      generateFollowUpQuestion(studentAnswer);
    }
  };

  // Mock Engine sinh câu hỏi xoáy thích ứng dựa trên từ khóa câu trả lời
  const generateFollowUpQuestion = (answerText) => {
    const lower = answerText.toLowerCase();
    const langPack = getCourseContent(activeSubject, examLangRef.current);
    let selected = null;

    // Search keyword match in active language
    for (const item of langPack.adaptiveFollowUps) {
      if (item.keywords.some((k) => lower.includes(k.toLowerCase()))) {
        selected = item;
        break;
      }
    }

    // Fallback if no specific keyword matched
    if (!selected) {
      const fallbackIdx = (speechTurnRef.current - 1) % langPack.fallbackFollowUps.length;
      selected = langPack.fallbackFollowUps[fallbackIdx];
    }

    setSpeechTurn((prev) => prev + 1);

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
        text: selected.question,
        isMainQuestion: true
      }
    ]);

    setCurrentQuestion({
      title: selected.question,
      bloom: selected.bloom || 'Bloom: Phản biện thích ứng'
    });

    setFsmState(STATES.AI_SPEAKING);
    isProcessingTurnRef.current = false;
  };

  // Finish exam and navigate to /exam-result
  const finishExamSession = (customTurnScores, customFeedback) => {
    isProcessingTurnRef.current = false;
    setFsmState(STATES.FINISHED);
    const langPack = getCourseContent(activeSubject, examLangRef.current);

    const scoresToUse = customTurnScores || turnScoresRef.current || [];
    let avgScore = 8.5;
    if (scoresToUse.length > 0) {
      const sum = scoresToUse.reduce((acc, curr) => acc + (Number(curr.score) || 8.0), 0);
      avgScore = Number((sum / scoresToUse.length).toFixed(1));
    }

    const latestResult = {
      sessionId: sessionUuid,
      examCode: currentSession?.examId || `${activeSubject}-VIVA-2026-99127`,
      courseName: activeCourseName,
      subjectCode: activeSubject,
      studentName: 'Nguyễn Văn An',
      studentId: 'SE190504',
      examLang: examLangRef.current,
      completedAt: new Date().toISOString(),
      turnsCompleted: maxTurns,
      overallScore: avgScore,
      turnScores: scoresToUse.length > 0 ? scoresToUse : [
        { turnOrder: 1, score: 8.5, bloomLevel: 'Bloom 4 - Phân tích & Đánh giá' },
        { turnOrder: 2, score: 8.0, bloomLevel: 'Bloom 5 - Phản biện phản hồi' },
        { turnOrder: 3, score: 9.0, bloomLevel: 'Bloom 5 - Đánh giá chuyên sâu' }
      ],
      status: 'PENDING_LECTURER_CONFIRMATION',
      dialogueHistory: dialogue,
      rubricScores: [
        { name: 'Tính chính xác giải thuật & Cấu trúc', score: `${(avgScore * 0.5).toFixed(1)} / 5.0` },
        { name: 'Khả năng phản biện câu hỏi xoáy', score: `${(avgScore * 0.45).toFixed(1)} / 5.0` },
        { name: 'Diễn đạt lưu loát & Tự tin', score: `${(avgScore * 0.5).toFixed(1)} / 5.0` }
      ],
      aiFeedback: customFeedback || (
        activeSubject === 'AI204'
          ? (examLangRef.current === 'ja-JP'
              ? '過学習・学習不足のメカニズム、正則化手法（L1/L2）、およびCNNの畳み込み層の特性に関する質問に対し、学術的根拠に基づき非常に的確に回答できています。'
              : examLangRef.current === 'en-US'
              ? 'The candidate demonstrated deep understanding of the Bias-Variance tradeoff, regularization mechanisms (L1/L2, Dropout), and CNN architectural advantages. Excellent technical clarity.'
              : 'Thí sinh thể hiện hiểu biết sâu sắc về đánh đổi Bias-Variance, cơ chế Regularization (L1/L2, Dropout) và ưu thế của các lớp tích chập CNN. Lập luận chuẩn xác và tự tin.')
          : activeSubject === 'SE102'
          ? (examLangRef.current === 'ja-JP'
              ? 'マイクロサービスのデータ整合性維持、Sagaパターン（オーケストレーション対コレオグラフィ）、およびCAP定理のトレードオフに関する試問に対し、実践的なシステム設計能力を示しました。'
              : examLangRef.current === 'en-US'
              ? 'The candidate exhibited strong architectural maturity regarding eventual consistency, Saga pattern trade-offs, and CAP theorem implications in distributed environments.'
              : 'Thí sinh nắm rất vững nguyên lý thiết kế Microservices, cơ chế Saga Pattern với bù trừ giao dịch và đánh đổi trong định lý CAP. Tư duy kiến trúc hệ thống sắc bén.')
          : (examLangRef.current === 'ja-JP'
              ? '負閉路の検出とフィボナッチヒープの最適化に関する深掘り試問に対し、論理적かつ的確に回答できています。'
              : examLangRef.current === 'en-US'
              ? 'The candidate demonstrated sharp problem-solving skills regarding negative weight cycles and heap structures. Arguments were coherent and well-structured.'
              : 'Thí sinh phản xạ nhanh với các câu hỏi xoáy về chu trình âm và tối ưu cấu trúc Heap trong Dijkstra. Lập luận chặt chẽ và mạch lạc.')
      )
    };

    try {
      localStorage.setItem('latest_viva_result', JSON.stringify(latestResult));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    let navigated = false;
    const goToResult = () => {
      if (navigated) return;
      navigated = true;
      navigate('/exam-result');
    };

    // Speak closing message in active exam language
    speakAIQuestion(langPack.closing, goToResult);

    // Timeout fallback if speech is cancelled/blocked
    setTimeout(goToResult, 2800);
  };

  const handleManualExit = () => {
    const confirmMsg =
      examLang === 'ja-JP'
        ? '早期提出して試験を終了しますか？'
        : examLang === 'en-US'
        ? 'Are you sure you want to finish the exam session early and submit for grading?'
        : 'Bạn có chắc chắn muốn nộp bài sớm và kết thúc ca thi vấn đáp để AI chấm điểm?';

    if (window.confirm(confirmMsg)) {
      finishExamSession();
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentLangPack = getCourseContent(activeSubject, examLang);

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
            <p className="text-[11px] text-slate-500">Môn: {activeCourseName}</p>
          </div>
        </div>

        {/* Middle Status Indicators & Language Selector */}
        <div className="flex items-center gap-3 md:gap-4 text-xs flex-wrap">
          {/* ============ EXAM LANGUAGE BADGE (READ-ONLY, CONFIGURED BY SUBJECT) ============ */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="text-sm leading-none">{examLang === 'en-US' ? '🇺🇸' : '🇻🇳'}</span>
            <span className="text-slate-500 font-normal">Ngôn ngữ thi:</span>
            <span className="font-bold text-sky-700">{examLang === 'en-US' ? 'English (en-US)' : 'Tiếng Việt (vi-VN)'}</span>
          </div>

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
            <span>
              Lượt hỏi: {speechTurn} / {maxTurns}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((turn) => (
                <span
                  key={turn}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    turn <= speechTurn ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                ></span>
              ))}
            </div>
          </div>

          {/* Live Connection Indicator */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isWsConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isWsConnected ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span>{isWsConnected ? 'Trực tuyến' : 'Ngoại tuyến'}</span>
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <span>{SUPPORTED_LANGUAGES.find((l) => l.code === examLang)?.flag}</span>
                  <span>{examLang}</span>
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
              className={`absolute w-80 h-80 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700 ${
                fsmState === STATES.AI_SPEAKING
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
                className={`absolute w-64 h-64 rounded-full border border-sky-300/40 transition-all duration-500 ${
                  fsmState === STATES.AI_SPEAKING ? 'animate-ping opacity-40' : 'opacity-20'
                }`}
              ></div>

              {/* Ripple Ring 2 */}
              <div
                className={`absolute w-52 h-52 rounded-full border border-cyan-400/50 transition-all duration-500 ${
                  fsmState === STATES.AI_SPEAKING
                    ? 'scale-110 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : ''
                }`}
              ></div>

              {/* Ripple Ring 3 */}
              <div className="absolute w-40 h-40 rounded-full border-2 border-sky-400/60 shadow-[0_0_24px_rgba(2,132,199,0.25)]"></div>

              {/* Central Glowing AI Orb */}
              <div
                className={`w-28 h-28 rounded-full p-1 flex items-center justify-center transition-all duration-500 ${
                  fsmState === STATES.AI_SPEAKING
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
                      className={`w-8 h-8 text-sky-600 ${
                        fsmState === STATES.AI_SPEAKING ? 'animate-bounce' : ''
                      }`}
                    />
                  )}
                  <div className="flex items-center gap-0.5">
                    <span
                      className={`w-1 rounded-full bg-cyan-500 ${
                        fsmState === STATES.AI_SPEAKING
                          ? 'h-4 animate-pulse'
                          : fsmState === STATES.STUDENT_ANSWERING
                          ? 'h-2'
                          : 'h-1'
                      }`}
                    ></span>
                    <span
                      className={`w-1 rounded-full bg-sky-500 ${
                        fsmState === STATES.AI_SPEAKING
                          ? 'h-6 animate-pulse delay-75'
                          : fsmState === STATES.STUDENT_ANSWERING
                          ? 'h-3'
                          : 'h-2'
                      }`}
                    ></span>
                    <span
                      className={`w-1 rounded-full bg-blue-500 ${
                        fsmState === STATES.AI_SPEAKING
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
                  <span className="text-sky-800">Giám khảo đang đọc câu hỏi...</span>
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                </>
              )}
              {fsmState === STATES.STUDENT_ANSWERING && (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  <span className="text-rose-800">Đang ghi âm câu trả lời...</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </>
              )}
              {fsmState === STATES.AI_THINKING && (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span className="text-indigo-800">Đang xử lý câu trả lời...</span>
                </>
              )}
              {fsmState === STATES.FINISHED && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800">Ca thi hoàn thành</span>
                </>
              )}
            </div>
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
                  <span>Bắt đầu trả lời</span>
                </button>
              ) : (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    fsmState === STATES.STUDENT_ANSWERING
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  isMarked
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
              disabled={fsmState !== STATES.STUDENT_ANSWERING || isProcessingTurnRef.current}
              className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                fsmState === STATES.STUDENT_ANSWERING && !isProcessingTurnRef.current
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:from-sky-700 hover:to-cyan-700 shadow-md shadow-sky-500/25 hover:scale-[1.02]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nộp câu trả lời</span>
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
                  Nội dung đối thoại
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                <Languages className="w-3 h-3 text-sky-600" />
                <span>{examLang}</span>
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
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      item.sender === 'ai' ? 'bg-sky-100 text-sky-700' : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {item.sender === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`flex-1 rounded-xl p-3 text-xs space-y-1 ${
                      item.sender === 'ai'
                        ? item.isMainQuestion
                          ? 'bg-sky-50 border border-sky-200'
                          : 'bg-slate-50 border border-slate-100'
                        : 'bg-sky-50/50 border border-sky-100'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between text-[10px] ${
                        item.sender === 'ai' ? 'text-slate-400' : 'text-sky-800'
                      }`}
                    >
                      <span className="font-bold">
                        {item.sender === 'ai'
                          ? 'Giám khảo AI'
                          : 'Bạn'}
                      </span>
                      <span>{item.time}</span>
                    </div>
                    <p
                      className={`leading-relaxed ${
                        item.isMainQuestion ? 'font-semibold text-slate-900' : 'text-slate-700'
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
                      Câu trả lời của bạn ({examLang})
                    </span>
                    <span className="text-slate-400 italic">Đang ghi âm...</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-sans min-h-[30px]">
                    {liveTranscript || (
                      <span className="text-slate-400 italic">{currentLangPack.placeholder}</span>
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
                    <p className="text-indigo-700 italic">{currentLangPack.aiThinkingText}</p>
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
                    className={`h-full rounded-full transition-all duration-100 ${
                      fsmState === STATES.STUDENT_ANSWERING
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

      {/* ================= MODAL: VOICE & LANGUAGE DIAGNOSTICS ================= */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kiểm tra & Cấu hình giọng đọc AI</h3>
                  <p className="text-[11px] text-slate-500">
                    Trạng thái phát âm đa ngữ (Tiếng Việt, English, 日本語)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopAllSpeech();
                  setShowVoiceModal(false);
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Engine Status for each supported language */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Trạng thái giọng đọc cho từng ngôn ngữ:
              </span>
              {SUPPORTED_LANGUAGES.map((item) => {
                const voice = findVoiceForLang(detectedVoices, item.code);
                const isCurrent = examLang === item.code;
                return (
                  <div
                    key={item.code}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      isCurrent
                        ? 'bg-sky-50/70 border-sky-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{item.label}</span>
                          <span className="text-[10px] font-mono text-slate-500">({item.code})</span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-200 text-sky-800">
                              Đang chọn
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {voice ? (
                            <span className="text-emerald-700 font-medium">
                              Voice nội bộ: {voice.name}
                            </span>
                          ) : (
                            <span className="text-sky-700 font-medium">
                              Tự động dùng Google TTS ({item.googleLang})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setVoiceTestStatus(`Đang phát âm thanh (${item.label})...`);
                        const sampleText =
                          item.code === 'ja-JP'
                            ? '受験者の皆さん、こんにちは。こちらはAI面接官の音声です。'
                            : item.code === 'en-US'
                            ? 'Welcome candidate. This is the AI Viva voice examination system.'
                            : 'Xin chào thí sinh. Đây là giọng đọc trí tuệ nhân tạo của hội đồng AIVES.';
                        speakText(
                          sampleText,
                          () => {
                            setVoiceTestStatus(`Đã phát xong (${item.label})!`);
                            setTimeout(() => setVoiceTestStatus(''), 2000);
                          },
                          item.code
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3 text-sky-600" />
                      <span>Thử giọng</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {voiceTestStatus && (
              <p className="text-[11px] text-center font-semibold text-sky-600 animate-pulse">
                {voiceTestStatus}
              </p>
            )}

            {/* List of installed voices on machine */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-700 block">
                Các giọng đọc phát hiện trên trình duyệt ({detectedVoices.length} giọng):
              </span>
              <div className="max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono space-y-1">
                {detectedVoices.length > 0 ? (
                  detectedVoices.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-600">
                      <span className="truncate max-w-[280px]">{v.name}</span>
                      <span className="text-slate-400 shrink-0">[{v.lang}]</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">Đang tải danh sách giọng...</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  stopAllSpeech();
                  setShowVoiceModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
