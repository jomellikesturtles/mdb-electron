const { contextBridge, ipcRenderer } = require("electron");

// Simple local logger for preload to avoid loading restricted Node APIs from shared utils
const DEBUG = {
  log: (...args) => console.log("[PRELOAD]", ...args),
  error: (...args) => console.error("[PRELOAD]", ...args)
};

DEBUG.log("Starting preload.");

const VALID_SEND_CHANNELS = new Set([
        "logger",
        "app-min",
        "app-restore",
        "exit-program",
        "open-file-explorer",
        "go-to-folder",
        "get-drives",
        "open-link-external",
        "scan-library-start",
        "scan-library-stop",
        "library",
        "retrieve-library-folders",
        "search-query",
        "get-search-list",
        "preferences",
        "preferences-get",
        "preferences-set",
        "movie-metadata",
        "get-image",
        "torrent-search",
        "user-data",
        "get-subtitle",
        "play-offline-video-stream",
        "play-torrent",
        "stop-stream"
]);

const VALID_RECEIVE_CHANNELS = new Set([
        "error",
        "fade",
        "system-drives",
        "library-folders",
        "library-movie",
        "library-movies",
        "search-list",
        "preferences-get-complete",
        "preferences-set-complete",
        "movie-metadata-result",
        "image-data-result",
        "torrent-search-result",
        "user-data-result",
        "subtitle-path",
        "stream-link",
        "stats",
        "notify",
        "can-play"
]);

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => {
      if (VALID_SEND_CHANNELS.has(channel)) {
        ipcRenderer.send(channel, data);
      } else {
        console.error(`[PRELOAD] Blocked unauthorized send: ${channel}`);
      }
    },
    on: (channel, func) => {
      if (VALID_RECEIVE_CHANNELS.has(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      } else {
        console.error(`[PRELOAD] Blocked unauthorized listener (on): ${channel}`);
      }
    },
    once: (channel, func) => {
      if (VALID_RECEIVE_CHANNELS.has(channel)) {
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      } else {
        console.error(`[PRELOAD] Blocked unauthorized listener (once): ${channel}`);
      }
    },
    removeListener: (channel, func) => {
      ipcRenderer.removeListener(channel, func);
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    },
    invoke: (channel, data) => {
      if (VALID_SEND_CHANNELS.has(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
    }
  }
});

DEBUG.log("[PRELOAD] End of preload.");
