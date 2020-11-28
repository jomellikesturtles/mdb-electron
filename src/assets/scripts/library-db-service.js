/**
 * Library db service. add comments on proccess functions to run as node js file
 */
/*jshint esversion: 6 */
let args = process.argv.slice(2);
let command = args[0];
let data1 = args[1];
let data2 = args[2];
const path = require('path');
const DataStore = require('nedb')
var { regexify } = require('./shared/util')
var libraryDb = new DataStore({
  filename: path.join(process.cwd(), 'src', 'assets', 'db', 'libraryFiles.db'),
  // filename: path.join('../..', 'assets', 'db', 'libraryFiles.db'),
  autoload: true
})

process.on('uncaughtException', function (error) {
  console.log(error);
  process.send(['operation-failed', 'general']); //mainWindow.webContents.send('scrape-failed', 'general');
});

let testLibraryMovieObject = {
  imdbId: 'tt2015381',
  title: 'Guardians of the Galaxy',
  year: 2014,
  directoryList: ['C:\\Guardians of the Galaxy.mp4']
}
let testLibraryMovieObject2 = {
  imdbId: 'tt0120338',
  title: 'Titanic',
  year: 1997,
  directoryList: ['D:\\titanic.mp4']
}
let testLibraryMovieObject3 = {
  imdbId: 'tt0910970',
  title: 'Wall·E',
  year: 2008,
  directoryList: ['D:\\movies\\wall-e.mp4']
}
let testLibraryMovieObject4 = {
  imdbId: 'tt0111161',
  title: 'The Shawshank Redemption',
  year: 1994,
  directoryList: ['D:\\The Shawshank Redemption.mp4']
}
let testLibraryMovieObject5 = {
  imdbId: 'tt0105236',
  title: 'Reservoir Dogs',
  year: 1994,
  directoryList: ['D:\\movies\\reservoir dogs.mp4']
}

function addMovie(value) {
  console.log('adding ', value);

  libraryDb.insert(value, function (err, data) {
    if (!err) {
      console.log('inserted ', data);
    }
  })
}

/**
 * Gets files of movie with imdb id.
 * Returns directories.
 * @param {string} param1 imdb id
 */
function getMovie(param1, param2) {
  const imdbIdRegex = new RegExp(`(^tt[0-9]{0,7})$`, `g`)
  const tmdbIdRegex = new RegExp(`([0-9])`, `g`)
  const titleRegex = new RegExp('^' + regexify(param1) + '$', `gi`)
  if (param1.trim().match(imdbIdRegex)) {
    console.log('param1', param1);
    libraryDb.findOne({ imdbId: param1 }, function (err, result) {
      if (!err) {
        process.send(['library-movie', result])
      }
    })
  }
  else if (param1.match(tmdbIdRegex)) {
    console.log('param1 num type', param1);
    libraryDb.findOne({ tmdbId: parseInt(param1) }, function (err, result) {
      if (!err) {
        process.send(['library-movie', result])
      }
    })
  } else {
    console.log('param1', param1, 'param2', param2);
    libraryDb.find({ title: titleRegex, year: parseInt(param2) }, function (err, result) {
      if (!err) {
        process.send(['library-movie', result])
      }
    })
  }
  console.log('end');
}

/**
 * Gets list of all movies in library folders
 */
function getAllMovies() {
  console.log('retrieving all movies');
  libraryDb.find({}, (err, result) => {
    process.send(['library-movies', result])
  })
}

function deleteMovie() {

}

/**
 * Adds directory of video file to movie
 * @param {string} imdbId imdb id
 * @param {string} directory directory to add
 */
function addDirectoryToMovie(imdbId, directory) {
  libraryDb.update({ imdbId: imdbId }, { $addToSet: { directory: directory } }, {}, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log('result', result)
    }
  })
}

/**
 * Removes directory of video file from movie
 * @param {string} imdbId imdb id
 * @param {string} directory directory to remove
 */
function removeDirectoryFromMovie(imdbId, directory) {
  libraryDb.update({ imdbId: imdbId }, { $pull: { directory: directory } }, {}, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log('result', result)
    }
  })
}

function getMovieAsync(param1, param2) {

  return new Promise((resolve, reject) => {
    console.log('param1', param1, 'param2', param2);
    const titleRegex = new RegExp('^' + regexify(param1) + '$', `gi`)
    libraryDb.find({ title: titleRegex, year: parseInt(param2) }, function (err, result) {
      if (!err) {
        console.log('getMovieAsync', result);
        // process.send(['library-movie', result])
        resolve(result)
      }
    })
  })
}

/**
 *
 * @param page page number
 */
function getMoviesByPage(page) {
  const NUMBER_OF_ITEMS = 2
  libraryDb.find({}).skip(NUMBER_OF_ITEMS * (page - 1)).limit(NUMBER_OF_ITEMS).exec(function (err, docs) {
    console.log('page', page, ',', docs);
    process.send(['library-movies', docs])
  })
}

// initializeDataAccess('insert', testLibraryMovieObject)
// initializeDataAccess('insert', testLibraryMovieObject2)
// initializeDataAccess('insert', testLibraryMovieObject4)
// initializeDataAccess('insert', testLibraryMovieObject5)
// initializeDataAccess('find-one', 'tt2015381')
// initializeDataAccess('find-one', 'The Shawshank Redemption', 1994)
// initializeDataAccess('find-one-async', 'The Shawshank Redemption', 1994)
// initializeDataAccess('find-one', 'Reservoir Dogs', 1994)
// console.log('in library db')
// initializeDataAccess('find-all')
// initializeDataAccess('insert-directory', 'tt2015381', 'C:\\Titanic.mp4')
// initializeDataAccess('remove-directory', 'tt2015381', 'C:\\Titanic.mp4')
// initializeDataAccess('find-directory', 'tt2015381', 'C:\\Titanic.mp4')
// initializeDataAccess('get-by-page', 1)
initializeDataAccess(command, data1, data2)

/**
 * Starts db service.
 * @param {string} command name of commend
 * @param {*} data1
 * @param {*} data2
 */
function initializeDataAccess(command, data1, data2) {
  console.log('command', command, 'data1', data1, 'data2', data2)
  libraryDb.ensureIndex({ fieldName: 'imdbId', unique: true }, function (err) {
    if (err) {
      console.log(err);
    }
  })
  switch (command) {
    case 'find':
      getMovie(data1)
      break;
    case 'get-by-page':
      getMoviesByPage(data1)
      break;
    case 'find-one':
      getMovie(data1, data2)
      break;
    case 'find-all':
      getAllMovies()
      break;
    case 'delete':
      deleteMovie(data1)
      break;
    case 'insert':
      addMovie(data1)
      break;
    case 'insert-directory':
      addDirectoryToMovie(data1, data2)
      break;
    case 'remove-directory':
      removeDirectoryFromMovie(data1, data2)
      break;
    case 'count':
      break;
    default:
      break;
  }
}
