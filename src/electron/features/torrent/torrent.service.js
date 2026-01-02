const path = require('path');
const WorkerManager = require('../../core/services/worker-manager.service');

class TorrentService {
  constructor() {
    // Determine the correct path to the worker script
    // Note: In production, this might need adjustment based on electron-builder packaging
    const workerPath = path.join(__dirname, 'worker', 'torrent.worker.js');
    
    this.worker = WorkerManager.create('torrent', workerPath);
    
    // Forward standard events if needed
    this.worker.on('error', (err) => console.error('Torrent Worker Error:', err));
  }

  start() {
    this.worker.start();
  }

  /**
   * Starts playing a torrent.
   * @param {string} magnetLink 
   */
  play(magnetLink) {
    // Uses the new standardized 'send' method which wraps data in WorkerMessage
    return this.worker.send('PLAY_TORRENT', magnetLink);
  }

  stop() {
    return this.worker.send('STOP_STREAM');
  }
}

module.exports = new TorrentService();
