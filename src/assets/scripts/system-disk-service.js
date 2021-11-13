/**
 * Service that checks system disk capcaity.
 * Deletes old webtorrent files.
 */
const checkDiskSpace = require("check-disk-space").default;
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const { prettyBytes } = require("./shared/util");

let args = process.argv.slice(2);
let headers = args[0];
let body = args[1];

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

process.on("uncaughtException", function (error) {
  console.log("ERROR: ", error);
});

process.on("unhandledRejection", function (error) {
  console.log("unhandledRejection ERROR: ", error);
});

process.on("exit", function (error) {
  console.log("exit ERROR: ", error);
});

process.on("disconnect", function (error) {
  console.log("disconnect: ", error);
});
process.send =
  process.send ||
  function (...args) {
    DEBUG.log("SIMULATING process.send", ...args);
  };

let USERNAME = require("os").userInfo().username;
DEBUG.log("username:", USERNAME);
const WEBTORRENT_FULL_FILE_PATH = `C:\\Users\\${USERNAME}\\AppData\\Local\\Temp\\webtorrent`;
DEBUG.log("webTorrentFullFilePath:", WEBTORRENT_FULL_FILE_PATH);

/**
 * Minimum 5GB
 */
function checkDiskAvailableSpace() {
  DEBUG.log("Checking disk available space");
  checkDiskSpace("C:\\").then((value) => {
    DEBUG.log("Available space: ", prettyBytes(value.free));
    if (value.free >= 5000000000) {
      process.send("check-disk-ok");
      // process.send(["check-disk-ok", prettyBytes(value.free)]);
    } else {
      process.send("check-disk-not-enough");
    }
  });
}

/**
 * Removes old webtorrent files after 30 days of file birth.
 * TODO: Remove if not modified(seeded) internal files in x number of days.
 * @param {import("fs").Stats} stat
 */
function isRemoveFile(stat) {
  const currentDate = new Date();

  const diffTime = Math.abs(currentDate - stat.birthtime);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 30;
}

/**
 *
 */
function scanWebTorrentFolder() {
  var files = fs.readdirSync(WEBTORRENT_FULL_FILE_PATH);
  for (var i = 0; i < files.length; i++) {
    var filePath = path.join(WEBTORRENT_FULL_FILE_PATH, files[i]);
    var stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      if (isRemoveFile(stat)) {
        DEBUG.log("Removing filepath: ", filePath);
        // fs.rmdirSync(filePath);
        rimraf.sync(filePath); // rimraf offers recursive delete
      }
    }
  }
  DEBUG.log("exiting scanWebTorrentFolder...");
  process.exit(0);
}

function initializeService() {
  const myHeaders = JSON.parse(headers);
  // const dataArgs = JSON.parse(body);
  const command = myHeaders.operation;
  console.log("myHeaders", myHeaders);
  // console.log("dataArgs", dataArgs);

  switch (command) {
    case "check-disk":
      checkDiskAvailableSpace();
      break;
    case "check-torrent-folders":
      scanWebTorrentFolder();
      break;
    default:
      break;
  }
}

initializeService();
