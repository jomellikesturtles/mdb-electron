import { IMdbMovieDetails, IRating, ILibraryInfo, IGenre, ISpokenLanguage } from './interfaces'
import { MONTHS, STRING_REGEX_OMDB_RELEASE_DATE, STRING_REGEX_OMDB_BOX_OFFICE } from './constants'
import { UtilsService } from './services/utils.service';

/**
 * The main class.
 * TODO: add 'N\A' and null handlers
 */
export class MdbMovieDetails implements IMdbMovieDetails {
  awards?: string
  private _backgroundPath: string;
  private _boxOffice?: string | number // tmdb:revenue(number)
  bookmark: any
  belongsToCollection?: []
  budget?: number
  country?: string
  director?: string
  dvd?: string // dvd release
  private _genres?: string[]
  imdbId?: string
  imdbRating?: string
  imdbVotes?: string
  isAdult?: boolean;
  isAvailable?: boolean
  originalLanguage?: string // omdb:"en",tmdb:"English"
  originalTitle?: string // tmdb:"en",omdb
  private _languages?: string[]
  libraryInfo?: ILibraryInfo
  metascore?: string // metacritic score
  popularity?: number
  private _posterPath: string
  plot?: string // plot or overview
  production?: string // company; i.e. Walt Disney Pictures
  rated?: string // rated or certificate
  ratings?: IRating[]
  private _releaseDate?: string // omdb:"05 May 2017"; tmdb:"1999-10-15"
  private _releaseYear?: string | number
  response: string
  runtime?: string
  status?: string // Rumored, Planned, In Production, Post Production, Released, Canceled
  starring?: string // Actors field in omdb
  tagline?: string;
  tmdbId?: number
  title: string
  type?: string // movie/tvmovie/series
  video?: boolean; // unknown
  voteAverage: number; // tmdb votes
  voteCount: number; // tmdb votes
  watched: any
  website?: string
  writer?: string // omdb
  [propName: string]: any;

  constructor() {
    this.isAvailable = false
  }

  /**
   * Converts omdb or tmdb object into Mdb object
   * @param value omdb or tmdb object.
   */
  convertToMdbObject(value) {

    Object.keys(value).forEach(key => {
      console.log('key: ', key, ' value: ', value[key], ' ')
      switch (key) {
        case 'Actors':
          this._releaseDate = value[key]
          break;
        case 'adult':
          this.isAdult = value[key]
          break;
        case 'Awards':
          this.awards = value[key]
          break;
        case 'backdrop_path':
          this._backgroundPath = value[key]
          break;
        case 'belongs_to_collection':
          this.belongsToCollection = value[key]
          break;
        case 'BoxOffice':
        case 'revenue':
          this._boxOffice = value[key]
          break;
        case 'Director':
          this.director = value[key]
          break;
        case 'Genre':
          this._genres = value[key]
          break;
        case 'homepage':
          this.website = value[key]
          break;
        case 'id':
          this.tmdbId = value[key]
          break;
        case 'imdb_id':
        case 'imdbID':
          this.imdbId = value[key]
          break;
        case 'Language':
        case 'spoken_languages':
          this._languages = value[key]
          break;
        case 'original_language':
          this.originalLanguage = value[key]
          break;
        case 'original_title':
          this.originalTitle = value[key]
          break;
        case 'Poster':
        case 'poster_path':
          this._posterPath = value[key]
          break;
        case 'Plot':
        case 'overview':
          this.plot = value[key]
          break;
        case 'Title':
          this.title = value[key]
          break;
        case 'TmdbID':
          this.tmdbId = value[key]
          break;
        case 'release_date':
        case 'Released':
          this._releaseDate = value[key]
          break;
        case 'vote_average':
          this.voteAverage = value[key]
          break;
        case 'vote_count':
          this.voteCount = value[key]
          break;
        case 'Writer':
          this.writer = value[key]
          break;
        case 'Year':
          this._releaseYear = value[key]
          break;
        default:
          this[key] = value[key]
          break;
      }
    });
    // Object.keys(this.movieDetails).forEach(key => {
    //   console.log(`movieDetails key ${key} with value `, key);
    // })
  }

