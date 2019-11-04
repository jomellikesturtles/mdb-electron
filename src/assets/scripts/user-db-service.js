/**
 * service for user's data, watchlist, watched
 */
let args = process.argv.slice(2);
let command = args[0];
let data1 = args[1];
let data2 = args[2];

let fs = require('fs');
const path = require('path');
const DataStore = require('nedb')
var userWatchedDb = new DataStore({
    filename: path.join(process.cwd(), 'src', 'assets', 'db', 'userWatched.db'),
    autoload: true
})
var userWatchlistDb = new DataStore({
    filename: path.join(process.cwd(), 'src', 'assets', 'db', 'userWatchlist.db'),
    autoload: true
})

function getWatchedStatus() {

}

function setWatchedStatus() {
    userWatchedDb.insert(value, function (err, data1) {
        if (!err) {
            console.log('inserted ', data1);
        }
    })
}

function removeWatchedStatus() {

}

function getWatchlist() {

}

function addToWatchlist() {

}


function removeFromWatchlist() {

}

function initializeService() {
    switch (command) {
        case 'watchlist-get': getWatchlist()
            break;
        case 'watchlist-add': addToWatchlist()
            break;
        case 'watchlist-remove': removeFromWatchlist()
            break;
        case 'watched-get': getWatchedStatus()
            break;
        case 'watched-add': setWatchedStatus()
            break;
        case 'watched-remove': removeWatchedStatus()
            break;
        default:
            break;
    }
}

initializeService()
