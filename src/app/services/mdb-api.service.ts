/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MDB_API_URL } from '../shared/constants';
import { IProfileData } from '../models/profile-data.model';
import { IMediaList } from '@models/media-list.model';
import GeneralUtil from '@utils/general.util';
import { ENDPOINT } from '@shared/endpoint.const';
import { HttpUrlProviderService } from './http-url.provider.service';
import { LoggerService } from '@core/logger.service';

@Injectable({ providedIn: 'root' })
export class MDBApiService {

  constructor(
    private http: HttpClient,
    private httpUrlProvider: HttpUrlProviderService,
    private logger: LoggerService
  ) { }

  getMediaUserData(tmdbId: number): Observable<any> {
    return this.http.get<any>(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_ID, tmdbId)).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getMediaUserData')));
  }

  /**
   * 
   * @param tmdbIdList list of tmdbId separated by comma
   * @returns 
   */
  getMediaUserDataInList(tmdbIdList: string): Observable<any> {
    let payload = {
      idList: tmdbIdList
      // idList: tmdbIdList.join(',')
    };
    return this.http.post<any>(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_ID), payload).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getMediaUserDataInList')));
  }

  saveBookmark(bookmarkBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}/profileData/bookmark`, bookmarkBody).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('saveFavorite')));
  }

  deleteBookmark(bookmarkId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', bookmarkId);
    return this.http.delete<any>(`${MDB_API_URL}/profileData/bookmark`, { params: httpParams }).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('deleteFavorite')));
  }
  saveFavorite(favBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}/profileData/favorite`, favBody).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('saveFavorite')));
  }
  deleteFavorite(favId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', favId);
    return this.http.delete<any>(`${MDB_API_URL}/profileData/favorite`, { params: httpParams }).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('deleteFavorite')));
  }
  saveToList(listLinkMovie: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}/profileData/list/add`, listLinkMovie).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('saveFavorite')));
  }

  removeFromList(listLinkMovie: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}/profileData/list/remove`, listLinkMovie).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('saveFavorite')));
  }
  saveMediaList(listBody: IMediaList): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}/profileData/list`, listBody).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('saveList')));
  }
  saveProgress(listBody: IMediaList): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}/profileData/list`, listBody).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('saveList')));
  }
  deleteList(listId: any): Observable<any> {
    let httpParams = new HttpParams().set('id', listId);
    return this.http.delete<any>(`${MDB_API_URL}/profileData/list`, { params: httpParams }).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('deleteFavorite')));
  }
  saveWatched(watchedBody: any): Observable<any> {
    return this.http.post<any>(`${MDB_API_URL}/profileData/watched`, watchedBody).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('saveFavorite')));
  }
  deleteWatched(watchedBody: any): Observable<any> {
    return this.http.delete<any>(`${MDB_API_URL}/profileData/watched`, watchedBody).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('deleteFavorite')));
  }

  getProfileDataByTmdbId(tmdbId: number): Observable<IProfileData> {

    return this.http.get<any>(`${MDB_API_URL}/profileData/media/${tmdbId}`).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getProfileDataByTmdbId')));
  }

  getProfileDataByTmdbIdList(tmdbIdList: number[]): Observable<IProfileData[]> {

    return this.http.get<any>(`${MDB_API_URL}/profileData/media/list/${tmdbIdList}`).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getProfileDataByTmdbIdList')));
  }

  registerUser(payload: RegisterUser) {
    return this.http.post<any>(`mdb/user/register`, payload).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('registerUser')));
  }

  getProfile() {
    return this.http.get<any>(`mdb/user/profile`).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getUserProfile')));
  }

  logout() {
    return this.http.post<any>(`mdb/user/logout`, {}).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('logout')));
  }

  login(payload: LoginUser) {
    return this.http.post<any>(`mdb/user/login`, payload).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('logout')));
  }


  get(url: string) {
    return this.http.get<any>(url).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getUserProfile')));
  }

  post(url: string, payload: any) {
    return this.http.post<any>(url, payload).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getUserProfile')));
  }

  patch(url: string, payload: any) {
    return this.http.patch<any>(url, payload).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getUserProfile')));
  }

  put(url: string, payload: any) {
    return this.http.put<any>(url, payload).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getUserProfile')));
  }

  delete(url: string, payload: any) {
    return this.http.delete<any>(url, payload).pipe(tap(_ => this.logger.info('')),
      catchError(this.handleError<any>('getUserProfile')));
  }

  /**
   * Error handler.
   * @param operation the operation
   * @param result the result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      GeneralUtil.DEBUG.error(error); // log to console instead
      this.logger.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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

