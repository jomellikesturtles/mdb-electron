/**
 * Stores and retrieves data to and from pc
 */
const request = require('request');
const fs = require('fs');
const path = require('path')
args = process.argv.slice(2)
const DataStore = require('nedb')
var command = args[0]
var url = args[1]
var type = args[2]
var imdbId = args[3]
let downloadPath = path.join(process.cwd(), '..', 'offline-image');
imdbId = 'tt1234567'
let targetPath = path.join(process.cwd(), '..', 'offline-image', `${imdbId}-${type}.jpg`);
let tstamp = new Date().toString();

process.on('uncaughtException', function (error) {
    console.log(error);
    // process.send(['image-data-failed', ['general', type]]);
});

function getImageOnline() {
    let receivedBytes = 0
    // request(url, function (error, response, body) {
    //     console.error('error:', error); // Print the error if one occurred
    //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //     console.log('body:', body); // Print the HTML for the Google homepage.
    // });
    ensureDownloadDir(targetPath)
    let out = fs.createWriteStream(targetPath)
        .on('error', (error) => {
            console.log(error);
        })
        .on('open', () => {
            let req = request({
                method: 'GET',
                url: url
            })
            req.pipe(out)
            req.on('response', data => {
                console.log(data);
            })
            req.on('data', chunk => {
                receivedBytes += chunk
                console.log(chunk);
            })
            req.on('error', error => {
                console.log(error);
            })
        })
        .on('finish', () => {
            out.close()

        })
}

function ensureDownloadDir() {
    let dirName = path.dirname(targetPath)
    console.log(dirName)
    if (fs.existsSync(dirName)) {
        return true
    }
    ensureDownloadDir()
    fs.mkdirSync(dirName)
}

function initializeRequest() {
    switch (command) {
        case 'get':
            getImageOnline()
            break;
        case 'set':

            break;

        default:
            break;
    }
}
url = `https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg`
initializeRequest()

