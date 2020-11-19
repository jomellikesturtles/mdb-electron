import { IUserSavedData } from './../interfaces';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { FirebaseService, FirebaseOperator, CollectionName, FieldName } from './firebase.service'
import { IpcService } from './ipc.service'
import { Observable, from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  bookmarkObservable = new Observable<any>()

  constructor(
    private firebaseService: FirebaseService,
    private ipcService: IpcService) { }

  getBookmark(id) {
    return new Promise(resolve => {
    if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestore(CollectionName.Bookmark, FieldName.TmdbId, FirebaseOperator.Equal, id).then(e => {
          console.log('BOOKMARK: ', e)
          resolve(e)
        })
      } else {
        // this.ipcService.call(IPCCommand.)
      }
    })
  }

  saveBookmark(data: IBookmark): Promise<any> {
    return new Promise(resolve => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.insertIntoFirestore(CollectionName.Bookmark, data).then(e => {
          resolve(e)
        })
      } else {
        this.ipcService.saveBookmark(data).then(e => {
          resolve(e)
        })
      }
    })
  }

  /**
   * Removes bookmark.
   * @param id watched id/_id/tmdbId to remove.
   */
  removeBookmark(type: 'id' | 'tmdbId', id: string | number) {
    return new Promise(resolve => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.deleteFromFirestore(CollectionName.Bookmark, id).then(e => {
          resolve(e)
        })
      } else {
        this.ipcService.removeBookmark(type, id).then(e => {
          resolve(e)
        })
      }
    })
  }

  saveBookmarkMulti(data: object[]) {
    const list = []
    // data.forEach(element => {
    //   list.push({ tmdbId: element })
    // })
    this.firebaseService.insertIntoFirestoreMulti(CollectionName.Bookmark, data)
  }

  /**
   * Gets multiple bookmarks by list of ids.
   * @param idList list of ids to fetch.
   */
  getBookmarksInList(idList: number[]): Promise<firebase.firestore.QuerySnapshot | any> {
    console.log('getBookmarksInList...', idList);
    return new Promise((resolve, reject) => {
      const myFunction = environment.runConfig.firebaseMode ?
        this.firebaseService.getFromFirestoreMultiple(CollectionName.Bookmark, FieldName.TmdbId, idList) :
        this.ipcService.getBookmarkInList(idList);
      myFunction.then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Gets multiple bookmarks.
   */
  getBookmarksPaginated(lastVal: string | number): Promise<any> {
    console.log('getting multiplebookmarks paginated...', lastVal);
    return new Promise((resolve, reject) => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Bookmark, FieldName.TmdbId, 20, lastVal).then(value => {
          resolve(value)
        }).catch(err => {
          reject(err)
        })
      } else {
      }
    })
  }

  getBookmarksPaginatedFirstPage(): Promise<any> {
    console.log('getting multiplebookmarks FirstPage(...');
    return new Promise((resolve, reject) => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Bookmark, FieldName.TmdbId, 20).then(value => {
          resolve(value)
        }).catch(err => {
          reject(err)
        })
      } else {
      }
    })

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

  // /**
  //  * Adds bookmark for single movie.
  //  * @param val tmdb id
  //  */
  // onAddBookmarkSingle(val): void {
  //   this.ipcService.call(IPCCommand.Bookmark, [IPCCommand.Add, val])
  // }
