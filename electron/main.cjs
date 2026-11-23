const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const cp = require('child_process');

let mainWindow = null;
let psProcess = null;
let typingState = {
  status: 'idle', // 'idle' | 'countdown' | 'typing' | 'paused' | 'stopped' | 'completed'
  text: '',
  currentIndex: 0,
  totalChars: 0,
  cps: 5,
  delayMs: 200,
  variance: 0,
  countdown: 0,
  isPaused: false,
  isStopped: false,
};
let typingTimer = null;
let countdownTimer = null;

// Default shortcuts
let currentShortcuts = {
  start: 'CommandOrControl+Shift+S',
  pause: 'CommandOrControl+Shift+P',
  stop: 'CommandOrControl+Shift+X',
};

// Initialize PowerShell background typer
function initPowerShellTyper() {
  const scriptPath = app.isPackaged
    ? path.join(process.resourcesPath, 'typer.ps1')
    : path.join(__dirname, 'typer.ps1');
  try {
    psProcess = cp.spawn('powershell.exe', [
      '-ExecutionPolicy', 'Bypass',
      '-NoProfile',
      '-File', scriptPath
    ]);

    psProcess.stdout.on('data', (data) => {
      // Process data events if needed
      // console.log('[Typer PS Output]:', data.toString().trim());
    });

    psProcess.stderr.on('data', (data) => {
      console.error('[Typer PS Error]:', data.toString());
    });

    psProcess.on('exit', (code) => {
      console.log('[Typer PS Exited with code]:', code);
      psProcess = null;
    });
  } catch (err) {
    console.error('Failed to spawn PowerShell Typer process:', err);
  }
}

function sendCharToOS(charCode) {
  if (psProcess && psProcess.stdin && !psProcess.killed) {
    try {
      psProcess.stdin.write(`TYPE_CHAR ${charCode}\r\n`);
    } catch (e) {
      console.error('Error writing to psProcess stdin:', e);
    }
  }
}

