import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName, FirebaseOperator, FieldName } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class WatchedService {

  constructor(private firebaseService: FirebaseService) { }

  getWatched(id) {
    return new Promise(resolve => {
      this.firebaseService.getFromFirestore(CollectionName.Watched, 'tmdbId', FirebaseOperator.Equal, id).then(e => {
        console.log('WATCHED: ', e)
        resolve(e)
      })
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

  saveWatched(data) {
    return new Promise(resolve => {
      this.firebaseService.insertIntoFirestore(CollectionName.Watched, data).then(e => {
        resolve(e)
      })
    })
  }

  saveWatchedMulti(data: object[]) {
    const list = []
    data.forEach(element => {
      list.push({ tmdbId: element })
    })
    this.firebaseService.insertIntoFirestoreMulti(CollectionName.Watched, list)
  }
}

export interface IWatched {
  tmdbId?: number,
  watchedDocId?: string,
  imdbId?: string,
  title?: string,
  year?: number,
  id?: string,
  cre8Ts?: number, // create timestamp
  timestamp?: number,
  percentage?: string,

  // getTmdbId(): number,
  // setTmdbId(): void,
  // getImdbId(): string,
  // setImdbId(): void
  // getId(): string,
  // setId(): void,
  // getTimestamp(): number,
  // setTimestamp(): void,
  // getPercentage(): string,
  // setPercentage(): void,
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
