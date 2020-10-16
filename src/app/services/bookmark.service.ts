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
    if (environment.runConfig.firebaseMode) {
      return new Promise(resolve => {
        this.firebaseService.getFromFirestore(CollectionName.Bookmark, FieldName.TmdbId, FirebaseOperator.Equal, id).then(e => {
          console.log('BOOKMARK: ', e)
          // bookmarkObservable=
          resolve(e)
        })
      })
    } else {
      // this.ipcService.call(IPCCommand.)
    }
  }

  saveBookmark(data): Promise<any> {
    return new Promise(resolve => {
      this.firebaseService.insertIntoFirestore(CollectionName.Bookmark, data).then(e => {
        // this.firebaseService.insertIntoFirestore(CollectionName.Bookmark, { tmdbId: data }).then(e => {
        resolve(e)
      })
    })
  }

  /**
   * Removes bookmark.
   * @param docId bookmark id to remove.
   */
  removeBookmark(docId: string) {
    return new Promise(resolve => {
      this.firebaseService.deleteFromFirestore(CollectionName.Bookmark, docId).then(e => {
        resolve(e)
      })
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
  getBookmarksMultiple(idList: number[]): Promise<any> {
    console.log('getting multiplebookmarks multiple...', idList);
    return new Promise((resolve, reject) => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestoreMultiple(CollectionName.Bookmark, FieldName.TmdbId, idList).then(value => {
          resolve(value)
        }).catch(err => {
          reject(err)
        })
      } else {

      }
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
  id: string,
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
