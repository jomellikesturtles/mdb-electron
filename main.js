/**
 * Main processor
 */
const cp = require('child_process');
const electron = require('electron')
const Datastore = require('nedb')
const configDb = new Datastore({
  filename: 'src/assets/config/config.db',
  autoload: true
});
// import * as url from 'url'const
const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray, shell } = electron
let procBookmark;
let procWatched;
let procLibraryDb;
let procSearch;
let procTorrentSearch;
let procVideoService
let offlineMovieDataService;
let procmovieImageService;
let procScanLibrary;
let mainWindow
let mdbTray
const appIcon = `${__dirname}/dist/mdb-electron/assets/icons/plex.png`

let DEBUG = (() => {
  let timestamp = () => { }
  timestamp.toString = () => {
    return '[DEBUG ' + (new Date()).toLocaleString() + ']'
  }
  return {
    log: console.log.bind(console, '%s', timestamp)
  }
})()

/**
 * Creates the browser window
 */
function createWindow() {

  mainWindow = new BrowserWindow({
    minWidth: 762,
    minHeight: 700,
    show: true,
    frame: false,
    backgroundColor: '#1e2a31',
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      webSecurity: false
    },
    icon: appIcon,
    title: 'MDB'
  });
  mainWindow.webContents.openDevTools()
  mainWindow.setMenu(null)
  mainWindow.loadURL(`file://${__dirname}/dist/mdb-electron/index.html`); // It will load in production mode
  // Event when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.once('show', function () {
    console.log('main window Show');
  });
  // ipcMain.on('error', (_, err) => {
  // 	if (!argv.debug) {
  // 		console.error(err);
  // 		app.exit(1);
  // 	}
  // });

  // ---------shortcuts. BUG: shortcuts also applies to other electron apps
  // globalShortcut.register('CommandOrControl+F', () => {
  //   console.log('search');
  //   mainWindow.webContents.send('shortcut-search');
  // })
  // globalShortcut.register('CommandOrControl+Shift+P', () => {
  //   console.log('pref');
  //   mainWindow.webContents.send('shortcut-preferences');
  // })

  setSystemTray();
}

app.setAppUserModelId(process.execPath)
// Create window on electron initialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('before-quit', function () {
  // save changes
  globalShortcut.unregisterAll()
})
app.on('activate', function () {
  // macOS specific close process
  if (mainWindow === null) {
    createWindow()
  }
})

function setSystemTray() {
  // let trayIcon = `${__dirname}/dist/mdb-electron/assets/icons/chevron.png`
  let trayIcon = appIcon
  mdbTray = new Tray(trayIcon)
  const trayMnu = Menu.buildFromTemplate([
    { label: 'Preferences', icon: trayIcon, enabled: false },
    { type: "separator" },
    { label: 'Quit', click: app.quit }
  ])
  mdbTray.setToolTip('Media Database')
  mdbTray.setContextMenu(trayMnu)
  mdbTray.on('click', showWindow)
  mdbTray.on('double-click', showWindow)
}

// Show and Focus mainWindow
function showWindow() {
  mainWindow.show();
  mainWindow.focus();
  // if (isMac) {
  //   app.dock.show();
  // }
}

/* IPC Event handling
----------------------*/
/* Logger */
ipcMain.on('logger', function (event, data) {
  logger('logger..')
  console.log(data);
}); // Handle console.logs from Renderer

/** Set to maximized or restore */
ipcMain.on('app-restore', function () {
  mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});
ipcMain.on('app-min', function () {
  mainWindow.minimize()
});

/* Operating System
----------------------*/

ipcMain.on('exit-program', function (event, folder) {
  app.quit()
})
// Opens folder with system file explorer.
ipcMain.on('open-file-explorer', function (event, folder) {
  console.log('open-file-explorer', folder);
  shell.showItemInFolder(folder)
  shell.openItem(folder)
})
// go to folder folder then return list of folders inside
ipcMain.on('go-to-folder', function (event, param) {
  console.log('go to folder', param);
  procLibraryDb = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'file-explorer.js'), [param[0], param[1]], {
    cwd: __dirname,
    silent: true
  });
  procLibraryDb.stdout.on('data', function (data) {
    console.log(data.toString().slice(0, -1));
  });
  procLibraryDb.on('exit', function () {
    console.log('file-explorer process ended');
  });
  procLibraryDb.on('message', function (m) {
    // command, list of folders
    mainWindow.webContents.send(m[0], m[1]);
  });
})
// opens modal file explorer
ipcMain.on('modal-file-explorer', function (folder) {
  fs.readFileSync(__dirname)
  // shell.showItemInFolder
})
// gets system drives
ipcMain.on('get-drives', function () {
  cp.exec('wmic logicaldisk get name', (error, stdout) => {
    console.log(stdout.split('\r\r\n').filter(value => /[A-Za-z]:/.test(value))
      .map(value => value.trim()));
    mainWindow.webContents.send('system-drives', stdout.split('\r\r\n').filter(value => /[A-Za-z]:/.test(value))
      .map(value => value.trim()))
  })
})

