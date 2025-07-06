const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');

let mainWindow;
let nextServer;

function createWindow() {
  if (mainWindow) return; // prevent multiple windows

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log("🔵 Starting Next.js production server...");

  nextServer = exec('npm run start');

  nextServer.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`);

    // Open window when server is ready (based on current Next.js logs)
    if (data.includes('Ready in')) {
      createWindow();
    }
  });

  nextServer.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data}`);
  });

  nextServer.on('exit', (code) => {
    console.log(`Next.js server exited with code ${code}`);
  });

  // Fallback: if server takes too long or log format changes, open after 10 seconds
  setTimeout(() => {
    if (!mainWindow) {
      console.log("⚠️ No server log detected. Opening window anyway...");
      createWindow();
    }
  }, 10000);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
      if (nextServer) nextServer.kill();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) createWindow();
  });
});
