/**
 * Searches movie with criteria from imdb .tsv files
 */
// tconst	titleType	primaryTitle	originalTitle	isAdult	startYear	endYear	runtimeMinutes	genres
// - search queries: title, releaseYear, genre/s, rating, ratingcount, language, country origin/region,
let fs = require('fs');
const path = require('path');
const papa = require('papaparse');
let totalResults = 0
let searchQuery = {
    title: 'g',
    genres: ['Drama'],
    titleType: ['movie', 'tvMovie'],
    releaseFrom: 1990,
    releaseTo: 2019,
    ratingFrom: 7.0,
    ratingTo: 9.8
}
const DataStore = require('nedb')
let basicsDataPath = path.join(process.cwd(), 'data.tsv');
let ratingsDataPath = path.join(process.cwd(), 'title.ratings.tsv', 'data.tsv');

let stream;
let searchResults = [];



/**
 * Search by title.
 * @param {*} record 
 */
function hasTitleCondition(record) {
    const searchQueryTitle = searchQuery.title
    if ((record['primaryTitle']).toLowerCase().indexOf(searchQueryTitle) > -1 || (record['originalTitle']).toLowerCase().indexOf(searchQueryTitle) > -1) {
        return true
    }
    return false
}

/**
 * Search by genre.
 * @param {*} record 
 */
function hasGenreCondition(record) {
    const searchGenres = searchQuery.genres
    let toReturn = false
    const rowGenres = record['genres']
    searchGenres.forEach(e => {
        if (rowGenres.indexOf(e) > -1) {
            toReturn = true
        } else {
            toReturn = false
        }
    })
    return toReturn
}

/**
 * Search by release year.
 * @param {*} record 
 */
function hasReleaseYearCondition(record) {
    if ((record['startYear']) >= searchQuery.releaseFrom && (record['startYear']) <= searchQuery.releaseTo) {
        return true
    }
    return false
}

/**
 * Search by of ratings.
 * @param {*} record 
 */
function hasRatingCondition(record) {
    // tconst, averageRating, numVotes
    if ((record['averageRating']) >= searchQuery.ratingFrom && (record['averageRating']) <= searchQuery.ratingTo) {
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

    for (let c = 0; c < results.data.length; c++) {
        let record = results.data[c];
        if (
            hasTitleCondition(record)
            && hasReleaseYearCondition(record)
            && hasGenreCondition(record)
        ) {
            totalResults++
            // console.log(record);
            searchResults.push(record)
        }
    }
}

/**
 * Finish search, exit the process
 */
function finSearch(type) {
    // if (type == 'basic') {

    // } else if (type == 'rating') {

    console.timeEnd('searchLapse')
    stream.close()
    // }
    console.log('result: ', searchResults)
    // initSearchTsv('rating')
    process.exit(0)
};

/**
* Initialize search
*/
function initSearchTsv(type) {
    let dataPath = ''
    if (type == 'basic') {
        dataPath = basicsDataPath
    } else if (type == 'rating') {
        dataPath = ratingsDataPath
    }
    console.log('initSearch', searchQuery, ' dataPath', dataPath, ' type', type);
    stream = fs.createReadStream(dataPath)
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
            stream.close()
        });
}

console.time('searchLapse')

initSearchTsv('basic')
