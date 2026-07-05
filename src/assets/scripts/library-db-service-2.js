/*jshint esversion: 6 */
const util = require("util");
if (!util.isDate) {
  util.isDate = (obj) => Object.prototype.toString.call(obj) === '[object Date]';
}
if (!util.isRegExp) {
  util.isRegExp = (obj) => Object.prototype.toString.call(obj) === '[object RegExp]';
}

const path = require('path');
const fs = require('fs');

var DataStore = require('nedb')
var { regexify } = require('./shared/util')
const getUnpackedPath = (p) => p ? p.replace(/app\.asar([\/\\]|$)/, 'app.asar.unpacked$1') : p;
const dbPath = getUnpackedPath(path.join(__dirname, '..', 'db', 'libraryFiles2.db'));
console.log('[library-db-service-2] DB Path:', dbPath);
var libraryFilesDb = new DataStore(
  {
    filename: dbPath,
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
    libraryFilesDb.findOne({ fullFilePath: params.fullFilePath }, function (err, doc) {
      if (!err && doc) {
        // update existing record's title and year if they changed
        if (doc.title !== params.title || doc.year !== params.year) {
          libraryFilesDb.update(
            { _id: doc._id },
            { $set: { title: params.title, year: params.year } },
            {},
            function (updateErr) {
              if (!updateErr) {
                console.log('updated title/year for:', params.fullFilePath);
              }
            }
          );
        }
      } else {
        libraryFilesDb.insert(params, function (insertErr) {
          console.log('adding');
          if (!insertErr) {
            console.log("added successfully");
          }
        });
      }
    });
  });
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
  const skip = (page - 1) * size;
  sort = sort != null && sort != undefined ? {[sort]: 1} : {};
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
  if (Array.isArray(id)) {
    id = id[0];
  }
  if (typeof id === 'string') {
    id = id.trim().replace(/^['"]|['"]$/g, '');
    if (id.endsWith(',')) {
      id = id.slice(0, -1);
    }
  }
  return new Promise(function (resolve, reject) {
    libraryFilesDb.loadDatabase(function (err) {
      if (err) {
        console.error('loadDatabase error in getLibraryFileById:', err);
        return resolve([]);
      }
      console.log('[getLibraryFileById] id input:', JSON.stringify(id), 'type:', typeof id, 'length:', id ? id.length : 0);

      // DIAGNOSTIC: Read file directly using fs
      try {
        const rawContent = fs.readFileSync(dbPath, 'utf8');
        console.log('[getLibraryFileById] Direct FS read size:', rawContent.length, 'bytes');
        const lines = rawContent.split('\n').filter(Boolean);
        let foundDirectly = null;
        for (const line of lines) {
          try {
            const obj = JSON.parse(line);
            if (obj._id === id) {
              foundDirectly = obj;
              break;
            }
          } catch (e) {}
        }
        console.log('[getLibraryFileById] Direct FS found record:', foundDirectly);
      } catch (fsErr) {
        console.error('[getLibraryFileById] Direct FS read error:', fsErr);
      }

      libraryFilesDb.find({ _id: id }, function (err, data) {
        console.log('[getLibraryFileById] NeDB query result:', data);
        let foundDirectly = null;
        if (!err && data && data.length > 0) {
          resolve(data);
        } else {
          if (foundDirectly) {
            console.log('[getLibraryFileById] FALLBACK: returning record found directly by FS read');
            resolve([foundDirectly]);
          } else {
            resolve([]);
          }
        }
      });
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

function onLibrary2(rawData, mainWindow) {
  let headers, body;
  if (Array.isArray(rawData)) {
    headers = rawData[0];
    body = rawData[1];
  } else if (typeof rawData === 'string') {
    try {
      const data = JSON.parse(rawData);
      headers = data.headers;
      body = data.body;
    } catch (e) {
      console.error("Failed to parse library IPC data:", e);
      return;
    }
  } else {
    headers = rawData.headers;
    body = rawData.body || rawData;
  }

  const uuid = headers.uuid;
  const operation = headers.operation;

  console.log(`onLibrary2: operation=${operation}, uuid=${uuid}, body=`, body);

  if (operation === 'find-in-list') {
    let idList = body.idList;
    if (typeof idList === 'string') {
      idList = idList.split(",").map((e) => parseInt(e, 10));
    } else if (Array.isArray(idList)) {
      idList = idList.map((e) => parseInt(e, 10));
    }
    libraryFilesDb.find({ tmdbId: { $in: idList } }, function (err, docs) {
      if (!err) {
        const toList = docs.map(element => ({
          tmdbId: element.tmdbId,
          fullFilePath: element.fullFilePath,
          id: element._id,
          title: element.title,
          year: element.year
        }));
        if (mainWindow) {
          mainWindow.webContents.send(`library-${uuid}`, toList);
        }
      } else {
        console.error('onLibrary2 error find-in-list:', err);
        if (mainWindow) {
          mainWindow.webContents.send(`library-${uuid}`, []);
        }
      }
    });
  } else if (operation === 'find') {
    const tmdbId = parseInt(body.tmdbId, 10);
    libraryFilesDb.find({ tmdbId: tmdbId }, function (err, docs) {
      if (!err) {
        const toList = docs.map(element => ({
          tmdbId: element.tmdbId,
          fullFilePath: element.fullFilePath,
          id: element._id,
          title: element.title,
          year: element.year
        }));
        if (mainWindow) {
          mainWindow.webContents.send(`library-${uuid}`, toList);
        }
      } else {
        console.error('onLibrary2 error find:', err);
        if (mainWindow) {
          mainWindow.webContents.send(`library-${uuid}`, []);
        }
      }
    });
  } else if (operation === 'get-by-page') {
    let lastVal = body.lastVal;
    let page = 1;
    if (lastVal && lastVal > 1) {
      page = parseInt(lastVal, 10);
    }
    const size = parseInt(body.limit || body.size || 20, 10);
    const sort = body.sort || null;

    getLibraryPaginated(page, size, sort).then(value => {
      if (mainWindow) {
        mainWindow.webContents.send(`library-${uuid}`, value);
      }
    }).catch(err => {
      console.error('onLibrary2 error get-by-page:', err);
      if (mainWindow) {
        mainWindow.webContents.send(`library-${uuid}`, { totalPages: 0, totalResults: 0, results: [] });
      }
    });
  }
}

module.exports = {
  count: countLibrary,
  insertLibraryFiles: insertLibraryFiles,
  insertTmdbId: insertTmdbId,
  getLibraryFilesMulti: getLibraryFilesMulti,
  removeLibraryFile: removeLibraryFile,
  getLibraryFilesByStep: getLibraryFilesByStep,
  updateFields,
  getLibraryFilesByTmdbId: getLibraryFilesByTmdbId,
  getLibraryFileById: getLibraryFileById,
  onLibrary2,
  getLibraryPaginated
};
