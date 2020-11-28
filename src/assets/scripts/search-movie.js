/**
 * !UNUSED
 * Searches movie info from imdb .tsv files
 */
/*jshint esversion: 8 */
const fs = require("fs");
const path = require("path");
const papa = require("papaparse");

let currentCondition = true;
let args = process.argv.slice(2);
// let query = arg s[0];
let query = "tt0031381";
let releaseFrom = 2012;
let releaseTo = 2019;
let searchQuery = {
  // title: 'guardians of the galaxy'.toLowerCase(),
  title: "[",
  genres: [""],
  titleType: ["movie", "tvMovie"],
  releaseFrom: 2014,
  releaseTo: 2019,
  ratingFrom: 7.0,
  ratingTo: 9.8,
};
let count = parseInt(args[1]);
let smart = args[2] === "true";
let inst = args[3] === "true";
count = count > 0 ? count : 100;
count = count > 10000 ? 10000 : count;

let i = 1;
let reg;
let stream;
let result = [];

// /**
//  * Search by criteria, start year, end year, primary title
//  * @param {*} record
//  */
// function titleCondition(record) {
//     // id;query, yearfrom,yearto, ratings, genres, titleType
//     // if (record['tconst'] == query)
//     if (hasTitleType(record['titleType'])) {
//         if (record['startYear'] >= searchQuery['releaseFrom'] &&
//             record['startYear'] <= searchQuery['releaseTo']) {
//             // if (hasGenre(record['genres'])) {
//                 if ((record['primaryTitle'].toLowerCase().includes(searchQuery['title'])) || (record['primaryTitle'].toLowerCase().includes(searchQuery['title']))) {
//                     // console.log('found ', record['tconst']);
//                     console.log('found primaryTitle', record['primaryTitle'], 'with query ', searchQuery['title']);
//                     return true
//                 }
//             // }
//         }
//     }
//     return false
// }

/**
 * Processes and searches each chunk of DB as it is read into memory
 * @param {*} results
 * @param {*} parser
 */
function procData(results, parser) {
  // var condition = currentCondition ? titleCondition : ratingCondition;
  for (let c = 0; c < results.data.length; c++) {
    let record = results.data[c];

    console.log("record", record);
    // if (condition(record)) {

    //     // if (i > count) { //count: sets limits of how many results to display
    //     //     parser.abort();
    //     //     stream.close();
    //     //     break;
    //     // } else {
    //     // result.push(resultObjectTemplate(record));
    // }
  }
}

/**
 * Finish search, exit the process
 */
function finSearch() {
  console.log("result: ", result);
  console.timeEnd("searchLapse");
  process.exit(0);
}

/**
 * Initialize search
 */
function initSearch() {
  console.log("initSearch");
  const titleBasicsTSV = path.join(
    process.cwd(),
    "src",
    "assets",
    "movie database",
    "title.basics.tsv",
    "data.tsv"
  );
  console.log("titleBasicsTSV", titleBasicsTSV);
  stream = fs
    .createReadStream(titleBasicsTSV)
    .once("open", function () {
      papa.parse(stream, {
        delimiter: "\t",
        escapeChar: "\\",
        header: true,
        chunk: procData,
        complete: finSearch,
        error: function (error) {
          console.log(error);
        },
      });
    })
    .on("error", function (err) {
      process.send(["search-failed", "read"]); //mainWindow.webContents.send('search-failed', 'read');
      console.log(err);
    });
}

// console.time('searchLapse')
// initSearch()
// console.log('result: ', result);
// console.timeEnd('searchLapse')

var callMe = function callMe(arg1) {
  console.log("callme", arg1);
  initSearch();
};
module.exports.callMe = callMe;
