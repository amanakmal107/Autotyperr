import React from 'react';
import { Target, Monitor, CheckCircle, Terminal, AlertTriangle, ArrowRight } from 'lucide-react';

export function TargetSelector({
  targetMode,
  setTargetMode,
  disabled,
  onOpenBrowserModal,
}) {
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  return (
    <div className="app-card">
      <div className="app-card-body">
        
        <div className="flex items-center justify-between mb-3">
          <label className="app-card-title">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            Target Typing Destination
          </label>
          <span className={`app-badge ${isElectron ? 'app-badge-emerald' : 'app-badge-amber'}`}>
            {isElectron ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Windows Desktop Active
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                Browser Tab
              </>
            )}
          </span>
        </div>

        {/* Dual Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Option 1: External Desktop */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setTargetMode('desktop');
              if (!isElectron && onOpenBrowserModal) {
                onOpenBrowserModal();
              }
            }}
            className={`option-card p-4 relative ${targetMode === 'desktop' ? 'option-card-active' : ''}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold flex items-center gap-2 text-slate-100">
                <Monitor className={`w-4 h-4 ${targetMode === 'desktop' ? 'text-blue-400' : 'text-slate-400'}`} />
                Outside Windows App (Anywhere)
              </span>
              <span className="app-badge app-badge-blue text-[10px] py-0 px-2 font-mono font-bold">
                RECOMMENDED
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Types directly into <strong>Notepad, Word, Discord, games, browser forms, or any active window</strong> you focus during countdown.
            </p>
          </button>

          {/* Option 2: In-App Sandbox */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setTargetMode('in-app')}
            className={`option-card p-4 relative ${targetMode === 'in-app' ? 'option-card-active' : ''}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold flex items-center gap-2 text-slate-100">
                <CheckCircle className={`w-4 h-4 ${targetMode === 'in-app' ? 'text-emerald-400' : 'text-slate-400'}`} />
                In-App Test Sandbox
              </span>
              <span className="app-badge app-badge-slate text-[10px] py-0 px-2 font-mono">
                Safe Test
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Types strictly into the test scratchpad box below. Useful for previewing formatting, speed, and characters safely.
            </p>
          </button>
        </div>

        {/* Browser Warning Guide */}
        {!isElectron && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span>You are viewing AutoTyper in a web browser. Browsers restrict sending keystrokes into outside Windows apps.</span>
                <div className="text-[11px] text-amber-300/80 mt-0.5">
                  Run <code className="app-kbd text-amber-200 border-amber-700/60 bg-black/50">npm run electron:dev</code> to autotype anywhere on your PC!
                </div>
              </div>
            </div>
            {onOpenBrowserModal && (
              <button
                type="button"
                onClick={onOpenBrowserModal}
                className="btn-base bg-amber-600 hover:bg-amber-500 text-white text-xs py-1.5 px-3 flex-shrink-0 shadow-sm"
              >
                <span>Desktop Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
