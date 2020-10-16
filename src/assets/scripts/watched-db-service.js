/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
/*jshint esversion: 6 */
let args = process.argv.slice(2);
let command = args[0];
let uuid = args[1];
let tmdbIdArg = args[2];
let dataArgs = args[3];

let fs = require('fs');
const path = require('path');
const DataStore = require('nedb');

var watchedDb = new DataStore({
  filename: path.join(__dirname, '..', 'db', 'watched.db'),
  // filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
  autoload: true
})

// var bookmarksDb = new DataStore({
//   // filename: path.join(__dirname, '..', 'db', 'bookmarks.db'), // for node only
//   filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
//   autoload: true
// })

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

process.on('uncaughtException', function (error) {
  console.log(error);
  process.send(['operation-failed', 'general']);
});

// --------- FUNCTIONS
// ----------WATCHED
function getWatched(uuid, args) {
  watchedDb.findOne({ tmdbId: parseInt(args, 10) }, function (err, doc) {
    if (!err) {
      console.log('watched found', doc);
      if (doc) {
        process.send([`watched-${uuid}`, doc]);
      } else {
        process.send([`watched-${uuid}`, null]);
      }
    } else {
      console.log(err);
    }
    process.exit(0);
  });
}

/**
 * Gets watched movives in list.
 * @param {string} uuid the uuid
 * @param {any[]} idList list of id
 * @returns list of watched movies
 */
function getWatchedInList(uuid, idList) {

  idList = idList.split(",").map((e) => parseInt(e, 10));
  return new Promise(function (resolve, reject) {
    watchedDb.find({ tmdbId: { $in: idList }}, function (err, docs) {
      if (!err) {
        let toList = [];
        docs.forEach((element) => {
          toList.push(element);
          toList.push({ tmdbId: element.tmdbId, fullFilePath: element.fullFilePath, id: element._id });
        });
        console.log('DOCS: ', docs);
        resolve([`watched-${uuid}`, toList]);
        // process.send([`watched-${uuid}`, toList]);
      } else {
        console.log('ERROR', err);
        reject(err)
      }
    });
  });
}

function saveWatched(uuid, args) {
  // const data = args[2];
  // console.log('saveWatched data: ', a
  // console.log('saveWatched data: ', data)
  // console.log('saveWatched data: ', JSON.stringify(data))
  // console.log('saveWatched data: ', data.tmdbId)
  // console.log('saveWatched data: ', JSON.parse(data))
  // const data = {imdbId: "tt1234567", tmdbId: 123, watchedTime: 24}
  // console.log('saveWatched data: ', JSON.parse(data))

  watchedDb.ensureIndex({ fieldName: 'tmdbId', unique: true, sparse: true }, function (err) {
    if (tmdbIdArg) {
      watchedDb.update({ tmdbId: parseInt(tmdbIdArg, 10) }, { $set: args }, { upsert: true }, function (err, numAffected, upsert) {
        if (!err) {
          process.send([`watched-${uuid}`, numAffected]);
        }
        process.exit(0);
      });
    }
  });
}

function removeWatched() {
  watchedDb.remove({ tmdbId: parseInt(tmdbIdArg) }, {}, function (err, data) {
    if (!err) {
      console.log(data);
      if (data) {
        process.send(['watched-success', 1])
      }
      else {
        process.send(['watched-success', null])
      }
    } else {
      console.log(err.type);
    }
    process.exit(0)
  })
}

function initializeService() {

  switch (command) {
    case 'findOne': getWatched(uuid, dataArgs);
      break;
    case 'find-in-list': getWatchedInList(uuid ,dataArgs).then(value=>{
      process.send([`watched-${uuid}`, value]);
    });
      break;
    case 'save': saveWatched(uuid, dataArgs);
      break;
    case 'remove': removeWatched();
      break;
    default:
      break;
  }
}

initializeService();
