// const cp = require("child_process");
// const {ipcRenderer} = require('electron');
// const url = require('url');
// import { exec, fork } from "child_process";
// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     ipcRenderer.send('logger', '[SPLASH]' + error.stack);
// }; // Send window errors to Main process

// ipcRenderer.on('fade', function () {
//     document.body.style.opacity = '1';
// });
// alert(document.getElementById("message").innerHTML);

let procPreStart;

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

console.log(path.join(__dirname, "src/assets/scripts/pre-start.js"));
procPreStart = window.fork(
  path.join(__dirname, "src/assets/scripts/pre-start.js"),
  null,
  {
    cwd: __dirname,
    silent: false,
  }
);
document.getElementById("message").innerHTML = "initializing...";

procPreStart.on("exit", function () {
  DEBUG.log("EXIT");
  ipcRenderer.send("splash-done");
});
procPreStart.on("message", function (event, msg) {
  console.log("MSG:", msg);
  document.getElementById("message").innerHTML = msg;
});

/*
 * webtorrent client messages:
 * 1. streamlink
 * 2. progress
 */

//  'checking disk space...',
//  'checking trial...',
//  'checking internet connection...',
//  'launching main app...',

document.getElementById("message").innerHTML = "CHANGED...";

window.ipcRenderer.on("message", function (event, msg) {
  // document.getElementById("message").innerHTML = msg;
});
