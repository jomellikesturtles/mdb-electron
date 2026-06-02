console.log("hey");
// // torrent client
/*jshint esversion: 8 */
let WebTorrent;
let torrentClient = null;
let moment = require("moment");
const { prettyBytes, DEBUG, processInit } = require("./shared/util");
const TorrentUtil = require("./utils/torrentUtil");
let cp = require("child_process");
const { canPlayNewTorrent } = require("./trans-play-process");

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

/**
 * Lazy-load WebTorrent (pure ESM) and initialize the client.
 */
async function ensureClient() {
  if (!torrentClient) {
    try {
      DEBUG.log("Loading WebTorrent ESM module...");
      const module = await import("webtorrent");
      WebTorrent = module.default;
      torrentClient = new WebTorrent(TORRENT_CONFIG);
      DEBUG.log("WebTorrent client initialized.");
    } catch (e) {
      DEBUG.error("Failed to load WebTorrent ESM:", e);
      throw e;
    }
  }
  return torrentClient;
}

/**
 * Play movie torrent, create server and return streamlink.
 * @param {string} hash
 */
async function playMovieTorrent(hash) {
  DEBUG.log("Starting playmovie torrent with hash: ", hash);

  await ensureClient();

  if (currentStreamHash === hash && currentStreamLink) {
    DEBUG.log("Resending existing stream-link", currentStreamLink);
    process.send(["stream-link", currentStreamLink]);
    return;
  }

  let torrentLink = getTorrentLink(hash);
  currentStreamHash = hash;

  torrentClient.add(torrentLink, {}, async function (torrent) {
    torrent.on("error", (e) => {
      DEBUG.error("Torrent error", hash, e);
    });

    if (currentServer) {
      currentServer.close();
    }

    // Check disk space before proceeding
    const canPlay = await canPlayNewTorrent(torrent.length);
    DEBUG.log("Disk Check Result - CanPlay: ", canPlay);

    if (!canPlay) {
      process.send(["can-play", false]);
      // Stop the torrent to avoid consuming bandwidth/space
      torrent.destroy();
      return;
    }

    process.send(["can-play", true]);

    let server = torrent.createServer();
    let serverPort = 3001;

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        DEBUG.log(`Port ${serverPort} is in use, trying next one...`);
        serverPort++;
        server.listen(serverPort);
      } else {
        DEBUG.error("Server error:", err);
      }
    });

    server.listen(serverPort, () => {
      const actualPort = server.address().port;
      DEBUG.log(`Streaming server listening on port ${actualPort}`);
      currentServer = server;

      let desiredFile = TorrentUtil.getDesiredFile(torrent.files);
      const desiredFileIndex = desiredFile.index;
      currentStreamLink = "http://localhost:" + actualPort + "/" + desiredFileIndex;
      DEBUG.log("sending stream-link", currentStreamLink);
      process.send(["stream-link", currentStreamLink]);
    });

    let noConIndex = 0;
    if (currentDisplayInterval) clearInterval(currentDisplayInterval);
    currentDisplayInterval = setInterval(() => {
      displayTorrentProgress(torrent);
      if (torrent.downloadSpeed == 0 && !torrent.done) {
        noConIndex++;
      }
    }, 5000);
  });
}

/**
 * Stops stream, pauses torrent download.
 */
async function stopStream() {
  currentStreamLink = "";
  if (currentServer) currentServer.close();

  clearInterval(currentDisplayInterval);

  if (torrentClient) {
    const torrent = torrentClient.get(currentStreamHash);
    if (torrent) {
      DEBUG.log("Destroying torrent:", currentStreamHash);
      torrent.destroy();
    }
  }
}

function getTorrentLink(hash) {
  return `magnet:?xt=urn:btih:${hash}`;
}

function displayTorrentProgress(torrent) {
  let percent = Math.round(torrent.progress * 100 * 100) / 100;
  const toReturn = {
    downSpeed: (torrent.downloadSpeed / 1024 / 1024).toFixed(2) + " MB/s",
    upSpeed: (torrent.uploadSpeed / 1024 / 1024).toFixed(2) + " MB/s",
    ratio: torrent.ratio,
    progress: percent + "%"
  };
  process.send(["stats", toReturn]);
}

processInit(process);

process.on("message", async (m) => {
  DEBUG.log("webtorrent on message", m);
  const message = m[0];
  const argument = m[1];
  try {
    if (message == "play-torrent") {
      await playMovieTorrent(argument);
    } else if (message == "stop-stream") {
      await stopStream();
    }
  } catch (e) {
    DEBUG.error("Error in message handler:", e);
  }
});

module.exports = { playMovieTorrent, stopStream };
