/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of, Subscriber, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IpcService } from '../services/ipc.service';
import { MDBTorrent, IOmdbMovieDetail, IRating, TmdbParameters, OmdbParameters } from '../interfaces'
import { STRING_REGEX_IMDB_ID, MDB_API_URL } from '../constants';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' })

@Injectable({ providedIn: 'root' })
export class MdbApiService {

  constructor(
    private http: HttpClient,
    // private ipcService: IpcService
  ) { }

  httpParam = new HttpParams()

  /**
   * Gets video by id or doc id.
   */
  getVideo(tmdbId) {
    const url = `${MDB_API_URL}/video/${tmdbId}`
    // let myHttpParam = new HttpParams().append(TmdbParameters.ApiKey, TMDB_API_KEY)
    // myHttpParam = this.appendParameters(val, myHttpParam)
    // const tmdbHttpOptions = {
    //   headers: JSON_CONTENT_TYPE_HEADER,
    //   params: myHttpParam
    // };
    return this.http.get<any>(url).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('searchTmdbMovie')))
  }


  getBookmark(id) {

    return this.http.get<any>(`http:\\\\localhost:3000\\getBookmark\\${id}`).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getBookmark')))
  }

  /**
   * Error handler.
   * @param operation the operation
   * @param result the result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`MovieService: ${message} `);
  }
}
