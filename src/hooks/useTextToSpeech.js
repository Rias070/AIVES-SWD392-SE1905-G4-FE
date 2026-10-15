import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Clean Architecture Application Hook: useTextToSpeech
 * Encapsulates multi-layered Text-To-Speech:
 *  - Layer 1: Browser SpeechSynthesis with matched BCP-47 voice
 *  - Layer 2: Google TTS Audio stream fallback
 *  - Layer 3: System default SpeechSynthesis fallback
 *  - Chromium 15-second speech queue freeze watchdog
 */
export function useTextToSpeech() {
  const [detectedVoices, setDetectedVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);

  const currentAudioRef = useRef(null);
  const isSpeechSynthesizingRef = useRef(false);
  const watchdogTimerRef = useRef(null);

  // Load and cache voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      try {
        const vList = window.speechSynthesis.getVoices();
        if (vList && vList.length > 0) {
          setDetectedVoices(vList);
        }
      } catch (e) {
        // Ignore
      }
    };

    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  // Helper: Find voice matching target language code
  const findVoiceForLang = useCallback((availableVoices, langCode) => {
    if (!availableVoices || availableVoices.length === 0) return null;
    const targetPrefix = (langCode || 'vi-VN').split('-')[0].toLowerCase();
    const fullTarget = (langCode || 'vi-VN').toLowerCase().replace('_', '-');

    // 1. Exact match on BCP-47 tag
    const exactMatch = availableVoices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      return code === fullTarget;
    });
    if (exactMatch) return exactMatch;

    // 2. Starts with target prefix (vi-, en-, ja-)
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
  }, []);

  // Stop both SpeechSynthesis and Google TTS Audio stream
  const stopAllSpeech = useCallback(() => {
    isSpeechSynthesizingRef.current = false;
    setIsSpeaking(false);

    if (watchdogTimerRef.current) {
      clearInterval(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignore
      }
    }

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {
        // Ignore
      }
      currentAudioRef.current = null;
    }
  }, []);

  // Layer 3 Fallback: Default Browser SpeechSynthesis
  const speakWithDefaultSpeechSynthesis = useCallback(
    (text, onEnd, onError) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          setIsSpeaking(false);
          isSpeechSynthesizingRef.current = false;
          if (typeof onEnd === 'function') onEnd();
        };

        utterance.onerror = (e) => {
          console.warn('Layer 3 SpeechSynthesis error:', e);
          setIsSpeaking(false);
          isSpeechSynthesizingRef.current = false;
          if (typeof onError === 'function') onError(e);
          else if (typeof onEnd === 'function') onEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Error invoking Layer 3 SpeechSynthesis:', err);
        setIsSpeaking(false);
        isSpeechSynthesizingRef.current = false;
        if (typeof onEnd === 'function') onEnd();
      }
    },
    []
  );

  // Layer 2 Fallback: Google TTS Audio Stream
  const speakWithGoogleTTS = useCallback(
    (text, lang, onEnd, onError) => {
      try {
        const shortLang = (lang || 'vi-VN').split('-')[0].toLowerCase();
        const encodedText = encodeURIComponent(text.slice(0, 200));
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${shortLang}&client=tw-ob&q=${encodedText}`;

        const audio = new Audio(url);
        currentAudioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          if (typeof onEnd === 'function') onEnd();
        };

        audio.onerror = (err) => {
          console.warn('Google TTS stream error, falling back to Layer 3:', err);
          speakWithDefaultSpeechSynthesis(text, onEnd, onError);
        };

        audio.play().catch((playErr) => {
          console.warn('Audio play rejected, falling back to Layer 3:', playErr);
          speakWithDefaultSpeechSynthesis(text, onEnd, onError);
        });
      } catch (e) {
        speakWithDefaultSpeechSynthesis(text, onEnd, onError);
      }
    },
    [speakWithDefaultSpeechSynthesis]
  );

  // Primary Speak Method with Chromium Freeze Watchdog
  const speak = useCallback(
    (text, lang = 'vi-VN', { onEnd = null, onError = null } = {}) => {
      if (!text || text.trim() === '') {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      stopAllSpeech();
      setIsSpeaking(true);
      isSpeechSynthesizingRef.current = true;

      const voices = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
      const matchedVoice = findVoiceForLang(voices.length > 0 ? voices : detectedVoices, lang);

      // Layer 1: Native speech synthesis with matched voice
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && matchedVoice) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang || lang;
          utterance.rate = 0.95;
          utterance.pitch = 1.0;

          // Chromium watchdog: unfreeze paused/speaking bug after 14s
          if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
          watchdogTimerRef.current = setInterval(() => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
              } else if (window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
              }
            }
          }, 10000);

          utterance.onend = () => {
            if (watchdogTimerRef.current) {
              clearInterval(watchdogTimerRef.current);
              watchdogTimerRef.current = null;
            }
            setIsSpeaking(false);
            isSpeechSynthesizingRef.current = false;
            if (typeof onEnd === 'function') onEnd();
          };

          utterance.onerror = (e) => {
            console.warn('SpeechSynthesis Layer 1 failed, triggering Layer 2 fallback:', e);
            if (watchdogTimerRef.current) {
              clearInterval(watchdogTimerRef.current);
              watchdogTimerRef.current = null;
            }
            speakWithGoogleTTS(text, lang, onEnd, onError);
          };

          window.speechSynthesis.speak(utterance);
          return;
        } catch (e) {
          console.warn('Layer 1 invocation failed, falling back to Layer 2:', e);
        }
      }

      // If no matched voice or Layer 1 failed, proceed to Layer 2
      speakWithGoogleTTS(text, lang, onEnd, onError);
    },
    [detectedVoices, findVoiceForLang, speakWithGoogleTTS, stopAllSpeech]
  );

  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, [stopAllSpeech]);

  return {
    speak,
    stopAllSpeech,
    isSpeaking,
    detectedVoices,
    findVoiceForLang,
    error
  };
}
