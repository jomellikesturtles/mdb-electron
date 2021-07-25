/*jshint esversion: 6 */
const express = require('express');
const fs = require('fs');
const path = require('path');
let args = process.argv.slice(2);
let idArg = args[0];
var http = require('http');

let isPortOpen = false;
const app = express();
const DataStore = require('nedb');
const libraryDbService = require('./library-db-service-2');
process.on('uncaughtException', function (error) {
  console.log('ERROR!!!!!!!!!!!!!!!!!!!!!!!!!', error);
  process.send(['operation-failed', 'general']);
});
process.on('warning', function (error) {
  console.log('warning!!!!!!!!!!!!!!!!!!!!!!!!!', error);
  process.send(['operation-failed', 'general']);
});
process.send = process.send || function (...args) { DEBUG.log('SIMULATING process.send', ...args) };

let DEBUG = (() => {
  let timestamp = () => { }
  timestamp.toString = () => {
    return '[DEBUG ' + (new Date()).toLocaleString() + ']'
  }
  return {
    log: console.log.bind(console, '%s', timestamp)
  }
})()

DEBUG.log('IN VIDEO SERVICE');

var libraryFilesDb = new DataStore({
  filename: '../db/libraryFiles2.db',
  // filename: path.join(process.cwd(), 'src', 'assets', 'db', 'libraryFiles2.db'),
  autoload: true
})

function openStream(libraryData) {
  DEBUG.log(`set streaming from: localhost:3000/stream/${libraryData._id}`)
  process.send(['stream-link', `http://localhost:3000/stream/${libraryData._id}`])
  app.get(`/stream/${libraryData._id}`, function (req, res) {
    // const filePath = path.join(process.cwd(), '..', '..', '..', '..', 'A.Streetcar.Named.Desire.1951.1080p.BluRay.x264-[YTS.AM].mp4')
    // console.log('filepath: ', libraryData.fullFilePath);
    const stat = fs.statSync(libraryData.fullFilePath)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = (end - start) + 1
      const file = fs.createReadStream(libraryData.fullFilePath, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
      }
      res.writeHead(206, head)
      file.pipe(res)
      // process.send(['video-success', `localhost:3000/stream/${libraryData._id}`])
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      }
      res.writeHead(206, head)
      fs.createReadStream(libraryData.fullFilePath).pipe(res)
    }
  })
}

function openPort() {

  app.listen(3000, function () {
    DEBUG.log('listening from 3000...');
    isPortOpen = true;
  });
}

function initialize() {
  libraryDbService.getLibraryFileById(idArg).then(libraryData => {
  // libraryDbService.getLibraryFilesByTmdbId(parseInt(tmdbIdArg)).then(libraryData => {
    DEBUG.log('FOUND ONE DATA: ', libraryData);
    openStream(libraryData[0])
  })
}

if (isPortOpen == false) {
  openPort()
}

initialize()
// setTimeout(() => {
//   testConnection()
// }, 3000);
// // testConnection()

function testConnection() {
  console.log('testConnection');

    let options = { method: 'GET', host: 'localhost', port: 3000, path: '/stream/Y9LaiH30sFSmjGfV', },
    req = http.request(options, function (r) {
      console.log('R: ', r.statusCode);
    });
  req.end();
}
