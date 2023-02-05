/*jshint esversion: 6 */
// transtion play process for ..... checks/processes before starting another play
// const path = require("path");
// var { DEBUG, processInit, getFuncName } = require("./shared/util");
const { getFreeDiskSpace } = require("./system-disk-service");
const { WEBTORRENT_FULL_FILE_PATH } = require("./shared/constants");
const fs = require("fs");
const rimraf = require("rimraf");

// processInit(process);

/**
 * TODO: optional: count all sizes before deleting
 * Check if can play.
 * @param {number} spaceNeeded
 */
async function canPlayNewTorrent(spaceNeeded) {
  spaceNeeded = 15000000000; //15GB
  let isEnoughSpace = false;

  let foldersOrderedByBirthTimeList = [];
  if (isDiskSpaceEnough(spaceNeeded)) {
    return true;
  } else {
    // delete earliest modified/added torrent movie
    // if cannot delete or deleting wont be enough, throw error message
    foldersOrderedByBirthTimeList = getSortedWebtorrentFolders(WEBTORRENT_FULL_FILE_PATH);
    let index = 0;
    do {
      rimraf.sync(foldersOrderedByBirthTimeList[index]);
      isEnoughSpace = isDiskSpaceEnough(spaceNeeded);
      index++;
    } while (!isEnoughSpace && index < foldersOrderedByBirthTimeList.length);

    return isEnoughSpace;
  }
}

async function isDiskSpaceEnough(spaceNeeded) {
  let freeSpace = await getFreeDiskSpace("C");
  return freeSpace > spaceNeeded;
}

/**
 * Gets list of folders path in webtorrent ordered by oldest modified.
 * @param {string} dir
 * @returns {string[]}
 */
function getSortedWebtorrentFolders(dir) {
  var files = fs
    .readdirSync(dir)
    .map(function (v) {
      return { name: v, time: fs.statSync(dir + v).mtime.getTime() };
    })
    .sort(function (a, b) {
      return a.time - b.time;
    })
    .map(function (v) {
      return v.name;
    });
  return files;
}

function init() {
  // diskspace,
  // if not enough, delete more
  // checkDisk().then((isOk) => {
  //   DEBUG.log(getFuncName(), isOk);
  // });
}

// init();

module.exports = {
  canPlayNewTorrent
  // scanWebTorrentFolder: scanWebTorrentFolder,
};
