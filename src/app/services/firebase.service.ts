import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators'
import { pipe } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import * as firebase from 'firebase';
import { IpcService, BookmarkChanges } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  BOOKMARK = 'BOOKMARK'
  bookmarkDeleteList = []
  bookmarkInsertList = []
  bookmarkUpdateList = []
  bookmarkList = []
  procSync = false
  db = this.angularFirestore.firestore
  batch

  constructor(
    private angularFirestore: AngularFirestore, private ipcService: IpcService,
    private auth: AngularFireAuth) { this.db = this.angularFirestore.firestore }

  onSync() {

  }

  /**
   * Syncs bookmarks to and from cloud then executing batch commit.
   */
  synchronizeBookmarks() {
    this.ipcService.getBookmarkChanges()
    // this.batch = this.db.firestore.batch()
    this.batch = this.db.batch()
    this.ipcService.bookmarkChanges.subscribe(e => {
      this.bookmarkInsertList = e.filter((v) => { v.change === BookmarkChanges.INSERT })
      this.bookmarkDeleteList = e.filter((v) => { v.change === BookmarkChanges.DELETE })
      this.bookmarkUpdateList = e.filter((v) => { v.change === BookmarkChanges.UPDATE })
      this.batch = this.db.batch()
      this.insertItemsToFirestore()
      this.deleteItemsFromFirestore()
      this.batch.commit()
    })
    // this.batch.
  }

  getItemsFromFirestore() {
    this.db.collection('bookmark').doc()
    // this.db.
    // this.db.
  }

  insertItemsToFirestore() {
    this.bookmarkInsertList.forEach(val => {
      this.db.collection('data').doc().set(val).then().catch()
    });
    // this.batch.com
  }

  deleteItemsFromFirestore() {
    // let batch = this.db.firestore.batch()
    // this.db.collection('bookmark').
    const val = this.bookmarkDeleteList
    val.forEach(element => {
      const removeBookmarkRef = this.db.collection('bookmark').where('tmdbId', '==', element.tmdbId).get().then(snapshot => {
        snapshot.forEach(e => {
          const ref = this.db.collection('bookmark').doc(e.id)
          this.batch.delete(ref);
        })
      });
      this.batch.commit()
    })
  }

  signIn(emailUsername: string, password: string) {
    const auth = this.auth.auth.signInWithEmailAndPassword(emailUsername, password).then((e) => {

      console.log(e.additionalUserInfo);
      console.log(e.credential);
      console.log(e.operationType);
      console.log(e.user);

    }).catch((e) => {
      {
        if (e.code === 'auth/user-not-found') {
          // need to login
        } else if (e.code === 'auth/wrong-password') {

        }
        console.log('in catch', e);
      }
    })
  }

  signUp(emailUsername, password) {
    const myAuth = this.auth.auth.createUserWithEmailAndPassword(emailUsername, password).then((e) => {
    }).catch((e) => {

    })
  }

}

export interface IBookmark {
  tmdbId: number,
  imdbId: string,
  userId: string,
  createTs?: Date,
  updateTs?: Date,
  change: 'add' | 'delete' | 'update',
}

/**
 * CHANGES FROM CURRENT MACHINE:
 * 1 bookmarksOrig.db
 * 2 bookmarksTemp.db
 * 3 bookmarksChanges.db
 * copy 1 and make 2
 * all changes apply to 2
 * during sync, create 3, scan diff between 1 and 2 then apply to 3
 * TODO: CHANGES FROM UPSTREAM
 */
