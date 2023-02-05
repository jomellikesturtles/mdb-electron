/*jshint esversion: 6 */
// import { uuidv4 } from "./src/assets/scripts/shared/util.js";
// import { COLLECTION_NAME, OPERATIONS } from "./src/assets/scripts/shared/constants.js";
// const { onUserData } = require("./src/assets/scripts/user-media-db");
// const { onLibrary } = require("./src/assets/scripts/library-db-service");
// const { onUserData } = require("./src/assets/scripts/user-media-db");
// const { onPreferences } = require("./src/assets/scripts/preferences-service");

// import { fork } from "child_process";

// import { join, dirname } from "path";
// import { DEBUG } from "./src/assets/scripts/shared/util.js";
const { uuidv4, DEBUG } = require("./src/assets/scripts/shared/util");
const { COLLECTION_NAME, OPERATIONS } = require("./src/assets/scripts/shared/constants");
const { onLibrary } = require("./src/assets/scripts/library-db-service");
const { fork } = require("child_process");
const { join } = require("path");
const { onUserData } = require("./src/assets/scripts/user-media-db");
process.on("uncaughtException", (e) => {
  DEBUG.log("uncaughtException", e);
});
process.on("unhandledRejection", () => {
  DEBUG.log("unhandledRejection");
});
process.on("error", () => {
  DEBUG.log("error");
});

process.send =
  process.send ||
  function (...args) {
    DEBUG.log("SIMULATING process.send", ...args);
  };

onUserData(
  JSON.stringify({
    // headers: { operation: OPERATIONS.REMOVE, subChannel: COLLECTION_NAME.BOOKMARK, uuid: uuidv4() },
    // headers: { operation: OPERATIONS.REMOVE, subChannel: COLLECTION_NAME.PROGRESS, uuid: uuidv4() },
    // headers: { operation: OPERATIONS.SAVE, subChannel: COLLECTION_NAME.FAVORITE, uuid: uuidv4() },
    headers: { operation: OPERATIONS.GET_BY_PAGE, subChannel: COLLECTION_NAME.BOOKMARK, uuid: uuidv4() },
    // query: { tmdbId: 122 }
    // body: { listId: "Bl8zwPAwNhvby8Hq", tmdbId: 124 }
    // body: { current: 3022, total: 2000 }
    // body: { tmdbId: 124 }
    // query: { tmdbId: 122 }
    // body: { current: 3024, total: 2000 }
    // headers: { operation: OPERATIONS.FIND_IN_LIST, subChannel: COLLECTION_NAME.ALL, uuid: uuidv4() },
    // query: { tmdbIdList: [122, 123] }
    params: { query: {}, sort: { tmdbId: 1 }, page: 1, size: 5 }
    // params: { query: {}, sort: { tmdbId: 1 }, page: 2, size: 3 }
    // body: { tmdbId: 124, rating: 5, content: "ganda lang" }
  })
);
// onLibrary(
//   JSON.stringify({
//     headers: { operation: OPERATIONS.FIND, uuid: uuidv4() },
//     query: {}
//   })
// );

// onPreferences(
//   JSON.stringify({
//     headers: { operation: OPERATIONS.REMOVE, subChannel: COLLECTION_NAME.BOOKMARK, uuid: uuidv4() },
//     query: { tmdbId: 122 }
//   })
// );

// const __dirname = dirname(fileURLToPath(import.meta.url));
let procWebTorrent = fork(join(__dirname, "src/assets/scripts/webtorrent.js"), [], {
  cwd: __dirname,
  silent: false
});

procWebTorrent.on("error", (e) => DEBUG.log("procWebTorrent ended"));
procWebTorrent.on("exit", function () {
  DEBUG.log("procWebTorrent ended");
});
/**
 * webtorrent client messages:
 * 1. streamlink
 * 2. progress
 */
procWebTorrent.on("message", (m) => sendContents(m[0], m[1]));
function playTorrentSample() {
  procWebTorrent.send(["play-torrent", "2ef6de6be35239d370db76e5b47be49d96bbf4da"]);
}

function playTorrentSample2() {
  procWebTorrent.send(["play-torrent", "2f200765bbfa5802ac2afdf0cb71865714e833a2"]);
}
// playTorrentSample();

function sendContents(channel, args) {
  DEBUG.log("sending...", channel, " | ", args);
  // mainWindow.webContents.send(channel, args); // reply
}
