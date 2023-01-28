// torrent client
/*jshint esversion: 8 */
const WebTorrent = require("webtorrent");
let moment = require("moment");
const { prettyBytes } = require("./shared/util");
const TorrentUtil = require("./utils/torrentUtil");

let args = process.argv.slice(2);
let command = args[0];

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

const TORRENT_CONFIG = {
  maxConns: 10,
};

const MAX_NO_CON = 30;
const RESET_LIMIT = 50;
let currentServer = null;
let currentStreamHash = "";
let currentStreamLink = "";
let currentDisplayInterval = null;
let torrentClient = new WebTorrent(TORRENT_CONFIG);

function initializeClient() {
  // torrentClient = client;
  // console.log("client.ratio: ", client.ratio);
}

/**
 * TODO: retry if connection disconnected
 * Play movie torrent, create server and return streamlink.
 * @param {string} hash
 */
function playMovieTorrent(hash) {
  if (currentStreamHash === hash) {
    DEBUG.log("sending stream-link1", currentStreamLink);
    process.send(["stream-link", currentStreamLink]);
    currentStreamLink = "";
    return;
  }
  let torrentLink = getTorrentLink(hash);
  currentStreamHash = hash;
  console.log("torrentClient.ratio: ", torrentClient.ratio);
  torrentClient.add(torrentLink, {}, function (torrent) {
    torrent.on("error", (e) => {
      DEBUG.log("noPeers", hash);
    });
    torrent.on("noPeers", (e) => {
      DEBUG.log("noPeers", hash);
    });

    if (currentServer) {
      currentServer.close();
    }
    let server = torrent.createServer();
    server.listen(3001);
    currentServer = server;

    let desiredFile = TorrentUtil.getDesiredFile(torrent.files);
    const desiredFileIndex = desiredFile.index;
    currentStreamLink = "http:\\\\localhost:3001\\" + desiredFileIndex;
    DEBUG.log("sending stream-link2", currentStreamLink);
    process.send(["stream-link", currentStreamLink]);
    currentStreamLink = "";

    let noConIndex = 0;
    // remove display if torrent is paused/stopped
    if (currentDisplayInterval) clearInterval(currentDisplayInterval);
    currentDisplayInterval = setInterval(() => {
      displayTorrentProgress(torrent);
      // displayTorrentPiecesInProgress(torrent);
      // const isConnected = checkInternetConnectivity().then((e) => {});

      if (torrent.downloadSpeed == 0 && !torrent.done) {
        noConIndex++;
        if (noConIndex >= MAX_NO_CON) {
          // reset torrent
        }
      }
    }, 5000);
  });
}

/**
 * Stops stream, pauses torrent download.
 * TODO: fix the pause. https://github.com/webtorrent/webtorrent/issues/1035
 */
function stopStream() {
  currentStreamLink = "";
  if (currentServer) currentServer.close();
  // torrentClient.destroy();
  clearInterval(currentDisplayInterval);
  if (torrentClient) {
    torrentClient.get(currentStreamHash).removeAllListeners();
    torrentClient.remove(currentStreamHash);
    torrentClient.torrents.forEach((torrent) => {
      DEBUG.log(
        "torrent.infoHash(): ",
        torrent.infoHash(),
        " torrent.paused: ",
        torrent.paused
      );
    });
  }
}

function resetTorrent(torrent) {}

function checkInternetConnectivity() {
  console.log("b4 Check");

  return new Promise((resolve) => {
    require("dns").resolve("www.google.com", function (err) {
      if (err) {
        console.log("No connection");
        // cb(false);
        resolve(false);
      } else {
        console.log("Connected");
        // cb(true);
        resolve(true);
      }
    });
  });
  // console.log("afterCheck");
}

function getTorrentLink(hash) {
  return `magnet:?xt=urn:btih:${hash}`;
}

