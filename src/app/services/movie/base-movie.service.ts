import { TmdbParameters, TmdbSearchMovieParameters } from '@models/interfaces';
import { Store } from '@ngxs/store';
import { MDBMovie } from '@models/mdb-movie.model';
import { TMDB_External_Id } from '@models/tmdb-external-id.model';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CacheService } from '@services/cache.service';
import { IpcService } from '@services/ipc.service';
import { TmdbService } from '@services/tmdb/tmdb.service';
import { HttpBaseService } from '@services/http-base.service';

@Injectable({ providedIn: "root" })
export abstract class BaseMovieService {

  constructor(
    protected cacheService: CacheService,
    protected ipcService: IpcService,
    protected tmdbService: TmdbService,
    protected httpBaseService: HttpBaseService,
    protected store: Store
  ) { }

  protected abstract searchSubtitleById(val: string);

  /**
   * Gets IMDB id
   *
   * @param tmdbId tmdbId
   * @returns external ids
   */
  protected abstract getExternalId(tmdbId: string): Observable<TMDB_External_Id>;

  protected abstract getMovieBackdrop(val: string): Observable<any>;

  protected abstract getMoviePoster(posterLink: string);

  /**
   * Gets movie with external id.(IMDb ID, TVDB ID, facebook,twitter,instagram)
   * @param val external id
   */
  protected abstract getFindMovie(val: string | number): Observable<any>;

  /**
   * Gets related videos from TMDB.
   * @param tmdbId the tmdb id.
   */
  protected abstract getRelatedClips(tmdbId: string, refresh?: boolean): Observable<any>;
  /**
   *
   * @param id tmdbId,imdbId, etc.
   * @param appendToResponse
   * @param refresh
   * @returns
   */
  protected abstract getMovieDetails(id: number, appendToResponse?: string, refresh?: boolean): Observable<MDBMovie>;

  /**
   * Get movies discover by genre, year, etc.
   * @param val parameter map
   */
  protected abstract getMoviesDiscover(paramMap: Map<TmdbParameters, any>): Observable<any>;

  /**
   *
   * @param parameters
   * @param refresh
   * @returns
   */
  protected abstract searchMovie(parameters: Map<TmdbParameters | TmdbSearchMovieParameters, any>, refresh?: boolean): Observable<any>;

  protected abstract getSubtitleFile(filePath: string): Observable<any>;

  protected abstract getSubtitleFileString(filePath: string): Observable<any>;

  /**
   * Error handler.
   * @param operation the operation
   * @param result result
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  protected log(message: string) {
    console.log(`MovieService: ${message} `);
  }

  /**
   * Generic caching method for NGXS
   * @param selector Selector to check in store
   * @param apiCall$ API Observable to fetch if cache is empty
   * @param actionFactory Function to create action to dispatch
   * @param refresh Force refresh
   */
  protected getCachedOrFetch<T>(
    selector: any,
    apiCallFn: () => Observable<T>,
    actionFactory: (data: T) => any,
    refresh: boolean = false
  ): Observable<T> {
    const cached = this.store.selectSnapshot(selector);
    if (!cached || refresh) {
      return apiCallFn().pipe(
        tap(data => this.store.dispatch(actionFactory(data)))
      ) as Observable<T>;
    }
    return of(cached) as Observable<T>;
  }
}
