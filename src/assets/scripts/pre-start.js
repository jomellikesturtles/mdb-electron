/**
 *  Pre-start
 **/
let moment = require("moment"),
  request = require("request");
let cp = require("child_process");
const path = require("path");
var { getFuncName, DEBUG, processInit } = require("./shared/util");
const { exit } = require("process");
const { getFreeDiskSpace } = require("./system-disk-service");
const { SIZE_LIMIT } = require("./shared/constants");

let procDiskCheck;
let procTorrentFilesCheck;

processInit(process);

/**
 *  Until January 1, 2023
 */
async function checkTrial() {
  DEBUG.log(getFuncName(), "checking trial");
  return new Promise(function (resolve, reject) {
    request(
      "http://worldtimeapi.org/api/timezone/Asia/Manila",
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(response.body);
          let responseDateTime = responseBody.datetime;
          let internetDate = new Date(responseDateTime);

          let endDate = new Date();
          endDate.setFullYear(2025);
          endDate.setMonth(0);
          endDate.setDate(1);
          endDate.setHours(0);
          endDate.setMinutes(0);
          endDate.setSeconds(0);
          endDate.setMilliseconds(0);

          const isTrialOk = endDate > internetDate;
          DEBUG.log(getFuncName(), "istrialOk", isTrialOk);
          resolve(isTrialOk);
        } else {
          DEBUG.log(getFuncName(), "error", error);
          reject(error);
        }
      }
    );
  });
}

/**
 * Check internet connection
 * TODO: check tmdb connection.
 */
async function checkAPIConnection() {
  DEBUG.log(getFuncName(), "checking internet connection");
  return new Promise(function (resolve) {
    require("dns").resolve("www.google.com", function (err) {
      if (err) {
        DEBUG.log(getFuncName(), "No connection");
        resolve(false);
      } else {
        DEBUG.log(getFuncName(), "Connected");
        resolve(true);
      }
    });
  });
}

/**
 * Minumum 5GB
 * @returns {boolean}
 */
function checkDiskSpace() {
  DEBUG.log(getFuncName(), "starting checkDiskSpace...");
  return new Promise((resolve) => {
    getFreeDiskSpace("C").then((value) => {
      if (value >= SIZE_LIMIT) {
        DEBUG.log(value);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
  //   filename: path.join(__dirname, '..', 'db', 'bookmark.db'), // node
  // filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
  // procDiskCheck = startProc("src/assets/scripts/system-disk-service.js", [ // node
  // procDiskCheck = startProc("system-disk-service.js", [
  //   JSON.stringify({
  //     operation: "check-disk",
  //   }),
  // ]);
  // return new Promise((resolve, reject) => {
  //   procDiskCheck.on("message", function (msg) {
  //     if (msg == "check-disk-ok") {
  //       resolve(true);
  //     } else if (msg == "check-disk-not-enough") {
  //       resolve(false);
  //     }
  //   });
  // });
}

/**
 * checks for old torrent folders
 * @returns
 */
function checkTorrentFolders() {
  DEBUG.log(getFuncName(), "starting checkFiles...");
  // procTorrentFilesCheck = startProc("src/assets/scripts/system-disk-service.js", [
  procTorrentFilesCheck = startProc("system-disk-service.js", [
    JSON.stringify({
      operation: "check-torrent-folders",
    }),
  ]);
  return new Promise((resolve, reject) => {
    procTorrentFilesCheck.on("exit", function (code) {
      DEBUG.log("EXITING with code", code);
      if (code == 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

function startProc(modulePath, args) {
  DEBUG.log("ARGS: ", args);
  return cp.fork(path.join(modulePath), args, {
    // return cp.fork(path.join(__dirname, modulePath), args, {
    cwd: __dirname,
    silent: false,
  });
}

async function initPreStart() {
  process.send(["status", "checking internet connection..."]);
  const isAPIGood = await checkAPIConnection();
  if (!isAPIGood) {
    process.send(["error", "No internet connection."]);
    process.exit(1);
  }
  process.send(["status", "checking trial..."]);
  // const isTrialGood = await checkTrial();
  // if (!isTrialGood) {
  //   process.send(["error", "Trial has expired."]);
  //   process.exit(1);
  // } else {
  //   DEBUG.log(getFuncName(), "trial Good");
  // }
  process.send(["status", "checking disk space...."]);
  let isDiskSpacePassed = await checkDiskSpace();
  // const isDiskSpaceGood = await checkDiskSpace();

  if (!isDiskSpacePassed) {
    DEBUG.log("isDiskSpacePassed not passed");
    process.send([
      "error",
      "Not enough disk space! Minimum 5GB is required to run the application.",
    ]);
    process.exit(1);
  }

  // TODO: fix stuck
  // process.send(["status", "checking old torrent files...."]);
  // const isTorrentFoldersGood = await checkTorrentFolders();
  // if (!isTorrentFoldersGood) {
  //   process.send(["warning", "Unable to delete old."]);
  // }
  DEBUG.log(getFuncName(), "exiting init...");
  process.exit(0);
}
DEBUG.log(getFuncName(), "initializing pre-start...");
process.send(["status", "initializing pre-start..."]);
initPreStart();
// exit(1);
// try {
//   // process.exit(0);
//   throw "I'm Evil";
//   DEBUG.log(getFuncName(), "You'll never reach to me", 123465);
// } catch (e) {
//   DEBUG.log(e); // I'm Evil
// }

// TODO: handle errors
