import { Injectable } from "@angular/core";
import { IOmdbMovieDetail, IRawTmdbResultObject, TmdbParameters, TmdbSearchMovieParameters } from "@models/interfaces";
import { MDBMovie } from "@models/mdb-movie.model";
import { IMdbMoviePaginated } from "@models/media-paginated.model";
import { IMediaProgress } from "@models/media-progress";
import { TMDB_External_Id } from "@models/tmdb-external-id.model";
import { BaseMovieService } from "@services/movie/base-movie.service";
import { TEST_OMDB_MOVIE_DETAIL } from "app/mock-data";
import { Observable, catchError, map, of, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockMovieService extends BaseMovieService {
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

  getFindMovie(val: string | number): Observable<any> {
    throw new Error("Method not implemented.");
  }

  getRelatedClips(tmdbId: number, refresh?: boolean): Observable<any> {
    return of({ results: [{ type: 'trailer', key: 'I7c1etV7D7g' }] });
  }

  getMovieDetails(id: number, appendToResponse?: string, refresh?: boolean): Observable<MDBMovie> {
    return this.http.get<any>('assets/mock-responses/tmdb-movie-details.json').pipe(
      map(data => {
        return new MDBMovie(data);
      }),
      catchError(this.handleError<any>('getMovieDetails')));
  }

  getMoviesDiscover(paramMap: Map<TmdbParameters, any>, listName?: string, refresh = false): Observable<IMdbMoviePaginated> {
    return this.http.get<IRawTmdbResultObject>(`assets/mock-responses/tmdb-movie-search-result.json`).pipe(tap(_ => this.log('')),
      map((data: IRawTmdbResultObject) => {
        let newData: IMdbMoviePaginated = {
          totalPages: data.total_pages,
          page: data.page,
          totalResults: data.total_results,
          results: []
        };
        data.results.forEach(e => {
          let movie = new MDBMovie(e);
          newData.results.push(movie);
        });
        return newData;
      }),
      catchError(this.handleError<any>('getMoviesDiscover')));
  }

  searchMovie(parameters: Map<TmdbParameters | TmdbSearchMovieParameters, any>, refresh?: boolean): Observable<IRawTmdbResultObject> {
    return this.http.get<IRawTmdbResultObject>('assets/mock-responses/tmdb-movie-search-result.json');
  }

  getSubtitleFile(filePath: string): Observable<any> {
    return this.http.get<any>('file:///D:/workspaces/git_repos/mdb-electron/cameron/src/assets/Cinema%20Paradiso-English.srt');
  }
  getSubtitleFileString(filePath: string): Observable<any> {
    return of('D:/workspaces/git_repos/mdb-electron/cameron/src/assets/Cinema Paradiso-English.srt');
  }

}
