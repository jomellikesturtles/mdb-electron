const { contextBridge, ipcRenderer } = require("electron");
const { DEBUG } = require("./src/assets/scripts/shared/util");
DEBUG.log("[PRELOAD] Starting preload.");
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = [
        "logger",
        "RestoreApp",
        "MinimizeApp",
        "ExitApp",
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
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      let validChannels = [
        "error",
        "fade",
        "system-drives",
        "library-folders",
        "search-list",
        "preferences-get-complete",
        "preferences-set-complete",
        "movie-metadata-result",
        "image-data-result",
        "torrent-search-result",
        "user-data-result",
        "subtitle-path",
        "streamlink",
        "progress",
        "notify"
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    removeListener: (channel, func) => {
      ipcRenderer.removeListener(channel, func);
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    },
    invoke: (channel, data) => {
      return ipcRenderer.invoke(channel, data);
    }
  }
});

DEBUG.log("[PRELOAD] End of preload.");
