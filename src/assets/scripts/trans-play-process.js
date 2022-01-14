// transtion play process for ..... checks/processes before starting another play
let cp = require("child_process");
const path = require("path");
var { DEBUG, processInit, getFuncName } = require("./shared/util");
const { exit } = require("process");
const { getFreeDiskSpace } = require("./system-disk-service");
const { SIZE_LIMIT, WEBTORRENT_FULL_FILE_PATH } = require("./shared/constants");
const fs = require("fs");
const rimraf = require("rimraf");

let procDiskCheck;
let procTorrentFilesCheck;

processInit(process);

async function checkDisk() {
  let spaceNeed = 123;
  let freeSpace = await getFreeDiskSpace("C");
  DEBUG.log(freeSpace);
  DEBUG.log(freeSpace >= SIZE_LIMIT);
  if (freeSpace >= SIZE_LIMIT) {
    return true;
  } else {
    return false;
    // delete earliest modified/added torrent movie
    // if cannot delete or deleting wont be enough, throw error message
    // function checkTorrentFolders() {
    //   DEBUG.log(getFuncName(), "starting checkFiles...");
    //   // procTorrentFilesCheck = startProc("src/assets/scripts/system-disk-service.js", [
    //   procTorrentFilesCheck = startProc("system-disk-service.js", [
    //     JSON.stringify({
    //       operation: "check-torrent-folders",
    //     }),
    //   ]);
    //   return new Promise((resolve, reject) => {
    //     procTorrentFilesCheck.on("exit", function (code) {
    //       DEBUG.log("EXITING with code", code);
    //       if (code == 0) {
    //         resolve(true);
    //       } else {
    //         resolve(false);
    //       }
    //     });
    //   });
    // }
  }
}

/**
 * Check if
 * @param {number} spaceNeeded
 *
 */
async function canPlayNewTorrent(spaceNeeded) {
  // let freeSpace = await getFreeDiskSpace("C");
  // DEBUG.log(freeSpace >= spaceNeeded);
  let isEnoughSpace = false;

  let foldersOrderedByBirthTimeList = [];
  if (isDiskSpaceEnough(spaceNeeded)) {
    return true;
  } else {
    // delete earliest modified/added torrent movie
    // if cannot delete or deleting wont be enough, throw error message
    foldersOrderedByBirthTimeList = getSorted(WEBTORRENT_FULL_FILE_PATH);
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

function getSorted(dir) {
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
  checkDisk().then((isOk) => {
    DEBUG.log(getFuncName(), isOk);
  });
  // canPlayNewTorrent(2).
}

// init();

module.exports = {
  canPlayNewTorrent: canPlayNewTorrent,
  // scanWebTorrentFolder: scanWebTorrentFolder,
};
