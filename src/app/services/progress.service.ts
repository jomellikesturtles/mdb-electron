import { Injectable } from '@angular/core';
import { IpcOperations, IpcService, IUserDataPaginated, SubChannel } from '@services/ipc.service';
import { MDBApiService } from './mdb-api.service';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { IMediaProgress } from '@models/media-progress';
import { HttpUrlProviderService } from './http-url.provider.service';
import { HttpClient } from '@angular/common/http';
import { BaseProgressService } from './media/base-progress.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService extends BaseProgressService {

  constructor(
    private ipcService: IpcService,
    private bffService: MDBApiService,
    dataService: DataService,
    private httpUrlProvider: HttpUrlProviderService,
    private http: HttpClient
  ) { super(dataService); }

  /**
   * Creates list
   * @param progressBody
   * @returns
   */
  postProgress(progressBody: IMediaProgress): Observable<IMediaProgress> {
    return this.dataService.postHandle(
      this.http.post<any>(this.httpUrlProvider.getBffAPI('/progress'), progressBody), this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.SAVE },
        progressBody, null));
  }

  /**
   * Get paginated in-progress media of current user
   * @param limit
   * @param offset
   * @param sortBy
   * @param type
   */
  getProgressesMultiple(limit: number, offset: number, sortBy: string, type: string): Observable<IUserDataPaginated> {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.LIST, operation: IpcOperations.FIND }, null,
      { limit, offset, sortBy, type }));
  }

  /**
   * Deletes the list.
   * @param idList
   */
  deleteProgress(listId: string): any {
    return this.dataService.deleteHandle(null, this.ipcService.userData({ subChannel: SubChannel.PROGRESS, operation: IpcOperations.REMOVE }, null,
      { _id: listId }));
  }

}
