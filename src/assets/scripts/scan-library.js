/**
 * scans library folders for potential video files
 */
// const promise = require('promise')
// const cp = require('child_process');

/*jshint esversion: 8 */
let args = process.argv.slice(2);
const searchMovie = require("./search-movie");
const fs = require("fs");
const path = require("path");
const validExtensions = [".mp4", ".mkv", ".mpeg", ".avi", ".wmv", ".mpg"];
const ffmpeg = require("fluent-ffmpeg");
var libraryDbService = require("./library-db-service-2.js");
var identifyMovie = require("./identify-movie");
var DataStore = require("nedb");
var config = new DataStore({
  // filename: "../config/config.db",// for node only
  filename: path.join(__dirname, "..", "config", "config.db"),
  // filename: '../config/config.db',
  autoload: true,
});

let DEBUG = (() => {
  let timestamp = () => {};
  timestamp.toString = () => {
    return "[DEBUG " + new Date().toLocaleString() + "]";
  };
  return {
    log: console.log.bind(console, "%s", timestamp),
  };
})();

process.on("uncaughtException", function (error) {
  console.log("ERROR: ", error);
});

process.on("unhandledRejection", function (error) {
  console.log("unhandledRejection ERROR: ", error);
});

process.on("exit", function (error) {
  console.log("exit ERROR: ", error);
});

process.on("disconnect", function (error) {
  console.log("disconnect: ", error);
});

// process.send =
//   process.send ||
//   function (...args) {
//     DEBUG.log("SIMULATING process.send", ...args);
//   };

// Toy.Story.4
/**
 * Insert into libraryFiles.db
 * @param {*} params
 */
function saveToLibraryDb(params) {
  libraryDbService.insertLibraryFiles(params);
}

/**
 * Create fileInfo object then add to .db file
 * @param {String} folderPath   the folder path
 * @param {String} fileName     the file name
 */
function addToList(folderPath, fileName) {
  const fullFilePath = path.join(folderPath, fileName);
  const stat = fs.lstatSync(fullFilePath);
  const dir = path.dirname(fullFilePath);
  const parentFolder = folderPath.substr(folderPath.lastIndexOf("\\") + 1);
  const byteSize = stat.size;
  const extension = path.extname(fullFilePath);
  const fullFileName = path.basename(fullFilePath);
  const hasSiblings = checkForSiblings(dir);
  const fromRegex = getTitleAndYear(parentFolder, fullFileName);
  const regex1Result = fromRegex[1];
  const title =
    typeof regex1Result === "undefined" || typeof regex1Result === "null"
      ? ""
      : regex1Result;
  const regex2Result = fromRegex[2];
  const year =
    typeof regex2Result === "undefined" || typeof regex2Result === "null"
      ? 0
      : regex2Result;

  const fileInfo = {
    fullFilePath: fullFilePath,
    // dir: dir,
    // parentFolder: parentFolder,
    // byteSize: byteSize,
    // extension: extension,
    // fullFileName: fullFileName,
    // hasSiblings: hasSiblings,
    title: title,
    year: parseInt(year, 10),
    tmdbId: 0,
  };
  saveToLibraryDb(fileInfo);
}

/**
 * Gets the movie title based on regex
 * @param {string} parentFolder
 * @param {string} fullFileName
 */
function getTitleAndYear(parentFolder, fullFileName) {
  //1: title, 2: year, 3: extension
  var fileTitleRegexStr = `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*|(?:(?=bluray|\\d+p|brrip|WEBRip)..*)?[.](mkv|avi|mpe?g|mp4)$)`;
  var folderTitleRegexStr = `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*$)`;
  var titleRegex = new RegExp(fileTitleRegexStr, "gmi");
  var result = null;
  result = titleRegex.exec(fullFileName);
  if (result && result[1]) {
    //if not blank or undefined
    return result;
  } else {
    titleRegex = new RegExp(folderTitleRegexStr, "gmi");
    result = titleRegex.exec(parentFolder);
    if (!result) {
      //if still null or empty
      return fullFileName.substring(0, fullFileName.lastIndexOf("."));
    }
  }
  return result;
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
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if file is a video file
 */
function isVideoFile(params) {
  var result = false;
  validExtensions.forEach((element) => {
    if (params.indexOf(element) > 0) {
      result = true;
      return result;
    }
  });
  return result;
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
    } else {
      if (isVideoFile(filename)) {
        console.log(filename);
        addToList(startPath, files[i]);
        process.send(["found-video-library", filename]);
      }
    }
  }
}

