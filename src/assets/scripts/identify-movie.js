const request = require('request')
const util = require('./shared/util')

const TMDB_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = 'a636ce7bd0c125045f4170644b4d3d25'

const options = {
  url: 'https://www.reddit.com/r/funny.json',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',
    'User-Agent': 'my-reddit-client'
  }
}
// https://api.themoviedb.org/3/find/{external_id}?api_key=<<api_key>>&language=en-US&external_source=imdb_id

function findByExternalId(externalId, sourceType) {
  const url = `${TMDB_URL}/find/${externalId}?api_key=${TMDB_API_KEY}&language=en-US&external_source=${sourceType}`
  request(url, function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  })
}

function findByTitle(title, year) {
  // https://api.themoviedb.org/3/search/movie?api_key=a636ce7bd0c125045f4170644b4d3d25&language=en-US&query=titanic&page=1&include_adult=false&year=1997
  let url = `${TMDB_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${title}`
  if (year) {
    year = url.concat(`&year=${year}`)
  }
  console.log('url: ', encodeURI(url));

  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      const object = JSON.parse(body)
      console.log('body.total_results: ', object);
      let toReturn
      if (object.total_results > 0) {
        const firstResult = object.results[0]
        toReturn = {
          tmdbIid: firstResult.id,
          title: firstResult.title,
          year: util.getReleaseYear(firstResult.release_date),
        }
        console.log(toReturn);
      }
      resolve(toReturn)
    })
  })
}

function identifyMovie(query, year) {
  const REGEX_TMDB_RELEASE_DATE_LOCAL = new RegExp(`(^tt[0-9]{7})$`, `gi`);
  const result1 = REGEX_TMDB_RELEASE_DATE_LOCAL.exec(query)
  if (result1) {
    findByExternalId(query, 'imdb_id')
  } else {
    console.log('before');
    let returned = findByTitle(query, year)
    console.log('after');
  }
}

identifyMovie('Wall·E-', 2013)
