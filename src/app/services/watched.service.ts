import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName, FirebaseOperator, FieldName } from './firebase.service';
import { IUserSavedData } from '../interfaces';
import { environment } from 'mdb-win32-x64/resources/app/src/environments/environment';
import { IpcService } from './ipc.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class WatchedService {

  constructor(private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private utilsService: UtilsService) { }

  async toggleWatched(movie) {
    let wDocId
    if (!movie.watched || !movie.watched.id) {
      const rDate = movie.release_date ? movie.release_date : movie.releaseDate
      const releaseYear = parseInt(this.utilsService.getYear(rDate), 10)
      const data: IWatched = {
        title: movie.title,
        tmdbId: movie.id ? movie.id : movie.tmdbId,
        imdbId: movie.imdbId ? movie.imdbId : '',
        year: releaseYear ? releaseYear : 0,
        percentage: 100
      }
      wDocId = await this.saveWatched(data)
      movie.watched = wDocId
    } else {
      const type = movie.watched && movie.watched.id ? 'id' : 'tmdbId'
      if (type === 'id')
        wDocId = await this.removeWatched(type, movie.watched.id)
      else
        wDocId = await this.removeWatched(type, movie.tmdbId)
      movie.watched.id = ''
    }
    return wDocId;
  }

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
   * @param idList
   */
  getWatchedInList(idList: number[]): Promise<any> {
    console.log('getWatchedInList...', idList);
    return new Promise((resolve, reject) => {

      const myFunction = environment.runConfig.firebaseMode ?
        this.firebaseService.getFromFirestoreMultiple(CollectionName.Watched, FieldName.TmdbId, idList) :
        this.ipcService.getWatchedInList(idList);

      myFunction.then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }

  saveWatched(data: IWatched): Promise<any> {
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
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  removeWatched(type: 'id' | 'tmdbId', id: string | number) {
    return new Promise(resolve => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.deleteFromFirestore(CollectionName.Watched, id).then(e => {
          resolve(e)
        })
      } else {
        this.ipcService.removeWatched(type, id).then(e => {
          resolve(e)
        })
      }
    })
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
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Watched, FieldName.TmdbId, 20).then(value => {
          resolve(value)
        }).catch(err => {
          reject(err)
        })
      } else {
        this.ipcService.getMultiplePaginatedFirst(CollectionName.Watched, FieldName.TmdbId, 20).then(value => {
          resolve(value)
        })
      }
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

  /**
   * Gets the percentage.
   * @param timestamp timestamp in seconds
   * @param length movie length in seconds
   * @returns percentage
   */
  getPercentage(timestamp: number, length: number): number {
    return (timestamp / length) * 100
  }

  /**
   * Gets the timestamp.
   * @param percentage
   * @param length movie length in seconds
   * @returns timestamp in seconds
   */
  getTimestamp(percentage: number, length: number): number {
    return (percentage / 100) * length
  }
}

export interface IWatched extends IUserSavedData {
  id?: string // also use in Doc Id
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  percentage?: number,
}
