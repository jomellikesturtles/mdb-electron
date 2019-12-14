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

var bookmarksDb = new DataStore({
  // filename: path.join(__dirname, '..', 'db', 'bookmarks.db'), // for node only
  filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
  autoload: true
})

process.on('uncaughtException', function (error) {
  console.log(error);
  process.send(['operation-failed', 'general']); //mainWindow.webContents.send('scrape-failed', 'general');
});


// --------- FUNCTIONS
//--------- BOOKMARK

function getBookmark() {
  bookmarksDb.findOne({ tmdbId: parseInt(tmdbIdArg) }, function (err, data) {
    if (!err) {
      console.log(data);
      if (data) {
        process.send(['bookmark-get-success', 1])
      } else {
        process.send(['bookmark-get-success', data])
      }
    } else {
      console.log(err);
    }
    process.exit(0)
  })
}

function insertBookmarkDb(tmdbId, imdbId) {
  bookmarksDb.insert({ tmdbId: parseInt(tmdbId), imdbId: imdbId }, function (err, data) {
    if (!err) {
      console.log(data);
      process.send(['bookmark-add-success', 1])
    } else {
      console.log("ERROR!", err);
    }
    process.exit(0)
  })
}

function addBookmark() {
  if (tmdbIdArg) {
    bookmarksDb.ensureIndex({ fieldName: 'tmdbId', unique: true, sparse: true }, function (err) { })
    insertBookmarkDb(tmdbIdArg, '')
  } else if (imdbIdArg) {
    bookmarksDb.ensureIndex({ fieldName: 'imdbId', unique: true, sparse: true }, function (err) { })
    insertBookmarkDb(0, imdbIdArg)
  }
}

function addBookmarkMulti() {
  const myList = [{ tmdbId: 124, imdbId: 'tt124' }, { tmdbId: 122, imdbId: 'tt122' }]
  let errorList = []
  myList.forEach(element => {
    bookmarksDb.insert(element, function (err, data) {
      if (!err) {
        console.log(data);
        process.send(['bookmark-add-success', data])
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
  bookmarksDb.remove({ tmdbId: parseInt(tmdbIdArg) }, {}, function (err, data) {
    if (!err) {
      process.send(['bookmark-remove-success', 1])
      if (data) {
        process.send(['bookmark-remove-success', null])
      }
    } else {
      console.log(err.type);
    }
    process.exit(0)
  })
}

function initializeService() {

  // "tmdbId":10681,"imdbId":"tt0910970"
  console.log('user-db-service initializeService', command, tmdbIdArg, imdbIdArg);
  console.log('filename', bookmarksDb.filename);

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
    default:
      break;
  }
}

initializeService()
