// torrent client
/*jshint esversion: 8 */
const WebTorrent = require("webtorrent");
let moment = require("moment");
const { prettyBytes, DEBUG, processInit } = require("./shared/util");
const TorrentUtil = require("./utils/torrentUtil");
const { canPlayNewTorrent } = require("./trans-play-process");
const { WEBTORRENT_FULL_FILE_PATH } = require("./shared/constants");
const IPCMainChannel = require("../IPCMainChannel.json");
let args = process.argv.slice(2);

const TORRENT_CONFIG = {
  maxConns: 10
};

const MAX_NO_CON = 30;
const RESET_LIMIT = 50;
let currentServer = null;
let currentStreamHash = "";
let currentStreamLink = "";
let currentDisplayInterval = null;
let torrentClient = new WebTorrent(TORRENT_CONFIG);
let serverPort = 3001;
let baseStreamLink = "http://localhost";

function initializeClient() {
  // torrentClient = client;
  // console.log("client.ratio: ", client.ratio);
}

/**
 * @returns {import("webtorrent").TorrentOptions} torrent
 */
function getOptions() {
  return true;
}
/**
 * TODO: retry if connection disconnected
 * Play movie torrent, create server and return streamlink.
 * @param {string} hash
 */
function playMovieTorrent(hash) {
  DEBUG.log("Starting playmovie torrent with hash: ", hash);
  if (currentStreamHash === hash) {
    DEBUG.log("sending stream-link1", currentStreamLink);
    process.send(["stream-link", currentStreamLink]);
    currentStreamLink = "";
    return;
  }

  let torrentLink = getTorrentLink(hash);
  currentStreamHash = hash;
  DEBUG.log("torrentLink: ", torrentLink);
  DEBUG.log("torrentClient.ratio: ", torrentClient.ratio);
  DEBUG.log("torrentClient: ", torrentClient);
  // getOptions().
  torrentClient.add(torrentLink, { path: WEBTORRENT_FULL_FILE_PATH }, async function (torrent) {
    torrent.on("error", (e) => {
      DEBUG.log("torrent error", e);
    });
    torrent.on("noPeers", (e) => {
      DEBUG.log("noPeers", hash);
    });

    if (currentServer) {
      currentServer.close();
    }

    // Prioritize first pieces of the desired file for fast stream start
    const desiredFile = TorrentUtil.getDesiredFile(torrent.files);
    if (desiredFile && desiredFile.file) {
      const startPiece = Math.floor(desiredFile.startSize / torrent.pieceLength);
      const criticalEndPiece = Math.min(startPiece + 30, Math.floor(desiredFile.endSize / torrent.pieceLength));
      DEBUG.log(`Prioritizing pieces ${startPiece}–${criticalEndPiece} for desired file`);
      torrent.critical(startPiece, criticalEndPiece);
    }

    const canPlay = await canPlayNewTorrent(torrent.length);
    DEBUG.log("CanPlay: ", canPlay);
    if (!canPlay) {
      DEBUG.error("Cannot play torrent: ");
      process.send(["can-play", false]);
      return;
    }

    process.send(["can-play", true]);

    let server = torrent.createServer();

    // Intercept webtorrent's internal request listener to prevent OPTIONS crash and set CORS headers
    let webtorrentRequestListener = null;
    const originalOn = server.on;
    server.on = function (event, listener) {
      if (event === "request") {
        webtorrentRequestListener = listener;
        return this;
      }
      return originalOn.call(this, event, listener);
    };
    server.addListener = server.on;

    originalOn.call(server, "request", (req, res) => {
      // Override setHeader to prevent webtorrent's strict Content-Security-Policy from blocking media playback
      const originalSetHeader = res.setHeader;
      res.setHeader = function (name, value) {
        if (name.toLowerCase() === "content-security-policy") {
          return this;
        }
        return originalSetHeader.call(this, name, value);
      };

      const origin = req.headers.origin || "*";
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");

      const requestHeaders = req.headers["access-control-request-headers"];
      if (requestHeaders) {
        res.setHeader("Access-Control-Allow-Headers", requestHeaders);
      } else {
        res.setHeader("Access-Control-Allow-Headers", "Range, Content-Type");
      }

      res.setHeader("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }
      if (webtorrentRequestListener) {
        webtorrentRequestListener.call(server, req, res);
      }
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        DEBUG.log(`Port ${serverPort} is in use, trying next one...`);
        serverPort++;
        server.listen(serverPort);
      } else {
        DEBUG.error("Server error:", err);
        process.send(["error", { source: "webtorrent-server", message: err.message, stack: err.stack }]);
      }
    });

    server.listen(serverPort, () => {
      const actualPort = server.address().port;
      DEBUG.log(`Streaming server listening on port ${actualPort}`);
      currentServer = server;

      const desiredFile = TorrentUtil.getDesiredFile(torrent.files);
      const fileIndex = desiredFile && desiredFile.index !== null ? desiredFile.index : 0;
      const fileName = desiredFile && desiredFile.file ? desiredFile.file.name : "video.mp4";
      currentStreamLink = `${baseStreamLink}:${actualPort}/${fileIndex}/${encodeURIComponent(fileName)}`;
      DEBUG.log("sending stream-link", currentStreamLink);
      process.send([IPCMainChannel.STREAM_LINK, currentStreamLink]);
    });

    if (currentDisplayInterval) clearInterval(currentDisplayInterval);
    let noConIndex = 0;
    currentDisplayInterval = setInterval(() => {
      displayTorrentProgress(torrent);
      if (torrent.downloadSpeed == 0 && !torrent.done) {
        noConIndex++;
      }
    }, 5000);
  });

  torrentClient.on("torrent", (t) => {
    t.on("metadata", () => console.log("metadata received!"));
    t.on("noPeers", (ann) => console.log("no peers via", ann));
  });
}

