// transtion play process for ..... checks/processes before starting another play
let cp = require("child_process");
const path = require("path");
var { DEBUG, processInit } = require("./shared/util");
const { exit } = require("process");
const { getFreeDiskSpace } = require("./system-disk-service");

let procDiskCheck;
let procTorrentFilesCheck;

processInit(process);

async function checkDisk() {
  let freeSpace = await getFreeDiskSpace("C");
  DEBUG.log(freeSpace);
  if (freeSpace >= 5000000000) {
  }
}

function init() {
  // diskspace,
  // if not enough, delete more
  checkDisk();
  // const cpPath = path.join(process.cwd(), "system-disk-service.js");
  // // filename: path.join(process.cwd(), 'src', 'assets', 'db', 'favorites.db'),
  // DEBUG.log(cpPath);
  // procDiskCheck = cp.fork(cpPath, null, {
  //   cwd: __dirname,
  //   silent: false,
  // });
  // procDiskCheck.on("message", function (message) {
  //   DEBUG.log(message);
  // });
  // procDiskCheck.on("exit", function (message) {
  //   DEBUG.log(message);
  // });
  // procDiskCheck.on("errror", function (message) {
  //   DEBUG.log(message);
  // });
}

init();
