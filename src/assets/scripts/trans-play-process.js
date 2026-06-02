/*jshint esversion: 8 */
const { getFreeDiskSpace } = require("./system-disk-service");
const { WEBTORRENT_FULL_FILE_PATH } = require("./shared/constants");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const { DEBUG } = require("./shared/util");

/**
 * Checks if there is enough disk space for the new torrent.
 * If not, it attempts to delete the oldest torrent folders until enough space is freed.
 * @param {number} spaceNeeded Bytes needed for the torrent
 */
async function canPlayNewTorrent(spaceNeeded) {
  DEBUG.log(`Checking if ${spaceNeeded} bytes are available for new torrent...`);
  
  let isEnoughSpace = await isDiskSpaceEnough(spaceNeeded);
  if (isEnoughSpace) {
    return true;
  }

  DEBUG.log("Not enough space. Attempting to free up space by deleting oldest torrents...");
  
  const folders = getSortedWebtorrentFolders(WEBTORRENT_FULL_FILE_PATH);
  
  for (const folder of folders) {
    const folderPath = path.join(WEBTORRENT_FULL_FILE_PATH, folder);
    DEBUG.log("Deleting old torrent folder:", folderPath);
    try {
      rimraf.sync(folderPath);
      isEnoughSpace = await isDiskSpaceEnough(spaceNeeded);
      if (isEnoughSpace) {
        DEBUG.log("Sufficient space freed.");
        return true;
      }
    } catch (e) {
      DEBUG.error(`Failed to delete folder ${folderPath}:`, e);
    }
  }

  return isEnoughSpace;
}

async function isDiskSpaceEnough(spaceNeeded) {
  try {
    const freeSpace = await getFreeDiskSpace(WEBTORRENT_FULL_FILE_PATH);
    return freeSpace > spaceNeeded;
  } catch (e) {
    DEBUG.error("Failed to check disk space:", e);
    // If check fails, we assume it's NOT enough to be safe
    return false;
  }
}

/**
 * Gets list of folder names in webtorrent directory ordered by oldest modification time.
 * @param {string} dir
 * @returns {string[]}
 */
function getSortedWebtorrentFolders(dir) {
  if (!fs.existsSync(dir)) return [];
  
  return fs.readdirSync(dir)
    .map(name => {
      const fullPath = path.join(dir, name);
      try {
        return { name, time: fs.statSync(fullPath).mtime.getTime() };
      } catch (e) {
        return { name, time: Infinity }; // Push files that error to the end
      }
    })
    .sort((a, b) => a.time - b.time)
    .map(v => v.name);
}

module.exports = {
  canPlayNewTorrent
};
