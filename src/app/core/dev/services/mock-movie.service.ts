import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IOmdbMovieDetail, TmdbParameters, TmdbSearchMovieParameters } from "@models/interfaces";
import { MDBMovie } from "@models/mdb-movie.model";
import { IMediaProgress } from "@models/media-progress";
import { TMDB_External_Id } from "@models/tmdb-external-id.model";
import { IUserDataPaginated } from "@services/ipc.service";
import { BaseMovieService } from "@services/movie/base-movie.service";
import { MDBMovieQuery } from "@services/movie/movie.query";
import { MDBMovieStore } from "@services/movie/movie.store";
import { TEST_OMDB_MOVIE_DETAIL, TMDB_SEARCH_RESULTS } from "app/mock-data";
import { TMDB_FULL_MOVIE_DETAILS } from "app/mock-data-movie-details";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockMovieService extends BaseMovieService {
  constructor(
    http: HttpClient,
    mdbMovieQuery: MDBMovieQuery,
    mdbMovieStore: MDBMovieStore
  ) {
    super(http,
      mdbMovieQuery,
      mdbMovieStore);
  }

  getMovieInfo(val: string): Observable<IMediaProgress> {
    throw new Error("Method not implemented.");
  }

  getMovieByImdbId(val: string): Observable<IOmdbMovieDetail> {
    return of(TEST_OMDB_MOVIE_DETAIL);
  }
  getImages(val: any): Observable<any> {
    throw new Error("Method not implemented.");
  }
  searchSubtitleById(val: string) {
    throw new Error("Method not implemented.");
  }
  getExternalId(tmdbId: number): Observable<TMDB_External_Id> {
    return of({
      id: 1234,
      imdb_id: 't232332',
      facebook_id: 'titanic',
      instagram_id: null,
      twitter_id: null
    });
  }
  getMovieBackdrop(val: string): Observable<any> {
    return of({ moviebackground: [{ url: 'https://wallpaperaccess.com/full/2745118.jpg' }] });
  }
  getMoviePoster(posterLink: string) {
    throw new Error("Method not implemented.");
  }
  getOmdbMovieDetails(imdbId: number): Observable<any> {
    throw new Error("Method not implemented.");
  }
  getFindMovie(val: string | number): Observable<any> {
    throw new Error("Method not implemented.");
  }
  getRelatedClips(tmdbId: number, refresh?: boolean): Observable<any> {
    return of({ results: [{ type: 'trailer', key: 'I7c1etV7D7g' }] });
  }
  getMovieDetails(id: number, appendToResponse?: string, refresh?: boolean): Observable<MDBMovie> {
    return of(this.mapMovieDetails(id, TMDB_FULL_MOVIE_DETAILS));
  }
  getMoviesDiscover(paramMap: Map<TmdbParameters, any>): Observable<any> {
    return of(TMDB_SEARCH_RESULTS);
  }
  searchMovie(parameters: Map<TmdbParameters | TmdbSearchMovieParameters, any>, refresh?: boolean): Observable<any> {
    return of(TMDB_SEARCH_RESULTS);
  }
  getRandomVideoClip(query: string) {
    throw new Error("Method not implemented.");
  }
  getSubtitleFile(filePath: string): Observable<any> {
    return this.http.get<any>('file:///D:/workspaces/git_repos/mdb-electron/cameron/src/assets/Cinema%20Paradiso-English.srt');
  }
  getSubtitleFileString(filePath: string): Observable<any> {
    return of('D:/workspaces/git_repos/mdb-electron/cameron/src/assets/Cinema Paradiso-English.srt');
  }

}