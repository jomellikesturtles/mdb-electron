import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators'
import { pipe, Observable } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, } from '@angular/fire/firestore'
import * as firebase from 'firebase';
import { IpcService, BookmarkChanges, IpcCommand } from './ipc.service';
import { Select, Store } from '@ngxs/store';
import { UserState } from '../app.state';
import { RemoveUser } from '../app.actions';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // @Select(UserState) user$: Observable<any>

  BOOKMARK = 'BOOKMARK'
  bookmarkDeleteList = []
  bookmarkInsertList = []
  bookmarkUpdateList = []
  bookmarkList = []
  procSync = false
  db = this.angularFirestore.firestore
  batch

  constructor(
    private angularFirestore: AngularFirestore,
    private ipcService: IpcService,
    private auth: AngularFireAuth,
    private store: Store
  ) { this.db = this.angularFirestore.firestore }

  onSync() {

  }

  /**
   * Syncs bookmarks to and from cloud then executing batch commit.
   */
  synchronizeBookmarks() {
    this.ipcService.call(IpcCommand.GetBookmarkChanges)
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
  }

  /**
   * Gets item from firestore.
   * @param collection name of collection
   * @param columnName name of column
   * @param operator firebase operator
   * @param value value to compare
   */
  getFromFirestore(collection: string, columnName: string, operator: FirebaseOperator, value: any) {
    return new Promise(resolve => {
      this.db.collection(collection).where(columnName, operator, value).get().then((snapshot) => {
        console.log('SNAPSHOT: ', snapshot);
        if (!snapshot.empty) {
          const user = snapshot.docs[0]
          console.log('snapshot.docs[0]', user);
        }
        console.log('snapshot.docs[0].data', snapshot.docs[0].data());
        resolve(snapshot.docs[0].data())
      }).catch(err => {
        console.log('Error getting document', err);
      });
    })
  }

  getFromFirestoreMultiple(collectionName: CollectionName, order: string, limit: number) {
    const resultList = []
    return new Promise(resolve => {
      this.db.collection(collectionName).orderBy(order).limit(limit).get().then(snapshot => {
        snapshot.docs.forEach(element => {
          console.log('getFromFirestoreMultiple single:', element.data())
          resultList.push(element.data())
        })
        resolve(resultList)
      })
    })
  }

  /**
   * Inserts data into firestore.
   * @param collection name of the collection
   * @param data data to insert/add
   */
  insertIntoFirestore(collection: CollectionName, data: object) {
    this.db.collection(collection).add(data).then(e => {
      console.log(e);
    })
  }

  /**
   * Inserts data into firestore.
   * @param collectionName name of the collection
   * @param data data to insert/add
   */
  insertIntoFirestoreMulti(collectionName: CollectionName, data: object[]) {
    const myBatch = this.db.batch()
    data.forEach(element => {
      const bookmarkRef = this.db.collection(collectionName).doc();
      myBatch.set(bookmarkRef, element)
    })
    myBatch.commit()
  }

  insertItemsToFirestore() {
    this.bookmarkInsertList.forEach(val => {
      this.db.collection('data').doc().set(val).then().catch()
    })
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

  signInWithGoogle(provider) {
    this.auth.auth.signInWithPopup(provider).then((e) => {
      console.log(e)
      localStorage.setItem('user', JSON.stringify(e.user))
    }).catch(function (e) {
      {
        console.log('in catch', e);
      }
    })
  }

  signUp(emailUsername, password) {
    const myAuth = this.auth.auth.createUserWithEmailAndPassword(emailUsername, password).then((e) => {
    }).catch((e) => {

    })
  }

  signOut() {
    // return new Promise(resolve => {
    this.auth.auth.signOut().then(e => {
      console.log(e);
      this.store.dispatch(new RemoveUser(e))
      // resolve(e)
    }).catch(e => {
      console.log(e);
    })
    // })
  }

  getUser() {
    return new Promise(resolve => {
      this.auth.user.subscribe(e => {
        console.log('the user', e);
        resolve(e)
      })
    })
  }

}

export enum FirebaseOperator {
  Equal = '==',
  LessThan = '<',
  LessThanEqual = '<=',
  GreaterThan = '>',
  GreaterThanEqual = '>=',
  ArrayContains = 'array-contains',
  In = 'in',
  ArrayContinsAny = 'array-contains-any'
  // <, <=, ==, >, >=, array - contains, in, or array - contains - any
}
export enum CollectionName {
  Bookmark = 'bookmark',
  UserName = '',
  Watched = 'watched',
}

export enum ColumnName {
  Bookmark = 'bookmark',
  UserName = ''
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
