import { IGenre } from './subject';

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
    releaseYear?: string
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
