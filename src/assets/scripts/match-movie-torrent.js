/**
 * Searches movie torrent from torrent offline dump
 */
const fs = require('fs');
const path = require('path');
const papa = require('papaparse');
const levenshtein = require('fast-levenshtein')
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
  //             // console.log('found ', record['tconst']);
  //             console.log('found primaryTitle', record['primaryTitle'], 'with query ', searchQuery['title']);
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

    console.log('record', record)
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
  console.log('result: ', result);
  console.timeEnd('searchLapse')
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
          console.log(error);
        }
      });
    })
    .on('error', function (err) {
      // process.send(['search-failed', 'read']); //mainWindow.webContents.send('search-failed', 'read');
      console.log(err);
    });
}


console.time('start')
initializeSearch()
// getLevenshteinDistance()
console.timeEnd('start')

function getLevenshteinDistance() {
  var toCompare = ['Guardians.of.the.galaxy',
    'Guardians of the Galaxy',
    'Guardians of the galaxy',
    'Guardians of the Galaxy Vol. 2'
  ]
  console.log(levenshtein.get(toCompare[0], 'Guardians of the Galaxy', {
    useCollator: true
  }));
  console.log(levenshtein.get('Leon the professional', 'Léon: The Professional', {
    useCollator: true
  }));
  console.log(levenshtein.get('Leon the professional', 'Léon The Professional', {
    useCollator: true
  }));
  console.log(levenshtein.get('RUN', '!RUN', {
    useCollator: true
  }));
}

// var fileTitleRegexStr = `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*|(?:(?=bluray|\\d+p|brrip|WEBRip)..*)?[.](mkv|avi|mpe?g|mp4)$)`
// var folderTitleRegexStr = `^(.+?)[.( \\t]*(?:(?:(19\\d{2}|20(?:0\\d|1[0-9]))).*$)`
// var titleRegex = new RegExp(fileTitleRegexStr, 'gmi')
// var result = null
// result = titleRegex.exec('Guardians.of.the.galaxy.mp4')
// console.log(result[0]);
// console.log(result[1]);
// console.log(regexify('guardians of the galaxy'))

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
