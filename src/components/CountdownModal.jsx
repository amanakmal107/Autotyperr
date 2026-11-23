import React from 'react';
import { X, Clock, AlertTriangle } from 'lucide-react';

export function CountdownModal({
  remaining,
  total,
  onCancel,
  targetMode,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="app-card max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden border-slate-700/80">
        
        {/* Background ambient glow circles */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="app-badge app-badge-blue">
            <Clock className="w-3.5 h-3.5" /> Countdown Active
          </span>
          <button
            onClick={onCancel}
            title="Cancel Countdown (Esc)"
            className="btn-toolbar p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big countdown digit */}
        <div className="my-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-slate-800/80 flex items-center justify-center bg-slate-950/40 shadow-inner">
              <span className="text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-300 to-emerald-400 scale-110 transform transition-all duration-300">
                {remaining}
              </span>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/40 animate-ping opacity-30" />
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-bold text-white">
            {targetMode === 'desktop'
              ? 'Click into Your Target Application Window Now'
              : 'Preparing In-App Typing Simulator'}
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            {targetMode === 'desktop' ? (
              <>
                Click inside your intended target (e.g. Notepad, Word, or form). Keystrokes begin streaming when the timer reaches 0.
              </>
            ) : (
              <>
                Simulated keystrokes will stream into the local test sandbox in {remaining} seconds.
              </>
            )}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-left text-xs text-amber-200 mb-6 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            Emergency Stop shortcut: <kbd className="app-kbd app-kbd-danger">Ctrl+Shift+X</kbd> immediately aborts typing at any time.
          </span>
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          className="btn-base btn-secondary w-full py-2.5"
        >
          Cancel Countdown (Esc)
        </button>

      </div>
    </div>
  );
}
