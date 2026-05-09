const { app, BrowserWindow, screen, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

// 关键：禁用硬件加速，防止 Windows DWM 在 setPosition 时重绘标题栏
app.disableHardwareAcceleration();

let mainWindow;
let tray;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea; // {x, y, width, height} 含任务栏偏移

  mainWindow = new BrowserWindow({
    width: 400,
    height: 350,
    x: Math.floor(workArea.x + workArea.width / 2 - 200),
    y: workArea.y + workArea.height - 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenu(null);

  mainWindow.loadFile('index.html');

  // 关键修复：强制触发窗口尺寸重算，清除 Windows DWM 缓存的标题栏
  mainWindow.once('ready-to-show', () => {
    forceRemoveTitleBar();
  });
  mainWindow.webContents.on('did-finish-load', () => {
    forceRemoveTitleBar();
    const wa = screen.getPrimaryDisplay().workArea;
    mainWindow.webContents.send('screen-info', {
      workArea: wa,
    });
  });
}

/**
 * 强制移除 DWM 渲染的标题栏
 * 通过快速 resize 触发 Windows 重新计算窗口非客户端区域
 */
function forceRemoveTitleBar() {
  if (!mainWindow) return;
  const bounds = mainWindow.getBounds();
  mainWindow.setBounds({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height + 1,
  });
  setTimeout(() => {
    if (mainWindow) {
      mainWindow.setBounds(bounds);
    }
  }, 50);
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: '🐱 桌面宠物', enabled: false },
    { type: 'separator' },
    {
      label: '📌 置顶窗口',
      type: 'checkbox',
      checked: true,
      click: (menuItem) => { mainWindow.setAlwaysOnTop(menuItem.checked); },
    },
    {
      label: '🔄 重置位置',
      click: () => {
        const wa = screen.getPrimaryDisplay().workArea;
        mainWindow.setPosition(Math.floor(wa.x + wa.width / 2 - 200), wa.y + wa.height - 350);
        mainWindow.webContents.send('reset-position');
      },
    },
    { type: 'separator' },
    { label: '❌ 退出', click: () => { app.quit(); } },
  ]);
  tray.setToolTip('桌面宠物小助手');
  tray.setContextMenu(contextMenu);
}

// IPC：窗口移动
ipcMain.on('move-window', (event, { deltaX, deltaY }) => {
  if (!mainWindow) return;
  const [x, y] = mainWindow.getPosition();
  mainWindow.setPosition(x + deltaX, y + deltaY);
});

ipcMain.handle('get-window-position', () => {
  if (!mainWindow) return { x: 0, y: 0 };
  const [x, y] = mainWindow.getPosition();
  return { x, y };
});

ipcMain.on('set-window-position', (event, { x, y }) => {
  if (!mainWindow) return;
  mainWindow.setPosition(Math.round(x), Math.round(y));
});

ipcMain.handle('get-screen-info', () => {
  const display = screen.getPrimaryDisplay();
  return {
    workArea: display.workArea,
  };
});

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  app.quit();
});
