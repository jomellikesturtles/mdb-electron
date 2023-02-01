import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName } from '../firebase.service';
import { IUserSavedData } from '@models/interfaces';
import { environment } from '@environments/environment';
import { IpcOperations, IpcService, IUserDataPaginated, SubChannel } from '@services/ipc.service';
import { BffService } from '../mdb-api.service';
import { IMediaList } from '@models/media-list.model';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { BaseListService } from './base-list.service';

@Injectable({
  providedIn: 'root'
})
export class ListsService extends BaseListService {

  constructor(
    private ipcService: IpcService,
    private bffService: BffService,
    dataService: DataService
  ) {
    super(dataService);
  }

  /**
   * Creates list
   * @param listObject
   * @returns
   */
  createList(listObject: IMediaList): Observable<IMediaList> {
    return this.dataService.postHandle(this.bffService.saveMediaList(listObject),
      this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.SAVE },
        listObject, null));
  };

  /**
   * Gets list details
   * @param listId
   * @returns
   */
  getList(listId: number | string): Observable<any> {
    return this.dataService.getHandle(null,
      this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.FIND_ONE },
        null, { _id: listId }));
  };

  /**
   *
   * @param limit
   * @param offset
   * @param sortBy
   * @param type
   */
  getLists(limit: number, offset: number, sortBy: string, type: string): Observable<IUserDataPaginated> {
    return this.dataService.getHandle(null,
      this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.FIND_ONE },
        null, { limit, offset, sortBy, type }));
  };

  /**
   * Deletes the list.
   * @param idList
   */
  deleteList(listId: string): any {
    return this.dataService.deleteHandle(null,
      this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.REMOVE },
        null, { _id: listId }));
  }


  /**
   * Updates the list details.
   * @param id
   * @param data
   * @returns
   */
  editListById(id: string, listObject: IMediaList): Observable<any> {
    return this.dataService.postHandle(this.bffService.saveMediaList(listObject),
      this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.UPDATE },
        listObject, null));
  };

  /**
   * Adds or removes item from list.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  addOrRemoveItemFromList(type: 'id' | 'tmdbId', id: string | number) {
    // if (environment.runConfig.firebaseMode) {
    //   return this.firebaseService.deleteFromFirestore(CollectionName.Watched, id);
    // } else {
    //   return this.ipcService.removeWatched(type, id);
    // }
  }

}

export interface IWatched extends IUserSavedData {
  id?: string; // also use in Doc Id
  tmdbId: number,
  imdbId?: string,
  // title: string,
  // year: number,
  percentage?: number,
}
