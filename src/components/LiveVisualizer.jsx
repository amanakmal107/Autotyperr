import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

export function LiveVisualizer({
  text,
  currentIndex,
  status,
}) {
  const containerRef = useRef(null);
  const activeCharRef = useRef(null);

  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentIndex]);

  const typedSlice = text.slice(0, currentIndex);
  const activeChar = text[currentIndex] || '';
  const remainingSlice = text.slice(currentIndex + 1);

  return (
    <div className="app-card">
      <div className="app-card-header">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h3 className="app-card-title">
            Real-Time Keystroke Visualizer
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Typed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Pending
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="p-4 max-h-[160px] overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-words bg-slate-950/80 select-none border-t border-slate-800/80"
      >
        {/* Completed text */}
        <span className="text-emerald-400/90 font-medium">
          {typedSlice}
        </span>

        {/* Current Active Character & Cursor */}
        {currentIndex < text.length && (
          <span
            ref={activeCharRef}
            className="inline-block relative bg-blue-600/30 text-white font-bold px-0.5 rounded border border-blue-400/60 shadow-sm shadow-blue-500/30 ring-2 ring-blue-500/40"
          >
            {activeChar === '\n' ? '↵\n' : activeChar === ' ' ? '␣' : activeChar === '\t' ? '⇥' : activeChar}
            <span className="inline-block w-0.5 h-4 bg-blue-400 align-middle ml-0.5 animate-cursor" />
          </span>
        )}

        {/* Remaining text */}
        <span className="text-slate-600">
          {remainingSlice}
        </span>

        {text.length === 0 && (
          <span className="text-slate-600 italic">No text to visualize yet...</span>
        )}
      </div>
    </div>
  );
}
