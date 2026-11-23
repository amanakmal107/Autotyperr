import React from 'react';
import { Clock, MousePointer } from 'lucide-react';

export function CountdownConfig({
  countdownSeconds,
  setCountdownSeconds,
  disabled,
}) {
  const quickPills = [3, 5, 8, 10];

  return (
    <div className="app-card">
      <div className="app-card-body">
        
        <div className="flex items-center justify-between mb-3">
          <label className="app-card-title">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Focus Countdown Delay
          </label>
          <span className="app-badge app-badge-blue font-mono font-medium">
            {countdownSeconds}s Switch Window
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
          <MousePointer className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          Provides sufficient time to click into your authorized destination field.
        </p>

        {/* Quick Select Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickPills.map((sec) => (
            <button
              key={sec}
              type="button"
              disabled={disabled}
              onClick={() => setCountdownSeconds(sec)}
              className={`option-card text-center py-2 px-1 ${countdownSeconds === sec ? 'option-card-active' : ''}`}
            >
              <div className="text-xs font-bold">{sec}s</div>
            </button>
          ))}
        </div>

        {/* Range Slider */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>3s min</span>
            <span>10s max</span>
          </div>
          <input
            type="range"
            min="3"
            max="10"
            step="1"
            disabled={disabled}
            value={countdownSeconds}
            onChange={(e) => setCountdownSeconds(Number(e.target.value))}
            className="app-slider"
          />
        </div>

      </div>
    </div>
  );
}
