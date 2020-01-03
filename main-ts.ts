import { prepareSyntheticListenerFunctionName } from "@angular/compiler/src/render3/util";

/**
 * Main processor
 */
const cp = require('child_process');
const electron = require('electron')
const Datastore = require('nedb')
const datastore = new Datastore({
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
let mainWindow
let mdbTray
const appIcon = `${__dirname}/dist/mdb-electron/assets/icons/plex.png`

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
    // maxHeight:
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

function setSystemTray() { }
