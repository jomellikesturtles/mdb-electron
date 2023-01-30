/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { IpcService } from '@services/ipc.service';
import { IOmdbMovieDetail, TmdbParameters, OmdbParameters, TmdbSearchMovieParameters, ITmdbResultObject } from '@models/interfaces';
import { OMDB_API_KEY, TMDB_API_KEY, FANART_TV_API_KEY, OMDB_URL, TMDB_URL, FANART_TV_URL, STRING_REGEX_IMDB_ID, YOUTUBE_API_KEY } from '../../shared/constants';
import { TMDB_External_Id } from '@models/tmdb-external-id.model';
import { CacheService } from '../cache.service';
import { MDBMovieQuery, SearchMovieQuery } from './movie.query';
import { environment } from '@environments/environment';
import { MDBMovieSearchStore, MDBMovieStore } from './movie.store';
import { MDBMovie } from '@models/mdb-movie.model';
import { TmdbService } from '@services/tmdb/tmdb.service';
import { BaseMovieService } from './base-movie.service';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({ providedIn: 'root' })
export class MovieService extends BaseMovieService {

  constructor(
    http: HttpClient,
    private cacheService: CacheService,
    private ipcService: IpcService,
    mdbMovieQuery: MDBMovieQuery,
    mdbMovieStore: MDBMovieStore,
    private tmdbService: TmdbService,
  ) {
    super(http,
      mdbMovieQuery,
      mdbMovieStore);
  }

  httpParam = new HttpParams();

  getMovieInfo(val: string): Observable<any> {
    let result;
    const REGEX_IMDB_ID = new RegExp(STRING_REGEX_IMDB_ID, `gi`);
    if (val.trim().match(REGEX_IMDB_ID)) {
      result = this.getMovieByImdbId(val);
    } else {
      result = this.getMovieByTitle(val);
    }
    return result;
  }

  getMovieByImdbId(val: string): Observable<IOmdbMovieDetail> {
    const url = `${OMDB_URL}/?i=${val}&apikey=${OMDB_API_KEY}&plot=full`;
    return this.http.get<IOmdbMovieDetail>(url).pipe(
      map(data => {
        console.log(data);
        return data;
      }),
      tap(_ => this.log(``)),
      catchError(this.handleError<IOmdbMovieDetail>('getMovie')));
    // return this.http.get<OmdbMovie>(url).pipe(
    //   tap(_ => this.log(``)),
    //   catchError(this.handleError<OmdbMovie>('getMovie')))
  }

  /**
   * most probably will not be used
   * @param val Movie title
   */
  getMovieByTitle(val: string): Observable<IOmdbMovieDetail> {
    const url = `${OMDB_URL}/?t=${val}&apikey=${OMDB_API_KEY}`;
    return this.http.get<IOmdbMovieDetail>(url).pipe(tap(_ => this.log(`getMovie ${val}`)),
      catchError(this.handleError<IOmdbMovieDetail>('getMovie')));
  }

  getImages(val: any): Observable<any> {
    const url = `${OMDB_URL}/?t=${val}&apikey=${TMDB_API_KEY}`;
    return this.http.get<IOmdbMovieDetail>(url).pipe(tap(_ => this.log(`getMovie ${val}`)),
      catchError(this.handleError<IOmdbMovieDetail>('getMovie')));
  }

  searchSubtitleById(val: string) {
    // insert code here
  }

  getExternalId(tmdbId: number): Observable<TMDB_External_Id> {
    return this.cacheService.get(tmdbId + '_EXTERNAL_ID', this.externalId(tmdbId));
  }

  getMovieBackdrop(val: string): Observable<any> {
    const url = `${FANART_TV_URL}/${val}?api_key=${FANART_TV_API_KEY}`;
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMovieBackdrop')));
  }

