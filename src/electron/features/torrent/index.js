const TorrentService = require('./torrent.service');
const TorrentIpc = require('./torrent.ipc');
const FeatureToggleService = require('../../core/services/feature-toggle.service');

/**
 * Torrent Feature Module
 * Composition Root for the Torrent feature.
 */
class TorrentModule {
  /**
   * @param {Electron.IpcMain} ipcMain 
   * @param {Electron.BrowserWindow} mainWindow 
   */
  constructor(ipcMain, mainWindow) {
    this.ipcMain = ipcMain;
    this.mainWindow = mainWindow;
    this.service = TorrentService;
    this.controller = new TorrentIpc(ipcMain, this.service, FeatureToggleService);
  }

  init() {
    console.log('[TorrentModule] Initializing...');
    
    // Start the worker process
    this.service.start();

    // Register IPC listeners
    this.controller.register();
  }
}

module.exports = TorrentModule;
