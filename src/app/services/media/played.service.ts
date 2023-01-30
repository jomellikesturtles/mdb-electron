import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName, FirebaseOperator, FieldName } from '../firebase.service';
import { IUserSavedData } from '@models/interfaces';
import { environment } from '@environments/environment';
import { IpcOperations, IpcService, IUserDataPaginated, SubChannel } from '@services/ipc.service';
import GeneralUtil from '@utils/general.util';
import { BffService } from '../mdb-api.service';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayedService {

  constructor(private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private bffService: BffService,
    private dataService: DataService
  ) { }

  async toggleWatched(movie) {
    let wDocId;
    if (!movie.watched || !movie.watched.id) {
      const rDate = movie.release_date ? movie.release_date : movie.releaseDate;
      const releaseYear = parseInt(GeneralUtil.getYear(rDate), 10);
      const data: IWatched = {
        title: movie.title,
        tmdbId: movie.id ? movie.id : movie.tmdbId,
        imdbId: movie.imdbId ? movie.imdbId : '',
        year: releaseYear ? releaseYear : 0,
        percentage: 100
      };
      wDocId = await this.savePlayed(data);
      movie.watched = wDocId;
    } else {
      const type = movie.watched && movie.watched.id ? 'id' : 'tmdbId';
      const id = type === 'id' ? movie.watched.id : movie.tmdbId;
      wDocId = await this.removePlayed(type, id);
      movie.watched.id = '';
    }
    return wDocId;
  }

  getWatched(id): Observable<any> {
    // if (environment.runConfig.firebaseMode) {
    //   return this.firebaseService.getFromFirestore(CollectionName.Watched, FieldName.TmdbId, FirebaseOperator.Equal, id);
    // } else {
    //   return this.ipcService.getWatched(id);
    // }
    return this.dataService.getHandle(this.bffService.getMediaUserData(id), this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      { tmdbId: id }));
  }

  /**
   * Gets multiple watched movies.
   * @param idList
   */
  getPlayedInList(idList: number[]): Observable<any> {

    // const myFunction = environment.runConfig.firebaseMode ?
    //   this.firebaseService.getFromFirestoreMultiple(CollectionName.Watched, FieldName.TmdbId, idList) :
    //   this.ipcService.getWatchedInList(idList);

    // return myFunction;

    return this.dataService.getHandle(this.bffService.getMediaUserData(0), this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      { tmdbId: 0 }));
  }

  savePlayed(data: IWatched): Observable<any> {
    // if (environment.runConfig.firebaseMode) {
    //   return this.firebaseService.insertIntoFirestore(CollectionName.Watched, data)
    // } else {
    //   return this.ipcService.saveWatched(data)
    // }
    return this.dataService.getHandle(this.bffService.getMediaUserData(null), this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      { tmdbId: 0 }));
  }

  /**
   * Removes watched.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  removePlayed(type: 'id' | 'tmdbId', id: string | number) {
    // if (environment.runConfig.firebaseMode) {
    //   return this.firebaseService.deleteFromFirestore(CollectionName.Watched, id)
    // } else {
    //   return this.ipcService.removeWatched(type, id)
    // }
  }

  saveWatchedMulti(data: object[]) {
    if (environment.runConfig.firebaseMode) {
      const list = [];
      data.forEach(element => {
        list.push({ tmdbId: element });
      });
      this.firebaseService.insertIntoFirestoreMulti(CollectionName.Watched, list);
    } else {

    }
  }

  /**
   * Gets first page of list.
   */
  getWatchedPaginatedFirstPage(): Promise<IUserDataPaginated | any> {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Watched, FieldName.TmdbId, 20);
    } else {
      return this.ipcService.getMultiplePaginatedFirst(CollectionName.Watched, FieldName.TmdbId, 20);
    }
  }

  /**
   * Gets multiple watched.
   * @param lastVal the last value to start with.
   */
  getWatchedPaginated(lastVal: string | number): Promise<IUserDataPaginated | any> {
    console.log('getting multiplewatched...', lastVal);
    return this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Watched, FieldName.TmdbId, 20, lastVal);
  }

}

export interface IWatched extends IUserSavedData {
  id?: string; // also use in Doc Id
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  percentage?: number,
}
