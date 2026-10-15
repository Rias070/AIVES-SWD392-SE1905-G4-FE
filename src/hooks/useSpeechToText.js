import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Clean Architecture Application Hook: useSpeechToText
 * Encapsulates the Web Speech API (SpeechRecognition / webkitSpeechRecognition),
 * interim results streaming, and continuous speech watchdog.
 */
export function useSpeechToText({ defaultLang = 'vi-VN', onResult = null } = {}) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const isManuallyStoppedRef = useRef(true);
  const activeLangRef = useRef(defaultLang);
  const canAutoRestartRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    canAutoRestartRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore already stopped error
      }
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(
    (overrideLang, { allowRestart = true } = {}) => {
      if (!isSupported) {
        console.warn('Browser does not support Web SpeechRecognition');
        return;
      }

      isManuallyStoppedRef.current = false;
      canAutoRestartRef.current = allowRestart;

      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      const targetLang = overrideLang || activeLangRef.current || defaultLang;
      activeLangRef.current = targetLang;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = targetLang;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let accumulated = '';
          for (let i = 0; i < event.results.length; i++) {
            accumulated += event.results[i][0].transcript + ' ';
          }
          const cleanText = accumulated.trim();
          setTranscript(cleanText);
          if (typeof onResult === 'function') {
            onResult(cleanText);
          }
        };

        recognition.onerror = (event) => {
          console.warn('SpeechRecognition error:', event.error);
          setError(event.error);
        };

        recognition.onend = () => {
          setIsListening(false);
          // Watchdog: auto-restart if active answering phase was not manually stopped
          if (!isManuallyStoppedRef.current && canAutoRestartRef.current) {
            try {
              recognition.start();
              setIsListening(true);
            } catch (e) {
              console.warn('SpeechRecognition watchdog restart caught:', e);
            }
          }
        };

        recognition.start();
        setIsListening(true);
        recognitionRef.current = recognition;
      } catch (err) {
        console.error('Failed to start SpeechRecognition:', err);
        setError(err.message);
      }
    },
    [defaultLang, isSupported, onResult]
  );

  const resetTranscript = useCallback((initialVal = '') => {
    setTranscript(initialVal);
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    transcript,
    setTranscript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
}
