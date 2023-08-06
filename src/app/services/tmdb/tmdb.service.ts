/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { IRawTmdbResultObject, TmdbParameters, TmdbSearchMovieParameters } from '@models/interfaces';
import { TMDB_External_Id } from '@models/tmdb-external-id.model';
import { CacheService } from '../cache.service';
import { TMDBMovieQuery } from '../movie/movie.query';
import { TMDBMovieStore } from '@services/movie/movie.store';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class TmdbService {

  TMDB_API_KEY = environment.tmdb.apiKey;
  TMDB_URL = environment.tmdb.url;

  constructor(
    private http: HttpClient,
    private cacheService: CacheService,
    private tmdbMovieQuery: TMDBMovieQuery,
    private tmdbMovieStore: TMDBMovieStore,
  ) { }

  httpParam = new HttpParams();

  /**
   * Gets IMDB id
   *
   * @param tmdbId tmdbId
   * @returns external ids
   */
  getExternalId(tmdbId: number): Observable<TMDB_External_Id> {
    return this.cacheService.get(tmdbId + '_EXTERNAL_ID', this.externalId(tmdbId));
  }

  /**
   * Gets movie with external id.(IMDb ID, TVDB ID, facebook,twitter,instagram)
   * @param val external id
   */
  getFindMovie(val: string | number): Observable<any> {
    const url = `${this.TMDB_URL}/find/${val}`;
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
    myHttpParam = myHttpParam.append('external_source', 'imdb_id');
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesDiscover')));
  }

  /**
   * Gets movie details.
   * @param tmdbId the tmdb id.
   * @param appendToResponse optional append to response
   * @param refresh refresh cache
   */
  getTmdbMovieDetails(tmdbId: number, appendToResponse?: string, refresh: boolean = false): Observable<any> {
    if (!this.tmdbMovieQuery.hasEntity(tmdbId) || refresh) {
      const url = `${this.TMDB_URL}/movie/${tmdbId}`;
      let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
      // videos, images, credits, translations, similar, external_ids, alternative_titles,recommendations
      //   keywords, reviews
      if (appendToResponse) {
        myHttpParam = myHttpParam.append(TmdbParameters.AppendToResponse, appendToResponse);
      }
      const tmdbHttpOptions = {
        headers: JSON_CONTENT_TYPE_HEADER,
        params: myHttpParam
      };
      return this.http.get<any>(url, tmdbHttpOptions).pipe(
        first(),
        map(data => {
          const store = {
            id: tmdbId,
            movie: data
          };
          this.tmdbMovieStore.add(store);
          return this.tmdbMovieQuery.getEntity(tmdbId).movie;
        }),
        catchError(this.handleError<any>('getTmdbMovieDetails2'))
      );
    }
    return of(this.tmdbMovieQuery.getEntity(tmdbId).movie);
  }

  /**
   * Searches movie from TMDB api.
   * @param val parameter map
   */
  searchTmdb(val: Map<TmdbParameters | TmdbSearchMovieParameters, any>): Observable<IRawTmdbResultObject> {
    const url = `${this.TMDB_URL}/search/movie`;
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
    myHttpParam = this.appendMappedParameters(val, myHttpParam);

    let key = '';
    for (let entry of val.entries()) {
      key += entry[0] + '_' + entry[1];
    }
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('searchTmdbMovie')));
  }

  private externalId(tmdbId: number): Observable<TMDB_External_Id> {
    const url = `${this.TMDB_URL}/movie/${tmdbId}/external_ids?api_key=${this.TMDB_API_KEY}`;
    return this.http.get<TMDB_External_Id>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getExternalId')));
  }

  getTmdbVideos(tmdbId: number): Observable<any> {
    const url = `${this.TMDB_URL}/movie/${tmdbId}/videos`;
    const myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('tmdbVideos')));
  }

  /**
   * Appends parameters list into http param object.
   * @param paramMap parameters key-value pair list
   * @param myHttpParam http param to append to
   */
  private appendMappedParameters(paramMap: Map<TmdbParameters | TmdbSearchMovieParameters, any>, myHttpParam: HttpParams) {
    for (let entry of paramMap.entries()) {
      myHttpParam = myHttpParam.append(entry[0], entry[1]);
    }
    return myHttpParam;
  }


  /**
   * Error handler.
   * @param operation the operation
   * @param result result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`TmdbService: ${message} `);
  }
}