function addTorrent(hash) {
  var torrentId = getTorrentLink(hash);
  let desiredFileIndex = null;
  return client.add(torrentId, function (torrent) {
    // Torrents can contain many files. Let's use the .mp4 file
    var file = torrent.files.find(function (file) {
      return file.name.endsWith(".mp4");
    });
    return file;
  });
  // return
}

function removeTorrent(torrentId) {
  // client.remove(torrentId);
}

function displayClientProgress(torrent) {
  // client.torrents.forEach((torrent) => {
  //   DEBUG.log("hash: ", torrent.infoHash);
  // });
  // DEBUG.log("downloadSpeed: ", client.downloadSpeed);
  // DEBUG.log("uploadSpeed: ", client.uploadSpeed);
  // DEBUG.log("progress: ", client.progress);
}

/**
 *
 * @param {import("webtorrent").Torrent} torrent
 */
function displayTorrentProgress(torrent) {
  let percent = Math.round(torrent.progress * 100 * 100) / 100;

  /* TEMPORARY COMMENT */
  // DEBUG.log("progress: ", percent + "%");
  // DEBUG.log("downloaded: ", prettyBytes(torrent.downloaded));
  // if (!torrent.done) {
  //   const remaining = moment
  //     .duration(torrent.timeRemaining / 1000, "seconds")
  //     .humanize();
  //   DEBUG.log(
  //     remaining[0].toUpperCase() + remaining.substring(1),
  //     " remaining."
  //   );
  // }
  // DEBUG.log(
  //   "down speed:",
  //   prettyBytes(torrent.downloadSpeed) + "/s | " + "up speed:",
  //   prettyBytes(torrent.uploadSpeed) + "/s"
  // );
  /* END OF TEMPORARY COMMENT */
  const progressReturn = {
    progress: percent + "%",
    downloadSpeed: torrent.downloadSpeed,
  };

  const toReturn = {
    downSpeed: prettyBytes(torrent.downloadSpeed),
    upSpeed: prettyBytes(torrent.uploadSpeed),
    downloadedPieces: countDownloadedPieces(torrent),
    ratio: torrent.ratio,
  };

  process.send(["stats", toReturn]);
}

/**
 *
 * @param {import("webtorrent").Torrent} torrent
 */
function countDownloadedPieces(torrent) {
  let downloadedPiecesCount = 0;
  torrent.pieces.forEach((piece) => {
    if (!piece) {
      downloadedPiecesCount++;
    }
    // pieceIndex++;
  });
  return downloadedPiecesCount;
}

/**
 *
 * @param {import("webtorrent").Torrent} torrent
 */
function displayTorrentPiecesInProgress(torrent) {
  let pieceIndex = 0;
  torrent.pieces.forEach((piece) => {
    if (piece && piece.missing < piece.length) {
      DEBUG.log(
        "Piece Index " +
          pieceIndex +
          " - " +
          ((piece.length - piece.missing) / piece.length) * 100 +
          "%"
      );
    }
    pieceIndex++;
  });
}

process.on("uncaughtException", function (error) {
  console.log("uncaughtException ipcChild", error);
  // process.send(['operation-failed', 'general']);
});

process.on("unhandledRejection", function (error) {
  DEBUG.log(error);
  process.send(["operation-failed", "general"]);
});
process.on("exit", function (error) {
  DEBUG.log("exiting...", error);
  process.send(["operation-failed", "general"]);
});
process.on("beforeExit", function (error) {
  DEBUG.log("beforeExit...", error);
  process.send(["operation-failed", "general"]);
});
process.on("warning", function (error) {
  DEBUG.log("warning...", error);
  process.send(["operation-failed", "general"]);
});

process.on("message", (m) => {
  console.log("onMessage ipcChild", m);
  if (m[0] == "play-torrent") {
    playMovieTorrent(m[1]);
  } else if (m == "stop-stream") {
    console.log("stoppingStream");
    stopStream();
  } else if (m == "progress") {
  }
});

initializeClient();

module.exports = { initializeClient, playMovieTorrent };
