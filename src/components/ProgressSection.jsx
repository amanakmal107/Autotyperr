import React from 'react';
import { CheckCircle2, Clock, Hourglass, Hash, Layers, AlertCircle } from 'lucide-react';

export function ProgressSection({
  status,
  totalChars,
  completedChars,
  remainingChars,
  percent,
  estimatedSeconds,
  activeChar,
}) {
  const getStatusBadge = () => {
    switch (status) {
      case 'typing':
        return (
          <span className="app-badge app-badge-blue animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Active Typing
          </span>
        );
      case 'paused':
        return (
          <span className="app-badge app-badge-amber">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Paused
          </span>
        );
      case 'countdown':
        return (
          <span className="app-badge app-badge-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            Counting Down...
          </span>
        );
      case 'completed':
        return (
          <span className="app-badge app-badge-emerald">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'stopped':
        return (
          <span className="app-badge app-badge-red">
            <AlertCircle className="w-3.5 h-3.5" />
            Stopped
          </span>
        );
      case 'idle':
      default:
        return (
          <span className="app-badge app-badge-slate">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Ready / Idle
          </span>
        );
    }
  };

  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;
  const timeFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const getCharLabel = (ch) => {
    if (!ch) return '—';
    if (ch === ' ') return '␣ (Space)';
    if (ch === '\n') return '↵ (Enter)';
    if (ch === '\t') return '⇥ (Tab)';
    return `'${ch}'`;
  };

  return (
    <div className="app-card">
      <div className="app-card-body">
        
        {/* Title & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="app-card-title">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Typing Progress & Telemetry
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {activeChar && status === 'typing' && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Char: <strong className="text-blue-400">{getCharLabel(activeChar)}</strong>
              </span>
            )}
            {getStatusBadge()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-mono">
            <span>{percent}% Completed</span>
            <span>{completedChars} / {totalChars} chars</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                status === 'completed'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : status === 'stopped'
                  ? 'bg-red-500'
                  : status === 'paused'
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="app-surface-inner p-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Hash className="w-3 h-3 text-slate-400" />
              Total
            </div>
            <div className="text-lg font-bold font-mono text-slate-100">{totalChars}</div>
          </div>

          <div className="app-surface-inner p-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Completed
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400">{completedChars}</div>
          </div>

          <div className="app-surface-inner p-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Hourglass className="w-3 h-3 text-amber-400" />
              Remaining
            </div>
            <div className="text-lg font-bold font-mono text-amber-300">{remainingChars}</div>
          </div>

          <div className="app-surface-inner p-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-indigo-400" />
              Time Left
            </div>
            <div className="text-lg font-bold font-mono text-indigo-300">
              {status === 'completed' ? '0s' : timeFormatted}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
