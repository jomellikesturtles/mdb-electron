const path = require('path');

const sayHello = function () {
  console.log('hell')
  console.log(path.join(__dirname, '..', 'db', 'bookmarks.db'));
}

let getReleaseYear = function (releaseDate) {
  const STRING_REGEX_OMDB_RELEASE_DATE = `^(\\d{2})+\\s+([a-z]{3,})+\\s+(\\d{4})+`;
  const STRING_REGEX_TMDB_RELEASE_DATE = `([0-9]{2,4})-([0-9]{2})-([0-9]{2})`
  const STRING_REGEX_YEAR_ONLY = `^([0-9]{2,4})$`
  const REGEX_OMDB_RELEASE_DATE_LOCAL = new RegExp(STRING_REGEX_OMDB_RELEASE_DATE, `gi`);
  const REGEX_TMDB_RELEASE_DATE_LOCAL = new RegExp(STRING_REGEX_TMDB_RELEASE_DATE, `gi`);
  const REGEX_YEAR_ONLY = new RegExp(STRING_REGEX_YEAR_ONLY, `gi`);
  const result1 = REGEX_OMDB_RELEASE_DATE_LOCAL.exec(releaseDate)
  const result2 = REGEX_TMDB_RELEASE_DATE_LOCAL.exec(releaseDate)
  let toReturn = ''
  if (result1) {
    toReturn = releaseDate.substr(releaseDate.lastIndexOf(' ') + 1);
  } else if (result2) {
    toReturn = releaseDate.substring(0, releaseDate.indexOf('-'))
  } else if (REGEX_YEAR_ONLY.exec(releaseDate)) {
    toReturn = releaseDate
  }
  return toReturn
}

/**
 * Checks if script is running under nodeJS
 */
function isNode() {
  if (typeof window === 'undefined') {
    console.log('window undefined')
  } else {
    console.log('window not undefined')
  }
  if (typeof process === 'object') {
    console.log('process object')
  } else {
    console.log('process not object')
  }
}

module.exports = {
  sayHello: sayHello,
  getReleaseYear: getReleaseYear
}
