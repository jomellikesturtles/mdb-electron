import { IUserSavedData } from './../interfaces';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { FirebaseService, FirebaseOperator, CollectionName, FieldName } from './firebase.service'
import { IpcService } from './ipc.service'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  bookmarkObservable = new Observable<any>()

  constructor(
    private firebaseService: FirebaseService,
    private ipcService: IpcService) { }

  getBookmark(id) {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestore(CollectionName.Bookmark, FieldName.TmdbId, FirebaseOperator.Equal, id)
    } else {
      // this.ipcService.call(IPCCommand.)
    }
  }

  saveBookmark(data: IBookmark): Promise<any> {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.insertIntoFirestore(CollectionName.Bookmark, data)
    } else {
      return this.ipcService.saveBookmark(data)
    }
  }

  /**
   * Removes bookmark.
   * @param id watched id/_id/tmdbId to remove.
   */
  removeBookmark(type: 'id' | 'tmdbId', id: string | number) {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.deleteFromFirestore(CollectionName.Bookmark, id)
    } else {
      return this.ipcService.removeBookmark(type, id)
    }
  }

  saveBookmarkMulti(data: object[]) {
    this.firebaseService.insertIntoFirestoreMulti(CollectionName.Bookmark, data)
  }

  /**
   * Gets multiple bookmarks by list of ids.
   * @param idList list of ids to fetch.
   */
  getBookmarksInList(idList: number[]): Promise<firebase.firestore.QuerySnapshot | any> {
    console.log('getBookmarksInList...', idList);
    const myFunction = environment.runConfig.firebaseMode ?
      this.firebaseService.getFromFirestoreMultiple(CollectionName.Bookmark, FieldName.TmdbId, idList) :
      this.ipcService.getBookmarkInList(idList);
    return myFunction
  }

  getBookmarksPaginatedFirstPage(): Promise<any> {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Bookmark, FieldName.TmdbId, 20)
    } else {

    }
  }

  /**
   * Gets multiple bookmarks.
   */
  getBookmarksPaginated(lastVal: string | number): Promise<any> {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Bookmark, FieldName.TmdbId, 20, lastVal)
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
