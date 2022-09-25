const { DEBUG } = require("./shared/util");

const cp = require("child_process");
const path = require("path");
const fs = require("fs");
const DataStore = require("nedb");
const { PlayedRepository } = require("./played-repository");

function init(data) {
  DEBUG.log(data);
  let myProcUserData = forkChildProcess("./user-db-service-new.js", data, {
    cwd: __dirname,
    silent: false,
  });
  myProcUserData.on("data", (data) => printData(data));
  myProcUserData.on("exit", function () {
    DEBUG.log("myProcUserData process ended");
    myProcUserData = null;
  });
  myProcUserData.on("message", (m) => sendContents(m[0], m[1]));
}
function forkChildProcess(modulePath, args, processOptions) {
  console.log();
  return cp.fork(path.join(__dirname, modulePath), [args], processOptions);
}
function printError(processName, args) {
  DEBUG.log(`${processName} in error`, args);
}
function printData(data) {
  DEBUG.log("printing data", data.toString());
}
function sendContents(channel, args) {
  DEBUG.log("sending...", channel, " | ", args);
  // mainWindow.webContents.send(channel, args); // reply
}

init(`{"headers":{"operation":"find-one","subChannel":"bookmarks,lists,played","uuid":"1234-abcd"},
  "body":{"tmdbId":1234}}`);

// var playedDb = new DataStore({
//   filename: path.join(__dirname, "..", "db", "played.db"), // node
//   // filename: path.join(process.cwd(), "src", "assets", "db", "played.db"),
//   autoload: true,
// });
var progressDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "progress.db"), // node
  // filename: path.join(process.cwd(), "src", "assets", "db", "progress.db"),
  autoload: true,
});
var bookmarksDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "bookmarks.db"), // node
  // filename: path.join(process.cwd(), "src", "assets", "db", "bookmarks.db"),
  autoload: true,
});
var listsDb = new DataStore({
  // filename: path.join(__dirname, '..', 'db', 'lists.db'), // node
  // filename: path.join(process.cwd(), "src", "assets", "db", "lists.db"),
  autoload: true,
});
var favoritesDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "favorites.db"), // node
  // filename: path.join(process.cwd(), "src", "assets", "db", "favorites.db"),
  autoload: true,
});
let playedRepository = new PlayedRepository();

listsDb.ensureIndex({ fieldName: "title", unique: true }, function () {});

module.exports = {
  // playedDb: playedDb,
  progressDb: progressDb,
  bookmarksDb: bookmarksDb,
  listsDb: listsDb,
  favoritesDb: favoritesDb,
  playedRepository: playedRepository,
};
