/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
/*jshint esversion: 8 */
let args = process.argv.slice(2);
let headers = args[0];
let body = args[1];

const path = require("path");
const DataStore = require("nedb");

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

const preferencesDb = new DataStore({
  // filename: path.join(__dirname, "..", "db", "bookmarks.db"), // for node only
  filename: path.join(process.cwd(), "src", "assets", "db", "preferences.db"),
  autoload: true,
});

process.on("uncaughtException", function (error) {
  console.log(error);
  // process.send(['operation-failed', 'general']);
});

process.send =
  process.send ||
  function (...args) {
    DEBUG.log("SIMULATING process.send", ...args);
  };

process.on("uncaughtException", function (error) {
  console.log(error);
  process.send(["operation-failed", "general"]);
});

/**
 *
 * @param {string} id
 */
async function findPreferenceById(id) {
  await preferencesDb.findOne({ _id: id }, function (err, doc) {});
}

async function getAllPreferences() {
  // preferencesDb.
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

function initializeService() {
  const myHeaders = JSON.parse(headers);
  const dataArgs = JSON.parse(body);
  const command = myHeaders.operation;
  const prefId = myHeaders.prefId;
  console.log("myHeaders", myHeaders);
  console.log("dataArgs", dataArgs);
  // "tmdbId":10681,"imdbId":"tt0910970"
  // console.log("user-db-service initializeService",
  //   command, tmdbIdArg, imdbIdArg);
  switch (command) {
    case "find-by-id":
      findPreferenceById(dataArgs.tmdbId).then((value) => {
        process.send([`preferences-${prefId}`, value]);
      });
      break;
    case "get-all":
      getAllPreferences().then((value) => {
        process.send([`preferences`, value]);
      });
      break;
    default:
      break;
  }
}

initializeService();
