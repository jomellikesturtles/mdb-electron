/*jshint esversion: 6 */
/**
 * Main processor
 */
// if (require("electron-squirrel-startup")) return;

const cp = require("child_process");
const electron = require("electron");
const Datastore = require("nedb");
const url = require("url");
var { DEBUG } = require("./src/assets/scripts/shared/util");
const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray, shell, dialog, nativeImage } = electron;
const IPCRendererChannel = require("./src/assets/IPCRendererChannel.json");
const IPCMainChannel = require("./src/assets/IPCMainChannel.json");
const configDb = new Datastore({
  filename: "src/assets/config/config.db",
  autoload: true
});
let { onUserData } = require("./src/assets/scripts/user-media-db");
const { onLibrary } = require("./src/assets/scripts/library-db-service");
const { onPreferences } = require("./src/assets/scripts/preferences-service");

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
let splashWindow;
const appIcon = `${__dirname}/dist/mdb-electron/assets/icons/plex.png`;

let isMac = process.platform === "darwin";

// let shouldQuit = app.requestSingleInstanceLock()

switch (process.platform) {
  case "win32":
    DEBUG.log("Detected windows");
    break;
  case "darwin":
    DEBUG.log("Detected MacOS");

    break;
}

process.on("uncaughtException", (error) => {
  DEBUG.error("uncaughtException", error.message);
  sendContents("error", JSON.stringify(error));
});
process.on("unhandledRejection", (error) => {
  DEBUG.error("unhandledRejection", error);
  sendContents("error", JSON.stringify(error));
});
process.on("error", (error) => {
  DEBUG.error("error", error);
  sendContents("error", JSON.stringify(error));
});

const PROC_OPTION = {
  cwd: __dirname,
  silent: true
};

/**
 * Creates the browser window
 */
function createMainWindow() {
  DEBUG.log("[MAIN] Creating mainWindow...");
  mainWindow = new BrowserWindow({
    minWidth: 762,
    minHeight: 700,
    show: true,
    frame: false,
    icon: path.join(__dirname, "src/assets/icons/plex.png"),
    titleBarStyle: isMac ? "hidden" : "default",
    trafficLightPosition: isMac ? { x: 10, y: 10 } : undefined,
    backgroundColor: "#1e2a31",
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      nativeWindowOpen: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: appIcon,
    title: "MDB"
  });
  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  DEBUG.log("[MAIN] Loading mainWindow");

  // mainWindow.loadURL(`file://${__dirname}/dist/mdb-electron/index.html`); // It will load in production mode
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "dist/mdb-electron/index.html"),
      protocol: "file:",
      slashes: true
    })
  ); // It will load in production mode
  // Event when the window is closed.
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  app.whenReady().then(() => {
    DEBUG.log("splashWindow: ", splashWindow);
    if (splashWindow) {
      DEBUG.log("closing splash window...");
      splashWindow.close();
    }
  });
  mainWindow.webContents.once("dom-ready", function () {
    splashWindow.close();
    DEBUG.log("domready");
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

  if (isMac) {
    const iconImage = nativeImage.createFromPath(path.join(__dirname, "src/assets/icons/plex.png"));
    app.dock.setIcon(iconImage);
  }
}
app.setAppUserModelId(process.execPath);
// Create window on electron initialization
app.on("ready", showSplash);
app.on("ready", showWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("before-quit", function () {
  // TODO: save changes
  globalShortcut.unregisterAll();
  mainWindow.removeAllListeners("close");
  mainWindow.close();
});
app.on("activate", function () {
  DEBUG.log("activate");
  if (mainWindow === null) {
    createMainWindow();
  }
});
const TEMP_FOLDER = path.join(process.cwd(), "dist/mdb-electron/tmp");
if (!fs.existsSync(TEMP_FOLDER)) {
  fs.mkdirSync(TEMP_FOLDER, { recursive: true });
}

function showSplash() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: false,
    show: false,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      // preload: __dirname + "/preload.js",
      // experimentalFeatures: true,
      nodeIntegration: false,
      webSecurity: false,
      nativeWindowOpen: true,
      devTools: true
    },
    title: "Starting MDB"
  });

  splashWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "WndSplash.html"),
      protocol: "file:",
      slashes: true
    })
  );

  splashWindow.webContents.once("dom-ready", function () {
    DEBUG.log("Splash webcontents dom ready");
    splashWindow.show();
    // mainWindow.show();
  });

  splashWindow.once("show", function () {
    DEBUG.log("Splash shown");
    splashWindow.webContents.send("fade");
  });
}

