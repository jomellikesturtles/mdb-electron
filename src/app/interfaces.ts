
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
  [propName: string]: any;
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

export enum OmdbParameters {
  ApiKey = 'apikey',
  ImdbId = 'i',
  Title = 't',
  Type = 'type',
  Year = 'y',
  Plot = 'plot',
  Return = 'r',
  Callback = 'callback',
  Version = 'v',
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

export enum TmdbAppendToResponseParameters {
  AccountStates = 'account_states',
  Videos = 'videos',
  Images = 'images',
  Credits = 'credits',
  Changes = 'changes',
  Translations = 'translations',
  Similar = 'similar',
  ExternalIds = 'external_ids',
  AlternativeTitles = 'alternative_titles',
  Keywords = 'keywords',
  Reviews = 'reviews',
  Recommendations = 'recommendations',
  ReleaseDates = 'release_dates',
  Lists = 'lists'
}

export enum TmdbReleaseTypes {
  PREMIERE = 'Premiere',  // 1
  THEATRICAL_LIMITED = 'Theatrical(limited)', // 2
  THEATRICAL = 'Theatrical', // 3
  DIGITAL = 'Digital', // 4
  PHYSICAL = 'Physical', // 5
  TV = 'TV', // 6
}

export enum TmdbReleaseTypes2 {
  PREMIERE = 'Premiere',  // 1
  THEATRICAL_LIMITED = 'Theatrical(limited)', // 2
  THEATRICAL = 'Theatrical', // 3
  DIGITAL = 'Digital', // 4
  PHYSICAL = 'Physical', // 5
  TV = 'TV', // 6
}

export interface IPersonDetails {
  birthday: string;
  known_for_department: string;
  id: number;
  movie_credits?: IPersonCredits;
  tv_credits?: IPersonCredits;
  combined_credits?: IPersonCredits;
  homepage?: any;
  profile_path: string;
  imdb_id: string;
  deathday?: any;
  images?: IImages;
  external_ids?: IExternalids;
  name: string;
  also_known_as: string[];
  biography: string;
  adult: boolean;
  gender: number;
  place_of_birth: string;
  popularity: number;
}



export interface IPersonCredits {
  cast: IPersonCastCrew[];
  crew: IPersonCastCrew[];
  id?: number;
}

export interface IPersonCastCrew {
  id?: number;
  original_language: string;
  episode_count?: number;
  overview: string;
  origin_country?: string[];
  original_name?: string;
  genre_ids: number[];
  name?: string;
  media_type: string;
  poster_path: null | string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  character?: string;
  backdrop_path: null | string;
  popularity: number;
  credit_id: string;
  original_title?: string;
  video?: boolean;
  release_date?: string;
  title?: string;
  adult?: boolean;
  department?: string;
  job?: string;
}

export interface IExternalids {
  id?: number;
  freebase_id: string;
  instagram_id: string;
  tvrage_id: number;
  twitter_id: string;
  freebase_mid: string;
  imdb_id: string;
  facebook_id: string;
}

export interface IImages {
  id?: number;
  profiles: IProfile[];
}

export interface IProfile {
  iso_639_1?: any;
  aspect_ratio: number;
  vote_count: number;
  height: number;
  vote_average: number;
  file_path: string;
  width: number;
}


export interface ICredits {
  cast: ICast[];
  crew: ICrew[];
}

export interface ICast {
  poster_path?: string;
  adult: boolean;
  backdrop_path?: string;
  vote_count: number;
  video: boolean;
  id: number;
  media_type?: string;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  title: string;
  original_title: string;
  release_date: string;
  character: string;
  vote_average: number;
  overview: string;
  credit_id: string;
}

export interface ICrew {
  id: number;
  department: string;
  original_language: string;
  original_title: string;
  job: string;
  overview: string;
  genre_ids: number[];
  video: boolean;
  episode_count: number
  media_type?: string;
  credit_id: string;
  poster_path?: string;
  popularity: number;
  backdrop_path?: string;
  vote_count: number;
  title: string;
  adult: boolean;
  vote_average: number;
  release_date: string;
}

/**
 *
export interface Credits {
    cast: Cast[];
    crew: Crew[];
}

export interface Cast {
    cast_id:      number;
    character:    string;
    credit_id:    string;
    gender:       number;
    id:           number;
    name:         string;
    order:        number;
    profile_path: null | string;
}

export interface Crew {
    credit_id:    string;
    department:   Department;
    gender:       number;
    id:           number;
    job:          string;
    name:         string;
    profile_path: null | string;
}

export enum Department {
    Art = "Art",
    Camera = "Camera",
    CostumeMakeUp = "Costume & Make-Up",
    Crew = "Crew",
    Directing = "Directing",
    Editing = "Editing",
    Lighting = "Lighting",
    Production = "Production",
    Sound = "Sound",
    VisualEffects = "Visual Effects",
    Writing = "Writing",
}

export interface ExternalIDS {
    imdb_id:      string;
    facebook_id:  null;
    instagram_id: null;
    twitter_id:   null;
}

export interface Genre {
    id:   number;
    name: string;
}

export interface Images {
    backdrops: any[];
    posters:   any[];
}

export enum OriginalLanguage {
    En = "en",
    Es = "es",
    Fr = "fr",
}

export interface ProductionCompany {
    id:             number;
    logo_path:      string;
    name:           string;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name:       string;
}

export interface Recommendations {
    page:          number;
    results:       RecommendationsResult[];
    total_pages:   number;
    total_results: number;
}

export interface RecommendationsResult {
    id:                number;
    video:             boolean;
    vote_count:        number;
    vote_average:      number;
    title:             string;
    release_date:      string;
    original_language: OriginalLanguage;
    original_title:    string;
    genre_ids:         number[];
    backdrop_path:     string;
    adult:             boolean;
    overview:          string;
    poster_path:       string;
    popularity:        number;
}

export interface SpokenLanguage {
    iso_639_1: OriginalLanguage;
    name:      string;
}

export interface Videos {
    results: VideosResult[];
}

export interface VideosResult {
    id:         string;
    iso_639_1:  OriginalLanguage;
    iso_3166_1: string;
    key:        string;
    name:       string;
    site:       string;
    size:       number;
    type:       string;
}
 */
