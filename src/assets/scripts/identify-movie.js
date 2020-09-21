/**
 * Identifies movie
 */
/*jshint esversion: 8 */
const request = require("request");
const util = require("./shared/util");

const TMDB_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "a636ce7bd0c125045f4170644b4d3d25";
let args = process.argv.slice(2);
const argTitle = args[0];
const argYear = args[1];
const levenshtein = require("fast-levenshtein");

function findByExternalId(externalId, sourceType) {
  const url = `${TMDB_URL}/find/${externalId}?api_key=${TMDB_API_KEY}&language=en-US&external_source=${sourceType}`;
  request(url, function (error, response, body) {
    // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received

    if (!error) {
      const object = JSON.parse(body);
      let toReturn;
      if (object.movie_results.length > 0) {
        const firstResult = object.movie_results[0];
        toReturn = {
          tmdbId: firstResult.id,
          title: firstResult.title,
          year: util.getReleaseYear(firstResult.release_date),
        };
        console.log(toReturn);
      }
    } else {
      console.error("error:", error);
    }
  });
}

function getSearchRegex(text) {
  // let reg = new RegExp(regexify(text), 'i');
  return regexify(text);
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
}

function regexify(text) {
  text = text.trim().replace(/(\s+)/g, " ");
  let words = text.split(" ");
  let final = "";
  words.forEach(function (item) {
    final += "(?=.*" + escapeRegExp(item) + ")";
  });
  return final;
}

/**
 *
 */
function findByTitle(title, year) {
  // https://api.themoviedb.org/3/search/movie?api_key=a636ce7bd0c125045f4170644b4d3d25&language=en-US&query=titanic&page=1&include_adult=false&year=1997
  const theQuery = getSearchRegex(title);
  let url = `${TMDB_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${theQuery}`;
  if (title.toLowerCase().indexOf("stepmom") > -1) {
    console.log("hey");
  }
  if (year) {
    url = url.concat(`&year=${year}`);
  }
  console.log("url: ", encodeURI(url));

  return new Promise((resolve, reject) => {
    request(encodeURI(url), function (error, response, body) {
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      if (!error) {
        if (title.toLowerCase() == "stepmom") {
          console.log("hey");
        }
        const object = JSON.parse(body);
        let theResult = { tmdbId: 0, title: "", year: 0 };
        if (object.total_results > 1) {
          let mostRelevant = { popularity: 0, levenshteinDistance: 99 };
          object.results.forEach((element) => {
            const levenshteinDistance = getLevenshteinDistance(
              title,
              element.title
            );
            const popularity = element.popularity;
            if (levenshteinDistance <= mostRelevant.levenshteinDistance) {
              if (
                // levenshteinDistance == mostRelevant.levenshteinDistance &&
                popularity >= mostRelevant.popularity
              ) {
                mostRelevant = {
                  popularity: element.popularity,
                  levenshteinDistance: levenshteinDistance,
                };
                theResult = {
                  tmdbId: element.id,
                  title: element.title,
                  originalTitle: element.originalTitle,
                  year: util.getReleaseYear(element.release_date),
                };
                // } else {
                // mostRelevant = {
                //   popularity: element.popularity,
                //   levenshteinDistance: levenshteinDistance,
                // };
                // theResult = {
                //   tmdbId: element.id,
                //   title: element.title,
                //   year: util.getReleaseYear(element.release_date),
                // };
              }
            }
          });
        } else if (object.results.length == 1) {
          theResult = {
            tmdbId: object.results[0].id,
            title: object.results[0].title,
            year: util.getReleaseYear(object.results[0].release_date),
          };
        }
        console.log(theResult);
        resolve(theResult);
      } else {
        // console.error('error:', error); // Print the error if one occurred
      }
    });
  });
}

function identifyMovie(query, year) {
  const REGEX_IMDB_ID = new RegExp(`(^tt[0-9]{7})$`, `gi`);
  const result1 = REGEX_IMDB_ID.exec(query);

  return new Promise(function (resolve, reject) {
    if (result1) {
      resolve(findByExternalId(query, "imdb_id"));
    } else {
      console.log("before");
      resolve(findByTitle(query, year));
    }
  });
}

function getLevenshteinDistance(string1, string2) {
  return levenshtein.get(string1, string2, {
    useCollator: true, // ignore case
  });
}

// identifyMovie('Wall·E', 2013)
// identifyMovie(argTitle, argYear)

module.exports = {
  identifyMovie,
};
