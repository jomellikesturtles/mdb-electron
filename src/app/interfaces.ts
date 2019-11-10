
// omdb:"N/A"; tmdb:null
export interface IMdbMovieDetails {
  awards?: string
  backgroundPath: string;
  belongsToCollection?: []
  boxOffice?: string | number // tmdb:revenue(number)
  budget?: number
  country?: string
  director?: string
  dvd?: string // dvd release
  genres?: string[] | string | IGenre[]
  imdbId?: string
  imdbRating?: string
  imdbVotes?: string
  isAdult?: boolean;
  isAvailable?: boolean;
  languages?: string[]
  libraryInfo?: ILibraryInfo
  metascore?: string // metacritic score\
  originalLanguage?: string // tmdb:"en",omdb:"English"
  originalTitle?: string
  plot?: string // plot or overview
  popularity?: number
  posterPath: string
  production?: string // company; i.e. Walt Disney Pictures
  rated?: string // rated or certificate
  ratings?: IRating[]
  releaseDate?: string // omdb:"05 May 2017"; tmdb:"1999-10-15"
  releaseYear?: number | string
  response: string
  runtime?: string
  starring?: string // Actors field in omdb
  status?: string // released/Post
  tagline?: string;
  tmdbId?: number
  title: string
  type?: string // movie/tvmovie/series
  video?: boolean; // unknown
  // voteAverage: number; // tmdb votes
  // voteCount: number; // tmdb votes
  website?: string
  writer?: string // omdb
}

export interface IRating {
  Source: string
  Value: string
}


export interface LibraryInfo {
  tmdbId?: null | number | string
  imdbID?: string
  title?: string
  year?: number
  directoryList?: string[]
  _id: string
}

export interface MovieGenre {
  id: number
  code: string
  description: string
  isChecked: boolean
}

export interface WatchList {
  id: number
  movieList: string[]
}


export interface ILibraryInfo {
  tmdbId?: null | number | string
  imdbID?: string
  title?: string
  year?: number
  directoryList?: string[]
  _id: string
}

export interface ICollection {
  id: number,
  name: string
}


export interface IProductionCompany {
  id: number;
  logo_path: null | string;
  name: string;
  origin_country: string;
}

export interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface ISpokenLanguage {
  iso_639_1: string;
  name: string;
}


export interface IOmdbMovieDetail {
  Title: string
  Year?: string
  Rated?: string
  Released?: string // "05 May 2017"
  Runtime?: string
  Genre?: string
  Director?: string
  Writer?: string
  Actors?: string
  Plot?: string
  Language?: string
  Country?: string
  Awards?: string
  Poster?: string
  Ratings?: IRating[]
  Metascore?: string
  imdbRating?: string
  imdbVotes?: string
  imdbID: string
  Type?: string
  DVD?: string
  BoxOffice?: string
  Production?: string
  Website?: string
  Response: string
}

export interface ITmdbMovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: IGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: ISpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MdbMovieDetails {
  adult?: boolean;
  title: string
  releaseYear?: string
  releaseDate?: string
  rated?: string // rated or certificate
  runtime?: string
  genres?: string
  director?: string
  writer?: string
  Actors?: string
  plot?: string // plot or overview
  Language?: string
  Country?: string
  Awards?: string
  Poster?: string
  Ratings?: IRating[]
  Metascore?: string
  imdbRating?: string
  imdbVotes?: string
  imdbID: string
  tmdbID: number
  Type?: string
  DVD?: string
  BoxOffice?: string
  Production?: string
  website?: string
  response: string
  libraryInfo?: ILibraryInfo
}

// // adult: boolean;
// //backdrop_path: string;
// belongs_to_collection: null;
// // budget: number;
// genres: Genre[];
// // homepage: string;
// // id: number;
// // imdb_id: string;
// original_language: string;
// original_title: string;
// // overview: string;
// // popularity: number;
// // poster_path: string;
// production_companies: ProductionCompany[];
// production_countries: ProductionCountry[];
// // release_date: string;
// // revenue: number;
// // runtime: number;
// spoken_languages: SpokenLanguage[];
// // status: string;
// // tagline: string;
// // title: string;
// // video: boolean;
// // vote_average: number;
// // vote_count: number;



export interface ITmdbResultObject {
  page: number;
  total_results: number;
  total_pages: number;
  results: ITmdbResult[];
}


export interface ITmdbResult {
  popularity: number
  vote_count: number
  video: boolean
  poster_path: string
  id: number
  adult: boolean
  backdrop_path: string
  original_language: string
  original_title: string
  genre_ids: number[]
  title: string
  vote_average: number
  overview: string
  release_date: string
  isAvailable?: boolean
  isHighlighted?: boolean
  isWatched?: boolean
  isInWatchList?: boolean
}

