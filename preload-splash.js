// Preload script specifically for the splash window to restore legacy requirements safely
window.ipcRenderer = require('electron').ipcRenderer;
window.fork = require("child_process").fork;
window.path = require("path");
window.__dirname = __dirname;
