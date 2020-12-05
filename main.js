/*jshint esversion: 6 */
/**
 * Main processor
 */
const cp = require("child_process");
const electron = require("electron");
const Datastore = require("nedb");
const configDb = new Datastore({
  filename: "src/assets/config/config.db",
  autoload: true,
});
const path = require("path");
const fs = require("fs");
const { PROC_NAMES } = require("./src/assets/scripts/shared/constants");
const {app, BrowserWindow, ipcMain,globalShortcut, Menu, Tray, shell, dialog} = electron;
const IPCRendererChannel = require("./src/assets/IPCRendererChannel.json");
const IPCMainChannel = require("./src/assets/IPCMainChannel.json");
let procLibraryDb;
let procSearch;
let procTorrentSearch;
let procVideoService;
let offlineMovieDataService;
let procmovieImageService;
let procScanLibrary;
let procWebTorrent;
let mainWindow;
let mdbTray;
const appIcon = `${__dirname}/dist/mdb-electron/assets/icons/plex.png`;

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

const PROC_OPTION = {
  cwd: __dirname,
  silent: true,
};

/**
 * Creates the browser window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 762,
    minHeight: 700,
    show: true,
    frame: false,
    backgroundColor: "#1e2a31",
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: true,
      webSecurity: false,
      nativeWindowOpen: true,
    },
    icon: appIcon,
    title: "MDB",
  });
  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  mainWindow.loadURL(`file://${__dirname}/dist/mdb-electron/index.html`); // It will load in production mode
  // Event when the window is closed.
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.once("show", function () {
    DEBUG.log("main window Show");
  });

  // ipcMain.on('error', (_, err) => {
  // 	if (!argv.debug) {
  // 		console.error(err);
  // 		app.exit(1);
  // 	}
  // });

  // ---------shortcuts. BUG: shortcuts also applies to other electron apps
  // globalShortcut.register('CommandOrControl+F', () => {
  //   DEBUG.log('search');
  //   mainWindow.webContents.send('shortcut-search');
  // })
  // globalShortcut.register('CommandOrControl+Shift+P', () => {
  //   DEBUG.log('pref');
  //   mainWindow.webContents.send('shortcut-preferences');
  // })

  setSystemTray();
  startTorrentClient();
}

app.setAppUserModelId(process.execPath);
// Create window on electron initialization
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("before-quit", function () {
  // save changes
  globalShortcut.unregisterAll();
});
app.on("activate", function () {
  // macOS specific close process
  if (mainWindow === null) {
    createWindow();
  }
});

function setSystemTray() {
  // let trayIcon = `${__dirname}/dist/mdb-electron/assets/icons/chevron.png`
  let trayIcon = appIcon;
  mdbTray = new Tray(trayIcon);
  const trayMnu = Menu.buildFromTemplate([
    { label: "Preferences", icon: trayIcon, enabled: false },
    { label: "Torrent1", click: playTorrentSample },
    { label: "Torrent2", click: playTorrentSample2 },
    { label: "Quit", click: app.quit },
  ]);
  mdbTray.setToolTip("Media Database");
  mdbTray.setContextMenu(trayMnu);
  mdbTray.on("click", showWindow);
  mdbTray.on("double-click", showWindow);
}

// Show and Focus mainWindow
function showWindow() {
  mainWindow.show();
  mainWindow.focus();
  // if (isMac) {
  //   app.dock.show();
  // }
}

function playTorrentSample() {
  procWebTorrent.send([
    "play-torrent",
    "2ef6de6be35239d370db76e5b47be49d96bbf4da",
  ]);
}

function playTorrentSample2() {
  procWebTorrent.send([
    "play-torrent",
    "2f200765bbfa5802ac2afdf0cb71865714e833a2",
  ]);
}

ipcMain.on(IPCRendererChannel.STOP_STREAM, function (event, args) {
  procWebTorrent.send("stop-stream");
});
ipcMain.on(IPCRendererChannel.PLAY_TORRENT, function (event, args) {
  DEBUG.log("playtorrentArgs: ", args);
  procWebTorrent.send([IPCRendererChannel.PLAY_TORRENT, args]);
});

function startTorrentClient() {
  procWebTorrent = forkChildProcess(
    "src/assets/scripts/webtorrent.js",
    [],
    {
      cwd: __dirname,
      silent: false,
    }
    // PROC_OPTION
  );
  // procWebTorrent.stdout.on("data", function (data) {
  //   DEBUG.log(data.toString().slice(0, -1));
  // });
  procWebTorrent.on("exit", function () {
    DEBUG.log("procWebTorrent ended");
  });
  /**
   * webtorrent client messages:
   * 1. streamlink
   * 2. progress
   */
  procWebTorrent.on("message", (m) => sendContents(m[0], m[1]));
}
/* IPC Event handling
----------------------*/
/* Logger */
ipcMain.on("logger", function (event, data) {
  logger("logger..");
  DEBUG.log(data);
});

