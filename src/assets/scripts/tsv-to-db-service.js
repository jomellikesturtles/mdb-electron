/**
 * Searches movie info from imdb .tsv files
 * DEPRECATED
 */
const fs = require('fs');
const path = require('path');
const papa = require('papaparse');

let args = process.argv.slice(2);
let totalResults = 0
let searchQuery = {
    title: '[',
    genres: [''],
    titleType: ['movie', 'tvMovie'],
    releaseFrom: 2014,
    releaseTo: 2019,
    ratingFrom: 7.0,
    ratingTo: 9.8
}
let count = parseInt(args[1]);
let smart = (args[2] === 'true');
let inst = (args[3] === 'true');
count = count > 0 ? count : 100;
count = count > 10000 ? 10000 : count;
const DataStore = require('nedb')
const titleBasicsTSV = path.join(process.cwd(), '..', 'movie database', 'title.basics.tsv', 'data.tsv')
const imdbDbFilePath = path.join(process.cwd(), '..', 'db', 'imdb.db')
var imdbDb = new DataStore({
    filename: imdbDbFilePath,
    autoload: true
})

let stream;
let result = [];

/**
 * Gets movies and tv movies only.
 * @param {*} record 
 */
function hasTitleTypeCondition(record) {

    if ((record['titleType']) == 'movie' || (record['titleType']) == 'tvMovie') {
        // console.log('found primaryTitle', record['primaryTitle']);
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
        let record = results.data[c];

        // console.log('record', record)
        if (hasTitleTypeCondition(record)) {
            totalResults++
            // console.log(totalResults)

            imdbDb.ensureIndex({ fieldName: 'tconst', unique: true }, function (err) {
                if (err) {
                    console.log(err);
                }
            })
            imdbDb.insert(record, function (err, record) {
                // if (!err) {
                //     console.log('inserted ', data);
                // }
            })
            //     // if (i > count) { //count: sets limits of how many results to display
            //     //     parser.abort();
            //     //     stream.close();
            //     //     break;
            //     // } else {
            //     // result.push(resultObjectTemplate(record));
        }
    }
}

/**
 * Finish search, exit the process
 */
function finSearch() {
    // console.log('result: ', result)
    console.log('result: ', totalResults)
    console.timeEnd('searchLapse')
    // process.exit(0)
};

/**
* Initialize search
*/
function initConversion() {
    console.log('initSearch');

    console.log('titleBasicsTSV', titleBasicsTSV);
    stream = fs.createReadStream(titleBasicsTSV)
        .once('open', function () {
            papa.parse(stream, {
                delimiter: '\t',
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
            // process.send(['search-failed', 'read']); 
            console.log(err);
        });
}

console.time('searchLapse')
initConversion()
console.log('result: ', result);
// console.timeEnd('searchLapse')