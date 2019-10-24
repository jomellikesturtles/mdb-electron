/**
 * Service for offline data
 */
const path = require('path')
args = process.argv.slice(2)
const DataStore = require('nedb')
var command = args[0]
var movie = args[1]

var movieDataDb = new DataStore({
    filename: path.join(process.cwd(), 'src', 'assets', 'db', 'movieData.db'),
    autoload: true
})

var testMovieMetadata = {
    Title: 'WALL·E',
    Year: '2008',
    Rated: 'G',
    Released: '27 Jun 2008',
    Runtime: '98 min',
    Genre: 'Animation, Adventure, Family, Sci-Fi',
    Director: 'Andrew Stanton',
    Writer: 'Andrew Stantoyzn (original story by), Pete Docter (original story by), Andrew Stanton (screenplay by), Jim Reardon (screenplay by)',
    Actors: 'Ben Burtt, Elissa Knight, Jeff Garlin, Fred Willard',
    Plot: 'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.',
    Language: 'English',
    Country: 'USA',
    Awards: 'Won 1 Oscar. Another 89 wins & 90 nominations.',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SX300.jpg',
    Ratings: [{
        Source: 'Internet Movie Database',
        Value: '8.4/10'
    },
    {
        Source: 'Rotten Tomatoes',
        Value: '95%'
    },
    {
        Source: 'Metacritic',
        Value: '95/100'
    }
    ],
    Metascore: '95',
    imdbRating: '8.4',
    imdbVotes: '919,942',
    imdbID: 'tt0910970',
    Type: 'movie',
    DVD: '18 Nov 2008',
    BoxOffice: '$223,749,872',
    Production: 'Walt Disney Pictures',
    Website: 'http://www.wall-e.com/',
    Response: 'True'
}

var testMovieMetadata2 = {
    Title: "Guardians of the Galaxy Vol. 2",
    Year: "2017",
    Rated: "PG-13",
    Released: "05 May 2017",
    Runtime: "136 min",
    Genre: "Action, Adventure, Comedy, Sci-Fi",
    Director: "James Gunn",
    Writer: "James Gunn, Dan Abnett (based on the Marvel comics by), Andy Lanning (based on the Marvel comics by), Steve Englehart (Star-Lord created by), Steve Gan (Star-Lord created by), Jim Starlin (Gamora and Drax created by), Stan Lee (Groot created by), Larry Lieber (Groot created by), Jack Kirby (Groot created by), Bill Mantlo (Rocket Raccoon created by), Keith Giffen (Rocket Raccoon created by), Steve Gerber (Howard the Duck created by), Val Mayerik (Howard the Duck created by)",
    Actors: "Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel",
    Plot: "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father the ambitious celestial being Ego.",
    Language: "English",
    Country: "USA",
    Awards: "Nominated for 1 Oscar. Another 12 wins & 42 nominations.",
    Poster: "https://m.media-amazon.com/images/M/MV5BN2MwNjJlODAtMTc1MS00NjkwLTg2NDMtYzFjZmU2MGM1YWUwXkEyXkFqcGdeQXVyMTYzMDM0NTU@._V1_SX300.jpg",
    Ratings: [{
        Source: "Internet Movie Database",
        Value: "7.6/10"
    },
    {
        Source: "Rotten Tomatoes",
        Value: "84%"
    },
    {
        Source: "Metacritic",
        Value: "67/100"
    }],
    Metascore: "67",
    imdbRating: "7.6",
    imdbVotes: "502, 562",
    imdbID: "tt3896198",
    Type: "movie",
    DVD: "22 Aug 2017",
    BoxOffice: "$389, 804, 217",
    Production: "Walt Disney Pictures",
    Website: "https://marvel.com/guardians",
    Response: "True"
}

function getAllMovieData() {
    movieDataDb.find({}, function (err, result) {
        // console.log(result)
        if (!err) {
            console.log(result)
            // process.send(['offline-movie-data', result])
        }
    })
}

function getMovieData() {
    // console.log('command', command, ' movie ', movie)
    movieDataDb.findOne({ imdbID: movie }, function (err, result) {
        if (!err) {
            // console.log('movie-metadata', result)
            if (!result) {
                process.send(['movie-metadata', 'empty'])
            } else {
                process.send(['movie-metadata', result])
            }
        }
    })
}

function setMovieData() {
    // console.log('setMovieData ', movie);
    const newMovie = JSON.parse(movie)
    movieDataDb.insert(newMovie, function (err, data) {
        if (!err) {
            // console.log('inserted setMovieData ', newMovie);
        }
    })
}

/**
 * Initializes the movie data service 
*/
function initializeService() {
    movieDataDb.ensureIndex({ fieldName: 'imdbID', unique: true }, function (err) {
        if (err) {
            console.log(err);
        }
    })
    switch (command) {
        case 'get':
            getMovieData()
            break;
        case 'get-all':
            getAllMovieData()
            break;
        case 'set':
            setMovieData()
            break;
        default:
            break;
    }
}

// movie = testMovieMetadata
initializeService()