/** Set to maximized or restore */
// !Press CTRL + Hover to property to view
ipcMain.on(IPCRendererChannel.RestoreApp, function () {
  mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});
ipcMain.on(IPCRendererChannel.MinimizeApp, function () {
  mainWindow.minimize();
});

/* Operating System
----------------------*/

ipcMain.on("exit-program", function (event, folder) {
  app.quit();
});
// Opens folder with system file explorer.
ipcMain.on("open-file-explorer", function (event, folder) {
  DEBUG.log("open-file-explorer", folder);
  shell.showItemInFolder(folder);
  shell.openItem(folder);
});
// go to folder folder then return list of folders inside
ipcMain.on("go-to-folder", function (event, param) {
  DEBUG.log("go to folder", param);
  procLibraryDb = forkChildProcess(
    "src/assets/scripts/file-explorer.js",
    [param[0], param[1]],
    PROC_OPTION
  );
  procLibraryDb.stdout.on("data", (data) => printData(data));
  procLibraryDb.on("exit", function () {
    DEBUG.log("file-explorer process ended");
  });
  procLibraryDb.on("message", (m) => sendContents(m[0], m[1]));
});
// opens modal file explorer
ipcMain.on("modal-file-explorer", function (folder) {
  fs.readFileSync(__dirname);
  // shell.showItemInFolder
});
// gets system drives
ipcMain.on("get-drives", function () {
  cp.exec("wmic logicaldisk get name", (error, stdout) => {
    DEBUG.log(
      stdout
        .split("\r\r\n")
        .filter((value) => /[A-Za-z]:/.test(value))
        .map((value) => value.trim())
    );
    mainWindow.webContents.send(
      "system-drives",
      stdout
        .split("\r\r\n")
        .filter((value) => /[A-Za-z]:/.test(value))
        .map((value) => value.trim())
    );
  });
});

// opens url to external browser
ipcMain.on("open-link-external", function (event, url) {
  shell.openExternal(url);
});

/**
 * Initializes scan-library.js
 */
ipcMain.on(IPCRendererChannel.SCAN_LIBRARY_START, function (event) {
  DEBUG.log("scan-library");
  if (!procScanLibrary) {
    // if process search is not yet running
    procScanLibrary = forkChildProcess(
      "src/assets/scripts/scan-library.js",
      [],
      {
        cwd: __dirname,
        silent: false,
      }
    );
    procScanLibrary.on("exit", function () {
      DEBUG.log("ScanLibrary process ended");
      procScanLibrary = null;
    });
    procScanLibrary.on("error", (e) => printError("scanLibrary", e));
    procScanLibrary.on("message", (m) => sendContents(m[0], m[1]));
  }
});

ipcMain.on(IPCRendererChannel.SCAN_LIBRARY_STOP, function (event) {
  DEBUG.log("stopping scan-librarye");
  if (procScanLibrary) {
    DEBUG.log("killing....");
    procScanLibrary.kill();
    procScanLibrary = null;
  }
});

// !UNUSED
ipcMain.on("search-query", function (event, data) {
  if (!procSearch) {
    // if process search is not yet running
    procSearch = forkChildProcess(
      "src/assets/scripts/search-movie.js",
      [],
      PROC_OPTION
    );
    procSearch.stdout.on("data", (data) => printData(data));
  } else {
    DEBUG.log("One Search process is already running");
  }
});

/**
 * Gets list of library folders
 */
ipcMain.on("retrieve-library-folders", function (event, data) {
  var config = configDb;
  config.findOne(
    {
      type: "libraryFolders",
    },
    function (err, dbPref) {
      if (!err) {
        foldersList = dbPref.foldersList;
        sendContents("library-folders", foldersList);
      } else {
        reject();
      }
    }
  );
});

/**
 * Gets list of last searches
 */
ipcMain.on("get-search-list", function (event, data) {
  var config = configDb;
  config.findOne(
    {
      type: "searchList",
    },
    function (err, dbPref) {
      if (!err) {
        searchList = dbPref.list;
        sendContents("search-list", searchList);
      } else {
        reject();
      }
    }
  );
});

