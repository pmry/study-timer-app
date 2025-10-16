const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// --- NEW: Add this line to enable auto-reloading ---
try { require('electron-reloader')(module) } catch (_) {}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 380,
    height: 575,
    frame: false,
    transparent: true,
    icon: path.join(__dirname, 'assets/Study-timer.ico'), // <-- ADD THIS LINE
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, 
      nodeIntegration: false,
    }
  });


  win.removeMenu();
  win.loadFile('study.html');
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('minimize-app', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.on('close-app', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});