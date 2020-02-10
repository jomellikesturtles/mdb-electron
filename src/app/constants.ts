/**
 * Constants
 */
import { IGenre } from './interfaces'

export const TMDB_IMAGE_BASE_URL = 'http://image.tmdb.org/t/p/'
export const TMDB_IMAGE_SECURE_BASE_URL = 'https://image.tmdb.org/t/p/'
export const TMDB_BACKGROUND_SIZES = ['w300', 'w780', 'w1280', 'original']
export const TMDB_LOGO_SIZES = ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original']
export const TMDB_POSTER_SIZES = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original']
export const TMDB_PROFILE_SIZES = ['w45', 'w185', 'h632', 'original']
export const TMDB_STILL_SIZES = ['w92', 'w185', 'w300', 'original']

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const DECADES = [
  { display: '1910s', value: 1910 },
  { display: '1920s', value: 1920 },
  { display: '1930s', value: 1930 },
  { display: '1940s', value: 1940 },
  { display: '1950s', value: 1950 },
  { display: '1960s', value: 1960 },
  { display: '1970s', value: 1970 },
  { display: '1980s', value: 1980 },
  { display: '1990s', value: 1990 },
  { display: '2000s', value: 2000 },
  { display: '2010s', value: 2010 }]

export const TROUBLE_QUOTES = [
  { title: `The Sixth Sense`, year: 1999, quote: 'I see dead people.' },
  { title: `Apollo 13`, year: 1995, quote: 'Houston, we have a problem.' },
  { title: `Finding Nemo`, year: 2003, quote: 'Just keep swimming.' },
  { title: `Beyond the Forest`, year: 1949, quote: 'What a dump.' },
  { title: `Moonstruck`, year: 1987, quote: 'Snap out of it!' },
  { title: `On Golden Pond`, year: 1981, quote: `Listen to me, mister. You're my knight in shining armor. Don't you forget it. You're going to get back on that horse, and I'm going to be right behind you, holding on tight, and away we're gonna go, go, go!` },
  { title: `King Kong`, year: 1933, quote: `Oh, no, it wasn't the airplanes. It was Beauty killed the Beast` },
  { title: `Dirty Harry`, year: 1971, quote: `You've got to ask yourself one question: 'Do I feel lucky?' Well, do ya, punk?` },
  { title: `The Graduate`, year: 1967, quote: `Plastics.` },
]

export const MOVIE_QUOTES = [
  { title: `Gone With the Wind`, year: 1939, quote: `Frankly, my dear, I don't give a damn.`, backdrop: '' },
  { title: 'The Room', year: 2003, quote: `You are tearing me apart, Lisa!`, backdrop: '' },
  { title: 'Dr. Strangelove', year: 1964, quote: `Gentlemen, you can't fight in here! This is the War Room!`, backdrop: '' },
  { title: 'Titanic', year: 1997, quote: `I'm king of the world!`, backdrop: '' },
]

export const GENRES: IGenre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
  // mdb reserved
  { id: 20000, name: 'Film-Noir' },
  {// similar genre: Music id:10402
    id: 20001, name: 'Musical'
  },
  { id: 20002, name: 'News' },
  { id: 20003, name: 'Reality-TV' },
  {
    // similar genre: Science Fiction id:878
    id: 20004, name: 'Sci-Fi'
  },
  {// another media type
    id: 20005, name: 'Short'
  },
  { id: 20006, name: 'Sport' }
]

