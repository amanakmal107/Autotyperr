import React, { useState } from 'react';
import { Sparkles, Copy, Check, Trash2, ShieldCheck, CheckCheck } from 'lucide-react';

export function TestPlayground({
  targetText,
  setTargetText,
  sourceText,
  status,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isComplete = status === 'completed' && targetText.length === sourceText.length;
  const isTyping = status === 'typing';

  return (
    <div className="app-card flex flex-col h-full">
      <div className="app-card-header">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="app-card-title">
            Interactive Target Sandbox
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 app-badge app-badge-emerald py-0">
            <ShieldCheck className="w-3 h-3" /> Local Field
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isComplete && (
            <span className="app-badge app-badge-emerald py-0 font-medium">
              <CheckCheck className="w-3.5 h-3.5" /> 100% Match
            </span>
          )}

          <button
            type="button"
            onClick={handleCopy}
            disabled={targetText.length === 0}
            title="Copy received text"
            className="btn-toolbar"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy</span>
          </button>

          <button
            type="button"
            onClick={() => setTargetText('')}
            disabled={targetText.length === 0 || isTyping}
            title="Clear target output"
            className="btn-toolbar text-red-300 hover:text-white hover:bg-red-900/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-[200px]">
        <textarea
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          placeholder="This is the target input field. When you start typing in 'In-App Sandbox' mode, characters will be automatically typed here character-by-character..."
          className="w-full h-full min-h-[200px] p-5 bg-transparent text-emerald-300 placeholder-slate-600 font-mono text-sm leading-relaxed focus:outline-none focus:ring-0 border-0 resize-none selection:bg-emerald-700/60 selection:text-white"
          readOnly={isTyping}
        />
        {isTyping && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/90 border border-blue-500/50 text-xs text-blue-200 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Receiving simulated keystrokes...
          </div>
        )}
      </div>

      <div className="px-5 py-2.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>
          Received: <strong className="text-emerald-400">{targetText.length}</strong> / {sourceText.length} chars
        </span>
        <span className="text-[11px] text-slate-500 font-sans">
          Editable target scratchpad
        </span>
      </div>
    </div>
  );
}
