const IPCRendererChannel = require('../../../assets/IPCRendererChannel.json');

/**
 * Torrent IPC Handler
 * Maps Electron IPC events to the TorrentService.
 */
class TorrentIpc {
  /**
   * @param {Electron.IpcMain} ipcMain 
   * @param {import('./torrent.service')} torrentService 
   * @param {import('../../core/services/feature-toggle.service')} toggleService 
   */
  constructor(ipcMain, torrentService, toggleService) {
    this.ipcMain = ipcMain;
    this.service = torrentService;
    this.toggles = toggleService;
  }

  register() {
    console.log('[TorrentIpc] Registering handlers...');

    // Handler for PLAY_TORRENT
    this.ipcMain.on(IPCRendererChannel.PLAY_TORRENT, (event, args) => {
      if (this.toggles.isEnabled('NEW_TORRENT_ENGINE')) {
        console.log('[TorrentIpc] Using NEW_TORRENT_ENGINE');
        
        // args might be just the magnet link string or an object depending on legacy code
        const magnetLink = args; 

        this.service.play(magnetLink);
        // Note: The worker replies directly or via service events. 
        // We need to bridge service events back to the renderer if they are not 1:1 request/response.
        // For now, let's assume the worker handles the logic and sends a message we forward.
        
        // Forward 'stream-link' from service/worker to renderer
        this.service.worker.on('STREAM_READY', (payload) => {
           event.reply('stream-link', payload.url);
        });

      } else {
        console.warn('[TorrentIpc] NEW_TORRENT_ENGINE disabled. Legacy handler in main.js should pick this up if not removed.');
      }
    });

    // Handler for STOP_STREAM
    this.ipcMain.on(IPCRendererChannel.STOP_STREAM, (event, args) => {
        if (this.toggles.isEnabled('NEW_TORRENT_ENGINE')) {
            this.service.stop();
        }
    });
  }
}

module.exports = TorrentIpc;
