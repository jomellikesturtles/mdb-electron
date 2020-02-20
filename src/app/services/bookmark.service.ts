import { Injectable } from '@angular/core';
import { FirebaseService, FirebaseOperator, CollectionName, FieldName } from './firebase.service'
import { IpcService, IpcCommand } from './ipc.service'
import { Observable, from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  bookmarkObservable = new Observable<any>()
  isFirebaseMode = false
  constructor(
    private firebaseService: FirebaseService,
    private ipcService: IpcService) { }

  getBookmark(id) {
    if (this.isFirebaseMode === true) {
      return new Promise(resolve => {
        this.firebaseService.getFromFirestore(CollectionName.Bookmark, 'tmdbId', FirebaseOperator.Equal, id).then(e => {
          console.log('BOOKMARK: ', e)
          // bookmarkObservable=
          resolve(e)
        })
      })
    } else {
      // this.ipcService.call(IpcCommand.)
    }
  }

  saveBookmark(data) {
    return new Promise(resolve => {
      this.firebaseService.insertIntoFirestore(CollectionName.Bookmark, data).then(e => {
        // this.firebaseService.insertIntoFirestore(CollectionName.Bookmark, { tmdbId: data }).then(e => {
        resolve(e)
      })
    })
  }

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
   * Gets multiple bookmarks.
   */
  getBookmarksMultiple(idList: number[]): Promise<any> {
    console.log('getting multiplebookmarks...', idList);
    return new Promise((resolve, reject) => {
      this.firebaseService.getFromFirestoreMultiple(CollectionName.Bookmark, FieldName.TmdbId, idList).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export interface IBookmark {
  bookmarkDocId: string,
  tmdbId: number,
  title: string,
  year: number,
  cr8Ts?: number,
}

  // /**
  //  * Adds bookmark for single movie.
  //  * @param val tmdb id
  //  */
  // onAddBookmarkSingle(val): void {
  //   this.ipcService.call(IpcCommand.Bookmark, [IpcCommand.Add, val])
  // }
