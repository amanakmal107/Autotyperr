import React, { useRef, useState } from 'react';
import { FileText, Upload, Trash2, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { SAMPLE_TEXTS } from '../utils/storage.js';

export function TextInputArea({
  text,
  setText,
  disabled,
  effectiveCps,
}) {
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Statistics
  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text === '' ? 0 : text.split('\n').length;
  const estimatedSeconds = effectiveCps > 0 ? Math.ceil(charCount / effectiveCps) : 0;
  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;
  const timeFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt') && file.type !== 'text/plain') {
      alert('Please upload a plain text (.txt) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    if (text.length > 0) {
      setText('');
    }
  };

  const handleReset = () => {
    setText(SAMPLE_TEXTS.general);
  };

  return (
    <div className="app-card flex flex-col h-full">
      {/* Editor Header Bar */}
      <div className="app-card-header">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <h2 className="app-card-title">
            Source Text Editor
          </h2>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Preset templates dropdown */}
          <div className="relative group">
            <button
              type="button"
              disabled={disabled}
              className="btn-toolbar"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sample Text</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1 hidden group-hover:block z-30 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXTS.general)}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors cursor-pointer"
              >
                Welcome & Overview
              </button>
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXTS.code)}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors cursor-pointer"
              >
                Code Snippet (JavaScript)
              </button>
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXTS.dataEntry)}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors cursor-pointer"
              >
                Structured Data / Form
              </button>
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXTS.specialChars)}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors cursor-pointer"
              >
                Special Chars & Unicode
              </button>
            </div>
          </div>

          {/* Import TXT */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,text/plain"
            className="hidden"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            title="Import text from .TXT file"
            className="btn-toolbar"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Import .TXT</span>
          </button>

          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy source text to clipboard"
            className="btn-toolbar"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Reset */}
          <button
            type="button"
            disabled={disabled}
            onClick={handleReset}
            title="Reset to default text"
            className="btn-toolbar"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Clear */}
          <button
            type="button"
            disabled={disabled || text.length === 0}
            onClick={handleClear}
            title="Clear all text"
            className="btn-toolbar text-red-300 hover:text-white hover:bg-red-900/40 hover:border-red-700/60"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 min-h-[230px]">
        <textarea
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or paste the text you want to auto-type here... Supports multiline, paragraphs, numbers, tabs, and all special characters."
          className="w-full h-full min-h-[230px] p-5 bg-transparent text-slate-100 placeholder-slate-500 font-mono text-sm leading-relaxed focus:outline-none focus:ring-0 border-0 resize-none selection:bg-blue-600/40 selection:text-white"
          spellCheck={false}
        />
      </div>

      {/* Telemetry Footer */}
      <div className="px-5 py-2.5 bg-slate-950/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-4 font-mono text-[11px] sm:text-xs">
          <span>
            <strong className="text-slate-200">{charCount}</strong> chars
          </span>
          <span className="text-slate-600">&bull;</span>
          <span>
            <strong className="text-slate-200">{wordCount}</strong> words
          </span>
          <span className="text-slate-600">&bull;</span>
          <span>
            <strong className="text-slate-200">{lineCount}</strong> lines
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Est. Typing Time:</span>
          <span className="app-badge app-badge-blue font-mono font-medium py-0">
            {timeFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}
