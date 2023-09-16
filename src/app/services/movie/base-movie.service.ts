import { HttpClient } from '@angular/common/http';
import { IMdbMovieDetails, IOmdbMovieDetail, IRawTmdbResultObject, TmdbParameters, TmdbSearchMovieParameters } from '@models/interfaces';
import { MDBMovie } from '@models/mdb-movie.model';
import { TMDB_External_Id } from '@models/tmdb-external-id.model';
import { Observable, of } from 'rxjs';
import { MDBMovieDiscoverQuery, MDBMovieQuery, MDBMovieSearchQuery } from './movie.query';
import { MDBMovieDiscoverStore, MDBMovieSearchStore, MDBMovieStore } from './movie.store';
import { MDBPaginatedResultModel } from './interface/movie';
import { IMdbMoviePaginated } from '@models/media-paginated.model';

export abstract class BaseMovieService {

  constructor(
    protected http: HttpClient,
    protected mdbMovieQuery: MDBMovieQuery,
    protected mdbMovieStore: MDBMovieStore,
    protected mdbMovieDiscoverQuery: MDBMovieDiscoverQuery,
    protected mdbMovieDiscoverStore: MDBMovieDiscoverStore,
    protected mdbMovieSearchQuery: MDBMovieSearchQuery,
    protected mdbMovieSearchStore: MDBMovieSearchStore
  ) { }

  /**
    * Gets movie info. First it gets from offline source,
    * if there is none, it gets from online source (OMDB)
    */
  protected abstract getMovieInfo(val: string): Observable<any>;

  protected abstract getMovieByImdbId(val: string): Observable<IOmdbMovieDetail>;

  protected abstract getImages(val: any): Observable<any>;

  protected abstract searchSubtitleById(val: string);

  /**
   * Gets IMDB id
   *
   * @param tmdbId tmdbId
   * @returns external ids
   */
  protected abstract getExternalId(tmdbId: number): Observable<TMDB_External_Id>;

  protected abstract getMovieBackdrop(val: string): Observable<any>;

  protected abstract getMoviePoster(posterLink: string);

  /**
   * Gets movie with external id.(IMDb ID, TVDB ID, facebook,twitter,instagram)
   * @param val external id
   */
  protected abstract getFindMovie(val: string | number): Observable<any>;

  /**
   * TODO: add akita caching
   * Gets related videos from TMDB.
   * @param tmdbId the tmdb id.
   */
  protected abstract getRelatedClips(tmdbId: number, refresh?: boolean): Observable<any>;
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
   * TODO: Create akita caching.
   *
   * @param parameters
   * @param refresh
   * @returns
   */
  protected abstract searchMovie(parameters: Map<TmdbParameters | TmdbSearchMovieParameters, any>, refresh?: boolean): Observable<any>;

  protected abstract getSubtitleFile(filePath: string): Observable<any>;

  protected abstract getSubtitleFileString(filePath: string): Observable<any>;

  protected mapSearchResult(data: IRawTmdbResultObject) {
    let newData = [];
    data.results.forEach(e => {
      newData.push(new MDBMovie(e));
    });
    // const store = {
    //   id: queryId,
    //   movie: newData,
    // };
    // this.mdbMovieSearchStore.add(store);
    return data;
    // return this.mdbMovieSearchQuery.getEntity(queryId).movie;
  }

  protected mapMovieDetails(id, data): MDBMovie {
    let newData = new MDBMovie(data);
    const store = {
      id: id,
      movie: newData
    };
    this.mdbMovieStore.add(store);
    return this.mdbMovieQuery.getEntity(id).movie;
  }

  protected mapPaginatedResult(entityId: string, rawData: IRawTmdbResultObject): IMdbMoviePaginated {
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
    this.mdbMovieDiscoverStore.add(store);
    return newData;
  }

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
}
