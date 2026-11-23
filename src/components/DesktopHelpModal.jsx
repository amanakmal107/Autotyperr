import React, { useState } from 'react';
import { X, Monitor, Terminal, Copy, Check, Sparkles } from 'lucide-react';

export function DesktopHelpModal({
  isOpen,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const command = 'npm run electron:dev';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="app-card max-w-lg w-full p-6 shadow-2xl relative border-slate-700/80">

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">How to Autotype Outside the App</h2>
          </div>
          <button
            onClick={onClose}
            className="btn-toolbar p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            To type into <strong>Notepad, Word, Discord, games, Google Docs, or any other software on your PC</strong>, you must run Smart AutoTyper as a <strong>Windows Desktop App</strong> using Electron.
          </p>

          <div className="app-surface-inner p-3.5 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Run this in your terminal:
            </div>
            <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/80 font-mono text-sm text-blue-300">
              <code>{command}</code>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-toolbar text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              How it works once opened in Desktop Mode:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>Click <strong>Start Typing</strong> (or press <kbd className="app-kbd text-blue-300">Ctrl+Shift+S</kbd>).</li>
              <li>A <strong>5-second countdown</strong> will begin.</li>
              <li>Switch to your target application (e.g. click into a blank Notepad or text field).</li>
              <li>AutoTyper will automatically stream keystrokes directly into that active window!</li>
              <li>Press <kbd className="app-kbd app-kbd-danger">Ctrl+Shift+X</kbd> at any time for an immediate Emergency Stop.</li>
            </ol>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-base btn-primary py-2 px-5 text-xs"
          >
            Got it, Let's Go!
          </button>
        </div>

      </div>
    </div>
  );
}
