// Local Storage Persistence & Presets

const STORAGE_KEY = 'smart_autotyper_config_v1';

export const SAMPLE_TEXTS = {
  general: `Welcome to Smart AutoTyper!

This modern tool automates repetitive typing tasks safely and efficiently. It accurately reproduces every character, preserves spaces, line breaks, numbers, and special symbols (e.g. !@#$%^&*()_+).

Select a speed, configure your countdown, focus your target input field, and let AutoTyper do the work!`,

  code: `function calculateMetrics(records) {
  // Process real-time transaction dataset
  const total = records.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const average = records.length > 0 ? (total / records.length) : 0;
  
  return {
    status: "SUCCESS",
    count: records.length,
    total: "$" + total.toFixed(2),
    average: average.toFixed(4)
  };
}`,

  dataEntry: `ID: 98421
Client: Orion Technologies Inc.
Contact: contact@orion-tech.org
Budget: $45,500.00
Status: ACTIVE [CONFIRMED]
Notes: Verified permissions for automated testing field.`,

  specialChars: `!@#$%^&*()_+-=[]{}|;':",.<>/?~\`
Numbers: 0 1 2 3 4 5 6 7 8 9
Unicode & Accents: Café, façade, résumé, naïve, jalapeño, München
Whitespace test:    4 spaces,\ttab, and newline breaks.`
};

export const DEFAULT_CONFIG = {
  speedPreset: 'normal', // 'slow' (2), 'normal' (5), 'fast' (10), 'custom' (1-30)
  customCps: 15,
  countdownSeconds: 5,
  humanizeVariance: true,
  soundEffects: true,
  keyboardClicks: true,
  theme: 'dark',
  targetMode: 'desktop', // Default to external Windows desktop application!
  shortcuts: {
    start: 'Ctrl+Shift+S',
    pause: 'Ctrl+Shift+P',
    stop: 'Ctrl+Shift+X',
  },
  savedText: SAMPLE_TEXTS.general,
};

export function loadStoredConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (err) {
    console.error('Error loading config from localStorage:', err);
    return DEFAULT_CONFIG;
  }
}

export function saveStoredConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving config to localStorage:', err);
  }
}
