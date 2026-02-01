/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { IpcService } from '@services/ipc.service';
import { IOmdbMovieDetail, TmdbParameters, TmdbSearchMovieParameters, IRawTmdbResultObject } from '@models/interfaces';
import { OMDB_API_KEY, FANART_TV_API_KEY, OMDB_URL, FANART_TV_URL, STRING_REGEX_IMDB_ID } from '../../shared/constants';
import { TMDB_External_Id } from '@models/tmdb-external-id.model';
import { environment } from '@environments/environment';
import { MDBMovie } from '@models/mdb-movie.model';
import { BaseMovieService } from './base-movie.service';
import { IMdbMoviePaginated } from '@models/media-paginated.model';
import GeneralUtil from '@utils/general.util';
import { ITmdbVideoResult } from '@models/tmdb.model';
import { Store } from '@ngxs/store';
import { MovieState } from '../../store/movie/movie.state';
import { AddMovie, AddDiscoverMovie } from '../../store/movie/movie.actions';
import { MDBPaginatedResultModel } from './interface/movie';
import { CacheService } from '@services/cache.service';
import { TmdbService } from '@services/tmdb/tmdb.service';
import { HttpBaseService } from '@services/http-base.service';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({ providedIn: 'root' })
export class MovieService extends BaseMovieService {

  TMDB_API_KEY = environment.tmdb.apiKey;
  TMDB_URL = environment.tmdb.url;

