/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { first, map, tap, switchMap } from 'rxjs/operators';
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
import { AddMovie, AddDiscoverMovie, AddPreviewMovie } from '../../store/movie/movie.actions';
import { MDBPaginatedResultModel, MDBMoviePreviewModel } from './interface/movie';
import { CacheService } from '@services/cache.service';
import { TmdbService } from '@services/tmdb/tmdb.service';
import { HttpBaseService } from '@services/http-base.service';
import { DataService } from '@services/data.service';
import { TmdbMapper } from '@utils/tmdb.mapper';

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
    protected dataService: DataService,
    protected store: Store
  ) {
    super(cacheService, ipcService, tmdbService, httpBaseService, store);
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
    const entityId = `movie:video:${tmdbId}`;
    return this.getCachedOrFetch<MDBMoviePreviewModel>(
      MovieState.getPreviewMovie(entityId),
      () => {
        let fetch$: Observable<any>;
        if (this.dataService.isWebApp() || navigator.onLine) {
          fetch$ = this.tmdbService.getTmdbVideos(tmdbId);
        } else {
          // Fallback to IPC if offline
          fetch$ = from(this.ipcService.getMovieFromLibrary(tmdbId));
        }
        return fetch$.pipe(
          first(),
          map((data) => {
            return { id: entityId, moviePreview: data };
          })
        );
      },
      (data) => {
        return new AddPreviewMovie(data);
      },
      refresh
    ).pipe(
      map((res) => (res && res.moviePreview ? res.moviePreview : res))
    );
  }

  getMovieDetails(id: number, appendToResponse?: string, refresh: boolean = false): Observable<MDBMovie> {
    return this.getCachedOrFetch<any>(
      MovieState.getMovie(id),
      () => {
        let fetch$: Observable<any>;
        if (this.dataService.isWebApp() || navigator.onLine) {
          fetch$ = this.tmdbService.getTmdbMovieDetails(id, appendToResponse);
        } else {
          fetch$ = from(this.ipcService.getMovieFromLibrary(id));
        }
        return fetch$.pipe(
          first(),
          map((data) => this.mapMovieDetails(id, data))
        );
      },
      (data) => {
        return { type: "NO_OP" };
      },
      refresh
    ).pipe(
      map((res) => (res instanceof MDBMovie ? res : res && res.movie ? res.movie : res))
    );
  }

  getMoviesDiscover(
    paramMap: Map<TmdbParameters, any>,
    listName?: string,
    refresh = false
  ): Observable<IMdbMoviePaginated> {
    const page = paramMap.get(TmdbParameters.Page) ? paramMap.get(TmdbParameters.Page) : 1;
    let myHttpParam = new HttpParams().append(TmdbParameters.Page, page);
    myHttpParam = GeneralUtil.appendMappedParameters(paramMap, myHttpParam);
    const entityId = `movie:discover:${myHttpParam.toString()}`;
    GeneralUtil.DEBUG.log(`getMoviesDiscover entityId ${entityId}`);

    return this.getCachedOrFetch<any>(
      MovieState.getDiscoverMovie(entityId),
      () => {
        let fetch$: Observable<any>;
        if (this.dataService.isWebApp() || navigator.onLine) {
          fetch$ = this.tmdbService.getTmdbDiscover(paramMap);
        } else {
          // IPC Discover placeholder
          fetch$ = of({ results: [], page: 1, total_pages: 0, total_results: 0 });
        }
        return fetch$.pipe(
          map((data: IRawTmdbResultObject) => {
            return this.mapPaginatedResult(entityId, data);
          })
        );
      },
      (data) => {
        return { type: "NO_OP" };
      },
      refresh
    ).pipe(map((res) => (res && res.paginatedResult ? res.paginatedResult : res)));
  }

  searchMovie(
    paramMap: Map<TmdbParameters | TmdbSearchMovieParameters, any>,
    refresh: boolean = false
  ): Observable<any> {
    const page = paramMap.get(TmdbSearchMovieParameters.Page) ? paramMap.get(TmdbSearchMovieParameters.Page) : 1;
    let myHttpParam = new HttpParams().append(TmdbParameters.Page, page);
    myHttpParam = GeneralUtil.appendMappedParameters(paramMap, myHttpParam);
    let entityId = `movie:search:${myHttpParam.toString()}`;

    return this.getCachedOrFetch<any>(
      MovieState.getSearchMovie(entityId),
      () => {
        let fetch$: Observable<any>;
        if (this.dataService.isWebApp() || navigator.onLine) {
          fetch$ = this.tmdbService.searchTmdb(paramMap);
        } else {
          fetch$ = of({ results: [], page: 1, total_pages: 0, total_results: 0 });
        }
        return fetch$.pipe(
          first(),
          map((data: IRawTmdbResultObject) => {
            return this.mapPaginatedResult(entityId, data);
          })
        );
      },
      (data) => {
        return { type: "NO_OP" };
      },
      refresh
    ).pipe(
      map((res) => (res && res.movies ? res.movies : res))
    );
  }

  getSubtitleFile(filePath: string): Observable<any> {
    return this.httpBaseService.get(filePath, { responseType: "blob" as "json" });
  }

  getSubtitleFileString(filePath: string): Observable<any> {
    return this.httpBaseService.get(filePath, { responseType: "text" as "json" });
  }

  getStreams(movieId: string, refresh: boolean = false): Observable<any> {
    const entityId = `movie:streams:${movieId}`;
    GeneralUtil.DEBUG.log(`getStreams movieId: ${movieId}`);

    return this.getCachedOrFetch<any>(
      MovieState.getDiscoverMovie(entityId),
      () => {
        return this.httpBaseService
          .get(`mdb/v1/media/${movieId}_1/streams`, {}, "getStreams")
          .pipe(
            tap((_) => this.log("")),
            map((data: IRawTmdbResultObject) => {
              return this.mapPaginatedResult(entityId, data);
            })
          );
      },
      (data) => {
        return { type: "NO_OP" };
      },
      refresh
    ).pipe(map((res) => (res && res.paginatedResult ? res.paginatedResult : res)));
  }

  private externalId(tmdbId: number): Observable<TMDB_External_Id> {
    const url = `${this.TMDB_URL}/movie/${tmdbId}/external_ids?api_key=${this.TMDB_API_KEY}`;
    return this.httpBaseService.get(url, 'getExternalId').pipe(tap(_ => this.log('')));
  }

  private mapMovieDetails(id, data): MDBMovie {
    let newData = TmdbMapper.mapToMdbMovie(data);
    const store = {
      id: id,
      movie: newData
    };
    this.store.dispatch(new AddMovie(store));
    return this.store.selectSnapshot(MovieState.getMovie(id)).movie;
  }

  private mapPaginatedResult(entityId: string, rawData: IRawTmdbResultObject): IMdbMoviePaginated {
    let newData = TmdbMapper.mapToPaginatedResults(rawData);

    const store: MDBPaginatedResultModel = {
      id: entityId,
      paginatedResult: newData
    };
    this.store.dispatch(new AddDiscoverMovie(store));
    return newData;
  }
}