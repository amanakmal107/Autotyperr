import React from 'react';
import { Zap, Activity, UserCheck } from 'lucide-react';

export function SpeedControls({
  speedPreset,
  setSpeedPreset,
  customCps,
  setCustomCps,
  humanizeVariance,
  setHumanizeVariance,
  disabled,
}) {
  const presets = [
    { id: 'slow', label: 'Slow', cps: 2, desc: '2 cps (~24 WPM)' },
    { id: 'normal', label: 'Normal', cps: 5, desc: '5 cps (~60 WPM)' },
    { id: 'fast', label: 'Fast', cps: 10, desc: '10 cps (~120 WPM)' },
    { id: 'custom', label: 'Custom', cps: customCps, desc: `${customCps} cps (~${Math.round((customCps * 60) / 5)} WPM)` },
  ];

  const currentCps = speedPreset === 'custom' ? customCps : (presets.find(p => p.id === speedPreset)?.cps || 5);
  const estimatedWpm = Math.round((currentCps * 60) / 5);

  return (
    <div className="app-card">
      <div className="app-card-body">
        
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <label className="app-card-title">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Typing Speed
          </label>
          <span className="app-badge app-badge-blue font-mono font-medium">
            {currentCps} CPS &bull; {estimatedWpm} WPM
          </span>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {presets.map((preset) => {
            const isActive = speedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => setSpeedPreset(preset.id)}
                className={`option-card ${isActive ? 'option-card-active' : ''}`}
              >
                <div className="text-xs font-bold leading-tight">{preset.label}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {preset.cps} chars/s
                </div>
              </button>
            );
          })}
        </div>

        {/* Slider */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              Fine Speed Slider (1 – 30 CPS)
            </span>
            <span className="font-mono text-blue-400 font-bold">{customCps} CPS</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 font-mono">1</span>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              disabled={disabled}
              value={customCps}
              onChange={(e) => {
                setCustomCps(Number(e.target.value));
                if (speedPreset !== 'custom') {
                  setSpeedPreset('custom');
                }
              }}
              className="app-slider"
            />
            <span className="text-[11px] text-slate-500 font-mono">30</span>
          </div>
        </div>

        {/* Humanized Variance Toggle */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className={`w-4 h-4 ${humanizeVariance ? 'text-emerald-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs font-semibold text-slate-200">Humanized Typing Variance</div>
              <div className="text-[11px] text-slate-400">&plusmn;25% natural delay jitter for realistic cadence</div>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => setHumanizeVariance(!humanizeVariance)}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              humanizeVariance ? 'bg-emerald-600' : 'bg-slate-700'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                humanizeVariance ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

      </div>
    </div>
  );
}
