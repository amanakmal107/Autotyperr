import React from 'react';
import { Play, Pause, Square, AlertOctagon, RefreshCw } from 'lucide-react';

export function ControlsBar({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onEmergencyStop,
  onReset,
  shortcuts,
  hasText,
}) {
  const isTyping = status === 'typing';
  const isPaused = status === 'paused';
  const isCountdown = status === 'countdown';
  const isBusy = isTyping || isPaused || isCountdown;

  return (
    <div className="app-card border-slate-700/80 shadow-2xl backdrop-blur-xl">
      <div className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Primary Start / Pause / Resume controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Start Button */}
          {!isTyping && !isPaused && (
            <button
              type="button"
              disabled={!hasText || isCountdown}
              onClick={onStart}
              className={`btn-base px-6 py-2.5 text-sm ${
                isCountdown
                  ? 'bg-amber-600/70 text-white cursor-wait'
                  : hasText
                  ? 'btn-primary'
                  : 'btn-secondary opacity-40 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isCountdown ? 'Counting Down...' : 'Start Typing'}</span>
              <span className="app-kbd ml-1 bg-white/20 text-white border-white/30">
                {shortcuts?.start || 'Ctrl+Shift+S'}
              </span>
            </button>
          )}

          {/* Pause Button */}
          {isTyping && (
            <button
              type="button"
              onClick={onPause}
              className="btn-base px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
              <span className="app-kbd ml-1 bg-white/20 text-white border-white/30">
                {shortcuts?.pause || 'Ctrl+Shift+P'}
              </span>
            </button>
          )}

          {/* Resume Button */}
          {isPaused && (
            <button
              type="button"
              onClick={onResume}
              className="btn-base px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume</span>
              <span className="app-kbd ml-1 bg-white/20 text-white border-white/30">
                {shortcuts?.pause || 'Ctrl+Shift+P'}
              </span>
            </button>
          )}

          {/* Standard Stop / Cancel Button */}
          {isBusy && (
            <button
              type="button"
              onClick={onStop}
              className="btn-base btn-secondary py-2.5 px-4"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          )}

          {/* Reset when completed or stopped */}
          {(status === 'completed' || status === 'stopped') && (
            <button
              type="button"
              onClick={onReset}
              className="btn-base btn-secondary py-2.5 px-4"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span>Reset Sequence</span>
            </button>
          )}
        </div>

        {/* Right: EMERGENCY STOP BUTTON */}
        <div>
          <button
            type="button"
            onClick={onEmergencyStop}
            title="Immediately kills all active typing and cancels countdown in under 10ms"
            className={`btn-base py-2.5 px-5 ${
              isTyping
                ? 'btn-danger glow-danger scale-105'
                : 'bg-red-950/50 hover:bg-red-900/70 text-red-200 border border-red-800/80'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-white flex-shrink-0" />
            <span className="font-bold tracking-wide">EMERGENCY STOP</span>
            <span className="app-kbd app-kbd-danger ml-1">
              {shortcuts?.stop || 'Ctrl+Shift+X'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
