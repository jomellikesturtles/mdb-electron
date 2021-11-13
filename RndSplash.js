
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

const prestartPath = path.join(__dirname, "src/assets/scripts/pre-start.js");
console.log(prestartPath);
procPreStart = window.fork(prestartPath, null, {
  cwd: __dirname,
  silent: false,
});
document.getElementById("message").innerHTML = "initializing...";

procPreStart.on("exit", function () {
  DEBUG.log("EXIT");
  ipcRenderer.send("splash-done");
});
procPreStart.on("message", function (msg) {
  console.log("MSG:", msg);
  if (msg && msg.length > 1) {
    switch (msg[0]) {
      case "status":
        document.getElementById("message").innerHTML = msg[1];
        break;
      case "error":
        ipcRenderer.send("splash-error", ["mymessage"]);
        exit(1);
        break;
      case "warning":
        ipcRenderer.send("splash-warning", []);
        break;

      default:
        break;
    }
  }
});

procPreStart.on("uncaughtException", function (event, msg) {
  console.log("uncaughtException:", msg);
  ipcRenderer.send("splash-error", "123");
});
procPreStart.on("rejectionHandled", function (event, msg) {
  console.log("rejectionHandled:", msg);
  ipcRenderer.send("splash-error", "123");
});
procPreStart.on("unhandledRejection", function (event, msg) {
  console.log("unhandledRejection 123:", msg);
  ipcRenderer.send("splash-error", "123");
});

//  'checking disk space...',
//  'checking trial...',
//  'checking internet connection...',
//  'launching main app...',