ipcMain.on("splash-done", function (event, msg) {
  DEBUG.log("splash-done");
  createMainWindow();
  splashWindow.webContents.send("fade");
});

function setSystemTray() {
  const trayIconPath = path.join(__dirname, "src/assets/icons/plex.png");
  let nimage = nativeImage.createFromPath(trayIconPath);

  if (isMac) {
    nimage = nimage.resize({ width: 18, height: 18 });
    nimage.setTemplateImage(true);
  }

  mdbTray = new Tray(nimage);
  const trayMnu = Menu.buildFromTemplate([
    // { label: "Preferences", icon: trayIcon, enabled: false },
    // { label: "Torrent1", click: playTorrentSample },
    // { label: "Torrent2", click: playTorrentSample2 },
    { label: "MDB", click: app.focus },
    { label: "Quit", click: app.quit }
  ]);
  mdbTray.setToolTip("Media Database");
  mdbTray.setContextMenu(trayMnu);
  mdbTray.on("click", showWindow);
  mdbTray.on("double-click", showWindow);
  if (isMac) {
    const dockMenu = Menu.buildFromTemplate([
      {
        label: "MDB",
        click: () => {}
      },
      { type: "separator" },
      {
        label: "Check for updates",
        click: () => {}
      },
      {
        label: "Quit",
        click: () => {}
      }
    ]);

    app.dock.setMenu(dockMenu);
  }
}

// Show and Focus mainWindow
function showWindow() {
  createMainWindow();
  DEBUG.log("Showing window...");
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.focus();
  if (isMac) {
    app.dock.show();
  }
}

ipcMain.on(IPCRendererChannel.STOP_STREAM, function (event, args) {
  DEBUG.log("received Stop Stream");
  procWebTorrent.send(["stop-stream"]);
  if (procVideoService) {
    DEBUG.log("killing procVideoService");
    procVideoService.kill();
  }
});

ipcMain.on(IPCRendererChannel.PLAY_TORRENT, function (event, args) {
  const hash = Array.isArray(args) ? args[0] : args;
  DEBUG.log("playtorrentArgs (unwrapped): ", hash);
  procWebTorrent.send(["play-torrent", hash]);
});