  constructor(
    protected cacheService: CacheService,
    protected ipcService: IpcService,
    protected tmdbService: TmdbService,
    protected httpBaseService: HttpBaseService,
    private store: Store
  ) {
    super(cacheService, ipcService, tmdbService, httpBaseService);
  }

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
    return this.httpBaseService.get(url, 'getMovie').pipe(
      map(data => {
        console.log(data);
        return data;
      }),
      tap(_ => this.log(``))
    );
  }

  /**
   * most probably will not be used
   * @param val Movie title
   */
  getMovieByTitle(val: string): Observable<IOmdbMovieDetail> {
    const url = `${OMDB_URL}/?t=${val}&apikey=${OMDB_API_KEY}`;
    return this.httpBaseService.get(url, 'getMovie').pipe(tap(_ => this.log(`getMovie ${val}`)));
  }

  getImages(val: any): Observable<any> {
    const url = `${OMDB_URL}/?t=${val}&apikey=${this.TMDB_API_KEY}`;
    return this.httpBaseService.get(url, 'getMovie').pipe(tap(_ => this.log(`getMovie ${val}`)));
  }

  searchSubtitleById(val: string) {
    // insert code here
  }

  getExternalId(tmdbId: number): Observable<TMDB_External_Id> {
    return this.cacheService.get(tmdbId + '_EXTERNAL_ID', this.externalId(tmdbId));
  }

  getMovieBackdrop(val: string): Observable<any> {
    const url = `${FANART_TV_URL}/${val}?api_key=${FANART_TV_API_KEY}`;
    return this.httpBaseService.get(url, 'getMovieBackdrop').pipe(tap(_ => this.log('')));
  }

  getMoviePoster(posterLink: string) {
    const url = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/biH5hW1BRfEr13oCizuAzpdBf2l.jpg`;
    return this.httpBaseService.get(url, { observe: 'response' }, 'getposter').pipe(
      map(data => {
        console.log(data);
        return data;
      })
    );
  }

  getFindMovie(val: string | number): Observable<any> {
    return this.tmdbService.getFindMovie(val);
  }

  getRelatedClips(tmdbId: number, refresh: boolean = false): Observable<any> {
    let theFunction: Observable<any>;
    let entityId = `movie:video:${tmdbId}`;
    const cached = this.store.selectSnapshot(MovieState.getPreviewMovie(entityId));
    if (!cached || refresh) {
      if (environment.dataSource.toString() === "TMDB") {
        theFunction = this.tmdbService.getTmdbVideos(tmdbId);
      } return theFunction.pipe(
        first(),
        map(data => {
          return this.mapMovieDetails(entityId, data);
        }));
    }
    return of(cached.moviePreview);
  }

  getMovieDetails(id: number, appendToResponse?: string, refresh: boolean = false): Observable<MDBMovie> {
    const cached = this.store.selectSnapshot(MovieState.getMovie(id));
    if (!cached || refresh) {
      let theFunction: Observable<any>;
      if (environment.dataSource.toString() === "TMDB") {
        theFunction = this.tmdbService.getTmdbMovieDetails(id, appendToResponse);
      }
      return theFunction.pipe(
        first(),
        map(data => {
          return this.mapMovieDetails(id, data);
        }));
    }
    return of(cached.movie);
  }

  getMoviesDiscover(paramMap: Map<TmdbParameters, any>, listName?: string, refresh = false): Observable<IMdbMoviePaginated> {
    // let entityId = listName.toLowerCase();
    const page = paramMap.get(TmdbParameters.Page) ? paramMap.get(TmdbParameters.Page) : 1;
    let myHttpParam = new HttpParams().append(TmdbParameters.Page, page);
    myHttpParam = GeneralUtil.appendMappedParameters(paramMap, myHttpParam);
    let entityId = `movie:discover:${myHttpParam.toString()}`;
    GeneralUtil.DEBUG.log(`getMoviesDiscover entityId ${entityId}`);
    const cached = this.store.selectSnapshot(MovieState.getDiscoverMovie(entityId));

    if (!cached || refresh) {
      myHttpParam = myHttpParam.append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
      const tmdbHttpOptions = {
        headers: JSON_CONTENT_TYPE_HEADER,
        params: myHttpParam
      };
      return this.httpBaseService.get(`${this.TMDB_URL}/discover/movie`, tmdbHttpOptions, 'getMoviesDiscover').pipe(
        tap(_ => this.log('')),
        map((data: IRawTmdbResultObject) => {
          return this.mapPaginatedResult(entityId, data);
        }));
    }
    return of(cached.paginatedResult);
  }

  searchMovie(paramMap: Map<TmdbParameters | TmdbSearchMovieParameters, any>, refresh: boolean = false): Observable<any> {
    const page = paramMap.get(TmdbSearchMovieParameters.Page) ? paramMap.get(TmdbSearchMovieParameters.Page) : 1;
    let myHttpParam = new HttpParams().append(TmdbParameters.Page, page);
    myHttpParam = GeneralUtil.appendMappedParameters(paramMap, myHttpParam);
    let entityId = `movie:search:${myHttpParam.toString()}`;
    if (environment.dataSource.toString() === "TMDB") {
      GeneralUtil.DEBUG.log(`searchMovie entityId ${entityId}`);
      const cached = this.store.selectSnapshot(MovieState.getSearchMovie(entityId));
      if (!cached || refresh) {
        let theFunction: Observable<any>;
        theFunction = this.tmdbService.searchTmdb(paramMap);
        return theFunction.pipe(
          first(),
          map((data: IRawTmdbResultObject) => {
            // let res = this.mapSearchResult(data);
            // return this.mapSearchResult(data);
            return this.mapPaginatedResult(entityId, data);
          }));
      }
      return of(cached.movies);
    }
    return of([]);
  }

  getSubtitleFile(filePath: string): Observable<any> {
    return this.httpBaseService.get(filePath, { responseType: 'blob' as 'json' });
  };

  getSubtitleFileString(filePath: string): Observable<any> {
    return this.httpBaseService.get(filePath, { responseType: 'text' as 'json' });
  };

  getStreams(movieId: string, refresh: boolean = false): Observable<any> {
    const entityId = `movie:streams:${movieId}`;
    GeneralUtil.DEBUG.log(`getStreams movieId: ${movieId}`);
    const cached = this.store.selectSnapshot(MovieState.getDiscoverMovie(entityId));
    if (!cached || refresh) {
      const tmdbHttpOptions = {
        headers: JSON_CONTENT_TYPE_HEADER,
        params: new HttpParams().append(TmdbParameters.ApiKey, this.TMDB_API_KEY)
      };
      return this.httpBaseService.get(`mdb/streams/${movieId}`, tmdbHttpOptions, 'getStreams').pipe(
        tap(_ => this.log('')),
        map((data: IRawTmdbResultObject) => {
          return this.mapPaginatedResult(entityId, data);
        }));
    }
    return of(cached.paginatedResult);
  }

  private externalId(tmdbId: number): Observable<TMDB_External_Id> {
    const url = `${this.TMDB_URL}/movie/${tmdbId}/external_ids?api_key=${this.TMDB_API_KEY}`;
    return this.httpBaseService.get(url, 'getExternalId').pipe(tap(_ => this.log('')));
  }

  private mapMovieDetails(id, data): MDBMovie {
    let newData = new MDBMovie(data);
    const store = {
      id: id,
      movie: newData
    };
    this.store.dispatch(new AddMovie(store));
    return this.store.selectSnapshot(MovieState.getMovie(id)).movie;
  }

  private mapPaginatedResult(entityId: string, rawData: IRawTmdbResultObject): IMdbMoviePaginated {
    let newData: IMdbMoviePaginated = {
      totalPages: rawData.total_pages,
      page: rawData.page,
      totalResults: rawData.total_results,
      results: []
    };

    rawData.results.forEach(e => {
      let movie = new MDBMovie(e);
      newData.results.push(movie);
    });

    const store: MDBPaginatedResultModel = {
      id: entityId,
      paginatedResult: newData
    };
    this.store.dispatch(new AddDiscoverMovie(store));
    return newData;
  }
}
