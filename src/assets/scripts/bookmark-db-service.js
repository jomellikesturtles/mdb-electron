/**
 * service for user's data, bookmark; for happy path, we will use TMDB for now.
 */
/*jshint esversion: 6 */
let args = process.argv.slice(2);
let headers = args[0];
let body = args[1];

const path = require('path');
const DataStore = require('nedb');

var bookmarkDb = new DataStore({
//   filename: path.join(__dirname, '..', 'db', 'bookmark.db'), // node
  filename: path.join(process.cwd(), 'src', 'assets', 'db', 'bookmarks.db'),
  autoload: true
})

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
// ----------BOOKMARK
/**
 *
 * @param {*} tmdbId
 */
function findBookmark(tmdbId) {
  return new Promise(function (resolve, reject) {
    bookmarkDb.findOne({ tmdb: parseInt(tmdbId, 10) }, function (err, doc) {
      if (!err) {
        console.log('bookmark found', doc);
        if (doc) {
          doc = convertToFEBookmark(doc);
          resolve(doc);
        } else {
          resolve(null);
        }
      } else {
        console.log(err);
      }
      // process.exit(0);
    });
  })
}

/**
 * Gets bookmark movies in list.
 * @param {any[]} idList list of id
 * @returns {Promise<any[]>} list of bookmark movies
 */
function getBookmarkInList(idList) {
  // console.log('getBookmarkInList idList: ',idList)
  // idList = idList.split(",").map((e) => parseInt(e, 10));
  return new Promise(function (resolve, reject) {
    bookmarkDb.find({ tmdb: { $in: idList }}, function (err, docs) {
      if (!err) {
        let toList = [];
        docs.forEach((element) => {
          toList.push(convertToFEBookmark(element));
        });
        console.log('DOCS: ', docs);
        resolve(toList);
      } else {
        console.log('ERROR', err);
        reject(err);
      }
    });
  });
}

function saveBookmark(args) {
  return new Promise(function (resolve, reject) {
    // bookmarkDb.ensureIndex({ fieldName: 'tmdb', unique: true, sparse: true }, function (err) {
      console.log('args.tmdbId: ', args.tmdbId);
      if (args.tmdbId) {
        const dbObj = convertToDbWatched(args);
        bookmarkDb.update({ tmdb: parseInt(args.tmdbId, 10) }, { $set: dbObj }, { upsert: true }, function (err, numAffected, upsert) {
          if (!err) {
            console.log('numAffected: ', numAffected);
            resolve(numAffected);
          } else {
            console.log('ERR: ', err.message);
          }
        });
      }
    // });
  });
}

/**
 * Removes bookmark.
 * @param {string} uuid
 * @param {*} id id/tmdbId
 * @returns number of affected instance.
 */
function removeBookmark(type, id) {

  return new Promise(function (resolve, reject) {
    if (type === 'id') {
      bookmarkDb.remove({ _id: id}, {}, (err, numAffected) => {removedCallback(err,numAffected).then(e => {
        resolve(e);
      })});
    } else if (type === 'tmdbId') {
      bookmarkDb.remove({ tmdb: parseInt(id, 10) }, {}, (err, numAffected) => {removedCallback(err,numAffected).then(e => {
        resolve(e);
      })});
    }
  });
}

function removedCallback(err, numAffected){
  return new Promise(function (resolve, reject) {
    console.log('removedCallback ', 'err ', err, ' | numAffected ', numAffected);
    if (!err) {
      resolve(numAffected);
    } else {
      console.log(err.type);
    }
  });
}

function initializeService() {

  const myHeaders = JSON.parse(headers);
  const dataArgs = JSON.parse(body);
  const uuid = myHeaders.uuid;
  const command = myHeaders.operation;
  console.log('myHeaders', myHeaders)
  console.log('dataArgs', dataArgs)

  switch (command) {
    case 'find-one': findBookmark(dataArgs.tmdbId).then(doc => {
        process.send([`bookmark-${uuid}`, doc]);
      });
      break;
    case 'find-in-list': getBookmarkInList(dataArgs.idList).then(value=>{
        process.send([`bookmark-${uuid}`, value]);
      });
      break;
    case 'save': saveBookmark(dataArgs);
      break;
    case 'remove': removeBookmark(dataArgs.type, dataArgs.id);
      break;
    default:
      break;
  }
}

console.log('initializingservice')
initializeService();

module.exports = {
  findBookmark: findBookmark,
  getBookmarkInList: getBookmarkInList
}


function convertToDbBookmark(arg) {
  return {
    _id: arg.id,
    tmdb: arg.tmdbId,
    imdb: arg.imdbId,
    title: arg.title,
    yr: arg.year,
  };
}

function convertToFEBookmark(arg) {
  return {
    id: arg._id,
    tmdbId: arg.tmdb,
    imdbId: arg.imdb,
    title: arg.title,
    year: arg.yr,
  };
}
