import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class WatchedService {

  constructor(private firebaseService: FirebaseService) { }

  saveWatchedMulti(data: object[]) {
    const list = []
    data.forEach(element => {
      list.push({ tmdbId: element })
    })
    this.firebaseService.insertIntoFirestoreMulti(CollectionName.Watched, list)
  }
}
