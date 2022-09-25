/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
/*jshint esversion: 8 */
let args = process.argv.slice(2);
// let args = process.argv[2];

const path = require("path");
const DataStore = require("nedb");
const { DEBUG } = require("./shared/util");
const {
  listsDb,
  favoritesDb,
  bookmarksDb,
  playedRepository,
} = require("./mock-main");
const { debug } = require("console");
// const watchedDbService = require("./watched-db-service");
// const watchedDbService = require("./watched-db-service");
// const bookmarkDbService = require("./bookmark-db-service");
let currentDb;

// const bookmarksDb = new DataStore({
//   // filename: path.join(__dirname, "..", "db", "bookmarks.db"), // for node only
//     filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
//   autoload: true,
// });
// const watchedDb = new DataStore({
//   // filename: path.join(__dirname, "..", "db", "watched.db"), // for node only
//     filename: path.join(process.cwd(), 'src', 'assets', 'db', 'watched.db'),
//   autoload: true,
// });
// const libraryDb = new DataStore({
//   // filename: path.join(__dirname, "..", "db", "libraryFiles2.db"), // for node only
//     filename: path.join(process.cwd(), 'src', 'assets', 'db', 'libraryFiles2.db'),
//   autoload: true,
// });

var bookmarksChangesDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "bookmarks-changes.db"), // for node only
  // filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks-changes.db'),
  autoload: true,
});

process.on("uncaughtException", function (error) {
  DEBUG.error(
    "SIMULATING operation-failed",
    error.name,
    " message: ",
    error.message
  );
  // process.send(["operation-failed", "general"]);
});

process.send =
  process.send ||
  function (...args) {
    DEBUG.log("SIMULATING process.send", ...args);
  };

/**
 *
 * @param headers
 * @param body
 */
async function findUserMovieData(headers, body) {
  DEBUG.log("starting findUserMovieData");
  let tmdbId = body.tmdbId;
  let subChannels = headers.subChannel;
  let subChannelsArr = [];
  if (subChannels) {
    subChannelsArr = subChannels.split(",");
  }
  DEBUG.log("subChannelsArr ", subChannelsArr);
  let promises = [];
  subChannelsArr.forEach((subChannel) => {
    switch (subChannel) {
      case "bookmarks":
        // promises.push(
        //   new Promise((resolve, reject) => {
        //     bookmarksDb.findOne({ tmdb: parseInt(tmdbId, 10) });
        //   })
        // );
        break;
      case "played":
        promises.push(playedRepository.findPlayed(tmdbId));
        break;
      case "progress":
        break;
      case "lists":
        // promises.push(
        //   new Promise((resolve, reject) => {
        //     listsDb.findOne({ tmdb: parseInt(tmdbId, 10) });
        //   })
        // );
        break;
      case "favorites":
        // promises.push(
        //   new Promise((resolve, reject) => {
        //     favoritesDb.findOne({ tmdb: parseInt(tmdbId, 10) });
        //   })
        // );
        break;

      default:
        break;
    }
  });

  DEBUG.log("promises ", promises);
  Promise.all(promises)
    .then((value) => {
      DEBUG.log("value: ", value);
    })
    .catch((reason) => {
      DEBUG.error("REASON: ", reason);
    });
  let res = await Promise.all(promises);
  DEBUG.log("RES", res);
  // DEBUG.log(data);
  // const watchedObj = await watchedDbService.findWatched(tmdbId);
  // const bookmarkObj = await bookmarkDbService.findBookmark(tmdbId);
  // const returnObject = {
  //   played: watchedObj,
  //   bookmark: bookmarkObj,
  //   library: null,
  //   progress: null,
  //   favorite: null,
  // };
  // return returnObject;
}

/**
 *
 * @param {number[]} idList
 */
async function getUserMovieDataInList(idList) {
  const watchedObjList = await watchedDbService.getWatchedInList(idList);
  const bookmarkObjList = await bookmarkDbService.getBookmarkInList(idList);
  const libraryObjList = [];
  const userMovieDataList = [];
  console.log("watchedObjList: ", watchedObjList);
  console.log("bookmarkObjList: ", bookmarkObjList);
  mapObjList("watched", watchedObjList, userMovieDataList);
  mapObjList("bookmark", bookmarkObjList, userMovieDataList);
  mapObjList("library", libraryObjList, userMovieDataList);
  console.log("userMovieDataList: ", userMovieDataList);
  return userMovieDataList;
}

function mapObjList(type, objList, userMovieDataList) {
  objList.forEach((watchedObj) => {
    const res = userMovieDataList.find(
      (umd) => umd.tmdbId === watchedObj.tmdbId
    );
    if (!res) {
      userMovieDataList.push({
        tmdbId: watchedObj.tmdbId,
        [type]: mapSinglObj(type, watchedObj),
      });
    } else {
      res[type] = mapSinglObj(type, watchedObj);
    }
    if (watchedObj.tmdbId === 123) {
      console.log(userMovieDataList);
    }
  });
}

function mapSinglObj(type, obj) {
  let retObj = { id: obj.id };
  switch (type) {
    case "watched":
      retObj.percentage = obj.percentage;
      break;
    case "bookmark":
      break;
    case "library":
      retObj.fullFilePath = obj.fullFilePath;
      break;

    default:
      break;
  }
  return retObj;
}

/**
 *
 * @param {number} id
 */
async function saveUserData(body) {
  currentDb.insert(body, function (err, newDoc) {
    console.log(newDoc);
    console.log(newDoc._id);
  });
}

//
// {headers:
// }

function initializeService() {
  DEBUG.log("initializing...");
  DEBUG.log("argv", process.argv);

  DEBUG.log("args0", args[0]);
  //   '{"headers":{"operation":"save","subCommand":"bookmarks","uuid":"1234-abcd"},"body":{"tmdbId":1234}}';
  DEBUG.log(typeof args[0]);
  let data = JSON.parse(args[0]);
  DEBUG.log("data", data);
  const headers = data.headers;
  const body = data.body;
  const uuid = headers.uuid;
  const command = headers.operation;
  DEBUG.log("headers", headers);
  DEBUG.log("body", body);

  // "tmdbId":10681,"imdbId":"tt0910970"
  let hasError = false;
  let errorMessage = "";

  // let asyncFunc;
  switch (command) {
    case "save":
      asyncFunc = saveUserData(headers, body);
      break;
    case "find-one":
      findUserMovieData(headers, body);
      break;
    case "find-in-list":
      getUserMovieDataInList(body.idList);
      break;
    default:
      hasError = true;
      errorMessage += "No command";
      DEBUG.error(errorMessage);
      break;
  }

  if (hasError) {
    DEBUG.error(errorMessage);
    process.send([`user-data-${uuid}`, errorMessage]);
  }

  // asyncFunc.then((value, reject) => {
  //   process.send([`user-data-${uuid}`, value]);
  //   process.exit();
  // });

  console.log("ended...");
}

initializeService();
