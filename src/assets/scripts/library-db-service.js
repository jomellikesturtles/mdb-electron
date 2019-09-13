var DataStore = require('nedb')
// process.on('uncaughtException', function (error) {
//     console.log(error);
//     process.send(['operation-failed', 'general']); //mainWindow.webContents.send('scrape-failed', 'general');
// });
var libraryDb = new DataStore({
    filename: '../db/libraryFiles.db',
    autoload: true
})

let testLibraryMovieObject = {
    title: 'Guardians of the galaxy',
    imdbId: 'tt2015381',
    directory: ['C:\\Guardians of the Galaxy.mp4']
}
let testLibraryMovieObject2 = {
    title: 'Titanic',
    imdbId: 'tt0120338',
    directory: ['D:\\titanic.mp4']
}

function addMovie(value) {
    libraryDb.insert(value, function (err, data) {
        if (!err) {
            console.log('inserted ', data);
        }
    })
}

/**
 * Gets files of movie with imdb id
 * @param {string} imdbId imdb id
 */
function getMovie(imdbId) {
    libraryDb.findOne({ imdbId: imdbId }, function (err, result) {
        if (!err) {
            // process.send(['library-movie-found', result])
        }
    })
}

/**
 * Gets listof movies in library folders
 */
function getAllMovies() {
    console.log('retrieving all movies');
    libraryDb.find({}, (err, result) => {
        // process.send(['library-movies', result])
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
    libraryConfig.update({ imdbId: imdbId }, { $addToSet: { directory: directory } }, {}, function (err, result) {
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

// insertMovie(testLibraryMovieObject)
// insertMovie(testLibraryMovieObject2)
// findMovie('tt2015381')
// getLibraryMovies()

initializeDataAccess('insert', testLibraryMovieObject)
initializeDataAccess('insert', testLibraryMovieObject2)
// initializeDataAccess('find', 'tt2015381')
console.log('in library db')
initializeDataAccess('find-all')
// initializeDataAccess('insert-directory', 'tt2015381', 'C:\\Titanic.mp4')
// initializeDataAccess('remove-directory', 'tt2015381', 'C:\\Titanic.mp4')
function initializeDataAccess(command, data1, data2) {
    libraryDb.ensureIndex({ fieldName: 'imdbId', unique: true }, function (err) {
        if (err) {
            console.log(err);
        }
    })
    switch (command) {
        case 'find':
            getMovie(data1)
            break;
        case 'find-one':
            getMovie(data1)
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