function createWindow() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, '../icon.png')
    : path.join(__dirname, '../public/icon.png');

  mainWindow = new BrowserWindow({
    width: 1220,
    height: 840,
    minWidth: 960,
    minHeight: 680,
    backgroundColor: '#020617', // slate-950
    title: 'Smart AutoTyper',
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const devUrl = 'http://localhost:5173';
  const prodPath = app.isPackaged
    ? path.join(process.resourcesPath, '../app/dist/index.html')
    : path.join(__dirname, '../dist/index.html');

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    mainWindow.loadFile(prodPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  registerShortcuts();
}

function registerShortcuts() {
  globalShortcut.unregisterAll();

  // Start Shortcut
  try {
    globalShortcut.register(currentShortcuts.start, () => {
      if (mainWindow) {
        mainWindow.webContents.send('global-shortcut', 'start');
      }
    });
  } catch (err) {
    console.warn(`Could not register start shortcut ${currentShortcuts.start}:`, err);
  }

  // Pause/Resume Shortcut
  try {
    globalShortcut.register(currentShortcuts.pause, () => {
      if (mainWindow) {
        mainWindow.webContents.send('global-shortcut', 'toggle-pause');
      }
      handleTogglePause();
    });
  } catch (err) {
    console.warn(`Could not register pause shortcut ${currentShortcuts.pause}:`, err);
  }

  // Emergency Stop Shortcut
  try {
    globalShortcut.register(currentShortcuts.stop, () => {
      if (mainWindow) {
        mainWindow.webContents.send('global-shortcut', 'emergency-stop');
      }
      stopTypingInternal('emergency');
    });
  } catch (err) {
    console.warn(`Could not register stop shortcut ${currentShortcuts.stop}:`, err);
  }
}

function startCountdownAndTyping(payload) {
  clearTimeout(typingTimer);
  clearInterval(countdownTimer);

  const { text, cps, countdownSeconds, humanizeVariance } = payload;
  const delayMs = Math.round(1000 / (cps || 5));
  const initialCountdown = typeof countdownSeconds === 'number' ? countdownSeconds : 0;

  typingState = {
    status: initialCountdown > 0 ? 'countdown' : 'typing',
    text: text || '',
    currentIndex: 0,
    totalChars: (text || '').length,
    cps: cps || 5,
    delayMs,
    variance: humanizeVariance ? 25 : 0,
    countdown: initialCountdown,
    isPaused: false,
    isStopped: false,
  };

  notifyStatus();

  // If countdown already completed in renderer or 0 requested, start typing immediately
  if (initialCountdown <= 0) {
    beginTypingLoop();
    return { success: true };
  }

  let remainingCountdown = typingState.countdown;
  if (mainWindow) {
    mainWindow.webContents.send('countdown-tick', remainingCountdown);
  }

  countdownTimer = setInterval(() => {
    remainingCountdown--;
    if (mainWindow) {
      mainWindow.webContents.send('countdown-tick', remainingCountdown);
    }

    if (remainingCountdown <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      beginTypingLoop();
    }
  }, 1000);

  return { success: true };
}

function beginTypingLoop() {
  if (typingState.isStopped) return;

  typingState.status = 'typing';
  notifyStatus();

  stepTyping();
}

function stepTyping() {
  if (typingState.isStopped) return;

  if (typingState.isPaused) {
    return;
  }

  if (typingState.currentIndex >= typingState.totalChars) {
    typingState.status = 'completed';
    notifyStatus();
    return;
  }

  const char = typingState.text[typingState.currentIndex];
  const charCode = char.charCodeAt(0);

  // Send keystroke to whichever external application is currently active/focused in Windows!
  sendCharToOS(charCode);

  typingState.currentIndex++;

  const completed = typingState.currentIndex;
  const total = typingState.totalChars;
  const remaining = total - completed;
  const estimatedSeconds = Math.ceil((remaining * typingState.delayMs) / 1000);

  if (mainWindow) {
    mainWindow.webContents.send('typing-progress', {
      completed,
      total,
      remaining,
      percent: Math.round((completed / total) * 100),
      estimatedSeconds,
      currentChar: char,
      index: typingState.currentIndex,
    });
  }

  let nextDelay = typingState.delayMs;
  if (typingState.variance > 0 && nextDelay > 15) {
    const delta = Math.round((nextDelay * typingState.variance) / 100);
    const jitter = Math.floor(Math.random() * (2 * delta + 1)) - delta;
    nextDelay = Math.max(10, nextDelay + jitter);
  }

  typingTimer = setTimeout(() => {
    stepTyping();
  }, nextDelay);
}

function handleTogglePause() {
  if (typingState.status === 'typing') {
    typingState.isPaused = true;
    typingState.status = 'paused';
    clearTimeout(typingTimer);
    notifyStatus();
  } else if (typingState.status === 'paused') {
    typingState.isPaused = false;
    typingState.status = 'typing';
    notifyStatus();
    stepTyping();
  }
}

function stopTypingInternal(reason = 'user') {
  clearTimeout(typingTimer);
  clearInterval(countdownTimer);
  typingState.isStopped = true;
  typingState.isPaused = false;
  typingState.status = 'stopped';

  notifyStatus({ reason });
}

function notifyStatus(extra = {}) {
  if (mainWindow) {
    mainWindow.webContents.send('typing-status', {
      status: typingState.status,
      currentIndex: typingState.currentIndex,
      totalChars: typingState.totalChars,
      isPaused: typingState.isPaused,
      ...extra,
    });
  }
}

// IPC Handlers
ipcMain.handle('start-typing', (_event, payload) => {
  return startCountdownAndTyping(payload);
});

ipcMain.handle('pause-typing', () => {
  if (typingState.status === 'typing') {
    handleTogglePause();
  }
  return { status: typingState.status };
});

ipcMain.handle('resume-typing', () => {
  if (typingState.status === 'paused') {
    handleTogglePause();
  }
  return { status: typingState.status };
});

ipcMain.handle('stop-typing', () => {
  stopTypingInternal('user');
  return { status: 'stopped' };
});

ipcMain.handle('update-shortcuts', (_event, shortcuts) => {
  currentShortcuts = { ...currentShortcuts, ...shortcuts };
  registerShortcuts();
  return { success: true };
});

ipcMain.handle('toggle-always-on-top', (_event, flag) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(flag);
    return mainWindow.isAlwaysOnTop();
  }
  return false;
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

app.whenReady().then(() => {
  initPowerShellTyper();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (psProcess && !psProcess.killed) {
    try {
      psProcess.stdin.write('EXIT\r\n');
      psProcess.kill();
    } catch (e) {}
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