/* Preferences
----------------------*/
/* Logger */
ipcMain.on(IPCRendererChannel.PREFERENCES_GET, function (event, data) {
  DEBUG.log("preferences-get ", data);
  configDb.findOne({ type: "preferences" }, function (err, dbPref) {
    if (!err) {
      DEBUG.log("dbPref: ", dbPref);
      sendContents(IPCMainChannel.PREFERENCES_GET_COMPLETE, dbPref);
    } else {
      reject();
    }
  });
});

ipcMain.on(IPCRendererChannel.PREFERENCES_SET, function (event, data) {
  DEBUG.log("preferences-set ", data);
  configDb.update({ type: "preferences" }, { $set: data }, {}, function (
    err,
    result
  ) {
    if (!err) {
      DEBUG.log("result", result);
      sendContents(IPCMainChannel.PREFERENCES_SET_COMPLETE, result);
    } else {
      DEBUG.log(err);
    }
  });
});
/* Preferences---------------------*/

/**
 * Gets all movies from libraryFiles.db
 */
ipcMain.on("get-library-movies", function (event, data) {
  DEBUG.log("get movies from library..", data);
  // if (!procLibraryDb) {
  let localProcLibraryDb = forkChildProcess(
    "src/assets/scripts/library-db-service-2.js",
    data,
    // PROC_OPTION
    { cwd: __dirname, silent: false }
  );
  localProcLibraryDb.on("exit", function () {
    DEBUG.log("get-library-movies process ended");
    localProcLibraryDb = null;
  });
  localProcLibraryDb.on("message", (m) => sendContents(m[0], m[1]));
});

/**
 * Gets the movie from libraryFiles.db
 */
ipcMain.on("get-library-movie", function (event, data) {
  DEBUG.log("get 1 movie from library..", data);
  procLibraryDb = forkChildProcess(
    "src/assets/scripts/library-db-service-2.js",
    // "src/assets/scripts/library-db-service.js",
    ["find-one", data[0], data[1]],
    PROC_OPTION
  );
  procLibraryDb.stdout.on("data", (data) => printData(data));
  procLibraryDb.on("exit", function () {
    DEBUG.log("get-library-movie process ended");
  });
  procLibraryDb.on("message", (m) => sendContents(m[0], m[1]));
});

ipcMain.on("get-torrents-title", function (event, data) {});

/**
 * Gets all movies from movieData.db
 * TODO: minify the param2 to just the basic movie metadata. Otherwise, it will an error: 'error spawn ENAMETOOLONG'
 */
ipcMain.on("movie-metadata", function (event, data) {
  let param2 = "";
  offlineMovieDataService = forkChildProcess(
    "src/assets/scripts/offlineMetadataService.js",
    [data[0], param2],
    PROC_OPTION
  );
  offlineMovieDataService.stdout.on("data", (data) => printData(data));
  offlineMovieDataService.on("exit", function () {
    DEBUG.log("movie-metadata process ended");
  });
  offlineMovieDataService.on("message", (m) => sendContents(m[0], m[1]));
});

/**
 * Procesess images.
 */
ipcMain.on("get-image", function (event, data) {
  DEBUG.log("image-data-service..", data[0], data[1]);
  procmovieImageService = forkChildProcess(
    "src/assets/scripts/image-data-service.js",
    [data[0], data[1], data[2], data[3]],
    PROC_OPTION
  );
  procmovieImageService.stdout.on("data", (data) => printData(data));
  procmovieImageService.on("exit", function () {
    DEBUG.log("image-data process ended");
  });
  procmovieImageService.on("message", (m) => sendContents(m[0], m[1]));
});

// TORRENTS
ipcMain.on("torrent-search", function (event, data) {
  if (!procTorrentSearch) {
    procTorrentSearch = forkChildProcess(
      "src/assets/scripts/search-torrent.js",
      [data[0], [data[1]]],
      PROC_OPTION
    );
    procTorrentSearch.stdout.on("data", (data) => printData(data));
  } else {
    DEBUG.log("One Search process is already running");
  }
});

// USER DATA
ipcMain.on("user-data", function (event, data) {
    DEBUG.log("myProcUserData ", data);

    data[0] = JSON.stringify(data[0]);
    data[1] = JSON.stringify(data[1]);
    let myProcUserData = forkChildProcess(
      "src/assets/scripts/user-db-service.js",
      data,
      {
        cwd: __dirname,
        silent: false,
      }
    );
    myProcUserData.on("data", (data) => printData(data));
    myProcUserData.on("exit", function () {
      DEBUG.log("myProcUserData process ended");
      myProcUserData = null;
    });
    myProcUserData.on("message", (m) => sendContents(m[0], m[1]));

});