  getMoviePoster(posterLink: string) {
    const url = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/biH5hW1BRfEr13oCizuAzpdBf2l.jpg`;
    return this.http.get<any>(url, {
      observe: 'response'
    }).pipe(map(data => {
      console.log(data);
    }, catchError(this.handleError('getposter')))
    );
  }

  getOmdbMovieDetails(imdbId: number): Observable<any> {
    const url = `${OMDB_URL}/`;
    const httpParam = new HttpParams().append(OmdbParameters.ApiKey, OMDB_API_KEY);

    const myOmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: httpParam
    };
    return this.http.get<any>(url, myOmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getOmdbMovieDetails')));
  }

  getFindMovie(val: string | number): Observable<any> {
    return this.tmdbService.getFindMovie(val);
  }

  getRelatedClips(tmdbId: number, refresh: boolean = false): Observable<any> {
    let theFunction: Observable<any>;

    // if (!this.mdbMovieQuery.hasEntity(tmdbId) || refresh) {
    if (environment.dataSource.toString() === "TMDB") {
      theFunction = this.tmdbService.getTmdbVideos(tmdbId);
    }

    // }
    return this.cacheService.get(tmdbId + '_TMDB_VIDEOS', this.tmdbService.getTmdbVideos(tmdbId));
  }


  getMovieDetails(id: number, appendToResponse?: string, refresh: boolean = false): Observable<MDBMovie> {
    let theFunction: Observable<any>;

    if (!this.mdbMovieQuery.hasEntity(id) || refresh) {
      if (environment.dataSource.toString() === "TMDB") {
        theFunction = this.tmdbService.getTmdbMovieDetails(id, appendToResponse);
      }
      return theFunction.pipe(
        first(),
        map(data => {
          return this.mapMovieDetails(id, data);
        }),
        catchError(this.handleError<any>('getMovieDetails')));
    }
    return of(this.mdbMovieQuery.getEntity(id).movie);

  }

  getMoviesDiscover(paramMap: Map<TmdbParameters, any>): Observable<any> {
    let key = '';
    for (let entry of paramMap.entries()) {
      key += entry[0] + '_' + entry[1];
    }
    return this.cacheService.get(key + '_TMDB_DISCOVER', this.movieDiscover(paramMap));
  }

  searchMovie(parameters: Map<TmdbParameters | TmdbSearchMovieParameters, any>, refresh: boolean = false): Observable<any> {
    let theFunction: Observable<any>;
    let queryId = `${parameters.get(TmdbSearchMovieParameters.Query)}_${parameters.get(TmdbSearchMovieParameters.Page)}`;
    if (environment.dataSource.toString() === "TMDB") {
      if (!this.mdbMovieQuery.hasEntity(queryId) || refresh) {
        theFunction = this.tmdbService.searchTmdb(parameters);
        return theFunction.pipe(
          first(),
          map((data: ITmdbResultObject) => {

            return this.mapSearchResult(data);

          }),
          catchError(this.handleError<any>('getMovieDetails')));
      }
    }
    // return of(this.mdbMovieSearchQuery.getEntity(id).movie);
    // return [];
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

  getRandomVideoClip(query: string) {
    const index = Math.round(Math.random() * (25));
    console.log(index);
    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
    let myHttpParam = new HttpParams().append('part', 'snippet');
    myHttpParam = myHttpParam.append('key', YOUTUBE_API_KEY);
    myHttpParam = myHttpParam.append('q', query);
    myHttpParam = myHttpParam.append('maxResults', '50');
    myHttpParam = myHttpParam.append('order', 'relevance');
    myHttpParam = myHttpParam.append('type', 'video');
    const httpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    // https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAC1kcZu_DoO7mbrMxMuCpO57iaDByGKV0&q=Toy%20Story%204%202019&maxResults=50&order=relevance&type=video
    return this.http.get<any>(baseUrl, httpOptions).pipe(map((e) => e.items));
  }

  getSubtitleFile(filePath: string): Observable<any> {
    return this.http.get<any>(filePath, { responseType: 'blob' as 'json' });
  };

  getSubtitleFileString(filePath: string): Observable<any> {
    return this.http.get<any>(filePath, { responseType: 'text' as 'json' });
  };

  private externalId(tmdbId: number): Observable<TMDB_External_Id> {
    const url = `${TMDB_URL}/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
    return this.http.get<TMDB_External_Id>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getExternalId')));
  }

  private movieDiscover(paramMap: Map<TmdbParameters, any>) {

    const url = `${TMDB_URL}/discover/movie`;
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, TMDB_API_KEY);
    myHttpParam = this.appendMappedParameters(paramMap, myHttpParam);
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.http.get<any>(url, tmdbHttpOptions).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getMoviesDiscover')));
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
    console.log(`MovieService: ${message} `);
  }
}
