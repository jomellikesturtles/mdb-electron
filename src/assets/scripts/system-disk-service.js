/**
 * Service that checks system disk capcaity.
 * Deletes old webtorrent files.
 */
const checkDiskSpace = require("check-disk-space").default;
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const { prettyBytes } = require("./shared/util");

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
    // DEBUG.log("SIMULATING process.send", ...args);
  };

let USERNAME = require("os").userInfo().username;
console.log('username:', USERNAME);
const webTorrentFullFilePath = `C:\\Users\\${USERNAME}\\AppData\\Local\\Temp\\webtorrent`;
console.log('username:', webTorrentFullFilePath);

/**
 * Minimum 5GB
 */
function checkDiskAvailableSpace() {
  checkDiskSpace("C:\\").then((value) => {
    // console.log(value);
    if (value.free >= 5000000000) {
      process.send(["check-disk-ok", prettyBytes(value.free)]);
    } else {
      process.send(["check-disk-error", prettyBytes(value.free)]);
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
  // @ts-ignore
  const diffTime = Math.abs(currentDate - stat.birthtime);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 30;
}

/**
 *
 * @param {string} startPath
 */
function scanWebTorrentFolder(startPath) {
  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filePath = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      if (isRemoveFile(stat)) {
        // fs.rmdirSync(filePath);
        rimraf.sync(filePath); // rimraf offers recursive delete
      }
    }
  }
}
checkDiskAvailableSpace();
scanWebTorrentFolder(webTorrentFullFilePath);
