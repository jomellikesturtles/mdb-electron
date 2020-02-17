/**
 * service for user's data, watchlist, watched; for happy path, we will use TMDB for now.
 */
let args = process.argv.slice(2);
let command = args[0];
let tmdbIdArg = args[1];
let imdbIdArg = args[2];

let fs = require('fs');
const path = require('path');
var DataStore = require('nedb')
var utilJs = require('./util.js')
var bookmarksService = require('./bookmarks-service.js')
var bookmarksDb = new DataStore({
  filename: path.join(__dirname, '..', 'db', 'bookmarks.db'), // for node only
  //   // filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
  autoload: true
})
var bookmarksChangesDb = new DataStore({
  filename: path.join(__dirname, '..', 'db', 'bookmarks-changes.db'), // for node only
  //   // filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks-changes.db'),
  autoload: true
})

process.on('uncaughtException', function (error) {
  console.log(error);
  // process.send(['operation-failed', 'general']);
});

process.send = process.send || function (...args) { DEBUG.log('SIMULATING process.send', ...args) };

// --------- FUNCTIONS
//--------- BOOKMARK

function getBookmark() {
  bookmarksDb.findOne({ tmdbId: parseInt(tmdbIdArg, 10) }, function (err, data) {
    if (!err) {
      console.log(data);
      if (data) {
        // process.send(['bookmark-get-success', 1])
      } else {
        // process.send(['bookmark-get-success', data])
      }
    } else {
      console.log(err);
    }
    // process.exit(0)
  })
}

function getBookmarkMulti(skip, limit) {
  bookmarksDb.find({}).sort({}).skip(skip).limit(limit).exec(function (err, data) {
    if (!err) {
      console.log(data);
      if (data) {
        // process.send(['bookmark-get-success', 1])
      } else {
        // process.send(['bookmark-get-success', data])
      }
    } else {
      console.log(err);
    }
    // process.exit(0)
  })
}

function insertBookmarkDb(tmdbId, imdbId) {
  bookmarksDb.insert({ tmdbId: parseInt(tmdbId, 10), imdbId: imdbId }, function (err, data) {
    if (!err) {
      console.log(data);
      // process.send(['bookmark-add-success', 1])
      addChanges('add', tmdbId)
    } else {
      console.log("ERROR!", err);
    }
  })
}

function addBookmark() {
  if (tmdbIdArg) {
    bookmarksDb.ensureIndex({ fieldName: 'tmdbId', unique: true, sparse: true }, function (err) {
      if (err) {
        console.log(err);
      } else {
        insertBookmarkDb(tmdbIdArg, '') // tmdb id and empty imdb
      }
    })
  } else if (imdbIdArg) {
    bookmarksDb.ensureIndex({ fieldName: 'imdbId', unique: true, sparse: true }, function (err) {
      if (err) {
        console.log(err);
      } else {
        insertBookmarkDb(0, imdbIdArg) // zero tmdb id and imdb id
      }
    })
  }
}

function addBookmarkMulti() {
  const myList = [{ tmdbId: 124, imdbId: 'tt124' }, { tmdbId: 122, imdbId: 'tt122' }]
  let errorList = []
  myList.forEach(element => {
    bookmarksDb.insert(element, function (err, data) {
      if (!err) {
        console.log(data);
        // process.send(['bookmark-add-success', data])
      } else {
        console.log(err.type)
        errorList.push(err.key)
      }
    })
  });
  console.log('done');
}

function updateBookmark() {

  const fieldToUpdate = 'tmdbId'
  if (fieldToUpdate === 'tmdbId') { // if tmdb id is field to update; for future use.
    bookmarksDb.update({ tmdbId: tmdbIdArg }, { $set: { imdbId: imdbIdArg } }, function (err, data) {
      if (!err) {
      }
    })
  }
  else {
    bookmarksDb.update({ imdbId: imdbIdArg }, { $set: { tmdbId: tmdbIdArg } }, function (err, data) {
      if (!err) {
      }
    })
  }
}

function removeBookmark() {
  console.log('tmdbIdArg:', parseInt(tmdbIdArg, 10));
  const idToRemove = parseInt(tmdbIdArg, 10)
  bookmarksDb.remove({ tmdbId: idToRemove }, {}, function (err, data) {
    if (!err) {
      console.log('bookmarksDb.remove ', data);
      // process.send(['bookmark-remove-success', 1])
      if (data > 0) {
        console.log('data > 0');

        addChanges('remove', idToRemove)
        // process.send(['bookmark-remove-success', null])
      }
    } else {
      console.log(err.type);
    }
  })
}

/**
 * Saves the bookmark changes into the bookmarks-changes.db
 * @param type change type
 * @param id the tmdb id or imdb id
 */
function addChanges(type, id) {
  bookmarksDb.ensureIndex({ fieldName: 'tmdbId', unique: true }, function (err) {
    if (!err) {
      bookmarksChangesDb.update({ tmdbId: parseInt(id, 10) },
        { $set: { command: type, timestamp: Date.now() } },
        { upsert: true }, function (err, numAffected, upsert) {
          if (!err) {
            console.log(numAffected);
            console.log(upsert);
          } else {
            console.log(err);
          }
          // process.exit(0)
        })
    } else {
      // process.exit(0)
    }
  })
}

function initializeService() {
  // "tmdbId":10681,"imdbId":"tt0910970"
  console.log('user-db-service initializeService', command, tmdbIdArg, imdbIdArg);
  switch (command) {
    case 'bookmark-get': getBookmark()
      break;
    case 'bookmark-add': addBookmark()
      break;
    case 'bookmark-add-multi': addBookmarkMulti()
      break;
    case 'bookmark-update': updateBookmark()
      break;
    case 'bookmark-remove': removeBookmark()
      break;
    case 'bookmark-count-all':
      bookmarksService.count()
      break;
    default:
      break;
  }
}

command = 'bookmark-count-all'
initializeService()
