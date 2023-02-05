/*jshint esversion: 8 */

const WebTorrent = require("webtorrent");

// const { DEBUG } = require("../util");

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp)
  };
})();

/**
 * Gets the bytes range.
 * @param  data
 */
function getSeekedBytesRange(data) {
  let n = data.toString().split("\n");
  /**
   * Get string with `Range: bytes=0-\r` or `Range: bytes=380141568-\r`;
   */
  let res = n.find((e) => {
    return e.indexOf("Range: ") === 0;
  });
  const bytesInStr = res.match(new RegExp("\\d+", "gi"));
  let seekedBytesRange = 0;
  if (seekedBytesRange.length > 0) {
    seekedBytesRange = bytesInStr[0];
  }
  return seekedBytesRange;
}

/**
 * !Not in USE
 * @param {WebTorrent.Torrent} torrent
 */
function criticalDownloadCycle(torrent) {
  //   let accumulatedTorrentSize = 0;
  let desiredFile = getDesiredFile(torrent.files);
  let movieStartSize = desiredFile.startSize;
  let endSize = desiredFile.endSize;
  DEBUG.log(`movieStartSize: ${movieStartSize}`);
  DEBUG.log(`endSize: ${endSize}`);
  //   DEBUG.log(`accumulatedTorrentSize: ${accumulatedTorrentSize}`);

  // res.send(`http:\\\\localhost:3001\\${desiredFileIndex}`);
  DEBUG.log(`torrent.pieces.length: ${torrent.pieces.length}`);
  let movieStartPiece = Math.floor(movieStartSize / torrent.pieceLength);
  let movieEndPiece = Math.floor(endSize / torrent.pieceLength);
  DEBUG.log(`startPiece: ${movieStartPiece}`);
  DEBUG.log(`endPiece: ${movieEndPiece}`);
  let startPiece = movieStartPiece;
  let endPiece = movieEndPiece;
  torrent.critical(startPiece, endPiece);
  let criticalDownloadInterval = setInterval(() => {
    let numOfPieces = 0;

    for (let index = startPiece; index <= movieEndPiece; index++) {
      if (torrent.pieces[index]) {
        startPiece = index;
        break;
      }
    }
    for (let index = startPiece; index <= movieEndPiece; index++) {
      // not null
      if (torrent.pieces[index]) {
        numOfPieces++;
        if (numOfPieces === chunkSize || index === movieEndPiece) {
          endPiece = index;
          break;
        }
      }
    }
    if (numOfPieces <= 0) {
      clearInterval(criticalDownloadInterval);
    }
    torrent.critical(startPiece, endPiece);
  }, 5000);
}

/**
 * TODO: get the largest video file.
 * @param {import("webtorrent").Torrent[]} torrentFiles list of files
 * returns {file, index, startSize, endSize}
 */
function getDesiredFile(torrentFiles) {
  let desiredFileIndex = null;
  let desiredFile = null;
  let startSize = 0;
  let endSize = 0;
  let accumulatedTorrentSize = 0;
  const validFormatsList = [".mp4", ".webm", ".flv", ".avi", ".wmv", ".mkv"];
  for (let index = 0; index < torrentFiles.length; index++) {
    const file = torrentFiles[index];
    const fileName = file.name;
    DEBUG.log("file.name:", fileName);
    DEBUG.log("file.length:", file.length);
    let hasFound = false;
    validFormatsList.forEach((format) => {
      const len = format.length;
      if (fileName.substr(fileName.length - len, len) === format) {
        // assuming that there is only 1 video file
        desiredFile = file;
        startSize = accumulatedTorrentSize + 1;
        endSize = startSize + file.length;
        hasFound = true;
        desiredFileIndex = index;
      }
    });
    if (hasFound) break;
    accumulatedTorrentSize += file.length;
  }

  return {
    file: desiredFile,
    index: desiredFileIndex,
    startSize: startSize,
    endSize: endSize
  };
}

module.exports = { getSeekedBytesRange, criticalDownloadCycle, getDesiredFile };
