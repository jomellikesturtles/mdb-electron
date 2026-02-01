import { IUserSavedData } from '@models/interfaces';
import { Injectable } from '@angular/core';
import { IpcOperations, IpcService, SubChannel } from '../ipc.service';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { MDBApiService } from '../mdb-api.service';
import { BaseBookmarkService } from './base-bookmark.service';
import { FeatureToggleService } from '@core/services/feature-toggle.service';
import { CollectionName, FieldName } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService extends BaseBookmarkService {

  constructor(
    dataService: DataService,
    private bffService: MDBApiService,
    private ipcService: IpcService,
    private featureToggleService: FeatureToggleService
  ) {
    super(
      dataService,
    );
  }

  saveBookmark(id: number): Observable<any> {
    if (!this.featureToggleService.isEnabled('springMode')) {
      return this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
        { tmdbId: id }, null);
    }
    return this.dataService.getHandle(this.bffService.saveBookmark(id), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
      { tmdbId: id }, null));
  }

  /**
   * Removes bookmark.
   * @param id watched id/_id/tmdbId to remove.
   */
  removeBookmark(type: 'id' | 'tmdbId', id: string | number): Observable<any> {
    if (!this.featureToggleService.isEnabled('springMode')) {
      return this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.REMOVE },
        null, { tmdbId: id });
    }
    return this.dataService.getHandle(this.bffService.deleteBookmark(id), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.REMOVE },
      null, { tmdbId: id }));
  }

  saveBookmarkMulti(data: object[]) {
    if (!this.featureToggleService.isEnabled('springMode')) {
      return this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
        data, null);
    }
    return this.dataService.getHandle(this.bffService.saveBookmark(data), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
      data, null));
  }

  /**
   * Gets first page of bookmarks.
   */
  getBookmarksPaginatedFirstPage(): Promise<any> {
    return this.ipcService.getMultiplePaginatedFirst(CollectionName.Bookmark, FieldName.TmdbId, 20);
  }

  /**
   * Gets multiple bookmarks.
   */
  getBookmarksPaginated(lastVal: string | number): Promise<any> {
    return this.ipcService.getMultiplePaginated(CollectionName.Bookmark, FieldName.TmdbId, 20, lastVal);
  }

}

export interface IBookmark extends IUserSavedData {
  id?: string,
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  cr8Ts?: number,
}
