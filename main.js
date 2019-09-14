/**
 * Main processor
 */
const cp = require('child_process');
const { app, BrowserWindow, ipcMain, dialog, Menu,
  Tray, shell, session, clipboard } = require('electron')
const validExtensions = ['.mp4', '.mkv', '.mpeg', '.avi', '.wmv', '.mpg',]
const papa = require('papaparse');
const os = require('os')
const Datastore = require('nedb')
const datastore = new Datastore({
  filename: 'src/assets/config/config.db',
  autoload: true
});
// import * as path from 'path'
// import * as url from 'url'const 
const path = require('path');
const fs = require('fs');
let procSearch;
let procLibraryDb;
let win
let mainWindow
let currentCondition = true;
let stream;

/**
 * Creates the browser window
 */
function createWindow() {

  mainWindow = new BrowserWindow({
    minWidth: 762,
    minHeight: 700,
    show: true,
    // frame: false,
    backgroundColor: '#1e2a31',
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true
    },
    title: 'MDB'
  });
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(`file://${__dirname}/dist/mdb-electron/index.html`); // It will load in production mode

  // Event when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.once('show', function () {
    console.log('main window Show');
  });
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (mainWindow === null) {
    createWindow()
  }
})

/* IPC Event handling
----------------------*/
/* Logger */
ipcMain.on('logger', function (event, data) {
  logger('logger..')
  console.log(data);
}); // Handle console.logs from Renderer

/** Set to maximized */
ipcMain.on('app-max', function () {
  mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});

/* Operating System
----------------------*/

// open folder
ipcMain.on('open-folder', function (event, folder) {
  console.log('open-folder', folder);
  shell.showItemInFolder(folder)
})
// opens OS' file explorer
ipcMain.on('file-explorer', function (folder) {
  shell.showItemInFolder(os.homedir())
})
// opens modal file explorer
ipcMain.on('modal-file-explorer', function (folder) {
  fs.readFileSync(__dirname)
  // shell.showItemInFolder
})
// opens url to external browser
ipcMain.on('open-link-external', function (event, url) {
  shell.openExternalSync(url, {}, function (err) {
    if (err) {
      console.log(err)
    }
  })
})


/**
 * Initializes scan-library.js
 */
ipcMain.on('scan-library', function (data) {
  if (!procSearch) { // if process search is not yet running
    console.log('procSearch true');
    procSearch = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'scan-library.js'), {
      cwd: __dirname,
      silent: true
    });
    procSearch.stdout.on('data', function (data) {
      console.log('printing data..');
      console.log(data.toString());
    });
    // procSearch.on('exit', function () {
    //     console.log('Search process ended');
    //     procSearch = null;
    //     if (awaitingQuit) {
    //         process.emit('cont-quit');
    //     }
    // });
    // procSearch.on('message', function (m) {
    //     mainWindow.webContents.send(m[0], m[1]);
    // });
    // mainWindow.webContents.send('search-init');
  } else {
    console.log('scan library is already running');
  }
})

ipcMain.on('search-query', function (event, data) {
  if (!procSearch) { // if process search is not yet running
    console.log('procSearch true');
    procSearch = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'search-movie.js'), {
      cwd: __dirname,
      silent: true
    });
    procSearch.stdout.on('data', function (data) {
      console.log('printing data..');
      console.log(data.toString());
    });
  } else {
    console.log('One Search process is already running');
  }
})

/**
 * Gets list of library folders
 */
ipcMain.on('retrieve-library-folders', function (event, data) {
  var config = datastore
  config.findOne({
    type: 'libraryFolders'
  }, function (err, dbPref) {
    if (!err) {
      foldersList = dbPref.foldersList
      mainWindow.webContents.send('library-folders', foldersList)
    } else {
      reject()
    }
  })
})

/* Preferences
----------------------*/
/* Logger */
ipcMain.on('get-preferences', function (event, data) {
  console.log('get-preferences ', data);
})

ipcMain.on('save-preferences', function (event, data) {
  console.log('save-preferences ', data);
})

/* Preferences
----------------------*/
/**
 * Gets all movies from libraryFiles.db
 */
ipcMain.on('get-library-movies', function (event, data) {
  console.log('get movies from library..')
  procLibraryDb = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'library-db-service.js'), {
    cwd: __dirname,
    silent: true
  });
  procLibraryDb.stdout.on('data', function (data) {
    console.log(data.toString().slice(0, -1));
  });
  procLibraryDb.on('exit', function () {
    console.log('Import process ended');
  });
  procLibraryDb.on('message', function (m) {
    mainWindow.webContents.send(m[0], m[1]);
  });
})

ipcMain.on('get-torrents-title', function (event, data) {

})
