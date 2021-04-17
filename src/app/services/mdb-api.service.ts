/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IpcService } from '../services/ipc.service';
import { STRING_REGEX_IMDB_ID, MDB_API_URL } from '../shared/constants';
import { IProfileData } from '../models/profile-data.model';

const JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' })

@Injectable({ providedIn: 'root' })
export class MdbApiService {

  constructor(
    private http: HttpClient
  ) { }

  httpParam = new HttpParams()

  saveBookmark(bookmarkBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\profileData\\bookmark`, bookmarkBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }

  deleteBookmark(bookmarkId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', bookmarkId);
    return this.http.delete<any>(`${MDB_API_URL}\\profileData\\bookmark`, { params: httpParams }).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('deleteFavorite')))
  }
  saveFavorite(favBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\profileData\\favorite`, favBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  deleteFavorite(favId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', favId);
    return this.http.delete<any>(`${MDB_API_URL}\\profileData\\favorite`, { params: httpParams }).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('deleteFavorite')))
  }
  saveToList(listLinkMovie: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\profileData\\list\\add`, listLinkMovie).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  removeFromList(listLinkMovie: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\profileData\\list\\remove`, listLinkMovie).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  saveList(listBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\profileData\\list`, listBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  deleteList(listId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', listId);
    return this.http.delete<any>(`${MDB_API_URL}\\profileData\\list`, { params: httpParams }).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('deleteFavorite')))
  }
  saveWatched(watchedBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}\\profileData\\watched`, watchedBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('saveFavorite')))
  }
  deleteWatched(watchedBody: any): Observable<any> {
    return this.http.delete<any>(`${MDB_API_URL}\\profileData\\watched`, watchedBody).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('deleteFavorite')))
  }

  getProfileDataByTmdbId(tmdbId: number): Observable<IProfileData> {

    return this.http.get<any>(`${MDB_API_URL}\\profileData\\media\\${tmdbId}`).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getProfileDataByTmdbId')))
  }

  getProfileDataByTmdbIdList(tmdbIdList: number[]): Observable<IProfileData[]> {

    return this.http.get<any>(`${MDB_API_URL}\\profileData\\media\\list\\${tmdbIdList}`).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('getProfileDataByTmdbIdList')))
  }

  registerUser(payload: RegisterUser) {
    return this.http.post<any>(`mdb/user/register`, payload).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('registerUser')))
  }

  logout() {
    return this.http.post<any>(`mdb/user/logout`, {}).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('logout')))
  }

  login(payload: LoginUser) {
    return this.http.post<any>(`mdb/user/login`, payload).pipe(tap(_ => this.log('')),
      catchError(this.handleError<any>('logout')))
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

export interface LoginUser {
  userName: string;
  password: string;
  type?: string;
  token?: string;
}
export interface RegisterUser {
  password: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  contactNumber?: string;
}
