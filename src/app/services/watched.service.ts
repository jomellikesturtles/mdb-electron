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
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestore(CollectionName.Watched, FieldName.TmdbId, FirebaseOperator.Equal, id)
    } else {
      return this.ipcService.getWatched(id)
    }
  }

  /**
   * Gets multiple watched movies.
   * @param idList
   */
  getWatchedInList(idList: number[]): Promise<any> {

    const myFunction = environment.runConfig.firebaseMode ?
      this.firebaseService.getFromFirestoreMultiple(CollectionName.Watched, FieldName.TmdbId, idList) :
      this.ipcService.getWatchedInList(idList);

    return myFunction
  }

  saveWatched(data: IWatched): Promise<any> {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.insertIntoFirestore(CollectionName.Watched, data)
    } else {
      return this.ipcService.saveWatched(data)
    }
  }

  /**
   * Removes watched.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  removeWatched(type: 'id' | 'tmdbId', id: string | number) {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.deleteFromFirestore(CollectionName.Watched, id)
    } else {
      return this.ipcService.removeWatched(type, id)
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
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Watched, FieldName.TmdbId, 20)
    } else {
      return this.ipcService.getMultiplePaginatedFirst(CollectionName.Watched, FieldName.TmdbId, 20)
    }
  }

  /**
   * Gets multiple watched.
   * @param lastVal the last value to start with.
   */
  getWatchedPaginated(lastVal: string | number): Promise<any> {
    console.log('getting multiplewatched...', lastVal);
    return this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Watched, FieldName.TmdbId, 20, lastVal)
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
