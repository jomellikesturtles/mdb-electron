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

var playedDb = new DataStore({
  filename: path.join(__dirname, "..", "db", "played-old.db"), // node
  // filename: path.join(process.cwd(), "src", "assets", "db", "played.db"),
  autoload: true,
});

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
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

class PlayedRepository {
  instance = this.constructor.instance;
  ;
  _this;
  #playedDbLocal;
  constructor() {
    // if (instance) return instance;
    // this.instance = this;
    this._this = this;
    this.#playedDbLocal = new DataStore({
      filename: path.join(__dirname, "..", "db", "played.db"), // node
      // filename: path.join(process.cwd(), "src", "assets", "db", "played.db"),
      autoload: true,
    });
  }

  findPlayed(tmdbId) {
    let root = this;
    return new Promise(function (resolve, reject) {
      DEBUG.log("findPlayed tmdbId", tmdbId);
      DEBUG.log("findPlayed constructor", constructor());
      root.#playedDbLocal.findOne(
        { tmdbId: parseInt(tmdbId, 10) },
        function (err, doc) {
          if (!err) {
            DEBUG.log("played found", doc);
            if (doc) {
              doc = root.#convertToFEWatched(doc);
              resolve(doc);
            } else {
              resolve(null);
            }
          } else {
            DEBUG.log(err);
          }
          // process.exit(0);
        }
      );
    });
  }

  /**
   * Gets watched movies in list.
   * @param {any[]} idList list of id
   * @returns {Promise<any[]>} list of watched movies
   */
  getPlayedInList(idList) {
    console.log("getPlayedInList idList2: ", idList);
    return new Promise(function (resolve, reject) {
      playedDbLocal.find({ tmdbId: { $in: idList } }, function (err, docs) {
        if (!err) {
          let toList = [];
          docs.forEach((element) => {
            toList.push(root.#convertToFEWatched(element));
            console.log("PUSHING ", this.convertToFEWatched(element));
          });
          DEBUG.log("DOCS: ", docs);
          resolve(toList);
        } else {
          DEBUG.log("ERROR", err);
          reject(err);
        }
      });
    });
  }

  #convertToFEWatched(arg) {
    return {
      id: arg._id,
      tmdbId: arg.tmdb,
      imdbId: arg.imdb,
      title: arg.title,
      year: arg.yr,
      percentage: arg.pctg,
    };
  }
}
// --------- FUNCTIONS
// ----------WATCHED
/**
 * ... can be used in paginated list.
 * @param {number} skip
 * @param {number} step
 * @param {*} sort // {year:1} ascending year, {year:-1} descending year
 */
function getWatchedByStep(skip, step, sort) {
  // DEBUG.log(`index, step: ${index}, ${step}`)
  return new Promise(function (resolve, reject) {
    playedDb
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
    playedDb.count(option, function (err, data) {
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
        results: newData,
      };
      resolve(toReturn);
    } else {
      const toReturn = {
        page: page,
        totalPages: 0,
        totalResults: 0,
        results: [],
      };
      resolve(toReturn);
    }
  });
}

function saveWatched(args) {
  return new Promise(function (resolve, reject) {
    // watchedDb.ensureIndex({ fieldName: 'tmdbId', unique: true, sparse: true }, function (err) {
    DEBUG.log("args.tmdbId: ", args.tmdbId);
    if (args.tmdbId) {
      const dbObj = convertToDbWatched(args);
      playedDb.update(
        { tmdb: parseInt(args.tmdbId, 10) },
        { $set: dbObj },
        { upsert: true },
        function (err, numAffected, upsert) {
          if (!err) {
            DEBUG.log("numAffected: ", numAffected);
            resolve(numAffected);
          } else {
            DEBUG.log("ERR: ", err.message);
          }
        }
      );
    }
    // });
  });
}

/**
 * Removes watched.
 * @param {*} args id/tmdbId
 * @returns number of affected instance.
 */
function removeWatched(type, id) {
  return new Promise(function (resolve, reject) {
    if (type === "id") {
      playedDb.remove({ _id: id }, {}, (err, numAffected) => {
        removedCallback(err, numAffected).then((e) => {
          resolve(e);
        });
      });
    } else if (type === "tmdbId") {
      playedDb.remove({ tmdb: parseInt(id, 10) }, {}, (err, numAffected) => {
        removedCallback(err, numAffected).then((e) => {
          resolve(e);
        });
      });
    }
  });
}

function removedCallback(err, numAffected) {
  return new Promise(function (resolve, reject) {
    DEBUG.log("removedCallback ", "err ", err, " | numAffected ", numAffected);
    if (!err) {
      resolve(numAffected);
    } else {
      DEBUG.log(err.type);
    }
  });
}

// headers = {operation: 'remove', uuid:'123'};
// body = {type:'tmdbId', id:10895};
// headers = JSON.stringify(headers);
// body = JSON.stringify(body);
// initializeService();

module.exports = {
  // findWatched: findWatched,
  // getWatchedInList: getWatchedInList,
  PlayedRepository,
};

function convertToDbWatched(arg) {
  return {
    _id: arg.id,
    tmdb: arg.tmdbId,
    imdb: arg.imdbId,
    title: arg.title,
    yr: arg.year,
    pctg: arg.percentage,
  };
}

function convertToFEWatched(arg) {
  return {
    id: arg._id,
    tmdbId: arg.tmdb,
    imdbId: arg.imdb,
    title: arg.title,
    year: arg.yr,
    percentage: arg.pctg,
  };
}
