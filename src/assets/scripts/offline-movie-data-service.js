/**
 * Service for offline data
 */
const fs = require('fs')
const path = require('path')
const papa = require('papaparse')
args = process.argv.slice(2)
var command = args[0]
var movie = args[0]
let stream
let result = []
var movieDataDb = new DataStore({
    filename: '../db/movieData.db',
    autoload: true
})


function getMovieData() {
    libraryDb.findOne({ imdbId: imdbId }, function (err, result) {
        if (!err) {
            process.send(['offline-movie-data', result])
        }
    })
}

function setMovieData() {
    libraryDb.ensureIndex({ fieldName: 'imdbId', unique: true }, function (err) {
        if (err) {
            console.log(err);
        }
    })
    movieDataDb.insert(movie, function (err, data) {
        if (!err) {
            console.log('inserted ', data);
        }
    })
}
function initializeService() {
    switch (command) {
        case 'get':
            getMovieData()
            break;
        case 'set':
            setMovieData()
            break;

        default:
            break;
    }
}
initializeService()

