// main.js

// Modules to control application life and create native browser window
const { app, ipcMain, globalShortcut, BrowserWindow } = require('electron')

const path = require('node:path')

let mainWindow = null;

let counter = 0;
let scenario = 0;
let pvuv = 0;
let siteURL = 'file:///';

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    icon: path.join(__dirname, 'hitbooster.png'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');
  mainWindow.setMenuBarVisibility(false);
  mainWindow.maximize();
  mainWindow.show();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    globalShortcut.register('Control+Shift+X', () => {
      mainWindow.loadFile('index.html');
    })
}).then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })


  ipcMain.on('resetCounter', (event) => {
    counter = 0;
  });

  ipcMain.on('incCounter', (event) => {
    counter++;
  });
  
  ipcMain.on('getCounter', (event) => {
    event.returnValue = counter;
  });


  ipcMain.on('setScenario', (event, args) => {
    scenario = args;
  });
  
  ipcMain.on('getScenario', (event) => {
    event.returnValue = scenario;
  });


  ipcMain.on('setPvuv', (event, args) => {
    pvuv = args;
  });
  
  ipcMain.on('getPvuv', (event) => {
    event.returnValue = pvuv;
  });
  

  ipcMain.on('loadSiteURL', (event, args) => {
    mainWindow.loadURL(args);
  });
  
  ipcMain.on('setSiteURL', (event, args) => {
    siteURL = args;
  });

  ipcMain.on('getSiteURL', (event) => {
    event.returnValue = siteURL;
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
