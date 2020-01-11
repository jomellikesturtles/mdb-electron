/**
 * Searches movie info from torrent .csv file
 * TODO: fix dotted dash, e.g. WALL·E
 */
const fs = require('fs')
const path = require('path')
const papa = require('papaparse')
args = process.argv.slice(2)
var title = args[0]
var year = args[1]
let stream
let result = []
const levenshtein = require('fast-levenshtein')
const newRegex = new RegExp(regexify(title), 'i')


function regexify(text) {
  text = text.trim().replace(/(\s+)/g, ' '); // whitespace
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
function condition(name) {
  // if (name.search((newRegex)) >= 0) {
  // if (name.match(newRegex)) {
  if (name.match(newRegex) && name.indexOf(year) >= 0) {
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
  // const titleBasicsTSV = path.join(process.cwd(), 'src', 'assets', 'torrent database', 'torrent_dump_full.csv', 'torrent_dump_full.csv')
  const titleBasicsTSV = path.join(process.cwd(), '..', 'torrent database', 'torrent_dump_full.csv', 'torrent_dump_full.csv')
  console.log(titleBasicsTSV);

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
console.log('torrent search with data0', title);
console.log('torrent search with data1', year);

initializeSearch()
