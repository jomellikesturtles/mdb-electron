/**
 * Library db service. add comments on proccess functions to run as node js file
 */
let args = process.argv.slice(2);
let command = args[0];
let data1 = args[1];
let data2 = args[2];
var DataStore = require('nedb')
process.on('uncaughtException', function (error) {
    console.log(error);
    process.send(['operation-failed', 'general']); //mainWindow.webContents.send('scrape-failed', 'general');
});
var libraryDb = new DataStore({
    filename: '../db/libraryFiles.db',
    autoload: true
})

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

function addMovie(value) {
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
    if (param1.trim().match(imdbIdRegex)) {
        libraryDb.findOne({ imdbId: param1 }, function (err, result) {
            if (!err) {
                console.log(result);
                // process.send(['library-movie-found', result])
            }
        })
    } else {
        console.log(param1, param2);
        const titleRegex = new RegExp('^' + regexify(param1) + '$', `gi`)
        libraryDb.find({ title: titleRegex, year: parseInt(param2) }, function (err, result) {
            if (!err) {
                console.log(result);
            }
        })
    }
    console.log('end');
}

function regexify(text) {
    text = text.trim().replace(/(\s+)/g, ' ');
    const words = text.split(' ');
    let final = '';
    words.forEach((item) => {
        final += '(' + escapeRegExp(item) + ')[.\\s-_=;,]?';
    });
    return final;
}
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
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

// initializeDataAccess('insert', testLibraryMovieObject)
// initializeDataAccess('insert', testLibraryMovieObject3)
// initializeDataAccess('find-one', 'tt2015381')
// initializeDataAccess('find-one', 'Titanic', 1997)
console.log('in library db')
// initializeDataAccess('find-all')
// initializeDataAccess('insert-directory', 'tt2015381', 'C:\\Titanic.mp4')
// initializeDataAccess('remove-directory', 'tt2015381', 'C:\\Titanic.mp4')
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
