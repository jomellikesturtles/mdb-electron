import { Injectable } from '@angular/core';
import { FirebaseService, FirebaseOperator } from './firebase.service'
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
    // return bookmark;
  }

  saveBookmark(data) {
    this.firebaseService.insertIntoFirestore('bookmark', data)
  }

  saveBookmarkMulti() {

  }

  removeBookmark() {

  }
}
