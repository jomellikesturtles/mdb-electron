import { IUserSavedData } from '@models/interfaces';
import { Injectable } from '@angular/core';
import { IpcOperations, IpcService, SubChannel } from '../ipc.service';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { BffService } from '../mdb-api.service';
import { BaseBookmarkService } from './base-bookmark.service';
@Injectable({
  providedIn: 'root'
})
export class BookmarkService extends BaseBookmarkService {

  constructor(
    dataService: DataService,
    private bffService: BffService,
    private ipcService: IpcService) {
    super(
      dataService,
    );
  }

  saveBookmark(id: number): Observable<any> {
    return this.dataService.getHandle(this.bffService.saveBookmark(id), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
      { tmdbId: id }, null));
  }

  /**
   * Removes bookmark.
   * @param id watched id/_id/tmdbId to remove.
   */
  removeBookmark(type: 'id' | 'tmdbId', id: string | number): Observable<any> {
    return this.dataService.getHandle(this.bffService.deleteBookmark(id), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.REMOVE },
      null, { tmdbId: id }));
  }

  saveBookmarkMulti(data: object[]) {
    return this.dataService.getHandle(this.bffService.saveBookmark(data), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
      data, null));
  }

  /**
   * Gets multiple bookmarks.
   */
  getBookmarksPaginated(lastVal: string | number): Promise<any> {
    return null;
    // return this.dataService.getHandle(this.bffService.saveBookmark(data), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
    //   data, null));
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