  set backgroundPath(v: string) {
    if (v && v.indexOf('/') == 0) {
      this._backgroundPath = `https://image.tmdb.org/t/p/original/${v}`
    } else {
      this._backgroundPath = v
    }
  }

  get backgroundPath() {
    return this._backgroundPath
  }

  /**
   * Sets the box office or revenue. Omdb has '$389,804,217' or 'N/A' format and Tmdb has number format
   * @param v to set gk
   */
  set boxOffice(v: string | number) {
    // just in case to be used in the future
    const REGEX_OMDB_BOX_OFFICE = new RegExp(STRING_REGEX_OMDB_BOX_OFFICE, `gi`);
    const omdbBoxOfficeRegex = REGEX_OMDB_BOX_OFFICE
    if (typeof v === 'string') {
      if (v === 'N/A') {
        this._boxOffice = null
      } else {
        this._boxOffice = v.replace(/\$|,/g, '')
      }
    } else {
      this._boxOffice = v
    }
  }

  get boxOffice() {
    return this._boxOffice
  }

  /**
   * Sets the genre list. Parameterized by string of genres `'Genre 1, Genre2'` or list of `IGenre`.
   * @param v genres to list.
   */
  set genres(v: any) {
    let result: string[] = []
    if (typeof v === 'string') {
      result = v.split(', ')
    } else {
      const localV = v as IGenre[]
      localV.forEach(element => {
        result.push(element.name.toString())
      })
    }
    this._genres = result
  }

  get genres() {
    return this._genres
  }
  /**
   * Sets the language list. Parameterized by string of languages `'Language, Idioma'` or list of `ISpokenLanguage`.
   * @param v languages to list.
   */
  set languages(v: any) {
    let result: string[] = []
    if (typeof v === 'string') {
      result = v.split(', ')
    } else if (typeof v === 'object') {
      const localV = v as ISpokenLanguage[]
      localV.forEach(element => {
        result.push(element.name)
      })
    }
    this._languages = result
  }

  get languages() {
    return this._languages
  }

  /**
   * Sets the online poster path.
   */
  set posterPath(v: string) {
    // /7w2KlTuboB1krEUfy2ggiZzmKRy.jpg
    // https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg
    if (v.indexOf('amazon') >= 0) {
      this._posterPath = v
    } else {
      this._posterPath = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${v}`
    }
  }

  get posterPath() {
    return this._posterPath
  }

  /**
   * Sets the release Date. If parameter is in tmdb format, Tmdb: `1999-10-15` convert to Omdb format `15 October 1999`.
   * @param v date to set
   */
  set releaseDate(v: string) {

    const REGEX_OMDB_RELEASE_DATE = new RegExp(STRING_REGEX_OMDB_RELEASE_DATE, `gi`);
    const regexResults = REGEX_OMDB_RELEASE_DATE.exec(v)
    if (regexResults != null) {
      const date = new Date()
      date.setFullYear(parseInt(regexResults[1], 10))
      // in Date function, index starts with zero and month 10 returns november,
      // in tmdb date, index starts with 1 and month 10 is october, so minus 1
      date.setMonth(parseInt(regexResults[2], 10) - 1)
      date.setDate(parseInt(regexResults[3], 10))
      const month = MONTHS[date.getMonth()]
      this._releaseDate = `${date.getDate()} ${month} ${date.getFullYear()}`
      // this.releaseYear(2)
    } else {
      this._releaseDate = v
    }
  }

  get releaseDate() {
    return this._releaseDate
  }

  set releaseYear(val: number | string) {
    this._releaseYear = val
  }

  get releaseYear(): number | string {
    let toReturn
    const releaseYear = this._releaseYear
    const releaseDate = this._releaseDate
    if (!releaseDate) {
      toReturn = releaseDate.substr(releaseDate.lastIndexOf(' ') + 1)
    } else {
      toReturn = !releaseYear ? releaseYear : 0
    }
    return toReturn
  }
}

