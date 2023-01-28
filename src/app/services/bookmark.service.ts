import { IUserSavedData } from '@models/interfaces';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { FirebaseService, FirebaseOperator, CollectionName, FieldName } from './firebase.service';
import { IpcOperations, IpcService, SubChannel } from './ipc.service';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { BffService } from './mdb-api.service';
@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  bookmarkObservable = new Observable<any>();

  constructor(
    private dataService: DataService,
    private bffService: BffService,
    private firebaseService: FirebaseService,
    private ipcService: IpcService) { }

  getBookmark(id) {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestore(CollectionName.Bookmark, FieldName.TmdbId, FirebaseOperator.Equal, id);
    } else {
      // this.ipcService.call(IPCCommand.)
    }
  }

  saveBookmark(data: IBookmark): Observable<any> {
    return this.dataService.getHandle(this.bffService.saveBookmark(data), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.SAVE },
      data, null));
  }

  /**
   * Removes bookmark.
   * @param id watched id/_id/tmdbId to remove.
   */
  removeBookmark(type: 'id' | 'tmdbId', id: string | number) {
    return this.dataService.getHandle(this.bffService.deleteBookmark(id), this.ipcService.userData({ subChannel: SubChannel.BOOKMARK, operation: IpcOperations.REMOVE },
      null));
  }

  saveBookmarkMulti(data: object[]) {
    this.firebaseService.insertIntoFirestoreMulti(CollectionName.Bookmark, data);
  }

  /**
   * Gets multiple bookmarks by list of ids.
   * @param idList list of ids to fetch.
   */
  getBookmarksInList(idList: number[]): Observable<any> {
    // console.log('getBookmarksInList...', idList);
    // const myFunction = environment.runConfig.firebaseMode ?
    //   this.firebaseService.getFromFirestoreMultiple(CollectionName.Bookmark, FieldName.TmdbId, idList) :
    //   this.ipcService.getBookmarkInList(idList);
    // return myFunction;
    // return this.dataService.getHandle(this.bffService.saveBookmark(data), this.ipcService.userData({ subChannel: SubChannel.BOOKMARKS, operation: IpcOperations.SAVE },
    //   data));
    return null;
  }

  getBookmarksPaginatedFirstPage(): Promise<any> {
    const myFunction = environment.runConfig.firebaseMode ?
      this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Bookmark, FieldName.TmdbId, 20) :
      this.ipcService.getMultiplePaginatedFirst(CollectionName.Bookmark, FieldName.TmdbId, 20);
    return myFunction;
  }

  /**
   * Gets multiple bookmarks.
   */
  getBookmarksPaginated(lastVal: string | number): Promise<any> {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Bookmark, FieldName.TmdbId, 20, lastVal);
    } else {
    }
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
