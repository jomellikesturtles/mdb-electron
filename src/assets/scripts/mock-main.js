const { DEBUG } = require("./shared/util");

const cp = require("child_process");
const path = require("path");
const fs = require("fs");


function init(data) {
  DEBUG.log(data)
  let myProcUserData = forkChildProcess(
    "./user-db-service-new.js",
    data,
    {
      cwd: __dirname,
      silent: false,
    }
  );
  myProcUserData.on("data", (data) => printData(data));
  myProcUserData.on("exit", function () {
    DEBUG.log("myProcUserData process ended");
    myProcUserData = null;
  });
  myProcUserData.on("message", (m) => sendContents(m[0], m[1]));
}
function forkChildProcess(modulePath, args, processOptions) {
  console.log();
  return cp.fork(path.join(__dirname, modulePath), [args], processOptions);
}
function printError(processName, args) {
  DEBUG.log(`${processName} in error`, args);
}
function printData(data) {
  DEBUG.log("printing data", data.toString());
}
function sendContents(channel, args) {
  DEBUG.log("sending...", channel, " | ", args);
  // mainWindow.webContents.send(channel, args); // reply
}

init('{"headers":{"operation":"save","subChannel":"bookmarks","uuid":"1234-abcd"},"body":{"tmdbId":1234}}');
