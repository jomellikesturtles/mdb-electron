/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
/*jshint esversion: 8 */
let args = process.argv.slice(2);
let headers = args[0];
let body = args[1];

const path = require("path");
const DataStore = require("nedb");
const watchedDbService = require('./watched-db-service');
const bookmarkDbService = require('./bookmark-db-service');

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
  console.log(error);
  // process.send(['operation-failed', 'general']);
});

process.send = process.send ||
  function (...args) {
    DEBUG.log("SIMULATING process.send", ...args);
  };

process.on('uncaughtException', function (error) {
  console.log(error);
  process.send(['operation-failed', 'general']);
});

/**
 *
 * @param {number} id
 */
async function findUserMovieData(id) {
    const watchedObj = await watchedDbService.findWatched(id);
    const bookmarkObj = await bookmarkDbService.findBookmark(id);
    const returnObject = {
      watched: watchedObj,
      bookmark:  bookmarkObj,
      library: null
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
  console.log('watchedObjList: ', watchedObjList)
  console.log('bookmarkObjList: ', bookmarkObjList)
  mapObjList("watched", watchedObjList, userMovieDataList);
  mapObjList("bookmark", bookmarkObjList, userMovieDataList);
  mapObjList("library", libraryObjList, userMovieDataList);
  console.log('userMovieDataList: ', userMovieDataList)
  return userMovieDataList;
}

function mapObjList(type, objList, userMovieDataList) {
  objList.forEach((watchedObj) => {
    const res = userMovieDataList.find((umd) => umd.tmdbId === watchedObj.tmdbId);
    if (!res) {
      userMovieDataList.push({ tmdbId: watchedObj.tmdbId, [type]: mapSinglObj(type, watchedObj) });
    } else {
      res[type] = mapSinglObj(type, watchedObj);
    }
    if (watchedObj.tmdbId === 123) {
      console.log(userMovieDataList)
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
 * !UNUSED
 * Saves the bookmark changes into the bookmarks-changes.db
 * @param type change type
 * @param id the tmdb id or imdb id
 */
function addChanges(type, id) {
  bookmarksDb.ensureIndex({ fieldName: "tmdbId", unique: true }, function (err) {
    if (!err) {
      bookmarksChangesDb.update(
        { tmdbId: parseInt(id, 10) },
        { $set: { command: type, timestamp: Date.now() } },
        { upsert: true },
        function (err, numAffected, upsert) {
          if (!err) {
            console.log(numAffected);
            console.log(upsert);
          } else {
            console.log(err);
          }
          // process.exit(0)
        });
    } else {
      // process.exit(0)
    }
  });
}

function initializeService() {
  const myHeaders = JSON.parse(headers);
  const dataArgs = JSON.parse(body);
  const uuid = myHeaders.uuid;
  const command = myHeaders.operation;
  console.log("myHeaders", myHeaders);
  console.log("dataArgs", dataArgs);
  // "tmdbId":10681,"imdbId":"tt0910970"
  // console.log("user-db-service initializeService",
  //   command, tmdbIdArg, imdbIdArg);
  switch (command) {
    case "find": findUserMovieData(dataArgs.tmdbId).then((value) => {
        process.send([`user-data-${uuid}`, value]);
      });
      break;
    case "find-in-list": getUserMovieDataInList(dataArgs.idList).then((value) => {
        process.send([`user-data-${uuid}`, value]);
      });
      break;
    default:
      break;
  }
}

initializeService();
