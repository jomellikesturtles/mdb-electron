import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName, FirebaseOperator, FieldName } from './firebase.service';
import { IUserSavedData } from '../interfaces';
import { environment } from 'mdb-win32-x64/resources/app/src/environments/environment';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class WatchedService {

  constructor(private firebaseService: FirebaseService,
    private ipcService: IpcService) { }

  getWatched(id): Promise<any> {
    return new Promise(resolve => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestore(CollectionName.Watched, FieldName.TmdbId, FirebaseOperator.Equal, id).then(e => {
          console.log('WATCHED: ', e)
          resolve(e)
        })
      } else {
        this.ipcService.getWatched(id).then(e => {
          resolve(e)
        })
      }
    })
  }

  /**
   * Gets multiple watched movies.
   */
  getWatchedMultiple(idList: number[]): Promise<any> {
    console.log('getting multiplewatched...', idList);
    return new Promise((resolve, reject) => {
      this.firebaseService.getFromFirestoreMultiple(CollectionName.Watched, FieldName.TmdbId, idList).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }

  saveWatched(data): Promise<any> {
    return new Promise(resolve => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.insertIntoFirestore(CollectionName.Watched, data).then(e => {
          resolve(e)
        })
      } else {
        this.ipcService.saveWatched(data).then(e => {
          resolve(e)
        })
      }
    })
  }

  /**
   * Removes watched.
   * @param docId watched id to remove.
   */
  removeWatched(docId: string) {
    if (environment.runConfig.firebaseMode) {
      return new Promise(resolve => {
        this.firebaseService.deleteFromFirestore(CollectionName.Watched, docId).then(e => {
          resolve(e)
        })
      })
    } else {

    }
  }

  saveWatchedMulti(data: object[]) {
    if (environment.runConfig.firebaseMode) {
      const list = []
      data.forEach(element => {
        list.push({ tmdbId: element })
      })
      this.firebaseService.insertIntoFirestoreMulti(CollectionName.Watched, list)
    } else {

    }
  }

  /**
   * Gets first page of list.
   */
  getWatchedPaginatedFirstPage(): Promise<any> {
    console.log('getting multiplewatched FirstPage(...');
    return new Promise((resolve, reject) => {
      this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Watched, FieldName.TmdbId, 20).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Gets multiple watched.
   * @param lastVal the last value to start with.
   */
  getWatchedPaginated(lastVal: string | number): Promise<any> {
    console.log('getting multiplewatched...', lastVal);
    return new Promise((resolve, reject) => {
      this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Watched, FieldName.TmdbId, 20, lastVal).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export interface IWatched extends IUserSavedData {
  id: string // also use in Doc Id
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  // id?: string,
  timestamp?: number,
  percentage: string,
}

// export class Watched implements IWatched {
//   tmdbId: number
//   imdbId: string
//   id: string
//   cre8Ts: number // create timestamp
//   timestamp?: number // time spent watched
//   percentage?: string // percentage from movie length

//   setTimestamp(): void {
//     this.timestamp = new Date().getTime()
//   }
// }