/**
 * Gets library folders from config.db file
 * @returns {string[]} list of folders directory
 */
function getLibraryFolders() {
  return new Promise(function (resolve, reject) {
    var foldersList = null;
    config.findOne(
      {
        type: "libraryFolders",
      },
      function (err, dbPref) {
        if (!err) {
          if (dbPref) {
            foldersList = dbPref.foldersList;
            resolve(foldersList);
          } else {
            console.log("undefined or null");
          }
        } else {
          reject();
        }
      }
    );
  });
}

async function scanExistingLibraryMovies() {
  var condition = true;
  let totalCount = 0;
  let page = 0;
  const skip = 2;
  let promises = [];
  libraryDbService.count().then(async (count) => {
    totalCount = count;
    console.log("count:", count);
    while (page < totalCount) {
      promises[page] = new Promise((resolve, reject) => {
        //------pagination steps. dont delete--
        // console.log('page ', page, ' page*skip ', skip * page, ' totalCount', totalCount);
        // if ((totalCount < (skip * page)) && totalCount % (skip * page) !== (skip * page)) {
        libraryDbService.getLibraryFilesMulti(page, 1).then((fullFilePath) => {
          if (!fs.existsSync(fullFilePath)) {
            console.log(`no dir, deleting ${fullFilePath}...`);
            libraryDbService.removeLibraryFile(fullFilePath);
          }
          resolve("myval");
        });
      });
      page++;
    }
    const values = await Promise.all(promises);
    return values;
  });
}

/**
 * TODO: add isPreviouslyIdentified flag to prevent 'double searching'
 */
async function identifyMovies() {
  const totalCount = await libraryDbService.count();
  let index = 0;
  while (index < totalCount) {
    let libraryFile = await libraryDbService.getLibraryFilesByStep(index, 1);
    libraryFile = libraryFile[0];
    if (!libraryFile.tmdbId) {
      const identityResult = await identifyMovie.identifyMovie(
        libraryFile.title,
        libraryFile.year
      );
      if (identityResult.tmdbId != 0) {
        // if query has returned a movie
        const replacementObj = {
          tmdbId: identityResult.tmdbId,
          title: identityResult.title,
          year: parseInt(identityResult.year, 10),
        };
        const updateLibDb = await libraryDbService.updateFields(
          libraryFile._id,
          replacementObj
        );
        console.log(updateLibDb);
      }
    }
    index++;
  }
}

/**
 * Starts scan. First checks for the folders in the database.
 */
async function initializeScan() {
  let result = await scanExistingLibraryMovies();
  console.log("result:", result);

  getLibraryFolders().then(function (libraryFolders) {
    libraryFolders.forEach((folder) => {
      readDirectory(folder);
    });
    identifyMovies().then((e) => {
      process.send(["scan-library-complete"]);
      process.exit(0);
    });
  });
}

DEBUG.log("initializing scan");
initializeScan().then((e) => {
  // process.send("scan-library-success");
  // process.exit(0);
});
// init2();
// var regexList =
// Tested: `^ (.+?)[.(\\t]* (?: (?: (19\\d{ 2} | 20(?: 0\\d | 1[0 - 9]))).*| (?: (?= bluray |\\d + p | brrip | WEBRip)..*)?[.](mkv | avi | mpe ? g | mp4)$)`
// tested : ^((.*[^ (_.])[ (_.]+((\d{4})([ (_.]+S(\d{1,2})E(\d{1,2}))?(?<!\d{4}[ (_.])S(\d{1,2})E(\d{1,2})|(\d{3}))|(.+))

/**
 * exact primary title
 * exact original title
 * levenschtein
 * rank by vote count&average
 */

/**
 * Scan process
 * 1. check contents of libraryFiles.db if movie file is existing, if not, delete
 * 2. scan the folders
 * 3.
 */
