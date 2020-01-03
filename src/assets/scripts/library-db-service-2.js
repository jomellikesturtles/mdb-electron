const path = require('path');

var DataStore = require('nedb')
var libraryFilesDb = new DataStore(
  {
    filename: '../db/libraryFiles2.db', // each file will now have their own row/id
    // filename: '../db/libraryFiles.db',
    // filename: 'libraryFiles.db',
    autoload: true
  })


const count = function () {


  // return new Promise(function (resolve, reject) {
  //   var fullFilePath = null
  //   libraryFilesDb.find({}).sort({}).skip(skip).limit(limit).exec(function (err, data) {
  //     if (!err) {
  //       fullFilePath = data.fullFilePath
  //       resolve(fullFilePath)
  //     } else {
  //       reject()
  //     }
  //   })
  // })
  // }, 1000);


  return new Promise(function (resolve, reject) {
    console.log('setting timeout');
    // setTimeout(function () {
    libraryFilesDb.count({}, function (err, data) {
      if (err) {
        console.log(err)
        return reject()
      } else {
        console.log('data:', data)
        return resolve(data)
      }
    })
    // }, 1000)
  })



  // var fullFilePath = null
  // libraryFilesDb.find({}).sort({}).skip(skip).limit(limit).exec(function (err, data) {
  //   if (!err) {
  //     fullFilePath = data.fullFilePath
  //     Pormise.resolve(fullFilePath)
  //   } else {
  //   }
  // })
  // // })
  // return Promise.reject(true)

}

/**
 * Inserts library files into the database.
 * @param {*} params the object
 */
function insertLibraryFiles(params) {
  libraryFilesDb.insert(params, function (err, numReplaced) {
    console.log('adding');
    if (!err || (numReplaced < 1)) {
      console.log("replaced---->" + numReplaced);
    } else {
      console.log(err);
    }
  })
}


/**
 * Inserts tmdb or imdb id.
 * @param {*} id the tmdb id or imdb id
 * @param fullFilePath the full file path
 */
function insertTmdbId(id, libraryId) {
  libraryFilesDb.update({ _id: libraryId }, { $set: { tmdbId: id } }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })
}

/**
 *
 * @param {} skip
 * @param {*} limit
 */
function getLibraryFilesMulti(skip, limit) {

  return new Promise(function (resolve, reject) {
    var fullFilePath = null
    libraryFilesDb.find({}).sort({}).skip(skip).limit(limit).exec(function (err, data) {
      if (!err) {
        if (data.length >= 1) {
          fullFilePath = data[0].fullFilePath
          resolve(fullFilePath)
        }
      } else {
        reject()
      }
    })
  })
  // return Promise.reject(true
}

function getLibraryFilesMulti2(skip, limit) {

  // return new Promise(function (resolve, reject) {
  var fullFilePath = null
  libraryFilesDb.find({}).sort({}).skip(skip).limit(limit).exec(function (err, data) {
    if (!err) {
      fullFilePath = data.fullFilePath
      Pormise.resolve(fullFilePath)
    } else {
    }
  })
  // })
  return Promise.reject(true)
}

function removeLibraryFile(val) {
  libraryFilesDb.remove({ fullFilePath: val }, {}, function (err, numRemoved) {
    if (!err) {
      console.log(numRemoved)

      // fullFilePath = data.fullFilePath
      Promise.resolve(numRemoved)
    } else {
      return Promise.reject(err)
    }
  })
}

function initialize() {

}

module.exports = {
  count: count,
  insertLibraryFiles: insertLibraryFiles,
  insertTmdbId: insertTmdbId,
  getLibraryFilesMulti: getLibraryFilesMulti,
  removeLibraryFile: removeLibraryFile,
}
