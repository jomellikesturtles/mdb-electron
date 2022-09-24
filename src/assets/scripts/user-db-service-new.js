/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
/*jshint esversion: 8 */
let args = process.argv.slice(2);
// let args = process.argv[2];

const path = require("path");
const DataStore = require("nedb");
const { DEBUG } = require("./shared/util");
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
  process.send(['operation-failed', 'general']);
});

process.send =
  process.send ||
  function (...args) {
    DEBUG.log("SIMULATING process.send", ...args);
  };


/**
 *
 * @param {number} tmdbId
 */
async function findUserMovieData(tmdbId) {
  const watchedObj = await watchedDbService.findWatched(tmdbId);
  const bookmarkObj = await bookmarkDbService.findBookmark(tmdbId);
  const returnObject = {
    played: watchedObj,
    bookmark: bookmarkObj,
    library: null,
    progress: null,
    favorite: null,
  };
  return returnObject;
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
  const subChannel = headers.subChannel;
  DEBUG.log("headers", headers);
  DEBUG.log("body", body);

  currentDb = new DataStore({
    // filename: path.join(__dirname, '..', 'db', `${subChannel}.db`), // node
    filename: path.join(
      process.cwd(),
      "src",
      "assets",
      "db",
      `${subChannel}.db`
    ),
    autoload: true,
  });

  // "tmdbId":10681,"imdbId":"tt0910970"
  let hasError = false;
  let errorMessage = "";
  switch (subChannel) {
    case "lists":
      currentDb.ensureIndex(
        { fieldName: "title", unique: true },
        function (err) {}
      );
      break;

    default:
      hasError = true;
      errorMessage = "No subChannel";
      DEBUG.error(errorMessage);
      break;
  }

  let asyncFunc;
  switch (command) {
    case "save":
      asyncFunc = saveUserData(headers, body);
      break;
    case "find":
      findUserMovieData(body.tmdbId);
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

  asyncFunc.then((value, reject) => {
    process.send([`user-data-${uuid}`, value]);
    process.exit();
  });

  console.log("ended...");
}

initializeService();
