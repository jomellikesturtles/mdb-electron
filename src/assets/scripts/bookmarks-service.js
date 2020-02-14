// const path = require("path");

var DataStore = require("nedb");
var bookmarksDb = new DataStore({
  filename: "../db/bookmarks.db", // each file will now have their own row/id // nodeJS mode
  // filename: path.join(process.cwd(), "src", "assets", "db", "bookmarks.db"), // electron mode
  autoload: true
});

function count() {
  return new Promise(function (resolve, reject) {
    bookmarksDb.count({}, function (err, data) {
      if (err) {
        console.log(err);
        return reject();
      } else {
        console.log("data:", data);
        return resolve(data);
      }
    });
  });
}

/**
 * Inserts bookmark into the database.
 * @param {*} params the object
 */
function insertBookmark(params) {
  params.timestamp = new Date().getTime()
  bookmarksDb.insert(params, function (err, inserted) {
    console.log("adding");
    if (!err && inserted) {
      console.log("inserted---->" + inserted);
    } else {
      console.log('ERR', err);
    }
  })
}

/**
 * Inserts tmdb or imdb id.
 * @param id the tmdb id or imdb id
 * @param libraryId the full file path
 */
function insertTmdbId(id, libraryId) {
  bookmarksDb.update({ _id: libraryId }, { $set: { tmdbId: id } }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
}

function removeBookmark(val) {
  bookmarksDb.remove({ tmdbId: val }, {}, function (err, numRemoved) {
    if (!err) {
      console.log(numRemoved);
      // fullFilePath = data.fullFilePath
      Promise.resolve(numRemoved);
    } else {
      return Promise.reject(err);
    }
  });
}

/**
 * Gets all bookmarks paginated.
 * @param {*} index
 * @param {*} step
 */
function getBookmarks(index, step) {
  // console.log(`index, step: ${index}, ${step}`)
  return new Promise(function (resolve, reject) {
    bookmarksDb
      .find({})
      .skip(index)
      .limit(step)
      .exec(function (err, data) {
        if (!err) {
          // if (data.length >= 1) {
          //   fullFilePath = data[0].fullFilePath;
          //   resolve(fullFilePath);
          // }
          // console.log('data:', data)
          resolve(data[0]);
        } else {
          // reject()
        }
      });
  });
}

/**
 * Updates the fields in bookmarks db.
 * @param idArg nedb id to replace with
 * @param replacementObj fields of objects to replace
 */
function updateFields(idArg, replacementObj) {
  // function updateFields(idArg, tmdbIdArg, titleArg, yearArg) {
  bookmarksDb.update({ _id: idArg }, { $set: replacementObj }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
}

function getLibraryFilesByTmdbId(tmdbIdArg) {
  return new Promise(function (resolve, reject) {
    bookmarksDb.find({ tmdbId: tmdbIdArg }, function (err, data) {
      if (!err) {
        console.log("data:", data);
        resolve(data);
        // return data
      } else {
        console.log("err:", err);
        // reject()
      }
    });
  });
}

/**
 * Finds new bookmarks greater than specified timestamp.
 * @param timestamp timestamp to find with
 */
function findNewBookmarks(timestamp, index, step) {

  return new Promise(function (resolve, reject) {
    bookmarksDb.find({ timestamp: { '$gt': timestamp } })
      .skip(index)
      .limit(step)
      .exec(function (err, data) {
        if (!err) {
          console.log('data:', data)
          resolve(data[0]);
        } else {
          // reject()
        }
      });
  });
}
// updateFields('3JKDWUVlWfLQ5y1v', '505948', 'I Am Mother', 2019)
// updateFields('RdmTLWXNNlkVY5JX', { tmdbId: 10681, title: 'WALL·E', year: '2008' })

bookmarksDb.ensureIndex({ fieldName: 'tmdbId', unique: true }, function (err) {
  removeBookmark('tt0128434')
  // insertBookmark({ tmdbId: 232222, imdbId: 'tt0128434' })
  // count()
  // findNewBookmarks(1581590374259, 0 , 5)
})


module.exports = {
  // count: count,
  // insertBookmark: insertBookmark,
  // insertTmdbId: insertTmdbId,
  // getLibraryFilesMulti: getLibraryFilesMulti,
  // removeLibraryFile: removeLibraryFile,
  // getLibraryFilesByStep: getLibraryFilesByStep,
  // updateFields,
  // getLibraryFilesByTmdbId
};

/**

export interface IBookmark {
    _id: string,
    tmdbId: number
    imdbId: string
    timestamp?: number
}
*
 *
 */
