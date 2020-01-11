import { Injectable } from '@angular/core';
import { FirebaseService, FirebaseOperator, CollectionName } from './firebase.service'
import { IpcService } from './ipc.service'
@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  constructor(private firebaseService: FirebaseService) { }

  getBookmark(id) {
    return new Promise(resolve => {
      this.firebaseService.getFromFirestore('bookmark', 'tmdbId', FirebaseOperator.Equal, id).then(e => {
        resolve(e)
      })
    })
  }

  saveBookmark(data) {
    this.firebaseService.insertIntoFirestore(CollectionName.Bookmark, { tmdbId: data })
  }

  saveBookmarkMulti(data: object[]) {
    const list = []
    data.forEach(element => {
      list.push({ tmdbId: element })
    })
    this.firebaseService.insertIntoFirestoreMulti(CollectionName.Bookmark, list)
  }

  removeBookmark(id: number) {

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
