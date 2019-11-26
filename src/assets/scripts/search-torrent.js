/**
 * Searches movie info from imdb .tsv files
 */
const fs = require('fs')
const path = require('path')
const papa = require('papaparse')
args = process.argv.slice(2)
var title = args[0]
var imdbId = args[1]
let stream
let result = []
const levenshtein = require('fast-levenshtein')


function regexify(text) {
  text = text.trim().replace(/(\s+)/g, ' ');
  const words = text.split(' ');
  let final = '';
  words.forEach((item) => {
    final += '(' + escapeRegExp(item) + ')[.\\s-_=;,]?';
  });
  return final;
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
}
const newRegex = new RegExp(regexify(title), 'i')
function condition(name) {
  // if (name.search((newRegex)) >= 0) {
  if (name.match(newRegex)) {
    return true
  }
  return false
}

/**
 * Processes and searches each chunk of DB as it is read into memory
 * @param {*} results
 * @param {*} parser
 */
function procData(results, parser) {

  // var condition = currentCondition ? titleCondition : ratingCondition;
  for (let c = 0; c < results.data.length; c++) {
    let record = results.data[c]
    if (condition(record['NAME'])) {
      result.push(record['NAME'])
    }
  }
}

/**
 * Finish search, exit the process
 */
function finSearch() {
  console.log('result: ', result);
  console.timeEnd('searchLapse')
  process.exit(0)
}
function initializeSearch() {
  console.log(title)
  const titleBasicsTSV = path.join(process.cwd(), 'src', 'assets', 'torrent database', 'torrent_dump_full.csv', 'torrent_dump_full.csv')
  // const titleBasicsTSV = path.join(process.cwd(), '..', 'app', 'src', 'assets', 'torrent database', 'torrent_dump_full.csv', 'torrent_dump_full.csv')

  stream = fs.createReadStream(titleBasicsTSV)
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
      // process.send(['search-failed', 'read'])
      console.log(err)
    });
}
console.time('searchLapse')
initializeSearch()
