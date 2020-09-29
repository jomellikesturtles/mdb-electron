/*jshint esversion: 6 */
const path = require('path');

var DataStore = require('nedb')
var { regexify } = require('./shared/util')
var libraryFilesDb = new DataStore(
  {
    // filename: '../db/libraryFiles2.db', // each file will now have their own row/id // nodeJS mode
    filename: path.join(process.cwd(), 'src', 'assets', 'db', 'libraryFiles2.db'),
    autoload: true
  });

process.send =
  process.send ||
  function (...args) {
    console.log("SIMULATING process.send", ...args);
  };

const count = function () {
  return new Promise(function (resolve, reject) {
    libraryFilesDb.count({}, function (err, data) {
      if (err) {
        console.log(err);
        return reject();
      } else {
        console.log('data:', data);
        return resolve(data);
      }
    });
  });
}

/**
 * Inserts library files into the database.
 * @param {*} params the object
 */
function insertLibraryFiles(params) {
  libraryFilesDb.ensureIndex({ fieldName: 'fullFilePath', unique: true }, function (err) {
  libraryFilesDb.insert(params, function (err, numReplaced) {
    console.log('adding');
    if (!err || (numReplaced < 1)) {
      console.log("replaced---->" + numReplaced);
    } else {
      // console.log('ERR! ', err);
    }
  })
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
 * Gets files of movie with imdb id or imdbId.
 * Returns library objects.
 * @param {number} uuid
 * @param {string} param1 imdbId/tmdbId/title
 * @param {number} param2 year
 */
function getMovie(uuid, param1, param2) {
  const imdbIdRegex = new RegExp(`(^tt[0-9]{0,7})$`, `g`);
  const tmdbIdRegex = new RegExp(`([0-9])`, `g`);
  const titleRegex = new RegExp('^' + regexify(param1) + '$', `gi`);
  console.log('param1', param1, 'param2', param2);
  if (param1.trim().match(imdbIdRegex)) {
    libraryFilesDb.find({ imdbId: param1 }, function (err, result) {
      if (!err) {
        process.send([`library-movie-${uuid}`, result]);
      }
    });
  }
  else if (param1.match(tmdbIdRegex)) {
    libraryFilesDb.find({ tmdbId: parseInt(param1) }, function (err, result) {
      if (!err) {
        process.send([`library-movie-${uuid}`, result]);
      }
    });
  } else {
    libraryFilesDb.find({ title: titleRegex, year: parseInt(param2) }, function (err, result) {
      if (!err) {
        process.send([`library-movie-${uuid}`, result]);
      }
    });
  }
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
  return Promise.reject(true)
}

/**
 * Gets movie library in list.
 * @param {any[]} idList list of id
 * @returns list of movie libary with filepath
 */
function getLibrayMovieInList(uuid, idList) {
  idList = idList.split(",").map((e) => parseInt(e, 10));
  libraryFilesDb.find({ tmdbId: { $in: idList }}, function (err, docs) {
    if (!err) {
      let toList = [];
      docs.forEach((element) => {
        toList.push({ tmdbId: element.tmdbId, fullFilePath: element.fullFilePath, id: element._id });
      });
      console.log('DOCS: ', docs);
      console.log(toList);
      // Promise.resolve(toList);
      process.send(['library-movies-' + uuid, toList]);
    } else {
      console.log('ERROR', err);
    }
  });
}

function removeLibraryFile(val) {
  libraryFilesDb.remove({ fullFilePath: val }, {}, function (err, numRemoved) {
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
 * ... can be used in paginated list.
 * @param {number} skip
 * @param {number} step
 * @param {*} sort
 */
function getLibraryFilesByStep(skip, step, sort) {
  // console.log(`index, step: ${index}, ${step}`)
  return new Promise(function (resolve, reject) {
    libraryFilesDb.find({}).sort(sort).skip(skip).limit(step).exec(function (err, data) {
      if (!err) {
        console.log('data:', data)
        resolve(data);
      } else {
        // reject()
      }
    });
  });
}
// getLibraryFilesByStep(0,2, null)
// getLibraryFilesByStep(1,2,{})
// getLibraryFilesByStep(2,2,{})
// getLibraryFilesByStep(4,2,{})


/**
 * Gets list of all movies in library folders
 */
function getAllMovies() {
  console.log('retrieving all movies');
  libraryFilesDb.find({}, (err, result) => {
    process.send(['library-movies', result]);
  });
}
// getAllMovies()
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
        console.log('data:', data);
        resolve(data);
        // return data
      } else {
        console.log('err:', err);
        // reject()
      }
    })
  })
}

let args = process.argv.slice(2);
let command = args[0];
let data1 = args[1];
let data2 = args[2];
let data3 = args[3];
let data4 = args[4];
// console.log(process)
// console.log(process.argv)
// console.log(process.argv0)
// console.log(args)
// command = 'find-list'
// data1=[516486,9441,718867,9444,400535]

if (command) {
  initializeDataAccess(command, data1, data2);
} else {
  console.log('noCommand');
}

/**
 * Starts db service.
 * @param {string} command name of commend
 * @param {*} data1
 * @param {*} data2
 */
function initializeDataAccess(command, data1, data2) {
  console.log('command', command, 'data1', data1, 'data2', data2)
  libraryFilesDb.ensureIndex({ fieldName: 'fullFilePath', unique: true }, function (err) {
    if (err) {
      console.log(err);
    }
  });
  switch (command) {
    case 'find':
      getMovie(data1, data2);
      break;
    case 'get-by-page':
      // get-by-page`, theUuid, order, limit, lastVal
      getLibraryFilesByStep(data4, data3, data2).then(value => {
        process.send([`library-movies-${data1}`, value]);
      });
      // getMoviesByPage(data1);
      break;
    case 'find-in-list':
      getLibrayMovieInList(data1, data2);
      break;
    case 'find-one':
      getMovie(data1, data2);
      break;
    case 'find-all':
      getAllMovies();
      break;
    case 'delete':
      deleteMovie(data1);
      break;
    case 'insert':
      addMovie(data1);
      break;
    case 'insert-directory':
      addDirectoryToMovie(data1, data2);
      break;
    case 'remove-directory':
      removeDirectoryFromMovie(data1, data2);
      break;
    case 'count':
      break;
    default:
      break;
  }
}
// getLibraryFilesByTmdbId(505948)
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
};
