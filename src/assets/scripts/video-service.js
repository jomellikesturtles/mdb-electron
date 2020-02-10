const express = require('express');
const fs = require('fs')
const path = require('path')
let args = process.argv.slice(2);
let tmdbIdArg = args[0];
// let tmdbIdArg = args[1];
// let imdbIdArg = args[2];
const app = express()
const DataStore = require('nedb')
const libraryDbService = require('./library-db-service-2')
process.on('uncaughtException', function (error) {
  console.log('ERROR!!!!!!!!!!!!!!!!!!!!!!!!!', error);
  process.send(['operation-failed', 'general']);
});
// process.send = process.send || function () {};
console.log('IN VIDEO SERVICE');

var libraryFilesDb = new DataStore({
  filename: path.join(process.cwd(), 'src', 'assets', 'db', 'libraryFiles.db'),
  autoload: true
})

function openStream(filePath) {

  app.get('/stream', function (req, res) {
    // res.json('welcomess!')

    // const filePath = path.join(process.cwd(), 'src', 'assets', 'scripts', 'videoplayback.mp4')
    // const filePath = path.join(process.cwd(), '..', '..', '..', '..', 'A.Streetcar.Named.Desire.1951.1080p.BluRay.x264-[YTS.AM].mp4')

    // const filePath = path.join(process.cwd(), 'src', 'assets', 'scripts', 'A.Streetcar.Named.Desire.1951.1080p.BluRay.x264-[YTS.AM].mp4')
    console.log('filepath: ', filePath);

    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = (end - start) + 1
      const file = fs.createReadStream(filePath, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
      }
      res.writeHead(206, head)
      file.pipe(res)
      // process.send(['video-success'])
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      }
      res.writeHead(206, head)
      fs.createReadStream(filePath).pipe(res)
      // process.send(['video-success'])
    }
  })

  app.listen(3000, function () {
    console.log('listening from 3000...');
  })
}

function initialize() {
  console.log(args)
  libraryDbService.getLibraryFilesByTmdbId(parseInt(tmdbIdArg)).then(theFiles => {
    console.log(theFiles)
    openStream(theFiles[0].fullFilePath)
  })
}

function getFromLibrary() {
  libraryFilesDb.findOne({
    tmdbId: parseInt(tmdbIdArg)
  }, function (err, data) {
    const firstDirectory = data.directoryList[0]
    openStream(firstDirectory)
  })
}
// getFromLibrary()
// console.log('thefile:', libraryDbService.getLibraryFilesByTmdbId(505948))
initialize()

// getFromLibrary()
