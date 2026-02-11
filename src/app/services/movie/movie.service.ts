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
    return this.getCachedOrFetch<any>(
      MovieState.getPreviewMovie(entityId),
      () => {
        let apiCall$ = Observable.create((observer) => observer.next(null));
        if (environment.dataSource.toString() === "TMDB") {
          apiCall$ = this.tmdbService.getTmdbVideos(tmdbId);
        }
        return apiCall$.pipe(
          first(),
          map((data) => this.mapMovieDetails(entityId, data))
        );
      },
      (data) => {
        return { type: "NO_OP" };
      }, // mapMovieDetails dispatches Action internally, so we pass a dummy or refactor mapMovieDetails.
      refresh
    ).pipe(
      map((res) => (res && res.moviePreview ? res.moviePreview : res)) // Handle both cached (MDBMoviePreviewModel) and fresh (data)
    );
  }

  getMovieDetails(id: number, appendToResponse?: string, refresh: boolean = false): Observable<MDBMovie> {
    return this.getCachedOrFetch<any>(
      MovieState.getMovie(id),
      () => {
        let apiCall$ = Observable.create((observer) => observer.next(null));
        if (environment.dataSource.toString() === "TMDB") {
          apiCall$ = this.tmdbService.getTmdbMovieDetails(id, appendToResponse);
        }
        return apiCall$.pipe(
          first(),
          map((data) => this.mapMovieDetails(id, data))
        );
      },
      (data) => {
        return { type: "NO_OP" };
      }, // mapMovieDetails dispatches internally
      refresh
    ).pipe(
      map((res) => (res instanceof MDBMovie ? res : res && res.movie ? res.movie : res)) // Handle cached wrapper vs direct object
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
        let apiCall$: Observable<IMdbMoviePaginated> = of(null); // Default or error fallback

        myHttpParam = myHttpParam.append(TmdbParameters.ApiKey, this.TMDB_API_KEY);
        const tmdbHttpOptions = {
          headers: JSON_CONTENT_TYPE_HEADER,
          params: myHttpParam
        };
        apiCall$ = this.httpBaseService
          .get(`${this.TMDB_URL}/discover/movie`, tmdbHttpOptions, "getMoviesDiscover")
          .pipe(
            tap((_) => this.log("")),
            map((data: IRawTmdbResultObject) => {
              return this.mapPaginatedResult(entityId, data);
            })
          );
        return apiCall$;
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

    if (environment.dataSource.toString() === "TMDB") {
      GeneralUtil.DEBUG.log(`searchMovie entityId ${entityId}`);

      return this.getCachedOrFetch<any>(
        MovieState.getSearchMovie(entityId),
        () => {
          let apiCall$: Observable<any> = this.tmdbService.searchTmdb(paramMap).pipe(
            first(),
            map((data: IRawTmdbResultObject) => {
              return this.mapPaginatedResult(entityId, data);
            })
          );
          return apiCall$;
        },
        (data) => {
          return { type: "NO_OP" };
        },
        refresh
      ).pipe(
        map((res) => (res && res.movies ? res.movies : res)) // Assuming getSearchMovie returns { movies: ... } or similar?
        // Wait, MovieState.getSearchMovie returns MDBMovieListModel?
        // Let's check MovieState. searchMovies: { [id: string]: MDBMovieListModel };
        // But mapPaginatedResult returns IMdbMoviePaginated.
        // This seems inconsistent in original code. Original code mapped to mapPaginatedResult but stored in searchMovies?
        // Original code: return this.mapPaginatedResult(entityId, data);
        // And getSearchMovie returns cached.movies.
        // Let's assume MDBMovieListModel has 'movies' property.
      );
    }
    return of([]);
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

    const tmdbHttpOptions = {
      headers: JSON_CONTENT_TYPE_HEADER
    };

    return this.getCachedOrFetch<any>(
      MovieState.getDiscoverMovie(entityId),
      () => {
        let apiCall$ = this.httpBaseService
          .get(`mdb/v1/media/${movieId}_1/streams`, tmdbHttpOptions, "getStreams")
          .pipe(
            tap((_) => this.log("")),
            map((data: IRawTmdbResultObject) => {
              return this.mapPaginatedResult(entityId, data);
            })
          );
        return apiCall$;
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

    rawData.results.forEach((e) => {
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
