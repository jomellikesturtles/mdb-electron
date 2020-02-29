/**
 * Identifies the movie from library.db
 */
const promise = require('promise')
const searchMovie = require('./search-movie')
const fs = require('fs');
const path = require('path');
var DataStore = require('nedb')
const validExtensions = ['.mp4', '.mkv', '.mpeg', '.avi', '.wmv', '.mpg',]
const ffmpeg = require('fluent-ffmpeg')
var moviesList = []

var config = new DataStore({ filename: '../config/config.db', autoload: true })
var libraryFilesDb = new DataStore({ filename: 'libraryFiles.db', autoload: true })
config.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});
var itemInfo = {
  title: 'Cinderella Man',
  year: 2005,
  fullFilePath: 'C:\\Users\\Lenovo\\Downloads\\Completed Downloads\\Cinderella Man (2005)\\Cinderella Man (2005) 720p 600MB.mkv',
  fullFileName: 'Cinderella Man (2005) 720p 600MB.mkv',
  exension: 'mkv',
  parentFolder: 'Cinderella Man (2005)',
  byteSize: 628422594,
  durationMins: 123,
  hasDuplicateTitle: false,
  hasSiblings: false,
  hasMatched: true,
  imdbId: 'tt1000912'
}

process.on('uncaughtException', function (error) {
  console.log(error);
  // process.send(['scrape-failed', 'general']); //mainWindow.webContents.send('scrape-failed', 'general');
});


/**
 * Gets the info of the movie from tmdb or omdb
 */
function getMovieInfo() {
  // http://www.omdbapi.com/?t=wall-e&apikey=3a2fe8bf
}

/**
 * Insert into libraryFiles.db
 * @param {*} params
 */
function saveToLibrary(params) {
  libraryFilesDb.insert(params, function (err, numpReplaced) {
    console.log('adding');
    if (err || (numpReplaced < 1)) {
      console.log("replaced---->" + numReplaced);
      console.log(err)
    }
  })

  // libraryDb.insert(value, function (err, data) {
  //   if (!err) {
  //     console.log('inserted ', data);
  //   }
  // })

}

/**
 * Create fileInfo object then add to .db file
 * @param {String} folderPath   the folder path
 * @param {String} fileName     the file name
 */
function addToList(folderPath, fileName) {
  var fullFilePath = path.join(folderPath, fileName);
  var stat = fs.lstatSync(fullFilePath);
  var dir = path.dirname(fullFilePath)
  var parentFolder = folderPath.substr(folderPath.lastIndexOf('\\') + 1)
  var byteSize = stat.size
  var extension = path.extname(fullFilePath)
  var fullFileName = path.basename(fullFilePath)
  var hasSiblings = checkForSiblings(dir)
  var fromRegex = getTitleAndYear(parentFolder, fullFileName)
  var title = fromRegex[1]
  var year = fromRegex[2]

  var fileInfo = {
    fullFilePath: fullFilePath,
    dir: dir,
    parentFolder: parentFolder,
    byteSize: byteSize,
    extension: extension,
    fullFileName: fullFileName,
    hasSiblings: hasSiblings,
    title: title,
    year: year
  }
  // durationMins: 123,
  // hasDuplicateTitle: false,
  console.log(fileInfo);
  // saveToLibrary(fileInfo);
}

/**
 * Gets the movie title based on regex
 * @param {string} parentFolder
 * @param {string} fullFileName
 */
function getTitleAndYear(parentFolder, fullFileName) {
  //1: title, 2: year, 3: extension
  var fileTitleRegexStr = `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*|(?:(?=bluray|\\d+p|brrip|WEBRip)..*)?[.](mkv|avi|mpe?g|mp4)$)`
  var folderTitleRegexStr = `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*$)`
  var titleRegex = new RegExp(fileTitleRegexStr, 'gmi')
  var result = null
  result = titleRegex.exec(fullFileName)
  if (result[1]) { //if not blank or undefined
    return result
  } else {
    titleRegex = new RegExp(folderTitleRegexStr, 'gmi')
    result = titleRegex.exec(parentFolder)
    if (!result) { //if still null or empty
      return fullFileName.substring(0, fullFileName.lastIndexOf('.'))
    }
  }
  return result
}

/**
 * Checks if video file has another video file in same folder
 *
 * @param {*} startPath
 * @returns {boolean} True if has sibling, False if alone
 */
function checkForSiblings(startPath) {
  var videoFileCount = 0;
  if (!fs.existsSync(startPath)) {
    // add error message
    return;
  }
  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    if (isVideoFile(filename)) {
      videoFileCount++;
      if (videoFileCount > 1) {
        return true
      }
    }
  }
  return false
}

/**
 * Checks if file is a video file
 */
function isVideoFile(params) {
  var result = false
  validExtensions.forEach(element => {
    if (params.indexOf(element) > 0) {
      result = true
      return result
    }
  });
  return result
}

/**
 * Reads/scans the directory
 */
function readDirectory(startPath) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      readDirectory(filename); //recurse
    }
    else {
      if (isVideoFile(filename)) {
        console.log(filename);
        addToList(startPath, files[i])
      }
    }
  }
  // fs.readdir(folderpath, (err, files) => {
  //     console.log(files)
  //     files.forEach(element => {
  //         console.log(element)
  //         console.log(getExtension(element))
  //     });
  // })
};

/**
 * Gets library folders from config.db file
 * @returns {string[]} list of folders directory
 */
function getLibraryFolders() {
  return new Promise(function (resolve, reject) {
    var foldersList = null
    config.findOne({ type: 'libraryFolders' }, function (err, dbPref) {
      if (!err) {
        foldersList = dbPref.foldersList
        resolve(foldersList)
      } else {
        reject()
      }
    })
  })
}

/**
 * Starts identification
 */
function initializeIdentify() {
  getLibraryFolders().then(function (libraryFolders) {
    libraryFolders.forEach(folder => {
      console.log(folder)
      readDirectory(folder);
    });
  })
}

console.time('initializeScan')
initializeIdentify();
console.timeEnd('initializeScan')

// saveToConfig(moviesList)

// var regexList =
// Tested: `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*|(?:(?=bluray|\\d+p|brrip|WEBRip)..*)?[.](mkv|avi|mpe?g|mp4)$)`
// tested : ^((.*[^ (_.])[ (_.]+((\d{4})([ (_.]+S(\d{1,2})E(\d{1,2}))?(?<!\d{4}[ (_.])S(\d{1,2})E(\d{1,2})|(\d{3}))|(.+))


/**
 * exact primary title
 * exact original title
 * levenschtein
 * rank by vote count&average
 */
