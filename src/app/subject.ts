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
  size_bytes?: number
  added?: string
  date_uploaded?: string
  date_uploaded_unix?: number
  is_yts?: boolean
  magnet_link?: string
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
  Released?: string
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

export interface MdbMovieDetails {
  Title: string
  Year?: string
  Rated?: string
  Released?: string
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
  LibraryInfo?: LibraryInfo
}
export interface LibraryInfo {
  imdbID?: string
  title?: string
  year?: number
  directoryList?: []
}
export interface LibraryInfo2 {
  imdbID?: string
  title?: string
  year?: number
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

export interface Genres {
  genres: Genre[]
}

export interface Genre {
  id: number
  name: string
}

export interface TmdbResultObject {
  page: number;
  total_results: number;
  total_pages: number;
  results: Result[];
}

export interface Result {
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
}


export interface Preferences {
  frequencyUnit: string
  frequencyValue: number
  isDarkMode: boolean
  isDirty: boolean
  isEnableCache: boolean
  libraryFolders: string[]
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
