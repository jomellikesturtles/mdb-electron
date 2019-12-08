/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
let args = process.argv.slice(2);
let command = args[0];
let tmdbIdArg = args[1];
let imdbIdArg = args[2];

let fs = require('fs');
const path = require('path');
const DataStore = require('nedb')

var watchedDb = new DataStore({
  // filename: path.join(__dirname, '..', 'db', 'watched.db'),
  filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
  autoload: true
})

// var bookmarksDb = new DataStore({
//   // filename: path.join(__dirname, '..', 'db', 'bookmarks.db'), // for node only
//   filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
//   autoload: true
// })

process.on('uncaughtException', function (error) {
  console.log(error);
  process.send(['operation-failed', 'general']); //mainWindow.webContents.send('scrape-failed', 'general');
});


// --------- FUNCTIONS
// ----------WATCHED
function getWatched() {
  watchedDb.findOne({ tmdbId: parseInt(tmdbIdArg) }, function (err, data) {
    if (!err) {
      console.log(data);
      if (data) {
        process.send(['watched-success', 1])
      } else {
        process.send(['watched-success', null])
      }
    } else {
      console.log(err);
    }
    process.exit(0)
  })
}

function insertWatchedDb(tmdbId, imdbId) {
  watchedDb.insert({ tmdbId: parseInt(tmdbId), imdbId: imdbId }, function (err, data) {
    if (!err) {
      console.log(data);
      process.send(['watched-success', 1])
    } else {
      console.log("ERROR!", err);
    }
    process.exit(0)
  })
}

function addWatched() {
  if (tmdbIdArg) {
    watchedDb.ensureIndex({ fieldName: 'tmdbId', unique: true, sparse: true }, function (err) { })
    insertWatchedDb(tmdbIdArg, '')
  } else if (imdbIdArg) {
    watchedDb.ensureIndex({ fieldName: 'imdbId', unique: true, sparse: true }, function (err) { })
    insertWatchedDb(0, imdbIdArg)
  }
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
    case 'get': getWatched()
      break;
    case 'add': addWatched()
      break;
    case 'remove': removeWatched()
      break;
    default:
      break;
  }
}

initializeService()
