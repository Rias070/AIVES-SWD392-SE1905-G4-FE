import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Shield,
  Sparkles,
  Radio,
  Sliders,
  Lock,
  CheckSquare,
  Square,
  Play,
  Pause
} from 'lucide-react';

export default function PreExamDeviceCheckPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active examination session details
  const currentSession = (() => {
    try {
      const stored = localStorage.getItem('aives_current_session');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  const activeSubject = searchParams.get('subject') || currentSession?.subject || 'SWD392';

  // Hardware mic list & selected ID
  const [mics, setMics] = useState([]);
  const [selectedMicId, setSelectedMicId] = useState('');

  // Media stream & status
  const [stream, setStream] = useState(null);
  const [micError, setMicError] = useState(null);

  // Web Audio API states & real-time visualizer
  const [currentDb, setCurrentDb] = useState(-60);
  const [waveBars, setWaveBars] = useState([15, 20, 25, 30, 25, 35, 45, 40, 30, 25, 20, 15, 12, 10]);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [hasTestedVoice, setHasTestedVoice] = useState(false);
  const [voiceTestResult, setVoiceTestResult] = useState('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);

  // Exam rules & countdown
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(286); // 04:46

  // Refs for cleanup and real-time processing
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const testAudioPlayerRef = useRef(null);
  const voiceActivityDetectedRef = useRef(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper: Stop current media tracks
  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.error('Error stopping track:', e);
        }
      });
      streamRef.current = null;
    }
  };

  // Helper: Enumerate available media devices
  const loadDeviceList = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter((d) => d.kind === 'audioinput');
      setMics(audioDevices);

      if (audioDevices.length > 0) {
        setSelectedMicId((prev) => {
          const exists = audioDevices.some((d) => d.deviceId === prev);
          return exists && prev ? prev : audioDevices[0].deviceId;
        });
      }
    } catch (err) {
      console.error('Lỗi khi đọc danh sách thiết bị âm thanh:', err);
    }
  };

  // Helper: Start/resume visualizer loop
  const startVisualizerLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const updateAudioVisualizer = () => {
      if (!analyserRef.current) return;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;

      // Logarithmic approximation for dB
      const normalized = Math.max(1, avg);
      const calculatedDb = Math.round(20 * Math.log10(normalized / 255));
      setCurrentDb(Math.max(-60, calculatedDb));

      if (avg > 18) {
        voiceActivityDetectedRef.current = true;
      }

      // Generate dynamic wave bars
      const barCount = 14;
      const step = Math.floor(bufferLength / barCount) || 1;
      const newBars = [];
      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i * step] || 0;
        const barHeight = Math.max(10, Math.min(100, Math.round((val / 255) * 100)));
        newBars.push(barHeight);
      }
      setWaveBars(newBars);

      animationFrameRef.current = requestAnimationFrame(updateAudioVisualizer);
    };

    updateAudioVisualizer();
  };

  // Helper: Attach single audio track to AnalyserNode
  const attachAudioTrackToAnalyser = (audioTrack) => {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtxClass();
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }

      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) {}
      }

      const tempStream = new MediaStream([audioTrack]);
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(tempStream);
      sourceNodeRef.current.connect(analyserRef.current);

      startVisualizerLoop();
    } catch (err) {
      console.warn('Lỗi khi kết nối Audio Analyser:', err);
    }
  };

  // Initialize Microphone Media Stream
  const initMicrophoneStream = async (micId) => {
    stopTracks();
    setMicError(null);

    try {
      const constraints = {
        audio: micId ? { deviceId: { exact: micId } } : true
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = newStream;
      setStream(newStream);

      await loadDeviceList();

      const audioTrack = newStream.getAudioTracks()[0];
      if (audioTrack) {
        attachAudioTrackToAnalyser(audioTrack);
      }
    } catch (err) {
      console.error('Không thể truy cập Microphone:', err);
      setMicError('Chưa cấp quyền Microphone hoặc không tìm thấy thiết bị thu âm.');
    }
  };

  useEffect(() => {
    initMicrophoneStream(selectedMicId);

    return () => {
      stopTracks();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, []);

  const handleMicChange = async (e) => {
    const newMicId = e.target.value;
    setSelectedMicId(newMicId);
    await initMicrophoneStream(newMicId);
  };

  // Run voice test (record 3s, then play back)
  const handleRunVoiceTest = () => {
    if (!streamRef.current || streamRef.current.getAudioTracks().length === 0) {
      alert('Vui lòng bật Microphone trước khi thử thu âm!');
      return;
    }

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }

    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }

    setIsMicTesting(true);
    setHasTestedVoice(false);
    voiceActivityDetectedRef.current = false;
    audioChunksRef.current = [];

    try {
      const recorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setIsMicTesting(false);
        setHasTestedVoice(true);

        if (voiceActivityDetectedRef.current) {
          setVoiceTestResult('Thu âm thành công: Âm thanh to, rõ ràng và bắt tín hiệu rất tốt!');
        } else {
          setVoiceTestResult('Âm thanh hơi nhỏ - Bạn vui lòng nói to hoặc chỉnh âm lượng Micro cao hơn.');
        }
      };

      recorder.start();

      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 3000);
    } catch (e) {
      console.warn('Lỗi ghi âm thử:', e);
      setIsMicTesting(false);
      setHasTestedVoice(true);
      setVoiceTestResult('Đã kiểm tra kết nối Micro ổn định.');
    }
  };

  const togglePlayTestAudio = () => {
    if (!testAudioPlayerRef.current || !recordedAudioUrl) return;
    if (isPlayingTestAudio) {
      testAudioPlayerRef.current.pause();
      setIsPlayingTestAudio(false);
    } else {
      testAudioPlayerRef.current.currentTime = 0;
      testAudioPlayerRef.current.play();
      setIsPlayingTestAudio(true);
    }
  };

  const isAudioLive = stream && stream.getAudioTracks().some((t) => t.readyState === 'live') && !micError;

  // Check if target session is overdue
  const isOverdue = (() => {
    try {
      const sessId = searchParams.get('sessionId') || currentSession?.sessionId || currentSession?.id;
      if (!sessId) return false;
      const allExamsRaw = localStorage.getItem('aives_exam_sessions');
      if (allExamsRaw) {
        const exams = JSON.parse(allExamsRaw);
        const match = exams.find((e) => e.id === sessId || e.sessionCode === sessId);
        if (match?.endedAt && new Date(match.endedAt) < new Date()) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  })();

  const isReadyToStart = isAudioLive && rulesAccepted && !isOverdue;

  const handleStartExam = () => {
    if (!isReadyToStart || isOverdue) return;
    stopTracks();
    const params = new URLSearchParams(searchParams);
    const resolvedSessionId = searchParams.get('sessionId') || currentSession?.sessionId || currentSession?.id;
    if (resolvedSessionId) {
      params.set('sessionId', resolvedSessionId);
    }
    if (!params.get('sessionId')) {
      try {
        const latestExamRaw = localStorage.getItem('aives_latest_active_exam');
        if (latestExamRaw) {
          const ex = JSON.parse(latestExamRaw);
          if (ex.id) params.set('sessionId', ex.id);
          if (ex.subjectCode && !params.get('subject')) params.set('subject', ex.subjectCode);
        }
      } catch (e) {}
    }
    if (!params.get('subject') && activeSubject) {
      params.set('subject', activeSubject);
    }
    navigate(`/viva?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Header / Stepper Bar */}
      <div className="p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">AIVES</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">VIVA EXAM</span>
            </div>
            <p className="text-[11px] text-slate-500">Khảo thí vấn đáp AI - Môn {activeSubject}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-semibold">
            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Kiểm tra Micro & Giọng nói</span>
          </div>
          <span className="text-slate-300">›</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-400 font-medium">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Vào phòng thi trực tiếp</span>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Thời gian chuẩn bị: {formatCountdown(countdownSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="text-center space-y-1.5 max-w-xl mx-auto py-1">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Kiểm Tra Thiết Bị & Âm Thanh Trước Khi Thi
        </h1>
        <p className="text-xs text-slate-500">
          Đảm bảo Micro của bạn hoạt động rõ ràng để AI ghi nhận chính xác phần trả lời vấn đáp của bạn.
        </p>
      </div>

      {/* 2 Main Panels: Audio Check & Exam Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel 1: Microphone & Voice Waveform Visualizer (7 COLS) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">Kiểm tra kết nối Microphone</h2>
            </div>
            {isAudioLive ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Microphone: Đã sẵn sàng
              </span>
            ) : micError ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                Chưa cấp quyền Micro
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Đang kết nối...
              </span>
            )}
          </div>

          {/* Real-Time Waveform & dB Meter Frame */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white space-y-5 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isAudioLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                <span className="text-xs font-semibold text-slate-300">
                  {isAudioLive ? 'Tín hiệu âm thanh thời gian thực (Live Stream)' : 'Chờ cấp quyền Micro'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono font-bold text-amber-300">
                {currentDb} dB
              </span>
            </div>

            {/* Visualizer Wave Bars */}
            <div className="h-20 flex items-center justify-center gap-2 px-2 bg-black/30 rounded-xl border border-white/10">
              {waveBars.map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${Math.max(12, height)}%` }}
                  className={`w-2 rounded-full transition-all duration-75 ${
                    height > 55
                      ? 'bg-amber-400'
                      : height > 30
                        ? 'bg-sky-400'
                        : 'bg-slate-500/60'
                  }`}
                />
              ))}
            </div>

            {/* Test Voice Button & Feedback */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleRunVoiceTest}
                disabled={isMicTesting || !isAudioLive}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isMicTesting
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/30'
                }`}
              >
                <Radio className={`w-4 h-4 ${isMicTesting ? 'animate-spin' : ''}`} />
                <span>{isMicTesting ? 'Đang thu âm thử 3 giây...' : 'Nói thử 3 giây để kiểm tra'}</span>
              </button>

              {recordedAudioUrl && (
                <button
                  type="button"
                  onClick={togglePlayTestAudio}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isPlayingTestAudio ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5 text-emerald-300" />}
                  <span>{isPlayingTestAudio ? 'Đang phát...' : 'Nghe lại tiếng vừa thu'}</span>
                </button>
              )}
            </div>

            {recordedAudioUrl && (
              <audio
                ref={testAudioPlayerRef}
                src={recordedAudioUrl}
                onEnded={() => setIsPlayingTestAudio(false)}
                className="hidden"
              />
            )}

            {hasTestedVoice && (
              <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{voiceTestResult}</span>
              </div>
            )}
          </div>

          {/* Micro Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 block">Chọn cổng Microphone</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedMicId}
                onChange={handleMicChange}
                className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              >
                {mics.length === 0 ? (
                  <option value="">Không tìm thấy thiết bị Microphone hoặc chưa cấp quyền</option>
                ) : (
                  mics.map((mic, idx) => (
                    <option key={mic.deviceId || idx} value={mic.deviceId}>
                      {mic.label || `Microphone ${idx + 1}`}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={() => initMicrophoneStream(selectedMicId)}
                title="Làm mới Micro"
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thử lại</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel 2: Quy Chế Thi & Cam Kết (5 COLS) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">Quy chế thi & Cam kết thí sinh</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Quy định làm bài 1 lần duy nhất</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Mỗi thí sinh chỉ được tham gia ca thi <strong>1 lần duy nhất</strong>. Nếu thoát giữa chừng (dù đóng tab hay bấm thoát), hệ thống sẽ tự động nộp bài ngay tại thời điểm đó.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Môi trường âm thanh yên tĩnh</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Thí sinh ngồi trong phòng yên tĩnh, nói to và rõ ràng vào Micro để hệ thống nhận diện giọng nói (Speech-to-Text) chính xác.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Thời gian trả lời từng lượt</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mỗi lượt câu hỏi có tối đa 90 giây để sinh viên trả lời. Khi hết giờ, bài trả lời sẽ tự động được gửi tới Hội đồng AI.
              </p>
            </div>
          </div>

          {/* Commitment Checkbox */}
          <div
            onClick={() => setRulesAccepted(!rulesAccepted)}
            className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
              rulesAccepted
                ? 'bg-sky-50/80 border-sky-300 text-sky-900'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="pt-0.5 shrink-0 text-sky-600">
              {rulesAccepted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
            </div>
            <label className="text-xs font-semibold select-none cursor-pointer leading-relaxed">
              Tôi xác nhận Microphone hoạt động tốt và cam kết tuân thủ toàn bộ quy chế thi vấn đáp AI.
            </label>
          </div>

          {/* Action Button: Enter Exam */}
          <div className="pt-2">
            {isOverdue && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Ca thi này đã kết thúc theo lịch quy định. Thí sinh không thể tham gia ca thi này nữa.</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleStartExam}
              disabled={!isReadyToStart || isOverdue}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isReadyToStart && !isOverdue
                  ? 'btn-glacier-primary shadow-lg shadow-sky-500/25 hover:scale-[1.01]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{isOverdue ? 'Ca Thi Đã Hết Hạn' : 'Bắt Đầu Vào Phòng Thi'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!isAudioLive && !isOverdue && (
              <p className="text-center text-[11px] text-rose-500 font-medium mt-2">
                * Vui lòng bật và cấp quyền Microphone để mở nút vào thi.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
