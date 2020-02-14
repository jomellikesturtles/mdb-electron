import { Injectable } from '@angular/core';
import { FirebaseService, FirebaseOperator, CollectionName } from './firebase.service'
import { IpcService } from './ipc.service'
import { Observable, from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  bookmarkObservable = new Observable<any>()

  constructor(private firebaseService: FirebaseService) { }

  getBookmark(id) {
    return new Promise(resolve => {
      this.firebaseService.getFromFirestore(CollectionName.Bookmark, 'tmdbId', FirebaseOperator.Equal, id).then(e => {
        console.log('BOOKMARK: ', e)
        // bookmarkObservable=
        resolve(e)
      })
    })
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
  getBookmarksMultiple() {
    console.log('getting multiplebookmarks...');
    return new Promise(resolve => {
      this.firebaseService.getFromFirestoreMultiple(CollectionName.Bookmark, 'tmdbId', 20).then(value => {
        console.log('getBookmarksMultiple', value);
        resolve(value)
      })
    })
  }
}

  // /**
  //  * Adds bookmark for single movie.
  //  * @param val tmdb id
  //  */
  // onAddBookmarkSingle(val): void {
  //   this.ipcService.call(IpcCommand.Bookmark, [IpcCommand.Add, val])
  // }
