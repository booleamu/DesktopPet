const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  moveWindow: (deltaX, deltaY) => ipcRenderer.send('move-window', { deltaX, deltaY }),
  setWindowPosition: (x, y) => ipcRenderer.send('set-window-position', { x, y }),
  getWindowPosition: () => ipcRenderer.invoke('get-window-position'),
  getScreenInfo: () => ipcRenderer.invoke('get-screen-info'),
  onScreenInfo: (callback) => ipcRenderer.on('screen-info', (event, data) => callback(data)),
  onResetPosition: (callback) => ipcRenderer.on('reset-position', () => callback()),
});
