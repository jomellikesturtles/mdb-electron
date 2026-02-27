/**
 * Searches movie torrent from torrent offline dump
 */
const fs = require('fs');
const path = require('path');
const papa = require('papaparse');
const levenshtein = require('fast-levenshtein')
const { DEBUG } = require("./shared/util");
let stream;
let result = [];
// test object
let testSearchQuery = {
  title: 'Guardians of the galaxy',
  imdbId: 'tt2015381'
}
//#ADDED;HASH(B64);NAME;SIZE(BYTES)
function titleCondition(record) {
  // id;query, yearfrom,yearto, ratings, genres, titleType
  // // if (record['tconst'] == query)
  // if (hasTitleType(record['titleType'])) {
  //     if (record['startYear'] >= searchQuery['releaseFrom'] &&
  //         record['startYear'] <= searchQuery['releaseTo']) {
  //         // if (hasGenre(record['genres'])) {
  //         if ((record['primaryTitle'].toLowerCase().includes(searchQuery['title'])) || (record['primaryTitle'].toLowerCase().includes(searchQuery['title']))) {
  //             // DEBUG.log('found ', record['tconst']);
  //             DEBUG.log('found primaryTitle', record['primaryTitle'], 'with query ', searchQuery['title']);
  //             return true
  //         }
  //         // }
  //     }
  // }
  // return false
}

/**
 * Processes and searches each chunk of DB as it is read into memory
 * @param {*} results 
 * @param {*} parser 
 */
function procData(results, parser) {

  // var condition = currentCondition ? titleCondition : ratingCondition;
  for (let c = 0; c < results.data.length; c++) {
    let record = results.data[c];

    DEBUG.log('record', record)
    if (titleCondition(record)) {

      // if (i > count) { //count: sets limits of how many results to display
      //     parser.abort();
      //     stream.close();
      //     break;
      // } else {
      // result.push(resultObjectTemplate(record));
    }
  }
}

/**
 * Finish search, exit the process
 */
function finSearch() {
  DEBUG.log('result: ', result);
  DEBUG.log('searchLapse: end')
  process.exit(0);
}

/**
 * Starts the search
 */
function initializeSearch() {
  const torrentDump = path.join(process.cwd(), '..', 'torrent_dump_full.csv', 'torrent_dump_full.csv')
  stream = fs.createReadStream(torrentDump)
    .once('open', function () {
      papa.parse(stream, {
        delimiter: ';',
        escapeChar: '\\',
        header: true,
        chunk: procData,
        complete: finSearch,
        error: function (error) {
          DEBUG.log(error);
        }
      });
    })
    .on('error', function (err) {
      // process.send(['search-failed', 'read']); //mainWindow.webContents.send('search-failed', 'read');
      DEBUG.log(err);
    });
}


DEBUG.log('start')
initializeSearch()
// getLevenshteinDistance()
DEBUG.log('start: end')

function getLevenshteinDistance() {
  var toCompare = ['Guardians.of.the.galaxy',
    'Guardians of the Galaxy',
    'Guardians of the galaxy',
    'Guardians of the Galaxy Vol. 2'
  ]
  DEBUG.log(levenshtein.get(toCompare[0], 'Guardians of the Galaxy', {
    useCollator: true
  }));
  DEBUG.log(levenshtein.get('Leon the professional', 'Léon: The Professional', {
    useCollator: true
  }));
  DEBUG.log(levenshtein.get('Leon the professional', 'Léon The Professional', {
    useCollator: true
  }));
  DEBUG.log(levenshtein.get('RUN', '!RUN', {
    useCollator: true
  }));
}

// var fileTitleRegexStr = `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*|(?:(?=bluray|\\d+p|brrip|WEBRip)..*)?[.](mkv|avi|mpe?g|mp4)$)`
// var folderTitleRegexStr = `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*$)`
// var titleRegex = new RegExp(fileTitleRegexStr, 'gmi')
// var result = null
// result = titleRegex.exec('Guardians.of.the.galaxy.mp4')
// DEBUG.log(result[0]);
// DEBUG.log(result[1]);
// DEBUG.log(regexify('guardians of the galaxy'))

// function regexify(text) {
//     text = text.trim().replace(/(\s+)/g, ' ');
//     let words = text.split(' ');
//     let final = '';
//     words.forEach(function (item) {
//         final += '((?=.*_-\s)' + escapeRegExp(item) + ')';
//     });
//     return final;
// }
// function escapeRegExp(text) {
//     return text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
// }

// var myArray
