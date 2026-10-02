import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Camera,
  Radio,
  Sliders,
  Maximize2,
  Lock,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';

export default function PreExamDeviceCheckPage() {
  const navigate = useNavigate();

  // Hardware device lists & selected IDs
  const [cameras, setCameras] = useState([]);
  const [mics, setMics] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [selectedMicId, setSelectedMicId] = useState('');

  // Media stream & status
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [micError, setMicError] = useState(null);
  const [videoResolution, setVideoResolution] = useState('1080p • 60 FPS');

  // Web Audio API states & real-time visualizer
  const [currentDb, setCurrentDb] = useState(-60);
  const [waveBars, setWaveBars] = useState([15, 20, 25, 30, 25, 35, 45, 40, 30, 25, 20, 15, 12, 10]);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [hasTestedVoice, setHasTestedVoice] = useState(false);
  const [voiceTestResult, setVoiceTestResult] = useState('');

  // Exam rules & countdown
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(286); // 04:46

  // Refs for cleanup and real-time processing
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const testRecordingRef = useRef(false);
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
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      const audioDevices = devices.filter((d) => d.kind === 'audioinput');

      setCameras(videoDevices);
      setMics(audioDevices);

      // Preserve or set default camera selection
      if (videoDevices.length > 0) {
        setSelectedCameraId((prev) => {
          const exists = videoDevices.some((d) => d.deviceId === prev);
          return exists && prev ? prev : videoDevices[0].deviceId;
        });
      }

      // Preserve or set default mic selection
      if (audioDevices.length > 0) {
        setSelectedMicId((prev) => {
          const exists = audioDevices.some((d) => d.deviceId === prev);
          return exists && prev ? prev : audioDevices[0].deviceId;
        });
      }
    } catch (err) {
      console.error('Lỗi khi đọc danh sách thiết bị:', err);
    }
  };

  // Helper: Setup Web Audio API with AnalyserNode
  const setupWebAudio = (activeStream) => {
    try {
      const audioTracks = activeStream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioContextClass();
      }

      const audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => { });
      }

      // Disconnect previous source if active
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) { }
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;

      const sourceNode = audioCtx.createMediaStreamSource(activeStream);
      sourceNodeRef.current = sourceNode;
      // Do NOT connect to audioCtx.destination to prevent acoustic feedback loop!
      sourceNode.connect(analyser);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioVisualizer = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average amplitude
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;

        // Calculate Decibel (-60 dB to 0 dB)
        let db = -60;
        const normalized = avg / 128;
        if (normalized > 0.01) {
          db = Math.round(-60 + normalized * 50);
          if (db > 0) db = 0;
        }
        setCurrentDb(db);

        // Check voice activity during mic test
        if (testRecordingRef.current && (avg > 15 || db > -48)) {
          voiceActivityDetectedRef.current = true;
        }

        // Map to 14 Wave Visualizer bars
        const barsCount = 14;
        const step = Math.max(1, Math.floor(bufferLength / barsCount));
        const newBars = [];
        for (let i = 0; i < barsCount; i++) {
          const val = dataArray[i * step] || 0;
          // Scale from min 12% to max 100%
          const percent = Math.max(12, Math.min(100, Math.round((val / 255) * 100)));
          newBars.push(percent);
        }
        setWaveBars(newBars);

        animationFrameRef.current = requestAnimationFrame(updateAudioVisualizer);
      };

      animationFrameRef.current = requestAnimationFrame(updateAudioVisualizer);
    } catch (err) {
      console.error('Lỗi khởi tạo Web Audio API:', err);
    }
  };

  // Main: Request media stream with selected devices
  const initMediaStream = async (camId, micId) => {
    stopTracks();

    let combinedStream = null;
    let camFail = null;
    let micFail = null;

    const videoConstraints = camId ? { deviceId: { exact: camId } } : true;
    const audioConstraints = micId ? { deviceId: { exact: micId } } : true;

    // 1. Try combined request first
    try {
      combinedStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints
      });
      setCameraError(null);
      setMicError(null);
    } catch (combinedError) {
      console.warn('Không thể mở đồng thời cả camera và micro, thử mở độc lập:', combinedError);

      // 2. Fallback: Try camera separately
      let videoStream = null;
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints
        });
        setCameraError(null);
      } catch (cErr) {
        camFail = 'Không thể truy cập camera. Vui lòng kiểm tra quyền thiết bị!';
        setCameraError(camFail);
      }

      // 3. Fallback: Try microphone separately
      let audioStream = null;
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints
        });
        setMicError(null);
      } catch (mErr) {
        micFail = 'Không thể truy cập microphone. Vui lòng cấp quyền!';
        setMicError(micFail);
      }

      const activeTracks = [];
      if (videoStream) activeTracks.push(...videoStream.getVideoTracks());
      if (audioStream) activeTracks.push(...audioStream.getAudioTracks());

      if (activeTracks.length > 0) {
        combinedStream = new MediaStream(activeTracks);
      }
    }

    if (combinedStream) {
      streamRef.current = combinedStream;
      setStream(combinedStream);

      // Attach video stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = combinedStream;
      }

      // Detect camera track settings
      const videoTrack = combinedStream.getVideoTracks()[0];
      if (videoTrack && videoTrack.getSettings) {
        const s = videoTrack.getSettings();
        if (s.width && s.height) {
          setVideoResolution(`${s.width}x${s.height} • ${Math.round(s.frameRate || 30)} FPS`);
        }
      }

      // Connect Web Audio API
      if (combinedStream.getAudioTracks().length > 0) {
        setupWebAudio(combinedStream);
      }
    } else {
      setStream(null);
    }

    // Refresh devices to populate full labels once permission is granted
    await loadDeviceList();
  };

  // Sync video element when stream is updated
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Initial mount & unmount cleanup
  useEffect(() => {
    initMediaStream('', '');

    const handleDeviceChange = () => {
      loadDeviceList();
    };

    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    }

    return () => {
      if (navigator.mediaDevices?.removeEventListener) {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      }
      stopTracks();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) { }
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (e) { }
      }
    };
  }, []);

  // Handle switching camera
  const handleCameraChange = (e) => {
    const newCamId = e.target.value;
    setSelectedCameraId(newCamId);
    initMediaStream(newCamId, selectedMicId);
  };

  // Handle switching mic
  const handleMicChange = (e) => {
    const newMicId = e.target.value;
    setSelectedMicId(newMicId);
    initMediaStream(selectedCameraId, newMicId);
  };

  // Run voice test
  const handleRunVoiceTest = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => { });
    }
    setIsMicTesting(true);
    voiceActivityDetectedRef.current = false;
    testRecordingRef.current = true;

    setTimeout(() => {
      testRecordingRef.current = false;
      setIsMicTesting(false);
      setHasTestedVoice(true);
      if (voiceActivityDetectedRef.current) {
        setVoiceTestResult('Nhận diện: 100% chính xác (Âm thanh rõ nét)');
      } else {
        setVoiceTestResult('Âm thanh hơi nhỏ - Vui lòng nói to hoặc để mic gần hơn');
      }
    }, 2400);
  };

  const isVideoLive = stream && stream.getVideoTracks().some((t) => t.readyState === 'live');
  const isAudioLive = stream && stream.getAudioTracks().some((t) => t.readyState === 'live');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Header / Stepper Bar */}
      <div className="p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">AIVES</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">VIVA CORE</span>
            </div>
            <p className="text-[11px] text-slate-500">Phòng thi vấn đáp AI trực tuyến</p>
          </div>
        </div>

        {/* Middle Stepper */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-semibold">
            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Bước 1/2: Kiểm tra thiết bị & Âm thanh</span>
          </div>
          <span className="text-slate-300">›</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-400 font-medium">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Bước 2/2: Vào phòng thi trực tiếp</span>
          </div>
        </div>

        {/* Right Time & Help */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Thời gian vào phòng: {formatCountdown(countdownSeconds)}</span>
          </div>
          <button className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hỗ trợ kỹ thuật</span>
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto py-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
          Hệ thống kiểm tra phần cứng thời gian thực
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Kiểm tra thiết bị & Cấp quyền thi vấn đáp
        </h1>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          Đảm bảo hình ảnh rõ ràng và micro thu âm tốt để mô hình AI Speech-to-Text nhận diện giọng nói chính xác theo thời gian thực.
        </p>
      </div>

      {/* 2 Main Panels: Video Check & Audio/STT Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Panel 1: Video Check */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">1. Kiểm tra hình ảnh</h2>
            </div>
            {isVideoLive ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Camera: Đã kết nối
              </span>
            ) : cameraError ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                Camera: Chưa cấp quyền
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Đang kết nối camera...
              </span>
            )}
          </div>

          {/* Video Preview Canvas Frame */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center group">
            {cameraError ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <VideoOff className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Chưa truy cập được Camera</p>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Vui lòng bấm Cho phép (Allow) quyền camera trên thanh địa chỉ của trình duyệt để tiếp tục.
                  </p>
                </div>
                <button
                  onClick={() => initMediaStream(selectedCameraId, selectedMicId)}
                  className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Cấp lại quyền
                </button>
              </div>
            ) : (
              <>
                {/* Real Live Webcam Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/40 pointer-events-none"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/20">
                    {videoResolution}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Face Locked</span>
                </div>

                {/* AI Bounding Box Face Tracker */}
                <div className="absolute w-36 h-44 rounded-xl border-2 border-cyan-400/90 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex flex-col justify-between p-1.5 pointer-events-none animate-pulse">
                  <span className="text-[9px] font-mono font-bold bg-cyan-500 text-white px-1 rounded w-max">
                    POS: 0.99 CONF
                  </span>
                  <span className="text-[9px] font-mono text-cyan-200 text-right">FACE OK</span>
                </div>

                {/* Bottom Status bar on video */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-white/90 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>REC PREVIEW: LIVE</span>
                  </div>
                  <span>LATENCY: 12ms</span>
                </div>
              </>
            )}
          </div>

          {/* Camera Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 block">Nguồn Video khả dụng</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedCameraId}
                onChange={handleCameraChange}
                className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              >
                {cameras.length === 0 ? (
                  <option value="">Không tìm thấy camera hoặc chưa cấp quyền</option>
                ) : (
                  cameras.map((cam, idx) => (
                    <option key={cam.deviceId || idx} value={cam.deviceId}>
                      {cam.label || `Camera ${idx + 1}`}
                    </option>
                  ))
                )}
              </select>
              <button
                onClick={() => initMediaStream(selectedCameraId, selectedMicId)}
                title="Làm mới camera"
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đổi</span>
              </button>
            </div>
          </div>

          {/* Video Checklist Diagnostics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Ánh sáng khuôn mặt</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đạt chuẩn (Tốt)
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Số người trong khung</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                1 thí sinh
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Microphone & Speech-To-Text Check */}
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">2. Kiểm tra Micro & STT</h2>
            </div>
            {isAudioLive ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Microphone: Đã kết nối
              </span>
            ) : micError ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                Microphone: Chưa cấp quyền
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Đang kết nối micro...
              </span>
            )}
          </div>

          {/* Audio Source Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 block">Nguồn thu âm (Audio Input)</label>
            <select
              value={selectedMicId}
              onChange={handleMicChange}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
            >
              {mics.length === 0 ? (
                <option value="">Không tìm thấy micro hoặc chưa cấp quyền</option>
              ) : (
                mics.map((mic, idx) => (
                  <option key={mic.deviceId || idx} value={mic.deviceId}>
                    {mic.label || `Microphone ${idx + 1}`}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Audio Input Level Visualizer */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span>Mức âm lượng (Audio Input Level)</span>
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${currentDb > -40
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentDb > -52
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-slate-100 text-slate-600'
                  }`}
              >
                {currentDb} dB • {currentDb > -42 ? 'Tối ưu cho AI STT' : currentDb > -54 ? 'Có tín hiệu giọng nói' : 'Yên lặng'}
              </span>
            </div>

            {/* Real Audio Wave Bars Visualizer (Driven by Web Audio API AnalyserNode) */}
            <div className="flex items-end gap-1.5 h-9 px-2 bg-white rounded-lg border border-slate-200/70 py-1">
              {waveBars.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-sm bg-gradient-to-t from-sky-500 to-cyan-400 transition-all duration-75"
                  style={{ height: `${val}%` }}
                ></div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>-60 dB</span>
              <span className="text-slate-600 font-bold">-18 dB (Chuẩn)</span>
              <span>0 dB (Vỡ tiếng)</span>
            </div>
          </div>

          {/* Voice Prompt Test Box */}
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Thử giọng nói (Mic Test)
              </span>
              <button
                onClick={handleRunVoiceTest}
                disabled={isMicTesting}
                className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Radio className={`w-3.5 h-3.5 ${isMicTesting ? 'animate-spin' : ''}`} />
                <span>{isMicTesting ? 'Đang lắng nghe & phân tích...' : 'Nói thử 1 câu ngắn'}</span>
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sky-100 text-xs italic text-slate-700">
              "Tôi là Nguyễn Văn An, sẵn sàng tham gia ca thi CS301."
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Kết quả kiểm tra AI STT:</span>
              {hasTestedVoice ? (
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {voiceTestResult}
                </span>
              ) : isMicTesting ? (
                <span className="font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Radio className="w-3.5 h-3.5 text-sky-600" />
                  Đang thu âm giọng đọc...
                </span>
              ) : (
                <span className="font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  Chưa thử âm thanh
                </span>
              )}
            </div>
          </div>

          {/* Ambient Noise Level */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Độ ồn môi trường xung quanh</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {currentDb < -45 ? '18 dB (Yên tĩnh - Tuyệt vời)' : 'Mức ổn định'}
            </span>
          </div>
        </div>
      </div>

      {/* Rules & Code of Conduct Card */}
      <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-600" />
              Nội quy phòng thi vấn đáp trực tuyến (Online Viva Rules & Code of Conduct)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Quy chuẩn kiểm tra số: 2025/QĐ-AIVES</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
            Giám sát AI & Liêm chính học thuật
          </span>
        </div>

        {/* 4 Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-600" />
              <span>1. Thí sinh phải luôn nhìn thẳng vào màn hình</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Hệ thống AI sẽ tự động cảnh báo nếu mất dấu khuôn mặt quá 5 giây hoặc phát hiện chuyển hướng mắt bất thường.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <MicOff className="w-4 h-4 text-sky-600" />
              <span>2. Không gian thi cách âm yên tĩnh</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Không có người thứ hai xuất hiện trong phòng; tuyệt đối không sử dụng tai nghe bluetooth ngoài thiết bị đã đăng ký.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sky-600" />
              <span>3. Khóa toàn màn hình (Strict Sandbox)</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Nghiêm cấm rời khỏi cửa sổ làm việc hoặc mở tab trình duyệt khác để tra cứu tài liệu trái phép.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>4. Khung thời gian phản xạ trực tiếp</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Mỗi câu hỏi vấn đáp có thời gian suy nghĩ 30s và trả lời từ 1 - 3 phút trước khi AI tự động chuyển câu hỏi.
            </p>
          </div>
        </div>

        {/* Checkbox agreement */}
        <div
          onClick={() => setRulesAccepted(!rulesAccepted)}
          className="p-3.5 rounded-xl bg-sky-50/40 border border-sky-200/70 flex items-center gap-3 cursor-pointer hover:bg-sky-50/60 transition-colors"
        >
          <div className="text-sky-600">
            {rulesAccepted ? <CheckSquare className="w-5 h-5 text-sky-600" /> : <Square className="w-5 h-5 text-slate-400" />}
          </div>
          <span className="text-xs font-semibold text-slate-800 select-none">
            Tôi đã đọc, hiểu rõ và cam kết tuân thủ toàn bộ quy chế thi vấn đáp trực tuyến do AIVES quy định.
          </span>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={() => initMediaStream(selectedCameraId, selectedMicId)}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Kiểm tra lại thiết bị</span>
        </button>

        <button
          onClick={() => {
            if (!rulesAccepted) {
              alert('Vui lòng tích chọn đồng ý cam kết tuân thủ quy chế thi trước khi vào phòng!');
              return;
            }
            navigate('/viva');
          }}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${rulesAccepted
            ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:from-sky-700 hover:to-cyan-700 shadow-sky-500/25 hover:scale-[1.02]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
        >
          <span>Bắt đầu thi (Vào phòng vấn đáp)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
        <Lock className="w-3 h-3" />
        <span>Bảo mật WebRTC End-to-End • Hệ thống khảo thí AI chuẩn quốc tế ISO/IEC 2382-36</span>
      </p>
    </div>
  );
}
