import React from 'react';
import { Keyboard, Volume2, VolumeX, Shield, Command, Pin, Monitor, Globe } from 'lucide-react';

export function Header({
  soundEffects,
  setSoundEffects,
  keyboardClicks,
  setKeyboardClicks,
  onOpenShortcuts,
  onOpenSafety,
  alwaysOnTop,
  setAlwaysOnTop,
}) {
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  const handleTogglePin = async () => {
    if (window.electronAPI) {
      const next = !alwaysOnTop;
      const res = await window.electronAPI.toggleAlwaysOnTop(next);
      setAlwaysOnTop(res);
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Left: Branding & Status Badge */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/25 border border-blue-400/30 flex-shrink-0 bg-slate-900 group">
            <img
              src="/icon.png"
              alt="Smart AutoTyper Icon"
              className="w-full h-full object-cover rounded-xl transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Smart AutoTyper
                <span className="app-badge app-badge-blue text-[10px] py-0 px-2 font-mono">
                  v1.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Automated simulated keyboard typing assistant
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1.5 ml-4">
            {isElectron ? (
              <span className="app-badge app-badge-emerald">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                Windows Desktop Active
              </span>
            ) : (
              <span className="app-badge app-badge-blue">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Web Simulation Active
              </span>
            )}
          </div>
        </div>

        {/* Right: Quick Actions & Standardized Toggles */}
        <div className="flex items-center gap-2">
          {/* Always on top (Electron only) */}
          {isElectron && (
            <button
              onClick={handleTogglePin}
              title={alwaysOnTop ? "Disable Always-on-Top" : "Enable Always-on-Top"}
              className={`btn-toolbar ${alwaysOnTop ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/30' : ''}`}
            >
              <Pin className={`w-3.5 h-3.5 ${alwaysOnTop ? 'rotate-45 text-white' : 'text-slate-400'}`} />
              <span className="hidden lg:inline">{alwaysOnTop ? 'HUD Pinned' : 'Pin HUD'}</span>
            </button>
          )}

          {/* Key clicks toggle */}
          <button
            onClick={() => setKeyboardClicks(!keyboardClicks)}
            title="Toggle Mechanical Key Click Audio"
            className={`btn-toolbar ${keyboardClicks ? 'text-blue-400 border-blue-500/40 bg-blue-500/10' : ''}`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{keyboardClicks ? 'Clicks: ON' : 'Clicks: OFF'}</span>
          </button>

          {/* Master Sound Effects Toggle */}
          <button
            onClick={() => setSoundEffects(!soundEffects)}
            title="Toggle Sound Effects (Chimes, Countdown)"
            className={`btn-toolbar ${soundEffects ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : ''}`}
          >
            {soundEffects ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Shortcuts Guide */}
          <button
            onClick={onOpenShortcuts}
            title="Configure Keyboard Shortcuts"
            className="btn-toolbar text-slate-300 hover:text-white"
          >
            <Command className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>

          {/* Safety & Compliance Guide */}
          <button
            onClick={onOpenSafety}
            title="Safety Guidelines & Permissions"
            className="btn-toolbar text-slate-300 hover:text-white"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Safety</span>
          </button>
        </div>

      </div>
    </header>
  );
}
