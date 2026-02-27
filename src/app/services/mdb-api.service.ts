/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MDB_API_URL } from '../shared/constants';
import { IProfileData } from '../models/profile-data.model';
import { IMediaList } from '@models/media-list.model';
import { ENDPOINT } from '@shared/endpoint.const';
import { HttpUrlProviderService } from './http-url.provider.service';
import { LoggerService } from '@core/logger.service';
import { HttpBaseService } from './http-base.service';
import { FavoriteResponse } from './media/favorite.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MDBApiService {

  JSON_CONTENT_TYPE_HEADER = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private httpBaseService: HttpBaseService,
    private httpUrlProvider: HttpUrlProviderService,
    private logger: LoggerService
  ) { }

  getMediaUserData(tmdbId: string): Observable<any> {
    return this.httpBaseService.get(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_ID, tmdbId), 'getMediaUserData').pipe(
      tap(_ => this.logger.info(`getMediaUserData tmdbId=${tmdbId}`))
    );
  }

  /**
   *
   * @param tmdbIdList list of tmdbId separated by comma
   * @returns
   */
  getMediaUserDataInList(tmdbIdList: string): Observable<any> {
    let payload = {
      idList: tmdbIdList
    };
    return this.httpBaseService.post(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_ID), payload, 'getMediaUserDataInList').pipe(
      tap(_ => this.logger.info(`getMediaUserDataInList count=${tmdbIdList.length}`))
    );
  }

  saveBookmark(tmdbId: string): Observable<any> {
    return this.httpBaseService.post(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_BOOKMARK, tmdbId), 'saveBookmark').pipe(
      tap(_ => this.logger.info(`saveBookmark tmdbId=${tmdbId}`))
    );
  }

  deleteBookmark(tmdbId: string): Observable<any> {
    // HttpBaseService delete takes payload as options
    return this.httpBaseService.delete(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_BOOKMARK, tmdbId), 'deleteBookmark').pipe(
      tap(_ => this.logger.info(`deleteBookmark id=${tmdbId}`))
    );
  }

  saveFavorite(tmdbId: any): Observable<FavoriteResponse> {
    return this.httpBaseService.post(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_FAVORITE, tmdbId), tmdbId, 'saveFavorite').pipe(
      tap(_ => this.logger.info(`saveFavorite tmdbId=${tmdbId}`))
    );
  }

  deleteFavorite(tmdbId: any): Observable<FavoriteResponse> {
    return this.httpBaseService.delete(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_FAVORITE, tmdbId), 'deleteFavorite').pipe(
      tap(_ => this.logger.info(`deleteFavorite id=${tmdbId}`))
    );
  }

  saveToList(listLinkMovie: any): Observable<any> {
    return this.httpBaseService.post(`${MDB_API_URL}/profileData/list/add`, listLinkMovie, 'saveToList').pipe(
      tap(_ => this.logger.info(`saveToList listId=${listLinkMovie.listId}`))
    );
  }

  removeFromList(listLinkMovie: any): Observable<any> {
    return this.httpBaseService.post(`${MDB_API_URL}/profileData/list/remove`, listLinkMovie, 'removeFromList').pipe(
      tap(_ => this.logger.info(`removeFromList listId=${listLinkMovie.listId}`))
    );
  }

  saveMediaList(listBody: IMediaList): Observable<any> {
    return this.httpBaseService.post(`${MDB_API_URL}/profileData/list`, listBody, 'saveMediaList').pipe(
      tap(_ => this.logger.info(`saveMediaList name=${listBody.title}`))
    );
  }

  saveProgress(listBody: IMediaList): Observable<any> {
    return this.httpBaseService.post(`${MDB_API_URL}/profileData/list`, listBody, 'saveProgress').pipe(
      tap(_ => this.logger.info(`saveProgress`))
    );
  }

  deleteList(listId: any): Observable<any> {
    let params = { id: listId };
    return this.httpBaseService.delete(`${MDB_API_URL}/profileData/list`, { params: params }, 'deleteList').pipe(
      tap(_ => this.logger.info(`deleteList id=${listId}`))
    );
  }

  saveWatched(watchedBody: any): Observable<any> {
    return this.httpBaseService.post(`${MDB_API_URL}/profileData/watched`, watchedBody, 'saveWatched').pipe(
      tap(_ => this.logger.info(`saveWatched tmdbId=${watchedBody.tmdbId}`))
    );
  }

  deleteWatched(watchedBody: any): Observable<any> {
    return this.httpBaseService.delete(`${MDB_API_URL}/profileData/watched`, watchedBody, 'deleteWatched').pipe(
      tap(_ => this.logger.info(`deleteWatched`))
    );
  }

  getProfileDataByTmdbId(tmdbId: number): Observable<IProfileData> {
    return this.httpBaseService.get(`${MDB_API_URL}/profileData/media/${tmdbId}`, 'getProfileDataByTmdbId').pipe(
      tap(_ => this.logger.info(`getProfileDataByTmdbId tmdbId=${tmdbId}`))
    );
  }

  getProfileDataByTmdbIdList(tmdbIdList: number[]): Observable<IProfileData[]> {
    return this.httpBaseService.get(`${MDB_API_URL}/profileData/media/list/${tmdbIdList}`, 'getProfileDataByTmdbIdList').pipe(
      tap(_ => this.logger.info(`getProfileDataByTmdbIdList count=${tmdbIdList.length}`))
    );
  }

  registerUser(payload: RegisterUser) {
    return this.httpBaseService.post(`mdb/user/register`, payload, 'registerUser').pipe(
      tap(_ => this.logger.info(`registerUser username=${payload.userName}`))
    );
  }

  getProfile() {
    return this.httpBaseService.get(`mdb/user/profile`, 'getProfile').pipe(
      tap(_ => this.logger.info(`getProfile`))
    );
  }

  logout() {
    return this.httpBaseService.post(`mdb/user/logout`, {}, 'logout').pipe(
      tap(_ => this.logger.info(`logout`))
    );
  }

  login(payload: LoginUser) {
    return this.httpBaseService.post(`mdb/user/login`, payload, 'login').pipe(
      tap(_ => this.logger.info(`login username=${payload.userName}`))
    );
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