/**
 * Stops stream, pauses torrent download.
 * TODO: fix the pause. https://github.com/webtorrent/webtorrent/issues/1035
 */
function stopStream() {
  currentStreamLink = "";
  if (currentServer) currentServer.close();
  clearInterval(currentDisplayInterval);

  if (torrentClient) {
    const torrent = torrentClient.get(currentStreamHash);
    if (torrent) {
      torrent.pause();
      torrent.removeAllListeners();
    }
  }
}

/**
 *
 * @param {string} hash
 * @returns {string}
 */
function getTorrentLink(hash) {
  const trackers = [
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://open.stealth.si:80/announce",
    "udp://tracker.torrent.eu.org:451/announce",
    "udp://tracker.openbittorrent.com:6969/announce"
  ];
  const tr = trackers.map((t) => `&tr=${encodeURIComponent(t)}`).join("");
  return `magnet:?xt=urn:btih:${hash}${tr}`;
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
    downloadSpeed: torrent.downloadSpeed
  };

  const toReturn = {
    downSpeed: prettyBytes(torrent.downloadSpeed),
    upSpeed: prettyBytes(torrent.uploadSpeed),
    downloadedPieces: countDownloadedPieces(torrent),
    ratio: torrent.ratio,
    progress: percent + "%",
    piecesInProgress: displayTorrentPiecesInProgress(torrent)
  };

  process.send(["stats", toReturn]);
}

/**
 *
 * @param {import("webtorrent").Torrent} torrent
 */
function countDownloadedPieces(torrent) {
  // torrent.
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
  let res = [];
  torrent.pieces.forEach((piece) => {
    if (piece && piece.missing < piece.length) {
      const pieceProgress = ((piece.length - piece.missing) / piece.length) * 100;
      DEBUG.log("Piece Index " + pieceIndex + " - " + pieceProgress + "%");
      res.push({
        index: pieceIndex,
        progress: pieceProgress
      });
    }
    pieceIndex++;
  });
  return res;
}

/**
 * Check if device can play/stream.
 * @param {number} torrentSize
 * @returns boolean
 */
function playChecklist(torrentSize) {
  return fork(path.join(__dirname, "trans-play-process.js"), args, {
    // return cp.fork(path.join(__dirname, modulePath), args, {
    cwd: __dirname,
    silent: false
  });
}

processInit(process);

process.on("message", (m) => {
  DEBUG.log("received message: ", m);
  const message = m[0];
  const argument = m[1];
  if (message == "play-torrent") {
    playMovieTorrent(argument);
  } else if (message == "stop-stream") {
    DEBUG.log("stoppingStream");
    stopStream();
  } else if (message == "progress") {
  }
});

initializeClient();

module.exports = { initializeClient, playMovieTorrent, stopStream };
