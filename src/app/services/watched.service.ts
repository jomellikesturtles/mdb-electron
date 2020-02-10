import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName, FirebaseOperator } from './firebase.service';

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

  saveWatchedMulti(data: object[]) {
    const list = []
    data.forEach(element => {
      list.push({ tmdbId: element })
    })
    this.firebaseService.insertIntoFirestoreMulti(CollectionName.Watched, list)
  }
}

export interface IWatched {
  tmdbId: number,
  imdbId: string,
  id: string
  timestamp?: number,
  percentage?: number
}
