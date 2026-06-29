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

  save(id: string): Observable<BookmarkResponse> {
    return this.bffService.saveBookmark(id);
    // if (!this.featureToggleService.isEnabled('springMode')) {
    //   return this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
    //     { tmdbId: id }, null);
    // }
    // return this.dataService.getHandle(this.bffService.saveBookmark(id), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
    //   { tmdbId: id }, null));
  }

  remove(id: string): Observable<BookmarkResponse> {
    return this.bffService.deleteBookmark(id);
    // if (!this.featureToggleService.isEnabled('springMode')) {
    //   return this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.REMOVE },
    //     null, { tmdbId: id });
    // }
    // return this.dataService.getHandle(this.bffService.deleteBookmark(id), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.REMOVE },
    //   null, { tmdbId: id }));
  }

  saveBookmarkMulti(data: object[]) {
    if (!this.featureToggleService.isEnabled('springMode')) {
      return this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
        data, null);
    }
    return null;
    // return this.dataService.getHandle(this.bffService.saveBookmark(data), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
    //   data, null));
  }

  /**
   * Gets multiple bookmarks.
   */
  getBookmarksPaginated(lastVal: string | number): Promise<any> {
    return this.ipcService.getMultiplePaginated(CollectionName.Bookmark, FieldName.TmdbId, 20, lastVal);
  }

}

export interface BookmarkResponse {
  status: 'SAVED' | 'DELETED',
  isBookmark: boolean,
  mediaId: string;
}
