import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { CacheService } from "@services/cache.service";
import { HttpBaseService } from "@services/http-base.service";
import { IpcService } from "@services/ipc.service";
import { TmdbService } from "@services/tmdb/tmdb.service";
import { IRawTmdbResultObject, TmdbParameters, TmdbSearchMovieParameters } from "@models/interfaces";
import { MDBMovie } from "@models/mdb-movie.model";
import { IMdbMoviePaginated } from "@models/media-paginated.model";
import { IMediaProgress } from "@models/media-progress";
import { TMDB_External_Id } from "@models/tmdb-external-id.model";
import { BaseMovieService } from "@services/movie/base-movie.service";
import { Observable, catchError, map, of, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockMovieService extends BaseMovieService {
  constructor(
    protected cacheService: CacheService,
    protected ipcService: IpcService,
    protected tmdbService: TmdbService,
    protected httpBaseService: HttpBaseService,
    protected store: Store
  ) {
    super(cacheService, ipcService, tmdbService, httpBaseService, store);
  }
  getMovieInfo(val: string): Observable<IMediaProgress> {
    throw new Error("Method not implemented.");
  }

  searchSubtitleById(val: string) {
    throw new Error("Method not implemented.");
  }
  getExternalId(tmdbId: "number"): Observable<TMDB_External_Id> {
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

  getRelatedClips(tmdbId: "number", refresh?: boolean): Observable<any> {
    return of({ results: [{ type: 'trailer', key: 'I7c1etV7D7g' }] });
  }

  getMovieDetails(id: number, appendToResponse?: string, refresh?: boolean): Observable<MDBMovie> {
    return this.httpBaseService.get('assets/mock-responses/tmdb-movie-details.json').pipe(
      map(data => {
        return new MDBMovie(data);
      }));
  }

  getMoviesDiscover(paramMap: Map<TmdbParameters, any>, listName?: string, refresh = false): Observable<IMdbMoviePaginated> {
    return this.httpBaseService.get(`assets/mock-responses/tmdb-movie-search-result.json`).pipe(tap(_ => this.log('')),
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
      }));
  }

  searchMovie(parameters: Map<TmdbParameters | TmdbSearchMovieParameters, any>, refresh?: boolean): Observable<IRawTmdbResultObject> {
    return this.httpBaseService.get('assets/mock-responses/tmdb-movie-search-result.json');
  }

  getSubtitleFile(filePath: string): Observable<any> {
    return this.httpBaseService.get('file:///D:/workspaces/git_repos/mdb-electron/cameron/src/assets/Cinema%20Paradiso-English.srt');
  }
  getSubtitleFileString(filePath: string): Observable<any> {
    return of('D:/workspaces/git_repos/mdb-electron/cameron/src/assets/Cinema Paradiso-English.srt');
  }

}
