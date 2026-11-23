import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.jsx';
import { TextInputArea } from './components/TextInputArea.jsx';
import { SpeedControls } from './components/SpeedControls.jsx';
import { CountdownConfig } from './components/CountdownConfig.jsx';
import { TargetSelector } from './components/TargetSelector.jsx';
import { ControlsBar } from './components/ControlsBar.jsx';
import { ProgressSection } from './components/ProgressSection.jsx';
import { LiveVisualizer } from './components/LiveVisualizer.jsx';
import { TestPlayground } from './components/TestPlayground.jsx';
import { CountdownModal } from './components/CountdownModal.jsx';
import { ShortcutsModal } from './components/ShortcutsModal.jsx';
import { SafetyModal } from './components/SafetyModal.jsx';
import { DesktopHelpModal } from './components/DesktopHelpModal.jsx';
import { useTypingEngine } from './hooks/useTypingEngine.js';
import { loadStoredConfig, saveStoredConfig } from './utils/storage.js';
import { Monitor, Terminal } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState(loadStoredConfig);
  const [text, setText] = useState(config.savedText || '');
  const [targetText, setTargetText] = useState('');
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);

  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  useEffect(() => {
    saveStoredConfig({
      ...config,
      savedText: text,
    });
  }, [config, text]);

  const handleAppendChar = useCallback((char) => {
    setTargetText((prev) => prev + char);
  }, []);

  const handleClearTarget = useCallback(() => {
    setTargetText('');
  }, []);

  const engine = useTypingEngine({
    text,
    speedPreset: config.speedPreset,
    customCps: config.customCps,
    countdownSeconds: config.countdownSeconds,
    humanizeVariance: config.humanizeVariance,
    soundEffects: config.soundEffects,
    keyboardClicks: config.keyboardClicks,
    targetMode: config.targetMode,
    shortcuts: config.shortcuts,
    onTargetAppendChar: handleAppendChar,
    onTargetClear: handleClearTarget,
    onShowBrowserWarning: () => setDesktopModalOpen(true),
  });

  const isBusy = engine.status === 'typing' || engine.status === 'paused' || engine.status === 'countdown';

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveShortcuts = (newShortcuts) => {
    updateConfig('shortcuts', newShortcuts);
    if (window.electronAPI) {
      window.electronAPI.updateShortcuts({
        start: newShortcuts.start.replace(/Ctrl/g, 'CommandOrControl'),
        pause: newShortcuts.pause.replace(/Ctrl/g, 'CommandOrControl'),
        stop: newShortcuts.stop.replace(/Ctrl/g, 'CommandOrControl'),
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-14 relative overflow-x-hidden">
      
      {/* Ambient background lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <Header
        soundEffects={config.soundEffects}
        setSoundEffects={(v) => updateConfig('soundEffects', v)}
        keyboardClicks={config.keyboardClicks}
        setKeyboardClicks={(v) => updateConfig('keyboardClicks', v)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onOpenSafety={() => setSafetyModalOpen(true)}
        alwaysOnTop={alwaysOnTop}
        setAlwaysOnTop={setAlwaysOnTop}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Status / Compliance Notice Banner */}
        <div className="app-card border-slate-800/60 bg-slate-900/60 p-3 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2.5">
          <div className="flex items-center gap-2.5">
            {isElectron ? (
              <Monitor className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <Terminal className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
            <span>
              {isElectron ? (
                <>
                  <strong className="text-emerald-300">Desktop Companion Active:</strong> Ready to auto-type into Notepad, Word, or any outside window. Emergency Stop:{' '}
                </>
              ) : (
                <>
                  <strong className="text-amber-300">Browser Mode:</strong> To type into outside Windows applications, run <code className="app-kbd text-amber-200 border-amber-700/60 bg-black/50">npm run electron:dev</code>. Emergency Stop:{' '}
                </>
              )}
              <kbd className="app-kbd app-kbd-danger">
                {config.shortcuts?.stop || 'Ctrl+Shift+X'}
              </kbd>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isElectron && (
              <button
                onClick={() => setDesktopModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline text-xs"
              >
                Enable Outside Typing
              </button>
            )}
            <button
              onClick={() => setSafetyModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer text-xs"
            >
              Policy & Safety
            </button>
          </div>
        </div>

        {/* Master 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Source Editor, Destination, Target Sandbox) - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <TextInputArea
              text={text}
              setText={setText}
              disabled={isBusy}
              effectiveCps={engine.effectiveCps}
            />

            <TargetSelector
              targetMode={config.targetMode}
              setTargetMode={(mode) => updateConfig('targetMode', mode)}
              disabled={isBusy}
              onOpenBrowserModal={() => setDesktopModalOpen(true)}
            />

            <TestPlayground
              targetText={targetText}
              setTargetText={setTargetText}
              sourceText={text}
              status={engine.status}
            />
          </div>

          {/* Right Column (Controls, Speed, Progress & Visualizer) - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            
            <SpeedControls
              speedPreset={config.speedPreset}
              setSpeedPreset={(p) => updateConfig('speedPreset', p)}
              customCps={config.customCps}
              setCustomCps={(c) => updateConfig('customCps', c)}
              humanizeVariance={config.humanizeVariance}
              setHumanizeVariance={(v) => updateConfig('humanizeVariance', v)}
              disabled={isBusy}
            />

            <CountdownConfig
              countdownSeconds={config.countdownSeconds}
              setCountdownSeconds={(s) => updateConfig('countdownSeconds', s)}
              disabled={isBusy}
            />

            <ProgressSection
              status={engine.status}
              totalChars={engine.totalChars}
              completedChars={engine.currentIndex}
              remainingChars={engine.remainingChars}
              percent={engine.percent}
              estimatedSeconds={engine.estimatedSeconds}
              activeChar={engine.activeChar}
            />

            <LiveVisualizer
              text={text}
              currentIndex={engine.currentIndex}
              status={engine.status}
            />
          </div>

        </div>

        {/* Sticky Controls Bar */}
        <div className="sticky bottom-4 z-30">
          <ControlsBar
            status={engine.status}
            onStart={engine.startTyping}
            onPause={engine.pauseTyping}
            onResume={engine.resumeTyping}
            onStop={engine.resetTyping}
            onEmergencyStop={engine.emergencyStop}
            onReset={engine.resetTyping}
            shortcuts={config.shortcuts}
            hasText={text.trim().length > 0}
          />
        </div>

      </main>

      {/* Countdown HUD Modal */}
      {engine.status === 'countdown' && (
        <CountdownModal
          remaining={engine.countdownRemaining}
          total={config.countdownSeconds}
          onCancel={engine.resetTyping}
          targetMode={config.targetMode}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
        shortcuts={config.shortcuts}
        onSaveShortcuts={handleSaveShortcuts}
      />

      {/* Safety & Compliance Modal */}
      <SafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
      />

      {/* Desktop Help / Outside Typing Modal */}
      <DesktopHelpModal
        isOpen={desktopModalOpen}
        onClose={() => setDesktopModalOpen(false)}
      />
    </div>
  );
}
