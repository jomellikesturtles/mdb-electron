import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName, FirebaseOperator, FieldName } from './firebase.service';
import { IUserSavedData } from '@models/interfaces';
import { environment } from '@environments/environment';
import { IpcService, IUserDataPaginated } from '@services/ipc.service';
import { BffService } from './mdb-api.service';
import { MediaList } from '@models/media-list.model';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(
    private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private bffService: BffService
  ) { }

  createList(list: MediaList) {
    this.bffService.saveMediaList(list).subscribe(e => {
      return;
    })
    this.ipcService.saveMediaList(list)
  }

  getList(id: string): Promise<any> {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.getFromFirestore(CollectionName.Watched, FieldName.TmdbId, FirebaseOperator.Equal, id)
    } else {
      return this.ipcService.getMediaList(id)
    }
  }

  /**
   * Gets multiple watched movies.
   * @param idList
   */
  deleteList(list: string): any {

    // const myFunction = environment.runConfig.firebaseMode ?
    //   this.firebaseService.getFromFirestoreMultiple(CollectionName.Watched, FieldName.TmdbId, idList) :
    // this.ipcService.getWatchedInList(idList);

    // return myFunction
  }

  editListById(id: string, data: IWatched): Promise<any> {
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
  addOrRemoveItemFromList(type: 'id' | 'tmdbId', id: string | number) {
    if (environment.runConfig.firebaseMode) {
      return this.firebaseService.deleteFromFirestore(CollectionName.Watched, id)
    } else {
      return this.ipcService.removeWatched(type, id)
    }
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
