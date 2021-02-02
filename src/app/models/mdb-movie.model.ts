import { Department, IRating } from "../interfaces"
import { TMDB_External_Id } from "./tmdb-external-id.model"
import { IUserData } from "./user-data.model"

export class MDBMovie {
  mdbId: string
  imdbId: string
  tmdbId: number
  title: string
  originalTitle: string
  originalLanguage: string
  overview: string
  popularity: number
  posterPath: string
  userData: IUserData
  backropPath: string
  credits: ICredits
  rating: IRating
  isAdult: boolean
  vote: IVote
  releaseDate: string
  runtime: number // runtme by minutes
  status: string
  tagline: string
  externalIds: TMDB_External_Id
  genres: any
  genreIds: number[]
  // not used much
  budget: number
  website: string
  revenue: number
  spokenLanguages: any
  video: boolean
  // to map further
  recommendations: any
  images: any
  videos: any
  productionCompanies: any
  collection: any
  productionCountries: any
  releaseDates: any

  constructor(value?: any) {
    if (value != null) {
      this.mapToObject(value)
    }
  }

  private nestMapper(val: any, ...args) {
    let toReturn = null
    try {
      if (this.getNested(val, args))
        toReturn = val
    } catch {
      toReturn = null
    }
    return toReturn
  }

  getNested(obj, ...args) {
    return args.reduce((obj, level) => obj && obj[level], obj)
  }
  /**
   * https://stackoverflow.com/questions/47632430/pattern-for-dealing-with-mapping-api-objects-to-ui-model-objects
   * @param value orig value
   * @param source tmdb, mdb or omdb
   */
  private mapToObject(value: any, source?: string) {

    this.imdbId = value['imdb_id'] || value['imdbId']
    this.tmdbId = value['id'] || value['tmdbId']
    this.mdbId = value['tmdbId'] || value['id']
    this.title = value['title']
    this.originalTitle = value['original_language'] || value['originalTitle']
    this.originalLanguage = value['original_title'] || value['originalLanguage']
    this.overview = value['overview'] || value['plot']
    this.posterPath = value['poster_path'] || value['posterPath']
    // this.userData = value['userData'] || value['plot']
    this.backropPath = value['backdrop_path'] || value['backropPath']
    this.credits = value['credits']
    this.rating = value['overview'] || value['plot']
    this.isAdult = value['adult'] || value['isAdult']
    this.vote = {
      voteAverage: value['vote_average'] || this.nestMapper(value, 'vote', 'voteAverage'),
      voteCount: value['vote_count'] || this.nestMapper(value, 'vote', 'voteCount')
    }
    this.releaseDate = value['release_date'] || value['releaseDate']
    this.runtime = value['runtime']
    this.status = value['status']
    this.tagline = value['tagline']
    this.externalIds = value['external_ids'] || value['externalIds']
    this.genres = value['genres']
    this.genreIds = value['genre_ids']

    this.budget = value['budget']
    this.website = value['homepage'] || value['Website']
    this.revenue = value['revenue']
    this.spokenLanguages = value['spoken_languages'] || value['spokenLanguages']
    this.video = value['video']

    this.recommendations = value['recommendations']
    this.images = value['images']
    this.videos = value['videos']
    this.productionCompanies = value['production_companies'] || value['productionCompanies']
    this.collection = value['belongs_to_collection'] || value['collection']
    this.productionCountries = value['production_countries'] || value['productionCountries']
    this.releaseDates = value['release_dates'] || value['releaseDates']

  }
}

export interface ICredits {
  id: number;
  cast: ICast[];
  crew: ICrew[];
}

interface ICast {
  castId: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profilePath: null | string;
}

interface ICrew {
  creditId: string;
  department: Department;
  gender: number;
  id: number;
  job: string;
  name: string;
  profilePath: null | string;
}


interface IVote {
  voteCount: number
  voteAverage: number
}
