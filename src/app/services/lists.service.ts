import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName, FirebaseOperator, FieldName } from './firebase.service';
import { IUserSavedData } from '@models/interfaces';
import { environment } from '@environments/environment';
import { IpcOperations, IpcService, IUserDataPaginated, SubChannel } from '@services/ipc.service';
import { BffService } from './mdb-api.service';
import { MediaList } from '@models/media-list.model';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(
    private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private bffService: BffService,
    private dataService: DataService
  ) { }

  /**
   * Creates list
   * @param listObject
   * @returns
   */
  createList(listObject: MediaList): Observable<MediaList> {
    return this.dataService.postHandle(this.bffService.saveMediaList(listObject), this.ipcService.userDataNew({ subChannel: SubChannel.LIST, operation: IpcOperations.SAVE },
      listObject));
  }

  /**
   * Gets list details
   * @param listId
   * @returns
   */
  getList(listId: number | string): Observable<any> {
    return this.dataService.getHandle(null, this.ipcService.userDataNew({ subChannel: SubChannel.LIST, operation: IpcOperations.FIND_ONE },
      { _id: listId }));
    // if (environment.runConfig.firebaseMode) {
    //   return this.firebaseService.getFromFirestore(CollectionName.Watched, FieldName.TmdbId, FirebaseOperator.Equal, id);
    // } else {
    //   return this.ipcService.getMediaList(id);
    // }
  }

  /**
   * Deletes the list.
   * @param idList
   */
  deleteList(list: string): any {

    // const myFunction = environment.runConfig.firebaseMode ?
    //   this.firebaseService.getFromFirestoreMultiple(CollectionName.Watched, FieldName.TmdbId, idList) :
    // this.ipcService.getWatchedInList(idList);

    // return myFunction
  }

  /**
   * Updates the list details.
   * @param id
   * @param data
   * @returns
   */
  editListById(id: string, data: IWatched): Promise<any> {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.insertIntoFirestore(CollectionName.Watched, data);
    } else {
      return this.ipcService.saveWatched(data);
    }
  }

  /**
   * Adds or removes item from list.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  addOrRemoveItemFromList(type: 'id' | 'tmdbId', id: string | number) {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.deleteFromFirestore(CollectionName.Watched, id);
    } else {
      return this.ipcService.removeWatched(type, id);
    }
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
