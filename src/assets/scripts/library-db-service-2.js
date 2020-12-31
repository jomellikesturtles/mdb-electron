/*jshint esversion: 6 */
const path = require('path');

var DataStore = require('nedb')
var { regexify } = require('./shared/util')
var libraryFilesDb = new DataStore(
  {
    // filename: '../db/libraryFiles2.db', // nodeJS mode
    filename: path.join(process.cwd(), 'src', 'assets', 'db', 'libraryFiles2.db'),
    autoload: true
  });
const { getNumberOfPages }= require('./shared/util');

process.send =
  process.send ||
  function (...args) {
    console.log("SIMULATING process.send", ...args);
  };
let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

const countLibrary = function () {
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
 * @param {string} param1 imdbId/tmdbId/title
 * @param {number} param2 year
 */
function findLibrary(param1, param2) {
  param1 = param1.toString();
  const imdbIdRegex = new RegExp(`(^tt[0-9]{0,7})$`, `g`);
  const tmdbIdRegex = new RegExp(`([0-9])`, `g`);
  const titleRegex = new RegExp('^' + regexify(param1) + '$', `gi`);
  console.log('param1', param1, 'param2', param2);
  return new Promise(function (resolve, reject) {
    if (param1.trim().match(imdbIdRegex)) {
      libraryFilesDb.find({ imdbId: param1 }, function (err, result) {
        if (!err) {
          resolve(result);
        }
      });
    }
    else if (param1.match(tmdbIdRegex)) {
      libraryFilesDb.find({ tmdbId: parseInt(param1) }, function (err, result) {
        if (!err) {
          resolve(result);
        }
      });
    } else {
      libraryFilesDb.find({ title: titleRegex, year: parseInt(param2) }, function (err, result) {
        if (!err) {
          resolve(result);
        }
      });
    }
  });
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
 * @param {string} uuid the uuid
 * @param {any[]} idList list of id
 * @returns list of movie libary with filepath
 */
function getLibrayMovieInList(uuid, idList) {
  idList = idList.split(",").map((e) => parseInt(e, 10));
  // return new Promise(function (resolve, reject) {
  // })
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
        console.log('data:', data);
        resolve(data);
      } else {
        // reject()
      }
    });
  });
}

/**
 * In paginated list.
 * @param {number} page page to get
 * @param {number} size num of items
 * @param {*} sort {year:1} ascending year, {year:-1} descending year
 */
async function getLibraryPaginated(page, size, sort) {

  const count = await countLibrary({});
  const skip = size > count ? 0 : (size * page) + -1;
  sort = sort != null || sort != undefined ? {[sort]: 1} : {};
  const libraryList = await getLibraryFilesByStep(skip, size, sort);

  return new Promise(function (resolve, reject) {
    if (libraryList.length > 0) {
      let newData = [];
      const totalPages = getNumberOfPages(count, size);
      DEBUG.log(libraryList)
      const toReturn = {
        page: page,
        totalPages: totalPages,
        totalResults: count,
        results: libraryList
      };
      resolve(toReturn);
    } else {
      const toReturn = {
        page: page,
        totalPages: 0,
        totalResults: 0,
        results: []
      };
      resolve(toReturn);
    }
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
      } else {
        console.log('err:', err);
      }
    });
  });
}

function getLibraryFileById(id) {
  return new Promise(function (resolve, reject) {
    libraryFilesDb.find({ _id: id }, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        console.log('err:', err);
      }
    });
  });
}

let args = process.argv.slice(2);
let headers = args[0];
let body = args[1];
// data1=[516486,9441,718867,9444,400535]
if (body) {
  initializeDataAccess();
}

/**
 * Starts db service.
 */
function initializeDataAccess() {

  const myHeaders = JSON.parse(headers);
  const dataArgs = JSON.parse(body);
  const uuid = myHeaders.uuid;
  const command = myHeaders.operation;
  DEBUG.log('myHeaders', myHeaders);
  DEBUG.log('dataArgs', dataArgs);

  // libraryFilesDb.ensureIndex({ fieldName: 'fullFilePath', unique: true }, function (err) {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  switch (command) {
    case 'get-by-page':
      getLibraryPaginated(dataArgs.page, dataArgs.size, dataArgs.sort).then(value => {
        process.send([`library-${uuid}`, value]);
      });
      break;
  //   case 'find-in-list':
  //     getLibrayMovieInList(data1, data2);
  //     break;
    case 'find':
      findLibrary(dataArgs.tmdbId).then(doc => {
        process.send([`library-${uuid}`, doc]);
      });
      break;
    // case 'find-one':
    //   getMovie(data1, data2);
    //   break;
    // case 'find-all':
    //   getAllMovies();
    //   break;
  //   case 'delete':
  //     deleteMovie(data1);
  //     break;
  //   case 'insert':
  //     addMovie(data1);
  //     break;
  //   case 'insert-directory':
  //     addDirectoryToMovie(data1, data2);
  //     break;
  //   case 'remove-directory':
  //     removeDirectoryFromMovie(data1, data2);
  //     break;
  //   case 'count':
  //     break;
    default:
      break;
  }
}
// getLibraryFilesByTmdbId(505948)
// updateFields('3JKDWUVlWfLQ5y1v', '505948', 'I Am Mother', 2019)
// updateFields('RdmTLWXNNlkVY5JX', { tmdbId: 10681, title: 'WALL·E', year: '2008' })

module.exports = {
  count: countLibrary,
  insertLibraryFiles: insertLibraryFiles,
  insertTmdbId: insertTmdbId,
  getLibraryFilesMulti: getLibraryFilesMulti,
  removeLibraryFile: removeLibraryFile,
  getLibraryFilesByStep: getLibraryFilesByStep,
  updateFields,
  getLibraryFilesByTmdbId: getLibraryFilesByTmdbId,
  getLibraryFileById: getLibraryFileById
};

function convertToDbLibrary(arg) {
  return {
    _id: arg.id,
    tmdb: arg.tmdbId,
    imdb: arg.imdbId,
    title: arg.title,
    yr: arg.year,
    fPath: arg.fullFilePath,
  };
}

function convertToFELibrary(arg) {
  return {
    id: arg._id,
    tmdbId: arg.tmdb,
    imdbId: arg.imdb,
    title: arg.title,
    year: arg.yr,
    fullFilePath: arg.fPath,
  };
}
