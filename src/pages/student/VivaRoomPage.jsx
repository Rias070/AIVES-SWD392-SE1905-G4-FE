import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

// Finite State Machine States
const STATES = {
  AI_SPEAKING: 'AI_SPEAKING',
  STUDENT_ANSWERING: 'STUDENT_ANSWERING',
  AI_THINKING: 'AI_THINKING',
  FOLLOW_UP: 'FOLLOW_UP',
  FINISHED: 'FINISHED'
};

// Supported Languages Configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'vi-VN', label: 'Tiếng Việt', shortLabel: 'VIE', flag: '🇻🇳', googleLang: 'vi' },
  { code: 'en-US', label: 'English', shortLabel: 'ENG', flag: '🇺🇸', googleLang: 'en' },
  { code: 'ja-JP', label: '日本語', shortLabel: 'JPN', flag: '🇯🇵', googleLang: 'ja' }
];

// Multilingual Question Bank & Speech Content
const MULTILANG_CONTENT = {
  'vi-VN': {
    initialQuestion: {
      title:
        'Hãy phân tích ưu và nhược điểm của thuật toán Dijkstra khi áp dụng cho đồ thị có trọng số âm, và giải thích tại sao thuật toán Bellman-Ford lại giải quyết được vấn đề này?',
      bloom: 'Bloom 4 & 5 - Phân tích & Đánh giá'
    },
    greeting:
      'Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn CS301. Mời bạn lắng nghe câu hỏi đầu tiên.',
    closing:
      'Cảm ơn thí sinh đã hoàn thành xuất sắc ca thi vấn đáp. Hệ thống AI đang tổng hợp kết quả.',
    placeholder: 'Hãy nói câu trả lời của bạn vào micro...',
    defaultAnswer:
      'Dạ thưa Hội đồng, thuật toán Dijkstra áp dụng chiến lược tham lam Greedy. Khi một đỉnh đã xét xong, Dijkstra mặc định khoảng cách đó là tối ưu vĩnh viễn và không cập nhật lại. Nếu có cạnh trọng số âm thì kết quả sẽ sai lệch, trong khi Bellman-Ford duyệt V-1 lần giúp phát hiện và cập nhật đường đi chính xác.',
    aiThinkingText:
      'Đang phân tích cấu trúc luận điểm, đối chiếu rubric và trích xuất câu hỏi xoáy phản biện...',
    adaptiveFollowUps: [
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
    ],
    fallbackFollowUps: [
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
    ]
  },
  'en-US': {
    initialQuestion: {
      title:
        "Please analyze the pros and cons of Dijkstra's algorithm when applied to graphs with negative edge weights, and explain why Bellman-Ford solves this issue.",
      bloom: 'Bloom 4 & 5 - Analysis & Evaluation'
    },
    greeting:
      'Welcome candidate! The AI Viva Board is commencing the CS301 oral examination. Please listen carefully to the first question.',
    closing:
      'Thank you for completing the oral viva exam. The AI examination system is compiling your evaluation results.',
    placeholder: 'Speak your answer clearly into the microphone...',
    defaultAnswer:
      "Dear Examination Board, Dijkstra's algorithm relies on a greedy strategy. Once a vertex is settled, it assumes that the calculated shortest path is permanently optimal and never revisited. In the presence of negative weights, this assumption fails. In contrast, Bellman-Ford relaxes all edges V-1 times, correctly handling negative edge weights and detecting negative weight cycles.",
    aiThinkingText:
      'Analyzing response arguments, benchmarking against rubric criteria, and formulating counter-question...',
    adaptiveFollowUps: [
      {
        keywords: ['negative', 'cycle', 'negative cycle', 'weight', 'weights'],
        question:
          'You mentioned negative weight cycles. How does the Bellman-Ford algorithm detect the presence of a negative cycle in a graph? What is the maximum number of relaxations and why?',
        bloom: 'Bloom 5 - Critical Evaluation'
      },
      {
        keywords: ['greedy', 'settle', 'settled', 'vertex', 'minimal', 'choice'],
        question:
          "Precisely, the greedy nature of Dijkstra. Once a vertex is settled, why can't Dijkstra revisit or update its distance if a negative edge appears subsequently? Provide a brief counterexample.",
        bloom: 'Bloom 4 - Logical Analysis'
      },
      {
        keywords: ['heap', 'priority queue', 'fibonacci', 'complexity', 'decrease-key', 'log'],
        question:
          'In terms of data structure optimization, why is Fibonacci Heap theoretically superior to Binary Heap in Dijkstra? How does Decrease-Key complexity improve?',
        bloom: 'Bloom 4 - Data Structure Mastery'
      },
      {
        keywords: ['bellman', 'relax', 'relaxation', 'v - 1', 'spfa', 'edges'],
        question:
          'In Bellman-Ford, why must we relax all edges exactly V - 1 times? What conclusion can be drawn if edge distances continue to decrease after V - 1 iterations?',
        bloom: 'Bloom 3 - Algorithm Application'
      }
    ],
    fallbackFollowUps: [
      {
        question:
          'To evaluate further: in a graph where a negative cycle exists but is unreachable from the source vertex, how is Bellman-Ford’s outcome affected?',
        bloom: 'Bloom 5 - Advanced Inquiry'
      },
      {
        question:
          'Final counter-question: If the graph is a Directed Acyclic Graph (DAG) with negative edge weights, can we use Topological Sort to achieve O(V + E) complexity instead of Bellman-Ford?',
        bloom: 'Bloom 6 - Optimization & Design'
      }
    ]
  },
  'ja-JP': {
    initialQuestion: {
      title:
        '負の重みを持つグラフにダイクストラ法を適用した場合のメリットとデメリットを分析し、ベルマン・フォード法がなぜこの問題を解決できるのかを説明してください。',
      bloom: 'Bloom 4 & 5 - 分析と評価'
    },
    greeting:
      '受験者の皆さん、こんにちは！AI口頭試問委員会によるCS301口頭試問を開始します。最初の質問をお聞きください。',
    closing:
      '口頭試問の受験お疲れ様でした。AI採点システムが現在評価結果を集計しています。',
    placeholder: 'マイクに向かって回答をお話しください...',
    defaultAnswer:
      '試問委員会の皆様、ダイクストラ法は貪欲法（グリーディ手法）を採用しており、一度確定した頂点の最短距離は最適であると仮定して再探索を行いません。そのため負の重みがある場合、最適解が得られない問題が生じます。一方、ベルマン・フォード法は全エッジをV-1回緩和（Relaxation）することで負の重みを正しく処理し、負閉路の検出も可能です。',
    aiThinkingText:
      '受験者の論点を分析し、ルーブリックと照合して深掘り反論質問を生成しています...',
    adaptiveFollowUps: [
      {
        keywords: ['負', '閉路', 'サイクル', 'マイナス', '重み', '負閉路'],
        question:
          '負の重みを持つ閉路（負閉路）について言及されましたね。ベルマン・フォード法はグラフ内に負の閉路が存在することをどのように検出し判定しますか？最大反復回数は何回で、それはなぜですか？',
        bloom: 'Bloom 5 - 批判的評価'
      },
      {
        keywords: ['貪欲', 'グリーディ', '確定', '頂点', '最小', '選択'],
        question:
          'ダイクストラ法の貪欲（グリーディ）な性質そのものですね。一度確定（Settled）した頂点に対し、後から負の重みの辺が見つかった場合、なぜ再更新できないのでしょうか？簡単な反例を挙げて説明してください。',
        bloom: 'Bloom 4 - 論理分析'
      },
      {
        keywords: ['ヒープ', '優先度付きキュー', 'フィボナッチ', '計算量', 'decrease-key', '二分'],
        question:
          'データ構造の最適化の観点から、ダイクストラ法においてフィボナッチヒープが二分ヒープより優れている理由は何ですか？Decrease-Key操作の計算量はどのように改善されますか？',
        bloom: 'Bloom 4 - データ構造理論'
      },
      {
        keywords: ['ベルマン', '緩和', 'リラクゼーション', 'v-1', '反復', 'v - 1'],
        question:
          'ベルマン・フォード法において、なぜすべての辺を正確に (V - 1) 回緩和（Relaxation）する必要があるのでしょうか？(V - 1) 回の緩和後も距離が更新され続ける場合、グラフについて何が言えますか？',
        bloom: 'Bloom 3 - アルゴリズム応用'
      }
    ],
    fallbackFollowUps: [
      {
        question:
          'さらに深く考察してみましょう。始点から到達不能な負閉路が存在する場合、ベルマン・フォード法の探索結果にはどのような影響がありますか？',
        bloom: 'Bloom 5 - 応用試問'
      },
      {
        question:
          '最終試問です：負の重みの辺を含んでいても、グラフが有向非巡回グラフ（DAG）である場合、ベルマン・フォード法の代わりにトポロジカルソートを用いて O(V + E) で解くことは可能ですか？',
        bloom: 'Bloom 6 - 最適化と創造'
      }
    ]
  }
};

