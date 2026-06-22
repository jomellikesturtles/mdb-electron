/**
 * Movies from and to web API and offline dump
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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
  getMediaUserDataInList(tmdbIdList: any[]): Observable<any> {
    let payload = {
      idList: tmdbIdList
    };
    return this.httpBaseService.post(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA), payload, 'getMediaUserDataInList').pipe(
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
    return this.httpBaseService.post<FavoriteResponse>(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_FAVORITE, tmdbId), { tmdbId }, 'saveFavorite').pipe(
      tap(_ => this.logger.info(`saveFavorite tmdbId=${tmdbId}`))
    );
  }

  deleteFavorite(tmdbId: any): Observable<FavoriteResponse> {
    return this.httpBaseService.delete<FavoriteResponse>(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_FAVORITE, tmdbId), {}, 'deleteFavorite').pipe(
      tap(_ => this.logger.info(`deleteFavorite id=${tmdbId}`))
    );
  }

  savePlayed(tmdbId: any): Observable<PlayedResponse> {
    return this.httpBaseService.put<PlayedResponse>(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_PLAYED, tmdbId), { tmdbId }, 'savePlayed').pipe(
      tap(_ => this.logger.info(`savePlayed tmdbId=${tmdbId}`))
    );
  }

  deletePlayed(tmdbId: any): Observable<PlayedResponse> {
    return this.httpBaseService.delete<PlayedResponse>(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_PLAYED, tmdbId), {}, 'deletePlayed').pipe(
      tap(_ => this.logger.info(`deletePlayed id=${tmdbId}`))
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

  toggleListMembership(listId: string | number, mediaId: string | number): Observable<any> {
    let url = ENDPOINT.LIST_ID_MEDIA_MEDIA_ID;
    url = url.replace('mdb_parameter_1', listId.toString());
    url = url.replace('mdb_parameter_2', mediaId.toString());
    return this.httpBaseService.post(url, {}, 'toggleListMembership').pipe(
      tap(_ => this.logger.info(`toggleListMembership listId=${listId} mediaId=${mediaId}`))
    );
  }

  getMediaLists(mediaId: string): Observable<any> {
    return this.httpBaseService.get(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_LISTS, mediaId), 'getMediaLists').pipe(
      tap(_ => this.logger.info(`getMediaLists mediaId=${mediaId}`))
    );
  }

  saveMediaList(listBody: IMediaList): Observable<any> {
    return this.httpBaseService.post(this.httpUrlProvider.getBffAPI(ENDPOINT.LIST), listBody, 'saveMediaList').pipe(
      tap(_ => this.logger.info(`saveMediaList name=${listBody.title}`))
    );
  }

  saveProgress(listBody: IMediaList): Observable<any> {
    return this.httpBaseService.post(`${MDB_API_URL}/profileData/list`, listBody, 'saveProgress').pipe(
      tap(_ => this.logger.info(`saveProgress`))
    );
  }

  deleteList(listId: any): Observable<any> {
    return this.httpBaseService.delete(this.httpUrlProvider.getBffAPI(ENDPOINT.LIST_ID, listId), {}, 'deleteList').pipe(
      tap(_ => this.logger.info(`deleteList id=${listId}`))
    );
  }

  saveWatched(watchedBody: any): Observable<any> {
    return this.httpBaseService.put(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_PLAYED, watchedBody.tmdbId), {}, 'saveWatched').pipe(
      tap(_ => this.logger.info(`saveWatched tmdbId=${watchedBody.tmdbId}`))
    );
  }

  deleteWatched(watchedBody: any): Observable<any> {
    return this.httpBaseService.delete(this.httpUrlProvider.getBffAPI(ENDPOINT.MEDIA_PLAYED, watchedBody.tmdbId), {}, 'deleteWatched').pipe(
      tap(_ => this.logger.info(`deleteWatched`))
    );
  }

  getAccount(): Observable<any> {
    return this.httpBaseService.get(ENDPOINT.ACCOUNT, 'getAccount').pipe(
      tap(_ => this.logger.info(`getAccount`))
    );
  }

  updateAccount(payload: any): Observable<any> {
    return this.httpBaseService.post(ENDPOINT.ACCOUNT, payload, 'updateAccount').pipe(
      tap(_ => this.logger.info(`updateAccount`))
    );
  }

  getIntelligence(prompt: string): Observable<any> {
    return this.httpBaseService.post(ENDPOINT.INTELLIGENCE, { prompt }, 'getIntelligence').pipe(
      tap(_ => this.logger.info(`getIntelligence prompt=${prompt}`))
    );
  }

  getProfileDataByTmdbId(tmdbId: number): Observable<IProfileData> {
    return this.httpBaseService.get(`${MDB_API_URL}/profileData/media/${tmdbId}`, 'getProfileDataByTmdbId').pipe(
      tap(_ => this.logger.info(`getProfileDataByTmdbId tmdbId=${tmdbId}`))
    );
  }

  getProfileDataByTmdbIdList(tmdbIdList: number[]): Observable<IProfileData[]> {
    return this.httpBaseService.get<IProfileData[]>(`${MDB_API_URL}/profileData/media/${tmdbIdList}`, 'getProfileDataByTmdbIdList').pipe(map(res => res as IProfileData[])).pipe(
      tap(_ => this.logger.info(`getProfileDataByTmdbIdList count=${tmdbIdList.length}`))
    );
  }

  getProfile() {
    return this.httpBaseService.get(`mdb/user/profile`, 'getProfile').pipe(
      tap(_ => this.logger.info(`getProfile`))
    );
  }

}

export interface PlayedResponse {
  status: 'SAVED' | 'DELETED',
  isPlayed: boolean,
  mediaId: string;
}
