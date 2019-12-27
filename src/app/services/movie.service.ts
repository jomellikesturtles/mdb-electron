/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of, Subscriber, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IpcService } from '../services/ipc.service';
import { ITorrent, IOmdbMovieDetail, IRating, TmdbParameters, OmdbParameters } from '../interfaces'
import { forEach } from '@angular/router/src/utils/collection';
import { REGEX_IMDB_ID, OMDB_API_KEY, TMDB_API_KEY, FANART_TV_API_KEY, OMDB_URL, TMDB_URL, FANART_TV_URL, STRING_REGEX_IMDB_ID } from '../constants';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' })

@Injectable({ providedIn: 'root' })
export class MovieService {

  constructor(
    private http: HttpClient,
    private ipcService: IpcService
  ) { }

  httpParam = new HttpParams()
  imdbId = 'tt0499549'
  plot = 'full' // short
  results = ''
  testBaseUrl = 'https://jsonplaceholder.typicode.com/todos/1'

  // test only
  getTestApi(id: number): Observable<any> {
    return this.http.get<any>(this.testBaseUrl).pipe(
      tap(_ => this.log(`get id ${id}`)),
      catchError(this.handleError<any>('getTEst'))
    );
  }

  /**
   * Gets movie info. First it gets from offline source,
   * if there is none, it gets from online source (OMDB)
   */
  getMovieInfo(val: string): Observable<any> {
    let result
    if (val.trim().match(REGEX_IMDB_ID)) {
      result = this.getMovieByImdbId(val);
    } else {
      result = this.getMovieByTitle(val);
    }
    return result
  }

  /**
   * Gets movie details by imdb id
   * @param val imdb id
   */
  getMovieByImdbId(val: string): Observable<IOmdbMovieDetail> {
    const url = `${OMDB_URL}/?i=${val}&apikey=${OMDB_API_KEY}&plot=full`
    return this.http.get<IOmdbMovieDetail>(url).pipe(
      map(data => {
        console.log(data);
        return data
      }),
      tap(_ => this.log(``)),
      catchError(this.handleError<IOmdbMovieDetail>('getMovie')))
    // return this.http.get<OmdbMovie>(url).pipe(
    //   tap(_ => this.log(``)),
    //   catchError(this.handleError<OmdbMovie>('getMovie')))
  }

  /**
   * most probably will not be used
   * @param val Movie title
   */
  getMovieByTitle(val: string): Observable<IOmdbMovieDetail> {
    const url = `${OMDB_URL}/?t=${val}&apikey=${OMDB_API_KEY}`
    return this.http.get<IOmdbMovieDetail>(url).pipe(tap(_ => this.log(`getMovie ${val}`)),
      catchError(this.handleError<IOmdbMovieDetail>('getMovie')))
  }

  getMovieFromLibrary(val) {
    this.ipcService.getMovieFromLibrary(val)
  }

  getImages(val: any): Observable<any> {
    const url = `${OMDB_URL}/?t=${val}&apikey=${TMDB_API_KEY}`
    return this.http.get<IOmdbMovieDetail>(url).pipe(tap(_ => this.log(`getMovie ${val}`)),
      catchError(this.handleError<IOmdbMovieDetail>('getMovie')))
  }

  searchMovieByTitle(val: string): Observable<any> {
    const url2 = `${OMDB_URL}/?s=${val}&apikey=${OMDB_API_KEY}`
    const url = `${TMDB_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${val}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('searchMovieByTitle')))
  }

  searchSubtitleById(val: string) {
    // insert code here
  }

  /**
   * Gets IMDB id
   *
   * @param val tmdbId
   * @returns imdb id
   */
  getExternalId(val: any) {
    const url = `${TMDB_URL}/movie/${val}/external_ids?api_key=${TMDB_API_KEY}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getExternalId')))
  }

  getMovieBackdrop(val: string): Observable<any> {
    const url = `${FANART_TV_URL}/${val}?api_key=${FANART_TV_API_KEY}`
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMovieBackdrop')))
  }

  getMoviePoster(posterLink: string) {
    const url = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/biH5hW1BRfEr13oCizuAzpdBf2l.jpg`
    return this.http.get<any>(url, {
      observe: 'response'
    }).pipe(map(data => {
      console.log(data);
    }, catchError(this.handleError('getposter')))
    )
  }

  /**
   * Gets movie details from omdb.
   * @param imdbId the imdb id.
   */
  getOmdbMovieDetails(imdbId: number): Observable<any> {
    const url = `${OMDB_URL}/`
    let httpParam = new HttpParams().append(OmdbParameters.ApiKey, OMDB_API_KEY)

    const myOmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: httpParam
    };
    return this.http.get<any>(url, myOmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getOmdbMovieDetails')))
  }

  /**
   * Gets movie with external id.(IMDb ID, TVDB ID, facebook,twitter,instagram)
   * @param val external id
   */
  getFindMovie(val: string | number): Observable<any> {
    const url = `${TMDB_URL}/find/${val}`
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, TMDB_API_KEY)
    // &external_source=imdb_id
    myHttpParam = myHttpParam.append('external_source', 'imdb_id')
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesDiscover')))
  }

  /**
   * Gets movie details.
   * @param tmdbId the tmdb id.
   * @param val list of key object pair.`[key,object]`
   * @param appendToResponse optional append to response
   */
  getTmdbMovieDetails(tmdbId: number, val?: any[], appendToResponse?: string): Observable<any> {
    const url = `${TMDB_URL}/movie/${tmdbId}`
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, TMDB_API_KEY)
    // videos, images, credits, translations, similar, external_ids, alternative_titles,recommendations
    //   keywords, reviews
    if (!appendToResponse) {
      const fullAppendToResponse = 'videos,images,credits,similar,external_ids,recommendations,release_dates'
      myHttpParam = myHttpParam.append(TmdbParameters.AppendToResponse, fullAppendToResponse)
    } else {
      myHttpParam = myHttpParam.append(TmdbParameters.AppendToResponse, appendToResponse)
    }

    if (val && val.length > 0) {
      myHttpParam = this.appendParameters(val, myHttpParam)
    }
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getTmdbMovieDetails')))
  }

  /**
   * [[key,value],[key,value]]
   */
  getMoviesDiscover(...val): Observable<any> {
    const url = `${TMDB_URL}/discover/movie`
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, TMDB_API_KEY)
    myHttpParam = this.appendParameters(val, myHttpParam)
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesDiscover')))
  }

  searchTmdbMovie(...val): Observable<any> {
    const url = `${TMDB_URL}/search/movie`
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, TMDB_API_KEY)
    myHttpParam = this.appendParameters(val, myHttpParam)
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('searchTmdbMovie')))
  }

  appendParameters(val, myHttpParam) {
    val[0].forEach(element => {
      console.log(element);
      myHttpParam = myHttpParam.append(element[0], element[1])
    })
    return myHttpParam
  }

  /**
   * Error handler.
   * @param operation
   * @param result
   */
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
