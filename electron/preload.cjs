const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  startTyping: (payload) => ipcRenderer.invoke('start-typing', payload),
  pauseTyping: () => ipcRenderer.invoke('pause-typing'),
  resumeTyping: () => ipcRenderer.invoke('resume-typing'),
  stopTyping: () => ipcRenderer.invoke('stop-typing'),
  updateShortcuts: (shortcuts) => ipcRenderer.invoke('update-shortcuts', shortcuts),
  toggleAlwaysOnTop: (flag) => ipcRenderer.invoke('toggle-always-on-top', flag),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  getActiveWindowTitle: () => ipcRenderer.invoke('get-active-window-title'),

  // Event listeners
  onCountdownTick: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('countdown-tick', subscription);
    return () => ipcRenderer.removeListener('countdown-tick', subscription);
  },
  onTypingStatus: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('typing-status', subscription);
    return () => ipcRenderer.removeListener('typing-status', subscription);
  },
  onTypingProgress: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('typing-progress', subscription);
    return () => ipcRenderer.removeListener('typing-progress', subscription);
  },
  onGlobalShortcut: (callback) => {
    const subscription = (_event, action) => callback(action);
    ipcRenderer.on('global-shortcut', subscription);
    return () => ipcRenderer.removeListener('global-shortcut', subscription);
  }
});
