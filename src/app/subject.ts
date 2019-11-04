/**
 * Objects/Interfaces template
 */
import { BrowserPlatformLocation } from '@angular/platform-browser/src/browser/location/browser_platform_location'

export class Torrent {
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

export class Movie {
  id?: number
  Title: string
  Year: number
  Plot: string
  genre: string
  isAvailable: boolean
  imageDirectory: string
  // runtime: number;
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Poster: string
  // Ratings
  // 0
  // Source	"Internet Movie Database"
  // Value	"7.8/10"
  // 1
  // Source	"Rotten Tomatoes"
  // Value	"82%"
  // 2
  // Source	"Metacritic"
  // Value	"83/100"
  // Metascore	"83"
  // imdbRating: string;
  // imdbVotes	"1,038,709"
  imdbID: string
  isHighlighted: boolean
  // BoxOffice	"$749,700,000"
  // Production	"20th Century Fox"
  // Website	"http://www.avatarmovie.com/"
  // Response	"True"
  // Plot:string;
}

export interface OmdbMovieDetail {
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
  Ratings?: Rating[]
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

export interface TmdbMovieDetail {
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
  Ratings?: Rating[]
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
  libraryInfo?: LibraryInfo
}

export interface LibraryInfo {
  tmdbId?: null | number | string
  imdbID?: string
  title?: string
  year?: number
  directoryList?: string[]
  _id: string
}

export interface Rating {
  Source: string
  Value: string
}

export class MovieGenre {
  id: number
  code: string
  description: string
  isChecked: boolean
}

export class WatchList {
  id: number
  movieList: string[]
}
export class Test {
  userId: number
  id: number
  title: string
  completed: boolean
}

export class SelectedMovies {
  imdbId: string
  title: string
}

export interface IGenres {
  genres: IGenre[]
}

export interface IGenre {
  id: number
  name: string
}

export interface TmdbResultObject {
  page: number;
  total_results: number;
  total_pages: number;
  results: TmdbResult[];
}

export interface TmdbResult {
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

export interface IPreferences {
  frequencyUnit: string
  frequencyValue: number
  isDarkMode: boolean
  isDirty: boolean
  isEnableCache: boolean
  libraryFolders: string[]
}

export interface LibraryMovie {
  tmdbId?: number,
  title: string,
  year: number,
  imdbId?: string,
  directory: string[]
}

export interface IGenre {
  id: number;
  name: string;
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


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