export const REGEX_IMDB_ID = new RegExp(`(^tt[0-9]{7})$`, `gi`);
export const REGEX_TMDB_RUNTIME = new RegExp(`([\\d,]+)(\\s)(min)`, `gi`);
export const REGEX_OMDB_RELEASE_DATE = new RegExp(`^(\\d{2})+\\s+([a-z]{3,})+\\s+(\\d{4})+`, `gi`);
export const REGEX_TMDB_RELEASE_DATE = new RegExp(`([0-9]{2,4})-([0-9]{2})-([0-9]{2})`, `gi`);
export const REGEX_PREFIX = new RegExp(`^([a-z]:)`, 'gi') // if file absolute e.g. c:/
export const REGEX_FILE_SIZE = new RegExp(`^([0-9])\\d+$`, `g`);
export const REGEX_OMDB_BOX_OFFICE = new RegExp(`(\\$+[\\d,]+)`, `gi`);
export const REGEX_IMAGE_SIZE = new RegExp(`(SX)+([\\d])+(.jpg|.jpeg)`, `gi`)
export const REGEX_YEAR_ONLY = new RegExp(`^([0-9]{4})$`, `gi`);

export const STRING_REGEX_IMDB_ID = `(^tt[0-9]{7})$`;
export const STRING_REGEX_TMDB_RUNTIME = `([\\d,]+)(\\s)(min)`;
export const STRING_REGEX_OMDB_RELEASE_DATE = `^(\\d{2})+\\s+([a-z]{3,})+\\s+(\\d{4})+`;
export const STRING_REGEX_TMDB_RELEASE_DATE = `([0-9]{2,4})-([0-9]{2})-([0-9]{2})`
export const STRING_REGEX_PREFIX = `^([a-z]:)`// if file absolute e.g. c:/
export const STRING_REGEX_FILE_SIZE = `^([0-9])\\d+$`
export const STRING_REGEX_OMDB_BOX_OFFICE = `(\\$+[\\d,]+)`
export const STRING_REGEX_IMAGE_SIZE = `(SX)+([\\d])+(.jpg|.jpeg)`
export const STRING_REGEX_YEAR_ONLY = `^([0-9]{4})$`

export const OMDB_URL = 'http://www.omdbapi.com'
export const TMDB_URL = 'https://api.themoviedb.org/3'
export const FANART_TV_URL = 'http://webservice.fanart.tv/v3/movies'
export const YTS_URL = 'https://yts.am/api/v2/list_movies.json'
export const MY_API_FILMS_URL = 'http://www.myapifilms.com/imdb/'

export const OMDB_API_KEY = '3a2fe8bf'
export const TMDB_API_KEY = 'a636ce7bd0c125045f4170644b4d3d25'
export const MY_API_FILMS_API_KEY = 'c7e516ed-d9fe-4f3f-b1d9-fde33f63c816'
export const TRAK_TV_API_KEY = 'b4f1b1e56c6b78ed8970ba48ed2b6d1fcc517d09164af8c10e2be56c45f5f9a7'
export const TRAK_TV_API_KEY_SECRET = '76c26a018cc31652644caf51928efedf75d301eed404b51e218edefdb661dc36'
export const FANART_TV_API_KEY = '295c36bf9229fd8369928b7360554c9a'
export const YOUTUBE_API_KEY = 'AIzaSyAC1kcZu_DoO7mbrMxMuCpO57iaDByGKV0'

// https://api.themoviedb.org/3/movie/550/videos?api_key=a636ce7bd0c125045f4170644b4d3d25 --getting trailer 1
// https://api.trakt.tv/?trakt-api-key=b4f1b1e56c6b78ed8970ba48ed2b6d1fcc517d09164af8c10e2be56c45f5f9a7&trakt-api-version=2&query=batman`
// http://www.omdbapi.com//?i=tt0499549&apikey=3a2fe8bf\
// /search/:type?query=
// https://api.trakt.tv/search/text?query=titanic
// https://api.themoviedb.org/3/movie/550?api_key=a636ce7bd0c125045f4170644b4d3d25
// http://www.myapifilms.com/imdb/idIMDB?title=matrix&token=c7e516ed-d9fe-4f3f-b1d9-fde33f63c816
// http://webservice.fanart.tv/v3/movies/tt0371746?api_key=295c36bf9229fd8369928b7360554c9a