export interface ILibraryMovie {
  tmdbId?: number,
  title: string,
  year: number,
  imdbId?: string,
  directory: string[]
}

export interface IGenre {
  id: number
  name: string
}

export interface IPreferences {
  frequencyUnit: string
  frequencyValue: number
  isDarkMode: boolean
  isDirty: boolean
  isEnableCache: boolean
  libraryFolders: string[]
}

export interface Credits {
  id: number;
  cast: CastElement[];
  crew: Crew[];
}

export interface CastElement {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profile_path: null | string;
}

export interface Crew {
  credit_id: string;
  department: Department;
  gender: number;
  id: number;
  job: string;
  name: string;
  profile_path: null | string;
}

export enum Department {
  Art = 'Art',
  Camera = 'Camera',
  CostumeMakeUp = 'Costume & Make-Up',
  Crew = 'Crew',
  Directing = 'Directing',
  Editing = 'Editing',
  Lighting = 'Lighting',
  Production = 'Production',
  Sound = 'Sound',
  VisualEffects = 'Visual Effects',
  Writing = 'Writing',
}

export interface ITorrent {
  id?: number
  name?: string
  size?: string
  hash: string
  url?: string
  quality?: string
  type?: string
  seeds?: number
  peers?: number
  sizeBytes?: number
  added?: string
  dateUploaded?: string
  dateUploadedUnix?: number
  isYts?: boolean
  magnetLink?: string
}

// export interface ITmdbDiscoverParameters {
//   api_key: string,
//   language: string,
//   region: string,
//   sort_by: string,
//   certification_country: string,
//   certification: string,
//   certification.lte: string,
//   certification.gte: string,
//     primary_release_year: string,
//       primary_release_date.gte: string,
//         primary_release_date.lte: string,
//           release_date.gte: string,
//             ReleaseDateLess = 'release_date.lte',
//             WithReleaseType = 'with_release_type',
//             Year = 'year',
//             VoteCountGreater = 'vote_count.gte',
//             VoteCountLess = 'vote_count.lte',
//             VoteAverageGreater = 'vote_average.gte',
//             VoteAverageLess = 'vote_average.lte',
//             WithCast = 'with_cast',
//             WithCrew = 'with_crew',
//             WithPeople = 'with_people',
//             WithCompanies = 'with_companies',
//             WithGenres = 'with_genres',
//             WithoutGenres = 'without_genres',
//             WithKeywords = 'with_keywords',
//             WithoutKeywords = 'without_keywords',
//             WithRuntimeGreater = 'with_runtime.gte',
//             WithRuntimeLess = 'with_runtime.lte',
//             WithOriginalLanguage = 'with_original_language',
// }

export interface ISearch {
  page: number

}

export enum TmdbParameters {
  ApiKey = 'api_key',
  AppendToResponse = 'append_to_response',
  Language = 'language',
  Region = 'region',
  SortBy = 'sort_by',
  CertificationCountry = 'certification_country',
  Certification = 'certification',
  CertificationLess = 'certification.lte',
  CertificationGreater = 'certification.gte',
  IncludeAdult = 'include_adult',
  IncludeVideo = 'include_video',
  Page = 'page',
  PrimaryReleaseYear = 'primary_release_year',
  PrimaryReleaseDateGreater = 'primary_release_date.gte',
  PrimaryReleaseDateLess = 'primary_release_date.lte',
  ReleaseDateGreater = 'release_date.gte',
  ReleaseDateLess = 'release_date.lte',
  WithReleaseType = 'with_release_type',
  Year = 'year',
  VoteCountGreater = 'vote_count.gte',
  VoteCountLess = 'vote_count.lte',
  VoteAverageGreater = 'vote_average.gte',
  VoteAverageLess = 'vote_average.lte',
  WithCast = 'with_cast',
  WithCrew = 'with_crew',
  WithPeople = 'with_people',
  WithCompanies = 'with_companies',
  WithGenres = 'with_genres',
  WithoutGenres = 'without_genres',
  WithKeywords = 'with_keywords',
  WithoutKeywords = 'without_keywords',
  WithRuntimeGreater = 'with_runtime.gte',
  WithRuntimeLess = 'with_runtime.lte',
  WithOriginalLanguage = 'with_original_language',
}

export enum AppendToResponse {
  /**
   * Details
   * videos,images,credits,changes,translations,similar,external_ids,alternative_titles
   * keywords, reviews,recommendations
   */

}
