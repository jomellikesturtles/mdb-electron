/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IpcService } from '../services/ipc.service';
import { STRING_REGEX_IMDB_ID, MDB_API_URL } from '../constants';
import { IUserData } from '../models/user-data.model';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' })

@Injectable({ providedIn: 'root' })
export class MdbApiService {

  constructor(
    private http: HttpClient
  ) { }

  httpParam = new HttpParams()

  saveBookmark(bookmarkBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\userData\\bookmark`, bookmarkBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }

  deleteBookmark(bookmarkId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', bookmarkId);
    return this.http.delete<any>(`${MDB_API_URL}\\userData\\bookmark`, { params: httpParams }).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('deleteFavorite')))
  }
  saveFavorite(favBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\userData\\favorite`, favBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  deleteFavorite(favId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', favId);
    return this.http.delete<any>(`${MDB_API_URL}\\userData\\favorite`, { params: httpParams }).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('deleteFavorite')))
  }
  saveToList(listLinkMovie: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\userData\\list\\add`, listLinkMovie).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  removeFromList(listLinkMovie: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\userData\\list\\remove`, listLinkMovie).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  saveList(listBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\userData\\list`, listBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  deleteList(listId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', listId);
    return this.http.delete<any>(`${MDB_API_URL}\\userData\\list`, { params: httpParams }).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('deleteFavorite')))
  }
  saveWatched(watchedBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\userData\\watched`, watchedBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  deleteWatched(watchedBody: any): Observable<any> {
    return this.http.delete<any>(`${MDB_API_URL}\\userData\\watched`, watchedBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('deleteFavorite')))
  }

  getUserDataByTmdbId(tmdbId: number): Observable<IUserData> {

    return this.http.get<any>(`${MDB_API_URL}\\userData\\media\\${tmdbId}`).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getUserDataByTmdbId')))
  }

  getUserDataByTmdbIdList(tmdbIdList: number[]): Observable<IUserData[]> {

    return this.http.get<any>(`${MDB_API_URL}\\userData\\media\\list\\${tmdbIdList}`).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getUserDataByTmdbIdList')))
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
