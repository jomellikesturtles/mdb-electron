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

  CURRENT_SUBCHANNEL = SubChannel.PLAYED;
  constructor(private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private bffService: BffService,
    private dataService: DataService
  ) { }

  getPlayed(id): Observable<any> {
    return this.dataService.getHandle(this.bffService.getMediaUserData(id), this.ipcService.userData({ subChannel: this.CURRENT_SUBCHANNEL, operation: IpcOperations.FIND_ONE },
      null, { tmdbId: id }));
  }

  /**
   * Gets multiple watched movies.
   * @param idList
   */
  getPlayedInList(idList: number[]): Observable<any> {
    return this.dataService.getHandle(this.bffService.getMediaUserData(0),
      this.ipcService.userData({ subChannel: this.CURRENT_SUBCHANNEL, operation: IpcOperations.FIND_IN_LIST },
        null, { tmdbIdList: idList }));
  }

  savePlayed(data: Object): Observable<any> {
    return this.dataService.getHandle(this.bffService.getMediaUserData(null),
      this.ipcService.userData({ subChannel: this.CURRENT_SUBCHANNEL, operation: IpcOperations.SAVE },
        data, null));
  }

  /**
   * Removes watched.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  removePlayed(type: 'id' | 'tmdbId', id: string | number) {
    return this.dataService.getHandle(this.bffService.getMediaUserData(0), this.ipcService.userData({ subChannel: this.CURRENT_SUBCHANNEL, operation: IpcOperations.REMOVE },
      null, { [type]: id }));
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
  getPlayedPaginatedFirstPage(): Promise<IUserDataPaginated | any> {
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
  getPlayedPaginated(lastVal: string | number): Promise<IUserDataPaginated | any> {
    console.log('getting multiplewatched...', lastVal);
    return this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Watched, FieldName.TmdbId, 20, lastVal);
  }

}

export interface IPlayed extends IUserSavedData {
  id?: string; // also use in Doc Id
  tmdbId: number,
  imdbId?: string,
  // title: string,
  // year: number,
  percentage?: number,
}
