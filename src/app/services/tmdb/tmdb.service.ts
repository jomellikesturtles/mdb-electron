/**
 * TMDB Data Provider Service
 * Single source of truth for all TMDB API endpoints.
 * Returns raw TMDB data.
 */
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TmdbParameters, TmdbSearchMovieParameters, IRawTmdbResultObject } from '@models/interfaces';
import { environment } from '@environments/environment';
import { HttpBaseService } from '@services/http-base.service';
import GeneralUtil from '@utils/general.util';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({ providedIn: 'root' })
export class TmdbService {

  private readonly TMDB_API_KEY = environment.tmdb.apiKey;
  private readonly TMDB_URL = environment.tmdb.url;

  constructor(
    private httpBaseService: HttpBaseService
  ) { }

  /**
   * Gets movie details.
   */
  getTmdbMovieDetails(tmdbId: number, appendToResponse?: string): Observable<any> {
    let params = this.getBaseParams();
    if (appendToResponse) {
      params = params.append(TmdbParameters.AppendToResponse, appendToResponse);
    }
    return this.httpBaseService.get(`${this.TMDB_URL}/movie/${tmdbId}`, { params }, 'getTmdbMovieDetails');
  }

  /**
   * Gets movie credits.
   */
  getTmdbCredits(tmdbId: number): Observable<any> {
    const params = this.getBaseParams();
    return this.httpBaseService.get(`${this.TMDB_URL}/movie/${tmdbId}/credits`, { params }, 'getTmdbCredits');
  }

  /**
   * Gets movie images.
   */
  getTmdbImages(tmdbId: number): Observable<any> {
    const params = this.getBaseParams();
    return this.httpBaseService.get(`${this.TMDB_URL}/movie/${tmdbId}/images`, { params }, 'getTmdbImages');
  }

  /**
   * Gets movie videos (trailers, clips).
   */
  getTmdbVideos(tmdbId: number): Observable<any> {
    const params = this.getBaseParams();
    return this.httpBaseService.get(`${this.TMDB_URL}/movie/${tmdbId}/videos`, { params }, 'getTmdbVideos');
  }

  /**
   * Gets similar movies.
   */
  getTmdbSimilar(tmdbId: number, page: number = 1): Observable<IRawTmdbResultObject> {
    const params = this.getBaseParams().append(TmdbParameters.Page, page.toString());
    return this.httpBaseService.get(`${this.TMDB_URL}/movie/${tmdbId}/similar`, { params }, 'getTmdbSimilar');
  }

  /**
   * Gets recommended movies.
   */
  getTmdbRecommendations(tmdbId: number, page: number = 1): Observable<IRawTmdbResultObject> {
    const params = this.getBaseParams().append(TmdbParameters.Page, page.toString());
    return this.httpBaseService.get(`${this.TMDB_URL}/movie/${tmdbId}/recommendations`, { params }, 'getTmdbRecommendations');
  }

  /**
   * Gets movie reviews.
   */
  getTmdbReviews(tmdbId: number, page: number = 1): Observable<any> {
    const params = this.getBaseParams().append(TmdbParameters.Page, page.toString());
    return this.httpBaseService.get(`${this.TMDB_URL}/movie/${tmdbId}/reviews`, { params }, 'getTmdbReviews');
  }

  /**
   * Discover movies by criteria.
   */
  getTmdbDiscover(paramMap: Map<TmdbParameters, any>): Observable<IRawTmdbResultObject> {
    let params = this.getBaseParams();
    params = GeneralUtil.appendMappedParameters(paramMap, params);
    return this.httpBaseService.get(`${this.TMDB_URL}/discover/movie`, { params }, 'getTmdbDiscover');
  }

  /**
   * Search movies.
   */
  searchTmdb(paramMap: Map<TmdbParameters | TmdbSearchMovieParameters, any>): Observable<IRawTmdbResultObject> {
    let params = this.getBaseParams();
    params = GeneralUtil.appendMappedParameters(paramMap, params);
    return this.httpBaseService.get(`${this.TMDB_URL}/search/movie`, { params }, 'searchTmdb');
  }

  /**
   * Finds media by external ID (e.g., IMDB ID).
   */
  getFindMovie(id: string | number, source: string = 'imdb_id'): Observable<any> {
    const params = this.getBaseParams().append('external_source', source);
    return this.httpBaseService.get(`${this.TMDB_URL}/find/${id}`, { params }, 'getFindMovie');
  }

  /**
   * Gets external IDs for a movie.
   */
  getTmdbExternalIds(tmdbId: number): Observable<any> {
    const params = this.getBaseParams();
    return this.httpBaseService.get(`${this.TMDB_URL}/movie/${tmdbId}/external_ids`, { params }, 'getTmdbExternalIds');
  }

  /**
   * Helper to initialize base parameters with API key.
   */
  private getBaseParams(): HttpParams {
    return new HttpParams()
      .set(TmdbParameters.ApiKey, this.TMDB_API_KEY)
      .set(TmdbParameters.Language, 'en-US'); // Default language
  }
}
