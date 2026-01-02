/**
 * Torrent Worker - Modularized & Typed
 * Handles the heavy lifting of WebTorrent streaming.
 */
const WorkerMessage = require('../../../core/contracts/worker-message.contract');
// In a full refactor, we would import the logic from webtorrent.js here
// For now, we simulate the structure to demonstrate the IPC Fix.

process.on('message', (rawMessage) => {
  try {
    const message = WorkerMessage.fromRaw(rawMessage);
    handleMessage(message);
  } catch (error) {
    sendError('INVALID_MESSAGE', error.message);
  }
});

function handleMessage(message) {
  switch (message.type) {
    case 'PLAY_TORRENT':
      startStreaming(message.payload);
      break;
    case 'STOP_STREAM':
      stopStreaming();
      break;
    default:
      console.warn(`Unknown message type: ${message.type}`);
  }
}

function startStreaming(magnetLink) {
  // Logic to start WebTorrent...
  // Simulating response:
  reply('STREAM_READY', { url: 'http://localhost:3000/stream', magnetLink });
}

function stopStreaming() {
  // Logic to stop...
  reply('STREAM_STOPPED');
}

/**
 * Helper to send typed responses back to Main
 */
function reply(type, payload) {
  const response = new WorkerMessage(type, payload);
  if (process.send) {
    process.send(response);
  }
}

function sendError(code, details) {
  reply('ERROR', { code, details });
}