// opens url to external browser
ipcMain.on('open-link-external', function (event, url) {
  shell.openExternal(url)
  // shell.openExternalSync(url, {}, function (err) {
  //   console.log(err)
  //   if (err) {
  //     console.log(err)
  //   }
  // })
})

/**
 * Initializes scan-library.js
 */
ipcMain.on('scan-library', function (event) {
  console.log('scan-librarye');
  if (!procScanLibrary) { // if process search is not yet running
    console.log('procSearch true');
    procScanLibrary = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'scan-library.js'), {
      cwd: __dirname,
      silent: true
    });
    // procScanLibrary.stdout.on('data', function (data) {
    //   console.log('scan-library printing data..');
    //   console.log(data.toString());
    // });
    procScanLibrary.on('exit', function () {
      // console.log('ScanLibrary process ended');
      DEBUG.log('ScanLibrary process ended')
      procScanLibrary = null;
    });
    procScanLibrary.on('message', function (m) {
      // console.log('scan-library in IPCMAIN', m);
      DEBUG.log('scan-library in IPCMAIN', m)
      mainWindow.webContents.send(m[0], m[1]);
    });
  }
})

ipcMain.on('stop-scan-library', function (event) {
  console.log('stop scan-librarye');
  if (procScanLibrary) { // if process search is not yet running
    console.log('killing....')
    procScanLibrary.kill()
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
  var config = configDb
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

/**
 * Gets list of library folders
 */
ipcMain.on('get-search-list', function (event, data) {
  var config = configDb
  config.findOne({
    type: 'searchList'
  }, function (err, dbPref) {
    if (!err) {
      searchList = dbPref.list
      mainWindow.webContents.send('search-list', searchList)
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
/* Preferences---------------------*/

/**
 * Gets all movies from libraryFiles.db
 */
ipcMain.on('get-library-movies', function (event, data) {
  console.log('get movies from library..')
  if (!procLibraryDb) {
    procLibraryDb = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'library-db-service.js'), [data[0], data[1]], {
      cwd: __dirname,
      silent: true
    });
    procLibraryDb.stdout.on('data', function (data) {
      console.log(data.toString().slice(0, -1));
    });
    procLibraryDb.on('exit', function () {
      console.log('get-library-movies process ended');
      procLibraryDb = null
    });
    procLibraryDb.on('message', function (m) {
      console.log('from main', m[0], m[1]);
      mainWindow.webContents.send(m[0], m[1]);
    });
  }
})

/**
 * Gets the movie from libraryFiles.db
 */
ipcMain.on('get-library-movie', function (event, data) {
  console.log('get 1 movie from library..')
  procLibraryDb = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'library-db-service.js'), ['find-one', data[0], data[1]], {
    cwd: __dirname,
    silent: true
  });
  procLibraryDb.stdout.on('data', function (data) {
    console.log(data.toString().slice(0, -1));
  });
  procLibraryDb.on('exit', function () {
    console.log('get-library-movie process ended');
  });
  procLibraryDb.on('message', function (m) {
    mainWindow.webContents.send(m[0], m[1]);
  });
})

ipcMain.on('get-torrents-title', function (event, data) {

})

/**
 * Gets all movies from movieData.db
 * TODO: minify the param2 to just the basic movie metadata. Otherwise, it will an error: 'error spawn ENAMETOOLONG'
 */
ipcMain.on('movie-metadata', function (event, data) {
  // console.log('movies into movie-metadata-service..', data[0], data[1])
  let param2 = ''
  // if (data[0] == 'set') {
  //   param2 = JSON.stringify(data[1])
  // } else {
  //   param2 = data[1]
  // }
  // console.log(data[0])
  // console.log(param2)
  offlineMovieDataService = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'offlineMetadataService.js'), [data[0], param2], {
    cwd: __dirname,
    silent: true
  });
  offlineMovieDataService.stdout.on('data', function (data) {
    // console.log(data.toString().slice(0, -1));
  });
  offlineMovieDataService.on('exit', function () {
    console.log('movie-metadata process ended');
  });
  offlineMovieDataService.on('message', function (m) {
    mainWindow.webContents.send(m[0], m[1]); // reply
  });
})

/**
 * Procesess images.
 */
ipcMain.on('get-image', function (event, data) {
  console.log('image-data-service..', data[0], data[1])
  procmovieImageService = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'image-data-service.js'), [data[0], data[1], data[2], data[3]], {
    cwd: __dirname,
    silent: true
  });
  procmovieImageService.stdout.on('data', function (data) {
    console.log(data.toString().slice(0, -1));
  });
  procmovieImageService.on('exit', function () {
    console.log('image-data process ended');
  });
  procmovieImageService.on('message', function (m) {
    mainWindow.webContents.send(m[0], m[1]); // reply
  });
})