// BOOKMARK
ipcMain.on("bookmark", function (event, data) {
  // if (!procBookmark) {
    DEBUG.log("procBookmark ", data);

    data[0] = JSON.stringify(data[0]);
    data[1] = JSON.stringify(data[1]);
    let myProcBookmark = forkChildProcess(
      "src/assets/scripts/bookmark-db-service.js",
      data,
      PROC_OPTION
    );
    myProcBookmark.on("data", (data) => printData(data));
    myProcBookmark.on("exit", function () {
      DEBUG.log("procBookmark process ended");
      myProcBookmark = null;
    });
    myProcBookmark.on("message", (m) => sendContents(m[0], m[1]));
  // }
});

// WATCHED
ipcMain.on("watched", function (event, args) {
  DEBUG.log("procWatched ", args);
  args[0] = JSON.stringify(args[0]);
  args[1] = JSON.stringify(args[1]);
  let procWatched = forkChildProcess(
    "src/assets/scripts/watched-db-service.js",
    args,
    {
      cwd: __dirname,
      silent: false,
    }
    // PROC_OPTION
  );
  procWatched.on("exit", function () {
    DEBUG.log("procWatched process ended");
    procWatched = null;
  });
  procWatched.on("message", (m) => sendContents(m[0], m[1]));
});

ipcMain.on("subtitle", function (event, data) {
  dialog.showOpenDialog({filters:[{name:'Subtitle', extensions:['srt','vtt']}]}).then(e => {
    if (e.filePaths.length > 0 && !e.canceled) {
      if (e.filePaths[0].toLowerCase().endsWith('.srt')) {
        let procWatched = forkChildProcess(
          "src/assets/scripts/subtitle-service.js",
          args,
          PROC_OPTION
        );
        procWatched.on("exit", function () { procWatched = null; });
        procWatched.on("message", (m) => sendContents(m[0], m[1]));
      }
      if (e.filePaths[0].toLowerCase().endsWith('.vtt')) {
        sendContents("destination-path", e.filePaths[0]);
      }
    }
  });
});

/**
 * Gets the video by id and streams to localhost.
 */
ipcMain.on("play-offline-video-stream", function (event, data) {
  DEBUG.log("procVideoService", data);
  procVideoService = forkChildProcess(
    "src/assets/scripts/video-service.js",
    [data],
    PROC_OPTION
  );
  // procVideoService.stdout.on("data", (data) => printData(data));
  procVideoService.on("exit", function () {
    DEBUG.log("video service process ended");
    procVideoService = null;
  });
  procVideoService.on("message", (m) => sendContents(m[0], m[1]));
});

function forkChildProcess(modulePath, args, processOptions) {
  return cp.fork(path.join(__dirname, modulePath), args, processOptions);
}
function printError(processName, args) {
  DEBUG.log(`${processName} in error`, args);
}
function printData(data) {
  DEBUG.log("printing data", data.toString());
}

function sendContents(channel, args) {
  DEBUG.log("sending...", channel, " | ", args);
  mainWindow.webContents.send(channel, args); // reply
}

//---------------------------

/**
 * TODO: assign a global proc
 * @param {string} processName
 * @param {string []} procPath
 * @param {any[]} params
 * @param {null| import("child_process").ChildProcess} proc
 */
function startProc(processName, procPath, params) {
  DEBUG.log(`starting ${processName}...`);
  DEBUG.log(`starting ${procPath}...`);
  let proc = cp.fork(path.join(__dirname, procPath), params, PROC_OPTION);
  proc.on("exit", () => {
    DEBUG.log(`process ${processName} ended`);
    proc = null;
  });
  proc.on("message", function (m) {
    DEBUG.log(`message by ${processName} in IPCMAIN: `, m);
    mainWindow.webContents.send(m[0], m[1]);
  });
  proc.on("error", function (m) {
    DEBUG.log(`${scriptName} in error`, m);
  });
  proc.on("uncaughtException", function (m) {
    DEBUG.log(`${scriptName} in uncaughtException`, m);
  });
  // globalProc = proc;

  return proc;
}

/**
 * exit codes
 * 0 success
 * 1 general error / operation unsucesful
 * 126 - Command invoked cannot execute
 * 127 - “command not found”
 * 128 - Invalid argument to exit
 * 128+n - Fatal error signal “n”
 * 130 - Script terminated by Control-C
 */
