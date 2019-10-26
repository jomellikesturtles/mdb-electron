/**
 * Searches movie info from imdb .tsv files
 */
let fs = require('fs');
const path = require('path');
const papa = require('papaparse');
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
const DataStore = require('nedb')
const titleBasicsTSV = path.join(process.cwd(), '..', 'movie database', 'title.basics.tsv', 'data.tsv')
const titleRatingsTSV = path.join(process.cwd(), '..', 'movie database', 'title.ratings.tsv', 'data.tsv')
let stream;
let ratingsStream;
let result = [];
let currentTconst = ''
let writeStage
function hasRatingsCondition(record) {
    if ((record['tconst']) == '') {
        return true
    }
    return false

}
function procRatingsData(results, parser) {
    // tconst, averageRating, numVotes

    for (let c = 0; c < results.data.length; c++) {
        let record = results.data[c];
        if (hasRatingsCondition(record)) {
            console.log('hasratings true', record);

        }
    }
}

function finRatingsSearch() {
    ratingsStream.close()
}

/**
 * Gets the rating from ratings.tsv
 * @returns averageRating, numVotes
 */
function getRatingFromRatingTsv() {
    ratingsStream = fs.createReadStream(titleRatingsTSV)
        .once('open', function () {
            papa.parse(stream, {
                delimiter: '\t',
                escapeChar: '\\',
                header: true,
                chunk: procRatingsData,
                complete: finRatingsSearch,
                error: function (error) {
                    console.log(error);
                }
            });
        })
        .on('error', function (err) {
            console.log(err);
            ratingsStream.close()
        });
    return ['', '']
}
/**
 * Gets movies and tv movies only.
 * @param {*} record 
 */
function hasTitleTypeCondition(record) {
    if ((record['titleType']) == 'movie' || (record['titleType']) == 'tvMovie') {
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
    // add header
    // writeStage.write(`tconst\ttitleType\tprimaryTitle\toriginalTitle\tisAdult\tstartYear\tendYear\truntimeMinutes\tgenres\n`)
    writeStage.write(`tconst\ttitleType\tprimaryTitle\toriginalTitle\tisAdult\tstartYear\tendYear\truntimeMinutes\tgenres\taverageRating\tnumVotes\n`)
    for (let c = 0; c < results.data.length; c++) {
        let record = results.data[c];
        if (hasTitleTypeCondition(record)) {
            console.log('has title type', record['tconst']);
            stream.pause()
            const rating = getRatingFromRatingTsv()
            stream.resume()
            currentTconst = record['tconst']
            totalResults++
            // writeStage.write(`${record['tconst']}\t${record['titleType']}\t${record['primaryTitle']}\t${record['originalTitle']}\t${record['isAdult']}\t${record['startYear']}\t${record['endYear']}\t${record['runtimeMinutes']}\t${record['genres']}\n`)
            writeStage.write(`${record['tconst']}\t${record['titleType']}\t${record['primaryTitle']}\t${record['originalTitle']}\t${record['isAdult']}\t${record['startYear']}\t${record['endYear']}\t${record['runtimeMinutes']}\t${record['genres']}\t${rating[0]}\t${rating[1]}\n`)
        }
    }
}

/**
 * Finish search, exit the process
 */
function finSearch() {
    console.log('result: ', totalResults)
    console.timeEnd('searchLapse')
    // process.exit(0)
};

/**
* Initialize search
*/
function initConversionTitleBasics() {
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
            console.log(err);
        });

}

console.time('searchLapse')

function initConversion() {

    let dataPath = path.join(process.cwd(), 'data.tsv');
    console.log(dataPath);

    writeStage = fs.createWriteStream(dataPath)
        .on('open', function () {
            console.log('open');
            initConversionTitleBasics()
        })
        .on('error', function (err) {
            writeStage.close();
            console.log(err);
        })
        .on('close', function () {
            writeStage.close();
            console.log('completed');
        })
    console.log('result: ', result);
}
initConversion()