// TORRENTS
ipcMain.on('torrent-search', function (event, data) {
  console.log('data: ', data[0], data[1]);

  if (!procTorrentSearch) { // if process search is not yet running
    console.log('procTorrentSearch ', data);
    procTorrentSearch = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'search-torrent.js'), [data[0], [data[1]]], {
      cwd: __dirname,
      silent: true
    });
    procTorrentSearch.stdout.on('data', function (data) {
      console.log('printing data..');
      console.log(data.toString());
    });
  } else {
    console.log('One Search process is already running');
  }
})

// BOOKMARK
ipcMain.on('bookmark', function (event, data) {
  if (!procBookmark) {
    console.log('procBookmark ', data);
    procBookmark = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'user-db-service.js'), [data[0], [data[1]]], {
      cwd: __dirname,
      silent: true
    });
    procBookmark.stdout.on('data', function (data) {
      console.log('printing data..');
      console.log(data.toString());
    });
    procBookmark.on('exit', function () {
      console.log('procBookmark process ended');
      procBookmark = null
    });
    procBookmark.on('message', function (m) {
      console.log('bookmark in IPCMAIN', m);
      mainWindow.webContents.send(m[0], m[1]); // reply
    });
  }
})

// WATCHED
ipcMain.on('watched', function (event, data) {
  if (!procWatched) {
    console.log('procWatched ', data);
    procWatched = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'watched-db-service.js'), [data[0], [data[1]]], {
      cwd: __dirname,
      silent: true
    });
    procWatched.stdout.on('data', function (data) {
      console.log('printing data..');
      console.log(data.toString());
    });
    procWatched.on('exit', function () {
      console.log('procWatched process ended');
      procWatched = null
    });
    procWatched.on('message', function (m) {
      console.log('watched in IPCMAIN', m);
      mainWindow.webContents.send(m[0], m[1]); // reply
    });
  }
})

/**
 * Gets the video by id and streams to localhost.
 */
ipcMain.on('open-video', function (event, data) {
  // if (!procVideoService) {
  DEBUG.log('procVideoService', data)
  procVideoService = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'video-service.js'), [data], {
    cwd: __dirname,
    silent: true
  });
  procVideoService.stdout.on('data', function (data) {
    DEBUG.log('printing data', data.toString())
  });
  procVideoService.on('exit', function () {
    // console.log('video service process ended');
    DEBUG.log('video service process ended')
    procVideoService = null
  });
  procVideoService.on('message', function (m) {
    // console.log('video service in IPCMAIN', m);
    DEBUG.log('video service in IPCMAIN', m)
    mainWindow.webContents.send(m[0], m[1]); // reply
  });
  // }
})

ipcMain.on('firebase-provider', function (event, data) {
  if (!procVideoService) {
    console.log('firebase ', data);
    procVideoService = cp.fork(path.join(__dirname, 'firebase-service.js'), [data], {
      // procVideoService = cp.fork(path.join(__dirname, 'src', 'assets', 'scripts', 'firebase-service.js'), [data], {
      cwd: __dirname,
      silent: true
    });
    procVideoService.stdout.on('data', function (data) {
      console.log('printing data..');
      console.log(data.toString());
    });
    procVideoService.on('exit', function () {
      console.log('firebase service process ended');
      procVideoService = null
    });
    procVideoService.on('error', (err) => {
      console.log("\n\t\tERROR: spawn failed! (" + err + ")");
    });
    procVideoService.on('message', function (m) {
      console.log('firebase service in IPCMAIN', m);
      mainWindow.webContents.send(m[0], m[1]); // reply
      if (m[0] === 'app-open') {
        shell.openExternal('http:\\localhost:4000')
      }
    });
  }
})
