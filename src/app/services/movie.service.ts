/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subscriber, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IpcService } from '../services/ipc.service';
import { Test, Movie, Torrent, OmdbMovieDetail, Rating } from '../subject'
import { forEach } from '@angular/router/src/utils/collection';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class MovieService {

  constructor(
    private http: HttpClient,
    private ipcService: IpcService
  ) { }
  // https://api.themoviedb.org/3/movie/550/videos?api_key=a636ce7bd0c125045f4170644b4d3d25 --getting trailer 1
  // https://api.trakt.tv/?trakt-api-key=b4f1b1e56c6b78ed8970ba48ed2b6d1fcc517d09164af8c10e2be56c45f5f9a7&trakt-api-version=2&query=batman`
  // http://www.omdbapi.com//?i=tt0499549&apikey=3a2fe8bf\
  // /search/:type?query=
  // https://api.trakt.tv/search/text?query=titanic
  // https://api.themoviedb.org/3/movie/550?api_key=a636ce7bd0c125045f4170644b4d3d25
  // http://www.myapifilms.com/imdb/idIMDB?title=matrix&token=c7e516ed-d9fe-4f3f-b1d9-fde33f63c816
  omdbApiKey = '3a2fe8bf'
  tmdbApiKey = 'a636ce7bd0c125045f4170644b4d3d25'
  // https://api.themoviedb.org/3/search/movie?api_key=a636ce7bd0c125045f4170644b4d3d25&page=1
  myApiFilmsApiKey = 'c7e516ed-d9fe-4f3f-b1d9-fde33f63c816'
  imdbId = 'tt0499549'
  plot = 'full' // short
  omdbUrl = 'http://www.omdbapi.com'
  tmdbUrl = 'https://api.themoviedb.org/3'
  farnartTVUrl = 'http://webservice.fanart.tv/v3/movies'
  ytsUrl = 'https://yts.am/api/v2/list_movies.json'
  trakTVApiKey = 'b4f1b1e56c6b78ed8970ba48ed2b6d1fcc517d09164af8c10e2be56c45f5f9a7'
  trakTVApiKeySecret = '76c26a018cc31652644caf51928efedf75d301eed404b51e218edefdb661dc36'
  fanartTVApiKey = '295c36bf9229fd8369928b7360554c9a'
  myApiFilmsUrl = 'http://www.myapifilms.com/imdb/'
  results = ''
  testBaseUrl = 'https://jsonplaceholder.typicode.com/todos/1'

  // http://webservice.fanart.tv/v3/movies/tt0371746?api_key=295c36bf9229fd8369928b7360554c9a

  // test only
  getTestApi(id: number): Observable<any> {
    return this.http.get<any>(this.testBaseUrl).pipe(
      tap(_ => this.log(`get id ${id}`)),
      catchError(this.handleError<any>('getTEst'))
    );
  }

  getMovieInfo(val: string): Observable<any> {
    const imdbIdRegex = new RegExp(`(^tt[0-9]{0,7})$`, `g`)
    let result
    if (val.trim().match(imdbIdRegex)) {
      result = this.getMovieByImdbId(val);
    } else {
      result = this.getMovieByTitle(val);
    }
    return result
  }

  getMovieByImdbId(val: string): Observable<OmdbMovieDetail> {
    const url = `${this.omdbUrl}/?i=${val}&apikey=${this.omdbApiKey}&plot=full`
    return this.http.get<OmdbMovieDetail>(url).pipe(
      map(data => {
        console.log(data);
        return data
      }),
      tap(_ => this.log(``)),
      catchError(this.handleError<OmdbMovieDetail>('getMovie')))
    // return this.http.get<OmdbMovie>(url).pipe(
    //   tap(_ => this.log(``)),
    //   catchError(this.handleError<OmdbMovie>('getMovie')))
  }

  /**
   * most probably will not be used
   * @param val Movie title
   */
  getMovieByTitle(val: string): Observable<Movie> {
    const url = `${this.omdbUrl}/?t=${val}&apikey=${this.omdbApiKey}`
    return this.http.get<Movie>(url).pipe(tap(_ => this.log(`getMovie ${val}`)),
      catchError(this.handleError<Movie>('getMovie')))
  }

  getImages(val: any): Observable<any> {
    // https://image.tmdb.org/t/p/original/mFb0ygcue4ITixDkdr7wm1Tdarx.jpg
    const url = `${this.omdbUrl}/?t=${val}&apikey=${this.tmdbApiKey}`
    return this.http.get<Movie>(url).pipe(tap(_ => this.log(`getMovie ${val}`)),
      catchError(this.handleError<Movie>('getMovie')))
  }

  searchMovieByTitle(val: string): Observable<any> {
    const url2 = `${this.omdbUrl}/?s=${val}&apikey=${this.omdbApiKey}`
    const url = `${this.tmdbUrl}/search/multi?api_key=${this.tmdbApiKey}&query=${val}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('searchMovieByTitle')))
  }

  searchMovieByTitleWithPage(query: string, page: number): Observable<any> {
    const url = `${this.tmdbUrl}/search/multi?api_key=${this.tmdbApiKey}&query=${query}&page=${page}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('searchMovieByTitleWithPage')))
  }

  searchSubtitleById(val: string): Observable<Movie> {
    const url = `${this.omdbUrl}/?t=${val}&apikey=${this.omdbApiKey}`
    return this.http.get<Movie>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<Movie>('getMovie')))
  }

  /**
   * Gets IMDB id
   *
   * @param val tmdbId
   * @returns imdb id
   */
  getExternalId(val: any) {
    const url = `${this.tmdbUrl}/movie/${val}/external_ids?api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getExternalId')))
  }

  getMoviesInTheaters() {
    const date = new Date();
    const dateToday = date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
    const date2 = new Date(date.getTime() + (1000 * 60 * 60 * 24))
    const dateTomorrow = date2.getFullYear() + '-' + ('0' + date2.getMonth()).slice(-2) + '-' + ('0' + date2.getDate()).slice(-2)
    const url = `${this.tmdbUrl}/discover/movie?primary_release_date.${dateToday}&primary_release_date.lte=${dateTomorrow}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }
  getMovieBackdrop(val: string): Observable<any> {
    // http://webservice.fanart.tv/v3/movies/tt0371746?api_key=295c36bf9229fd8369928b7360554c9a

    const url = `${this.farnartTVUrl}/${val}?api_key=${this.fanartTVApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMovieBackdrop')))
  }

  /**
   * Gets images from Tmdb
   * @param val tmdb id
   */
  getMovieImages(val: string) {
    // https://image.tmdb.org/t/p/original/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg
    const url = `${this.tmdbUrl}/movie/${val}/images?api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }

  getMovieVideos(val: string) {
    const url = `${this.tmdbUrl}/movie/${val}/videos?api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }

  getReviews(val: string) {
    const url = `${this.tmdbUrl}/movie/${val}/reviews?api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }

  getSimilarMovies(val: string) {
    const url = `${this.tmdbUrl}/movie/${val}/similar?api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }

  getMoviesByDates(startDate, endDate) {
    const url = `${this.tmdbUrl}/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&api_key=${this.tmdbApiKey}`

    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }

  getTopMovies() {
    const url = `${this.tmdbUrl}/discover/movie?sort_by=popularity.desc&api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }
  getRRatedMovies() {
    const url = `${this.tmdbUrl}/discover/movie/?certification_country=US&certification=R&sort_by=vote_average.desc&api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }
  getTopMoviesByGenre(genreId) {
    const url = `${this.tmdbUrl}/discover/movie?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=10&api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }
  getTopMoviesByYear(year) {
    const url = `${this.tmdbUrl}/discover/movie?primary_release_year=${year}&sort_by=popularity.desc&api_key=${this.tmdbApiKey}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesInTheaters')))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`MovieService: ${message} `);
  }
}
