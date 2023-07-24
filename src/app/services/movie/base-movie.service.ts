import { HttpClient } from '@angular/common/http';
import { IOmdbMovieDetail, ITmdbResultObject, TmdbParameters, TmdbSearchMovieParameters } from '@models/interfaces';
import { MDBMovie } from '@models/mdb-movie.model';
import { TMDB_External_Id } from '@models/tmdb-external-id.model';
import { Observable } from 'rxjs';
import { MDBMovieQuery } from './movie.query';
import { MDBMovieStore } from './movie.store';

export abstract class BaseMovieService {

  constructor(
    protected http: HttpClient,
    protected mdbMovieQuery: MDBMovieQuery,
    protected mdbMovieStore: MDBMovieStore,
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
   * Gets movie details from omdb.
   * @param imdbId the imdb id.
   */
  protected abstract getOmdbMovieDetails(imdbId: number): Observable<any>;

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

  protected mapSearchResult(data: ITmdbResultObject) {
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

  protected mapMovieDetails(id, data) {
    let newData = new MDBMovie(data);
    const store = {
      id: id,
      movie: newData
    };
    this.mdbMovieStore.add(store);
    return this.mdbMovieQuery.getEntity(id).movie;
  }
}
