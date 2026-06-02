/**
 * Service that checks system disk capacity.
 * Deletes old webtorrent files.
 */
const checkDiskSpace = require("check-disk-space").default;
const fs = require("fs");
const path = require("path");
const os = require("os");
const rimraf = require("rimraf");
const { DEBUG, processInit } = require("./shared/util");
const { WEBTORRENT_FULL_FILE_PATH } = require("./shared/constants");

processInit(process);

/**
 * Gets free space in bytes for the disk containing the given path.
 * @param {string} directoryPath
 */
async function getFreeDiskSpace(directoryPath) {
  DEBUG.log("Checking available space for path:", directoryPath);
  try {
    DEBUG.log("directoryPath: ", directoryPath);
    // Ensure the directory exists so checkDiskSpace can analyze it
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const diskSpace = await checkDiskSpace(directoryPath);
    DEBUG.log(`Free space on ${directoryPath}: ${diskSpace.free} bytes`);
    return diskSpace.free;
  } catch (err) {
    DEBUG.error("Error checking disk space:", err);
    throw err;
  }
}

/**
 * Removes old webtorrent files after 30 days of file birth.
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
 */
function scanWebTorrentFolder() {
  if (!fs.existsSync(WEBTORRENT_FULL_FILE_PATH)) return;

  const files = fs.readdirSync(WEBTORRENT_FULL_FILE_PATH);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(WEBTORRENT_FULL_FILE_PATH, files[i]);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory() && isRemoveFile(stat)) {
      DEBUG.log("Removing old torrent data:", filePath);
      rimraf.sync(filePath);
    }
  }
}

module.exports = {
  getFreeDiskSpace,
  scanWebTorrentFolder
};
