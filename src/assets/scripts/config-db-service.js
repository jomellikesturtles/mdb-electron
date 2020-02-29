var DataStore = require('nedb')
// process.on('uncaughtException', function (error) {
//     console.log(error);
//     process.send(['operation-failed', 'general']); //mainWindow.webContents.send('scrape-failed', 'general');
// });
var configDb = new DataStore({
  filename: '../db/config.db',
  autoload: true
})

let testLibraryMovieObject = {
  title: 'Guardians of the galaxy',
  imdbId: 'tt2015381',
  directory: ['C:\\Guardians of the Galaxy.mp4']
}
let preferencesObject

/**
 * Saves preferences into config.db file
 * @param {preferencesObject} data preferences to save
 */
function savePreferences(param) {
  param.forEach(element => {
    delete element._id
    console.log('element ', element)
    configDb.insert(element, function (err, data) {
    })
  });
}

/**
 * Gets all preferences
 */
function getPreferences() {
  configDb.find({}, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      // console.log('result', result[0])
      // process.send(['preferences-success', result]);
      savePreferences(result)
    }
  })
}

initializeDataAccess('get')
function initializeDataAccess(command, data1, data2) {
  switch (command) {
    case 'save':
      savePreferences(data1)
      break;
    case 'reset':
      getMovie(data1)
      break;
    case 'get':
      getPreferences()
      break;
    default:
      break;
  }
}

console.log('asd')

// module.exports = {
//   count: count,
//   insertLibraryFiles: insertLibraryFiles,
//   insertTmdbId: insertTmdbId,
//   getLibraryFilesMulti: getLibraryFilesMulti,
//   removeLibraryFile: removeLibraryFile,
// }
