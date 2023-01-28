/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
/*jshint esversion: 8 */
let args = process.argv.slice(2);
let headers = args[0];
let body = args[1];

const path = require("path");
const DataStore = require("nedb");
const { getNumberOfPages } = require("./shared/util");

var watchedDb = new DataStore({
  // filename: path.join(__dirname, '..', 'db', 'watched.db'), // node
  filename: path.join(process.cwd(), "src", "assets", "db", "watched.db"),
  autoload: true
});

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp)
  };
})();

process.send =
  process.send ||
  function (...args) {
    DEBUG.log("SIMULATING process.send", ...args);
  };

process.on("uncaughtException", function (error) {
  DEBUG.log(error);
  process.send(["operation-failed", "general"]);
});

/**
 * ... can be used in paginated list.
 * @param {number} skip
 * @param {number} step
 * @param {*} sort // {year:1} ascending year, {year:-1} descending year
 */
function getWatchedByStep(skip, step, sort) {
  // DEBUG.log(`index, step: ${index}, ${step}`)
  return new Promise(function (resolve, reject) {
    watchedDb
      .find({})
      .sort(sort)
      .skip(skip)
      .limit(step)
      .exec(function (err, data) {
        if (!err) {
          DEBUG.log("data:", data);
          resolve(data);
        } else {
          // reject()
        }
      });
  });
}

/**
 *  // Count all planets in the solar system
 *  // db.count({ system: 'solar' }, function (err, count) {
 * // // count equals to 3
 * // });
 * @param {object} option
 */
function countWatched(option) {
  return new Promise(function (resolve, reject) {
    watchedDb.count(option, function (err, data) {
      resolve(data);
    });
  });
}

/**
 * In paginated list.
 * @param {number} page page to get
 * @param {number} size num of items
 * @param {*} sort {year:1} ascending year, {year:-1} descending year
 */
async function getWatchedPaginated(page, size, sort) {
  const count = await countWatched({});
  const skip = size > count ? 0 : size * page + -1;
  const watchedList = await getWatchedByStep(skip, size, sort);

  return new Promise(function (resolve, reject) {
    if (watchedList.length > 0) {
      let newData = [];
      const totalPages = getNumberOfPages(count, size);
      watchedList.forEach((e) => {
        newData.push(convertToFEWatched(e));
      });
      const toReturn = {
        page: page,
        totalPages: totalPages,
        totalResults: count,
        results: newData
      };
      resolve(toReturn);
    } else {
      const toReturn = {
        page: page,
        totalPages: 0,
        totalResults: 0,
        results: []
      };
      resolve(toReturn);
    }
  });
}

function initializeService() {
  const myHeaders = JSON.parse(headers);
  const dataArgs = JSON.parse(body);
  const uuid = myHeaders.uuid;
  const command = myHeaders.operation;
  DEBUG.log("myHeaders", myHeaders);
  DEBUG.log("dataArgs", dataArgs);
  switch (command) {
    case "find-in-list":
      getWatchedInList(dataArgs.idList).then((value) => {
        process.send([`watched-${uuid}`, value]);
      });
      break;
    case "get-by-page":
      getWatchedPaginated(dataArgs.page, dataArgs.size, dataArgs.sort).then((value) => {
        process.send([`watched-${uuid}`, value]);
      });
      break;
    default:
      break;
  }
}

// headers = {operation: 'remove', uuid:'123'};
// body = {type:'tmdbId', id:10895};
// headers = JSON.stringify(headers);
// body = JSON.stringify(body);
initializeService();

module.exports = {
  findWatched: findWatched,
  getWatchedInList: getWatchedInList
};

function convertToDbWatched(arg) {
  return {
    _id: arg.id,
    tmdb: arg.tmdbId,
    imdb: arg.imdbId,
    title: arg.title,
    yr: arg.year,
    pctg: arg.percentage
  };
}

function convertToFEWatched(arg) {
  return {
    id: arg._id,
    tmdbId: arg.tmdb,
    imdbId: arg.imdb,
    title: arg.title,
    year: arg.yr,
    percentage: arg.pctg
  };
}
