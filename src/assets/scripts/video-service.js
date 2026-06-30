/*jshint esversion: 6 */
const express = require('express');
const fs = require('fs');
const path = require('path');
console.log('[video-service] process.argv:', process.argv);
let args = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
let idArg = args[0];
var http = require('http');

let port = process.env.PORT || '3000'
let streamLink = `http://localhost:${port}/stream`
let isPortOpen = false;
const app = express();
const libraryDbService = require('./library-db-service-2');
process.on('uncaughtException', function (error) {
  console.log('ERROR!!!!!!!!!!!!!!!!!!!!!!!!!', error);
  process.send(['error', { source: "video-service", message: error.message, stack: error.stack }]);
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

function openStream(libraryData) {
  DEBUG.log(`libraryData: ${libraryData}`)
  DEBUG.log(`set streaming from: ${streamLink}/${libraryData._id}`)
  process.send(['stream-link', `${streamLink}/${libraryData._id}`])
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

let libraryItem = null;
let serverStarted = false;

function checkAndStart() {
  if (libraryItem && serverStarted) {
    openStream(libraryItem);
  }
}

function openPort() {
  const server = http.createServer(app);
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      DEBUG.log(`Port ${port} is in use, trying next one...`);
      port = parseInt(port, 10) + 1;
      streamLink = `http://localhost:${port}/stream`;
      server.listen(port);
    } else {
      console.error('Server error:', err);
      process.send(['error', { source: "video-service", message: err.message, stack: err.stack }]);
    }
  });

  server.listen(port, function () {
    const actualPort = server.address().port;
    DEBUG.log(`listening from ${actualPort}...`);
    port = actualPort;
    streamLink = `http://localhost:${port}/stream`;
    isPortOpen = true;
    serverStarted = true;
    checkAndStart();
  });
}

function initialize() {
  DEBUG.log('idArg: ', idArg);
  libraryDbService.getLibraryFileById(idArg).then(libraryData => {
    DEBUG.log('FOUND ONE DATA: ', libraryData);
    if (libraryData && libraryData.length > 0) {
      libraryItem = libraryData[0];
      checkAndStart();
    } else {
      DEBUG.log('No library data found for ID:', idArg);
    }
  });
}

if (isPortOpen == false) {
  openPort();
}

initialize();
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
