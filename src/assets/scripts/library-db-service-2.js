const path = require('path');

var DataStore = require('nedb')
var libraryFilesDb = new DataStore(
  {
    // filename: '../db/libraryFiles2.db', // each file will now have their own row/id // nodeJS mode
    // filename: '../db/libraryFiles2.db',
    // filename: 'libraryFiles.db',
    filename: path.join(process.cwd(), 'src', 'assets', 'db', 'libraryFiles2.db'),
    autoload: true
  })


const count = function () {
  return new Promise(function (resolve, reject) {
    libraryFilesDb.count({}, function (err, data) {
      if (err) {
        console.log(err)
        return reject()
      } else {
        console.log('data:', data)
        return resolve(data)
      }
    })
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
  libraryFilesDb.ensureIndex({ fieldName: 'fullFilePath', unique: true }, function (err) { })
  libraryFilesDb.insert(params, function (err, numReplaced) {
    console.log('adding');
    if (!err || (numReplaced < 1)) {
      console.log("replaced---->" + numReplaced);
    } else {
      // console.log(err);
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

function getLibraryFilesByStep(index, step) {
  // console.log(`index, step: ${index}, ${step}`)
  return new Promise(function (resolve, reject) {
    libraryFilesDb.find({}).sort({}).skip(index).limit(step).exec(function (err, data) {
      if (!err) {
        // console.log('data:', data)
        resolve(data[0])
      } else {
        // reject()
      }
    })
  })
}

/**
 * Updates the fields in library files db.
 * @param idArg id to replace with
 * @param replacementObj fields of objects to replace
 */
function updateFields(idArg, replacementObj) {
  // function updateFields(idArg, tmdbIdArg, titleArg, yearArg) {
  libraryFilesDb.update({ _id: idArg }, { $set: replacementObj }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  })
}

function getLibraryFilesByTmdbId(tmdbIdArg) {
  return new Promise(function (resolve, reject) {
    libraryFilesDb.find({ tmdbId: tmdbIdArg }, function (err, data) {
      if (!err) {
        console.log('data:', data)
        resolve(data)
        // return data
      } else {
        console.log('err:', err)
        // reject()
      }
    })
  })
}

getLibraryFilesByTmdbId(505948)
// updateFields('3JKDWUVlWfLQ5y1v', '505948', 'I Am Mother', 2019)
// updateFields('RdmTLWXNNlkVY5JX', { tmdbId: 10681, title: 'WALL·E', year: '2008' })

module.exports = {
  count: count,
  insertLibraryFiles: insertLibraryFiles,
  insertTmdbId: insertTmdbId,
  getLibraryFilesMulti: getLibraryFilesMulti,
  removeLibraryFile: removeLibraryFile,
  getLibraryFilesByStep: getLibraryFilesByStep,
  updateFields,
  getLibraryFilesByTmdbId
}
