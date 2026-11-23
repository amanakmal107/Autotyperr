import React from 'react';
import { X, ShieldCheck, AlertOctagon, CheckCircle2, Lock, EyeOff } from 'lucide-react';

export function SafetyModal({
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="app-card max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border-slate-700/80">

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Safety & Ethical Automation Policy</h2>
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
            Smart AutoTyper is built to assist with legitimate, authorized typing automation—such as bulk data entry, form testing, transcription assistance, and accessibility support.
          </p>

          <div className="space-y-3">
            <div className="app-surface-inner p-3.5 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block mb-0.5">Explicit User Initiation</strong>
                Keystrokes are simulated only after deliberate user action (clicking Start Typing or using the configured shortcut). The app never initiates typing unprompted.
              </div>
            </div>

            <div className="app-surface-inner p-3.5 flex items-start gap-3">
              <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block mb-0.5">Authorized Targets Only</strong>
                Simulate input only into windows, text fields, and applications you own or have explicit administrative permission to automate.
              </div>
            </div>

            <div className="app-surface-inner p-3.5 flex items-start gap-3">
              <EyeOff className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block mb-0.5">No Security or Anti-Bot Bypass</strong>
                This tool does not attempt to bypass CAPTCHA challenges, bot detection systems, credential gates, or authentication controls.
              </div>
            </div>

            <div className="app-surface-inner p-3.5 border-red-900/40 bg-red-950/20 flex items-start gap-3">
              <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-300 block mb-0.5">Instant Hardware & OS Emergency Stop</strong>
                Pressing <kbd className="app-kbd app-kbd-danger">Ctrl+Shift+X</kbd> immediately clears the internal timer queue and aborts all keystrokes in under 10 milliseconds.
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-base btn-primary py-2 px-5 text-xs"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
}