function startTorrentClient() {
  DEBUG.log("Forking procWebTorrent....");
  procWebTorrent = forkChildProcess("src/assets/scripts/webtorrent.js", [], {
    cwd: __dirname,
    silent: false
  });
  procWebTorrent.on("error", (e) => printError("procWebTorrent", e));
  procWebTorrent.on("exit", function () {
    DEBUG.log("procWebTorrent ended");
  });
  procWebTorrent.send(["stop-stream"]);
  /**
   * webtorrent client messages:
   * 1. stream-link
   * 2. stats
   */
  procWebTorrent.on("message", (m) => {
    DEBUG.log("procWebTorrent message on main: ", m);
    if (m[0] === "stream-link") {
      sendContents(IPCMainChannel.STREAM_LINK, m[1]);
    } else if (m[0] === "stats") {
      sendContents(IPCMainChannel.STATS, m[1]);
    } else {
      sendContents(m[0], m[1]);
    }
  });
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

ipcMain.on(IPCRendererChannel.ExitApp, function () {
  DEBUG.log("Exiting app...");
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
  procLibraryDb = forkChildProcess("src/assets/scripts/file-explorer.js", [param[0], param[1]], PROC_OPTION);
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

// Library
/**
 * Initializes scan-library.js
 */
ipcMain.on(IPCRendererChannel.SCAN_LIBRARY_START, function (event) {
  DEBUG.log("scan-library");
  if (!procScanLibrary) {
    // if process search is not yet running
    procScanLibrary = forkChildProcess("src/assets/scripts/scan-library.js", [], {
      cwd: __dirname,
      silent: false
    });
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

/**
 * currently using libraryFiles.db
 */
ipcMain.on("library", function (event, data) {
  DEBUG.log("on library", data);
  onLibrary(data, mainWindow);
});

/**
 * Gets list of library folders
 */
ipcMain.on("retrieve-library-folders", function (event, data) {
  var config = configDb;
  config.findOne(
    {
      type: "libraryFolders"
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
      type: "searchList"
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

// preferences: changeable by user or config: not changeable by user
ipcMain.on("preferences", function (event, data) {
  DEBUG.log("on preferences", data);
  onPreferences(data, mainWindow);
});

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
  configDb.update({ type: "preferences" }, { $set: data }, {}, function (err, result) {
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
    procTorrentSearch = forkChildProcess("src/assets/scripts/search-torrent.js", [data[0], [data[1]]], PROC_OPTION);
    procTorrentSearch.stdout.on("data", (data) => printData(data));
  } else {
    DEBUG.log("One Search process is already running");
  }
});

// USER DATA
ipcMain.on("user-data", function (event, rawData) {
  onUserData(rawData, mainWindow);
});

// TODO: check if destination file already exists & equal
// TODO: support other formats
ipcMain.on("get-subtitle", function (event, data) {
  dialog.showOpenDialog({ filters: [{ name: "Subtitle", extensions: ["srt"] }] }).then((e) => {
    if (e.filePaths.length > 0 && !e.canceled) {
      const subtitlePath = path.join(TEMP_FOLDER, path.basename(e.filePaths[0]));
      const data = new Uint8Array(Buffer.from(fs.readFileSync(e.filePaths[0])));
      // fs.copyFile(e.filePaths[0], subtitlePath, (err) => {
      fs.writeFile(subtitlePath, data, (err) => {
        if (err) throw err;
        DEBUG.log("The file has been saved!");
        if (err) {
          DEBUG.log(err);
        }
        DEBUG.log("subtitle-path", subtitlePath);
        sendContents("subtitle-path", subtitlePath);
        // sendContents("subtitle-path", path.basename(e.filePaths[0]));
      });
    }
  });
});

/**
 * Gets the video by id and streams to localhost.
 * @param libraryFileId libraryFile Id
 */
ipcMain.on("play-offline-video-stream", function (event, libraryFile) {
  DEBUG.log("procVideoService", mediaUserData);
  procVideoService = forkChildProcess(
    "src/assets/scripts/video-service.js",
    [libraryFileId],
    // PROC_OPTION
    {
      cwd: __dirname,
      silent: false
    }
  );
  // procVideoService.stdout.on("data", (data) => printData(data));
  procVideoService.on("error", (e) => printError("play-offline-video-stream", e));
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
  sendError(processName, args);
}

function sendError(source, error) {
  const appError = {
    source: source,
    message: error.message || error.toString(),
    stack: error.stack,
    timestamp: Date.now()
  };
  DEBUG.error(`[Error][${source}]`, appError);
  sendContents("error", appError);
}

process.on("uncaughtException", (error) => {
  sendError("main-uncaught", error);
});

process.on("unhandledRejection", (reason, promise) => {
  sendError("main-unhandled-rejection", reason);
});

function printData(data) {
  DEBUG.log("printing data", data.toString());
}

function sendContents(channel, args) {
  DEBUG.log("sending...", channel, " | ", args);
  if (mainWindow) mainWindow.webContents.send(channel, args); // reply
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
