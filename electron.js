const { app, BrowserWindow, ipcMain, shell, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 650,
    backgroundColor: '#F8F6F2',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ---- IPC: Open Website in default browser ----
ipcMain.handle('open-website', async (_event, url) => {
  try {
    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }
    await shell.openExternal(target);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ---- IPC: Take Screenshot ----
ipcMain.handle('take-screenshot', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    });

    if (!sources.length) {
      return { success: false, error: 'No screen source found' };
    }

    const primary = sources[0];
    const image = primary.thumbnail.toPNG();

    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const fileName = `screenshot-${Date.now()}.png`;
    const filePath = path.join(screenshotsDir, fileName);
    fs.writeFileSync(filePath, image);

    return { success: true, fileName, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
