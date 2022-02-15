/**
 * Service that checks system disk capcaity.
 * Deletes old webtorrent files.
 */
const checkDiskSpace = require("check-disk-space").default;
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const fastFolderSize = require("fast-folder-size");
const { prettyBytes, DEBUG, processInit } = require("./shared/util");

let args = process.argv.slice(2);
let headers = args[0];
let body = args[1];

processInit(process);

let USERNAME = require("os").userInfo().username;
DEBUG.log("username:", USERNAME);
const WEBTORRENT_FULL_FILE_PATH = `C:\\Users\\${USERNAME}\\AppData\\Local\\Temp\\webtorrent`;
DEBUG.log("webTorrentFullFilePath:", WEBTORRENT_FULL_FILE_PATH);

/**
 * Gets free space in bytes.
 * @param {string} disk
 */
function getFreeDiskSpace(disk) {
  DEBUG.log("Getting disk available space...");
  return new Promise((resolve, reject) => {
    checkDiskSpace(`${disk}:\\`)
      .then((e) => {
        resolve(e.free);
      })
      .catch((err) => {
        DEBUG.log("Error", err);
        reject(err);
      });
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
 * Scans and removes old webtorrent file/folder.
 * TODO: non-process
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

/**
 * Size of folder.
 * @param {string} filePath
 * @returns
 */
function getFolderSize(filePath) {
  return new Promise((resolve) => {
    fastFolderSize(filePath, (err, bytes) => {
      if (err) {
        throw err;
      }
      resolve(bytes);
      // console.log(bytes);
    });
  });
}

/**
 * Scans and removes old webtorrent file/folder.
 * Removes old webtorrent folder until enough space.
 */
function removescanWebTorrentFolderV2() {
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
}

/**
 * Counts folders in the webtorrent folder
 * @returns
 */
function countWebTorrentFolders() {
  return 0;
}

function initializeService() {
  DEBUG.log("process.argv", process.argv);
  const myHeaders = JSON.parse(headers);
  // const dataArgs = JSON.parse(body);
  const command = myHeaders.operation;
  DEBUG.log("myHeaders", myHeaders);
  // DEBUG.log("dataArgs", dataArgs);

  switch (command) {
    case "check-disk":
      // checkDiskAvailableSpace();
      break;
    case "check-torrent-folders":
      scanWebTorrentFolder();
      break;
    default:
      break;
  }
}
// initializeService();
module.exports = {
  getFreeDiskSpace: getFreeDiskSpace,
  // scanWebTorrentFolder: scanWebTorrentFolder,
};
