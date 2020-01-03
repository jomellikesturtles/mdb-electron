const express = require('express')
const app = express()
const port = 3000
var libraryDbService = require('../library-db-service-2.js')

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/test', (req, res) => {
  console.log(`Example app listening on port ${port}!`);
  res.send('Hello Worldd!s')
})

app.get('/ab(cd)?e', function (req, res) {
  res.send('ab(cd)?e')
})
app.get('/ab+cd', function (req, res) {
  res.send('ab+cd')
})
app.get('/ab*cd', function (req, res) {
  res.send('ab*cd')
})

app.get('/getBookmarks', (req, res) => {
  res.send('Hello Worldd!s')
})

/**
 * Gets individual bookmark.
 * @param id the tmdb id or imdb id
 */
app.get('/getBookmark/:id', (req, res) => {
  console.log(req.params)
  const response = {
    tmdbId: 123,
    imdbId: 'tt1234567',
    title: 'Titanic',
    year: 1997
  }
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT')
  res.json(response)
})

app.post('/removeBookmark', (req, res) => {
  res.send('Hello Worldd!s')
})

app.post('/addBookmark', (req, res) => {
  res.send('Hello Worldd!s')
})

app.get('/countBookmarks', (req, res) => {
  libraryDbService.count().then(async count => {
    console.log(`sending ${count}`);
    res.json(count)
    // res.send(count)
  })
})

// app.get('/getBookmark')


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

