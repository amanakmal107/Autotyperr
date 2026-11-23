import React, { useState } from 'react';
import { X, Command, Key, RotateCcw, Check, AlertCircle } from 'lucide-react';

export function ShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
  onSaveShortcuts,
}) {
  const [localShortcuts, setLocalShortcuts] = useState({ ...shortcuts });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    const defaults = {
      start: 'Ctrl+Shift+S',
      pause: 'Ctrl+Shift+P',
      stop: 'Ctrl+Shift+X',
    };
    setLocalShortcuts(defaults);
  };

  const handleSave = () => {
    onSaveShortcuts(localShortcuts);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="app-card max-w-md w-full p-6 shadow-2xl relative border-slate-700/80">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="btn-toolbar p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 my-3 leading-relaxed">
          Configure high-priority hotkeys for seamless control. Hotkeys operate globally when running in Windows Desktop companion mode.
        </p>

        <div className="space-y-3 my-4">
          {/* Start shortcut */}
          <div className="app-surface-inner p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">Start / Initiate Sequence</div>
              <div className="text-[11px] text-slate-400">Triggers countdown and typing</div>
            </div>
            <input
              type="text"
              value={localShortcuts.start}
              onChange={(e) => setLocalShortcuts({ ...localShortcuts, start: e.target.value })}
              className="w-32 px-2.5 py-1 text-xs font-mono text-center rounded-lg bg-slate-900 border border-slate-700 text-blue-400 font-bold focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Pause shortcut */}
          <div className="app-surface-inner p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">Pause / Resume</div>
              <div className="text-[11px] text-slate-400">Toggles active typing flow</div>
            </div>
            <input
              type="text"
              value={localShortcuts.pause}
              onChange={(e) => setLocalShortcuts({ ...localShortcuts, pause: e.target.value })}
              className="w-32 px-2.5 py-1 text-xs font-mono text-center rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-bold focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Emergency Stop shortcut */}
          <div className="app-surface-inner p-3.5 flex items-center justify-between border-red-900/40">
            <div>
              <div className="text-xs font-semibold text-red-300">
                Emergency Stop
              </div>
              <div className="text-[11px] text-slate-400">Immediately aborts all keystrokes</div>
            </div>
            <input
              type="text"
              value={localShortcuts.stop}
              onChange={(e) => setLocalShortcuts({ ...localShortcuts, stop: e.target.value })}
              className="w-32 px-2.5 py-1 text-xs font-mono text-center rounded-lg bg-slate-900 border border-red-800/80 text-red-400 font-bold focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/50 text-[11px] text-blue-300 mb-5 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <span>
            Modifiers like <code>Ctrl</code>, <code>Shift</code>, and <code>Alt</code> prevent unintentional triggers.
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="btn-toolbar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-base btn-secondary py-1.5 px-3.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-base btn-primary py-1.5 px-4 text-xs"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Key className="w-3.5 h-3.5" />}
              <span>{saved ? 'Saved!' : 'Save Hotkeys'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
