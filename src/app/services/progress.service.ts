import { Injectable } from '@angular/core';
import { IUserSavedData } from '@models/interfaces';
import { IpcOperations, IpcService, IUserDataPaginated, SubChannel } from '@services/ipc.service';
import { BffService } from './mdb-api.service';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { MediaProgress } from '@models/media-progress';
import { HttpUrlProviderService } from './http-url.provider.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(
    private ipcService: IpcService,
    private bffService: BffService,
    private dataService: DataService,
    private httpUrlProvider: HttpUrlProviderService,
    private http: HttpClient
  ) { }

  /**
   * Creates list
   * @param progressBody
   * @returns
   */
  postProgress(progressBody: MediaProgress): Observable<MediaProgress> {
    return this.dataService.postHandle(
      this.http.post<any>(this.httpUrlProvider.getBffAPI('/progress'), progressBody), this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.SAVE },
        progressBody));
  }

  /**
   * Get paginated in-progress media of current user
   * @param limit
   * @param offset
   * @param sortBy
   * @param type
   */
  getProgresses(limit: number, offset: number, sortBy: string, type: string): Observable<IUserDataPaginated> {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.FIND },
      { limit, offset, sortBy, type }));
  }

  /**
   * Deletes the list.
   * @param idList
   */
  deleteProgress(listId: string): any {
    return this.dataService.deleteHandle(null, this.ipcService.userData({ subChannel: SubChannel.PROGRESS, operation: IpcOperations.REMOVE },
      { _id: listId }));
  }

  private bffPostProgress() {
    return;
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
