/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { IRawTmdbResultObject, TmdbParameters, TmdbSearchMovieParameters } from '@models/interfaces';
import { TMDB_External_Id } from '@models/tmdb-external-id.model';
import { CacheService } from '../cache.service';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });

import { environment } from '@environments/environment';
import GeneralUtil from '@utils/general.util';
import { LoggerService } from '@core/logger.service';
import { ITmdbVideoResult } from '@models/tmdb.model';
import { HttpBaseService } from '@services/http-base.service';

@Injectable({ providedIn: 'root' })
export class TmdbService {

  TMDB_API_KEY = environment.tmdb.apiKey;
  TMDB_URL = environment.tmdb.url;

  constructor(
    private httpBaseService: HttpBaseService,
    private cacheService: CacheService,
    private logger: LoggerService
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
    return this.httpBaseService.get(url, tmdbHttpOptions, 'getMoviesDiscover').pipe(
      tap(_ => this.logger.info(''))
    );
  }

  /**
   * Gets movie details.
   * @param tmdbId the tmdb id.
   * @param appendToResponse optional append to response
   * @param refresh refresh cache
   */
  getTmdbMovieDetails(tmdbId: number, appendToResponse?: string, refresh: boolean = false): Observable<any> {
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
    return this.httpBaseService.get(url, tmdbHttpOptions, 'getTmdbMovieDetails2').pipe(
      first(),
      map(data => {
        return data;
      })
    );
  }

  /**
   * Searches movie from TMDB api.
   * @param val parameter map
   */
  searchTmdb(val: Map<TmdbParameters | TmdbSearchMovieParameters, any>): Observable<IRawTmdbResultObject> {
    const url = `${this.TMDB_URL}/search/movie`;
    let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
    myHttpParam = GeneralUtil.appendMappedParameters(val, myHttpParam);

    let key = '';
    for (let entry of val.entries()) {
      key += entry[0] + '_' + entry[1];
    }
    GeneralUtil.DEBUG.log(`key ${key}`);
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.httpBaseService.get(url, tmdbHttpOptions, 'searchTmdbMovie').pipe(
      tap(_ => this.logger.info(''))
    );
  }

  private externalId(tmdbId: number): Observable<TMDB_External_Id> {
    const url = `${this.TMDB_URL}/movie/${tmdbId}/external_ids?api_key=${this.TMDB_API_KEY}`;
    return this.httpBaseService.get(url, 'getExternalId').pipe(
      tap(_ => this.logger.info(''))
    );
  }

  getTmdbVideos(tmdbId: number): Observable<ITmdbVideoResult> {
    const url = `${this.TMDB_URL}/movie/${tmdbId}/videos`;
    const myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER,
      params: myHttpParam
    };
    return this.httpBaseService.get(url, tmdbHttpOptions, 'tmdbVideos').pipe(
      tap(_ => this.logger.info(''))
    );
  }

}