{
  const ipcRenderer = window.ipcRenderer;
  const path = window.path;
  const __dirname = window.__dirname;
  let procPreStart;

  const startTime = Date.now();
  const timerElement = document.getElementById("timer");
  const messageElement = document.getElementById("message");

  const updateTimer = () => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    if (timerElement) timerElement.innerText = elapsed + "s";
  };

  setInterval(updateTimer, 100);

  let DEBUG = (() => {
    const getTimestamp = () => "[Splash][DEBUG " + new Date().toLocaleString() + "]";
    return {
      log: (...args) => console.log("%s", getTimestamp(), ...args)
    };
  })();

  DEBUG.log("Splash screen starting...");
  const getUnpackedPath = (p) => p ? p.replace(/app\.asar([\/\\]|$)/, 'app.asar.unpacked$1') : p;
  const prestartPath = getUnpackedPath(path.join(__dirname, "src/assets/scripts/pre-start.js"));
  procPreStart = window.fork(prestartPath, null, {
    cwd: getUnpackedPath(__dirname),
    silent: false
  });
  let currentTime = new Date();
  if (messageElement)
    messageElement.innerHTML = `initializing... ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

  procPreStart.on("exit", function () {
    DEBUG.log("EXIT");
    ipcRenderer.send("splash-done");
  });

  procPreStart.on("message", function (msg) {
    console.log("MSG:", msg);
    if (msg && msg.length > 1) {
      switch (msg[0]) {
        case "status":
          if (messageElement) messageElement.innerHTML = msg[1];
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
    ipcRenderer.send("splash-error", "UncaughtException:" + msg);
  });
  procPreStart.on("rejectionHandled", function (event, msg) {
    console.log("rejectionHandled:", msg);
    ipcRenderer.send("splash-error", "Rejection Error: ", msg);
  });
  procPreStart.on("unhandledRejection", function (event, msg) {
    console.log("unhandledRejection:", msg);
    ipcRenderer.send("splash-error", "Unhandled Error: " + msg);
  });
}
