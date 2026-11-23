import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio.js';

export function useTypingEngine({
  text,
  speedPreset,
  customCps,
  countdownSeconds,
  humanizeVariance,
  soundEffects,
  keyboardClicks,
  targetMode,
  shortcuts,
  onTargetAppendChar,
  onTargetClear,
  onShowBrowserWarning,
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'countdown' | 'typing' | 'paused' | 'stopped' | 'completed'
  const [countdownRemaining, setCountdownRemaining] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeChar, setActiveChar] = useState('');

  const statusRef = useRef(status);
  statusRef.current = status;

  const textRef = useRef(text);
  textRef.current = text;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const typingTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  useEffect(() => {
    soundFX.enabled = soundEffects;
  }, [soundEffects]);

  const getEffectiveCps = useCallback(() => {
    switch (speedPreset) {
      case 'slow':
        return 2;
      case 'normal':
        return 5;
      case 'fast':
        return 10;
      case 'custom':
      default:
        return Math.max(1, Math.min(30, customCps || 5));
    }
  }, [speedPreset, customCps]);

  const effectiveCps = getEffectiveCps();
  const baseDelayMs = Math.round(1000 / effectiveCps);

  const emergencyStop = useCallback(() => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    setStatus('stopped');
    soundFX.playStop();

    if (window.electronAPI) {
      window.electronAPI.stopTyping().catch(() => { });
    }
  }, []);

  const pauseTyping = useCallback(() => {
    if (statusRef.current !== 'typing') return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setStatus('paused');

    if (window.electronAPI && targetMode === 'desktop') {
      window.electronAPI.pauseTyping().catch(() => { });
    }
  }, [targetMode]);

  const resumeTyping = useCallback(() => {
    if (statusRef.current !== 'paused') return;

    setStatus('typing');

    if (window.electronAPI && targetMode === 'desktop') {
      window.electronAPI.resumeTyping().catch(() => { });
    } else {
      stepWebTyping();
    }
  }, [targetMode]);

  const stepWebTyping = useCallback(() => {
    if (statusRef.current === 'stopped' || statusRef.current === 'paused') {
      return;
    }

    const currentIdx = currentIndexRef.current;
    const currentText = textRef.current;

    if (currentIdx >= currentText.length) {
      setStatus('completed');
      soundFX.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#3b82f6', '#10b981', '#6366f1', '#f59e0b']
        });
      } catch (e) { }
      return;
    }

    const char = currentText[currentIdx];
    setActiveChar(char);

    if (onTargetAppendChar) {
      onTargetAppendChar(char);
    }

    if (keyboardClicks) {
      soundFX.playClick();
    }

    const nextIdx = currentIdx + 1;
    setCurrentIndex(nextIdx);

    let delay = baseDelayMs;
    if (humanizeVariance && delay > 25) {
      const delta = Math.round((delay * 0.25));
      const jitter = Math.floor(Math.random() * (2 * delta + 1)) - delta;
      delay = Math.max(15, delay + jitter);
    }

    typingTimerRef.current = setTimeout(() => {
      stepWebTyping();
    }, delay);
  }, [baseDelayMs, humanizeVariance, keyboardClicks, onTargetAppendChar]);

  const startTyping = useCallback(() => {
    if (!text || text.length === 0) {
      return;
    }

    // Check if user requested external desktop typing while in standard browser tab
    const isElectron = typeof window !== 'undefined' && !!window.electronAPI;
    if (targetMode === 'desktop' && !isElectron) {
      if (onShowBrowserWarning) {
        onShowBrowserWarning();
        return;
      }
    }

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    if (onTargetClear && targetMode === 'in-app') {
      onTargetClear();
    }

    setCurrentIndex(0);
    setActiveChar('');
    setStatus('countdown');

    let count = countdownSeconds;
    setCountdownRemaining(count);
    soundFX.playCountdownTick(count === 1);

    countdownTimerRef.current = setInterval(() => {
      count--;
      setCountdownRemaining(count);

      if (count > 0) {
        soundFX.playCountdownTick(count === 1);
      } else {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        soundFX.playStart();
        setStatus('typing');

        if (window.electronAPI && targetMode === 'desktop') {
          // Tell Electron to type into the active outside window immediately
          window.electronAPI.startTyping({
            text,
            cps: effectiveCps,
            countdownSeconds: 0,
            humanizeVariance,
          }).catch((err) => {
            console.error('Electron typing failed:', err);
            stepWebTyping();
          });
        } else {
          stepWebTyping();
        }
      }
    }, 1000);
  }, [text, countdownSeconds, effectiveCps, humanizeVariance, targetMode, onTargetClear, stepWebTyping, onShowBrowserWarning]);

  const resetTyping = useCallback(() => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    setStatus('idle');
    setCountdownRemaining(0);
    setCurrentIndex(0);
    setActiveChar('');

    if (window.electronAPI) {
      window.electronAPI.stopTyping().catch(() => { });
    }
  }, []);

  useEffect(() => {
    if (!window.electronAPI) return;

    const unsubProgress = window.electronAPI.onTypingProgress((data) => {
      setCurrentIndex(data.completed);
      setActiveChar(data.currentChar || '');
      if (keyboardClicks) {
        soundFX.playClick();
      }
    });

    const unsubStatus = window.electronAPI.onTypingStatus((data) => {
      if (data.status === 'completed') {
        setStatus('completed');
        soundFX.playSuccess();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.65 },
          });
        } catch (e) { }
      } else if (data.status === 'stopped') {
        setStatus('stopped');
      } else if (data.status === 'paused') {
        setStatus('paused');
      } else if (data.status === 'typing') {
        setStatus('typing');
      }
    });

    const unsubShortcuts = window.electronAPI.onGlobalShortcut((action) => {
      if (action === 'start') {
        if (statusRef.current === 'idle' || statusRef.current === 'completed' || statusRef.current === 'stopped') {
          startTyping();
        }
      } else if (action === 'toggle-pause') {
        if (statusRef.current === 'typing') {
          pauseTyping();
        } else if (statusRef.current === 'paused') {
          resumeTyping();
        }
      } else if (action === 'emergency-stop') {
        emergencyStop();
      }
    });

    return () => {
      unsubProgress();
      unsubStatus();
      unsubShortcuts();
    };
  }, [startTyping, pauseTyping, resumeTyping, emergencyStop, keyboardClicks]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      if (isCtrlOrCmd && isShift && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        emergencyStop();
        return;
      }

      if (isInput) return;

      if (isCtrlOrCmd && isShift && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (statusRef.current === 'idle' || statusRef.current === 'completed' || statusRef.current === 'stopped') {
          startTyping();
        }
        return;
      }

      if (isCtrlOrCmd && isShift && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        if (statusRef.current === 'typing') {
          pauseTyping();
        } else if (statusRef.current === 'paused') {
          resumeTyping();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startTyping, pauseTyping, resumeTyping, emergencyStop]);

  const totalChars = (text || '').length;
  const completedChars = Math.min(currentIndex, totalChars);
  const remainingChars = Math.max(0, totalChars - completedChars);
  const percent = totalChars > 0 ? Math.round((completedChars / totalChars) * 100) : 0;
  const estimatedSeconds = remainingChars > 0 ? Math.ceil((remainingChars * baseDelayMs) / 1000) : 0;

  return {
    status,
    countdownRemaining,
    currentIndex: completedChars,
    totalChars,
    remainingChars,
    percent,
    estimatedSeconds,
    effectiveCps,
    baseDelayMs,
    activeChar,
    startTyping,
    pauseTyping,
    resumeTyping,
    emergencyStop,
    resetTyping,
  };
}