export default function VivaRoomPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Language Resolution: URL param -> localStorage -> default 'vi-VN'
  const getInitialLang = () => {
    const urlLang = searchParams.get('lang');
    if (urlLang) {
      const l = urlLang.toLowerCase();
      if (l === 'vi' || l === 'vi-vn') return 'vi-VN';
      if (l === 'en' || l === 'en-us') return 'en-US';
      if (l === 'ja' || l === 'ja-jp') return 'ja-JP';
    }
    const saved = localStorage.getItem('aives_exam_lang');
    if (saved && (saved === 'vi-VN' || saved === 'en-US' || saved === 'ja-JP')) {
      return saved;
    }
    return 'vi-VN';
  };

  const [examLang, setExamLang] = useState(getInitialLang);
  const examLangRef = useRef(examLang);
  examLangRef.current = examLang;

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
    const langContent = MULTILANG_CONTENT[getInitialLang()] || MULTILANG_CONTENT['vi-VN'];
    return {
      title: langContent.initialQuestion.title,
      bloom: langContent.initialQuestion.bloom
    };
  });

  // Dialogue History
  const [dialogue, setDialogue] = useState(() => {
    const langContent = MULTILANG_CONTENT[getInitialLang()] || MULTILANG_CONTENT['vi-VN'];
    return [
      {
        sender: 'ai',
        time: '14:02:15',
        text: langContent.greeting
      }
    ];
  });

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
  const currentAudioRef = useRef(null);

  // Voice Diagnostic Modal State
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [detectedVoices, setDetectedVoices] = useState([]);
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
      }
    };
  }, []);

  // Pre-load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const vList = window.speechSynthesis.getVoices();
        setDetectedVoices(vList);
      };
      updateVoices();
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      };
    }
  }, []);

  // Stop both SpeechSynthesis and Google TTS Audio stream
  const stopAllSpeech = () => {
    isSpeechSynthesizingRef.current = false;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) { }
      currentAudioRef.current = null;
    }
  };

  // Helper: Find voice matching target language code
  const findVoiceForLang = (availableVoices, langCode) => {
    if (!availableVoices || availableVoices.length === 0) return null;
    const targetPrefix = langCode.split('-')[0].toLowerCase(); // 'vi', 'en', 'ja'
    const fullTarget = langCode.toLowerCase().replace('_', '-');

    // 1. Exact match on BCP-47 tag (e.g. 'vi-vn', 'en-us', 'ja-jp')
    const exactMatch = availableVoices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      return code === fullTarget;
    });
    if (exactMatch) return exactMatch;

    // 2. Starts with target prefix (e.g. 'vi-', 'en-', 'ja-')
    const prefixMatch = availableVoices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      return code.startsWith(`${targetPrefix}-`) || code === targetPrefix;
    });
    if (prefixMatch) return prefixMatch;

    // 3. Language specific name keywords
    if (targetPrefix === 'vi') {
      return availableVoices.find((v) => {
        const name = (v.name || '').toLowerCase();
        return (
          name.includes('tiếng việt') ||
          name.includes('vietnam') ||
          name.includes('vietnamese') ||
          name.includes('hoaimy') ||
          name.includes('namminh')
        );
      });
    }

    if (targetPrefix === 'ja') {
      return availableVoices.find((v) => {
        const name = (v.name || '').toLowerCase();
        return (
          name.includes('japanese') ||
          name.includes('japan') ||
          name.includes('haruka') ||
          name.includes('ayumi') ||
          name.includes('ichiro') ||
          name.includes('sayaka') ||
          name.includes('kyoko') ||
          name.includes('otoya')
        );
      });
    }

    if (targetPrefix === 'en') {
      return availableVoices.find((v) => {
        const name = (v.name || '').toLowerCase();
        return (
          name.includes('english') ||
          name.includes('david') ||
          name.includes('zira') ||
          name.includes('mark') ||
          name.includes('george') ||
          name.includes('samantha')
        );
      });
    }

    return null;
  };

  // Online Google TTS fallback (Guarantees 100% natural native audio in vi, en, ja if OS lacks offline voice)
  const speakWithGoogleTTS = (text, langCode, onFinished) => {
    const gLang = MULTILANG_CONTENT[langCode]?.googleLang || langCode.split('-')[0] || 'vi';

    // Split text into natural sentences / phrases (under 140 chars)
    const rawChunks =
      text.match(/[^.?!,;:\n。！？、；：]+[.?!,;:\n。！？、；：]+|[^.?!,;:\n。！？、；：]+/g) || [text];
    const chunks = [];
    let current = '';

    for (const part of rawChunks) {
      if ((current + ' ' + part).trim().length <= 140) {
        current = (current + ' ' + part).trim();
      } else {
        if (current) chunks.push(current);
        current = part.trim();
      }
    }
    if (current) chunks.push(current);

    let idx = 0;
    const playNextChunk = () => {
      if (!isSpeechSynthesizingRef.current) return;
      if (idx >= chunks.length) {
        isSpeechSynthesizingRef.current = false;
        if (onFinished) onFinished();
        return;
      }

      const chunk = chunks[idx];
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${gLang}&client=tw-ob&q=${encodeURIComponent(
        chunk
      )}`;
      const audio = new Audio(url);
      currentAudioRef.current = audio;

      audio.onended = () => {
        idx++;
        setTimeout(playNextChunk, 160);
      };

      audio.onerror = (e) => {
        console.warn('Google TTS audio chunk error:', e);
        idx++;
        playNextChunk();
      };

      audio.play().catch((err) => {
        console.warn('Audio play blocked or network error:', err);
        isSpeechSynthesizingRef.current = false;
        if (onFinished) onFinished();
      });
    };

    playNextChunk();
  };

  // Main Speech Function: checks local voice, if absent -> automatically uses Google TTS
  const speakText = (text, onFinished, explicitLang) => {
    stopAllSpeech();
    isSpeechSynthesizingRef.current = true;

    const targetLang = explicitLang || examLangRef.current || 'vi-VN';
    const voices = 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
    const voice = findVoiceForLang(voices, targetLang);

    if (voice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang || targetLang;
      utterance.rate = targetLang.startsWith('ja') ? 1.0 : 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        isSpeechSynthesizingRef.current = false;
        if (onFinished) onFinished();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error, falling back to Google TTS:', e);
        speakWithGoogleTTS(text, targetLang, onFinished);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.log(
        `Không tìm thấy voice offline cho ${targetLang} trên máy tính -> Tự động dùng Google TTS (${targetLang})`
      );
      speakWithGoogleTTS(text, targetLang, onFinished);
    }
  };

  const speakAIQuestion = (text, onFinished, explicitLang) => {
    speakText(text, onFinished, explicitLang || examLangRef.current);
  };

  // Speech-To-Text (STT) Native Function
  const startSpeechRecognition = (overrideLang) => {
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

      const activeLang = overrideLang || examLangRef.current || 'vi-VN';
      const recognition = new SpeechRecognitionClass();
      recognition.lang = activeLang;
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

    const langContent = MULTILANG_CONTENT[newLang] || MULTILANG_CONTENT['vi-VN'];

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
    stopAllSpeech();
    setFsmState(STATES.STUDENT_ANSWERING);
    setLiveTranscript('');
    startSpeechRecognition(examLangRef.current);
  };

  // Student clicks "Hoàn thành câu trả lời" or Timer expires
  const handleCompleteAnswer = () => {
    stopAllSpeech();
    stopSpeechRecognition();
    setFsmState(STATES.AI_THINKING);

    const activeLangPack = MULTILANG_CONTENT[examLangRef.current] || MULTILANG_CONTENT['vi-VN'];
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

    // AI Thinking Delay (1.8s) before follow-up or finished
    setTimeout(() => {
      if (speechTurnRef.current >= maxTurns) {
        // Exam Finished!
        finishExamSession();
      } else {
        // Generate Adaptive Follow-up in active language
        generateFollowUpQuestion(studentAnswer);
      }
    }, 1800);
  };

  // Mock Engine sinh câu hỏi xoáy thích ứng dựa trên từ khóa câu trả lời
  const generateFollowUpQuestion = (answerText) => {
    const lower = answerText.toLowerCase();
    const langPack = MULTILANG_CONTENT[examLangRef.current] || MULTILANG_CONTENT['vi-VN'];
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
  };

  // Finish exam and navigate to /exam-result
  const finishExamSession = () => {
    setFsmState(STATES.FINISHED);
    const langPack = MULTILANG_CONTENT[examLangRef.current] || MULTILANG_CONTENT['vi-VN'];

    const latestResult = {
      examCode: 'CS301-VIVA-2026-99127',
      courseName: 'CS301: Cấu trúc Dữ liệu & Giải thuật',
      studentName: 'Nguyễn Văn An',
      examLang: examLangRef.current,
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
        examLangRef.current === 'ja-JP'
          ? '負閉路の検出とフィボナッチヒープの最適化に関する深掘り試問に対し、論理的かつ的確に回答できています。'
          : examLangRef.current === 'en-US'
          ? 'The candidate demonstrated sharp problem-solving skills regarding negative weight cycles and heap structures. Arguments were coherent and well-structured.'
          : 'Thí sinh phản xạ nhanh với các câu hỏi xoáy về chu trình âm và tối ưu cấu trúc Heap trong Dijkstra. Lập luận chặt chẽ và mạch lạc.'
    };

    try {
      localStorage.setItem('latest_viva_result', JSON.stringify(latestResult));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Speak closing message in active exam language
    speakAIQuestion(langPack.closing, () => {
      navigate('/exam-result');
    });

    // Timeout fallback if speech is cancelled/blocked
    setTimeout(() => {
      navigate('/exam-result');
    }, 2800);
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

  const currentLangPack = MULTILANG_CONTENT[examLang] || MULTILANG_CONTENT['vi-VN'];

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

        {/* Middle Status Indicators & Language Selector */}
        <div className="flex items-center gap-3 md:gap-4 text-xs flex-wrap">
          {/* ============ LANGUAGE SWITCHER PILLS ============ */}
          <div className="flex items-center p-1 bg-slate-100/90 border border-slate-200/90 rounded-xl gap-1 shadow-2xs">
            {SUPPORTED_LANGUAGES.map((langItem) => {
              const isActive = examLang === langItem.code;
              return (
                <button
                  key={langItem.code}
                  onClick={() => handleLanguageChange(langItem.code)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-xs border border-sky-200/80 font-bold scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                  title={`Chuyển ngôn ngữ thi sang ${langItem.label}`}
                >
                  <span className="text-sm leading-none">{langItem.flag}</span>
                  <span className="hidden sm:inline">{langItem.label}</span>
                  <span className="sm:hidden text-[10px]">{langItem.shortLabel}</span>
                </button>
              );
            })}
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
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) {
                setDetectedVoices(window.speechSynthesis.getVoices());
              }
              setShowVoiceModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Xem danh sách giọng đọc AI và chẩn đoán TTS"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">
              Giọng: {findVoiceForLang(detectedVoices, examLang) ? 'Voice Máy' : 'Google TTS'}
            </span>
          </button>

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
                  <span className="text-sky-800">
                    AI Giám khảo đang đọc ({SUPPORTED_LANGUAGES.find((l) => l.code === examLang)?.label})...
                  </span>
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                </>
              )}
              {fsmState === STATES.STUDENT_ANSWERING && (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  <span className="text-rose-800">
                    Sinh viên đang trả lời ({SUPPORTED_LANGUAGES.find((l) => l.code === examLang)?.label} - Mic Đang Thu)
                  </span>
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
              Hệ thống AI Speech-To-Text & TTS thời gian thực • Hỗ trợ Tiếng Việt, English & 日本語 • Rubric: Chính xác giải thuật (40%), Tư duy phản biện (30%), Diễn đạt (30%)
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
              disabled={fsmState !== STATES.STUDENT_ANSWERING}
              className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                fsmState === STATES.STUDENT_ANSWERING
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
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                <Languages className="w-3 h-3 text-sky-600" />
                <span>STT: {examLang}</span>
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
                          ? item.isMainQuestion
                            ? 'AI Giám khảo • Câu hỏi vấn đáp'
                            : 'AI Giám khảo'
                          : 'Bạn (Thí sinh)'}
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
                      Bản ghi trực tiếp giọng nói thí sinh ({examLang})
                    </span>
                    <span className="text-slate-400 italic">Đang nhận diện giọng nói...</span>
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
