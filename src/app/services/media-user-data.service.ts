import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { IpcOperations, IpcService, SubChannel } from './ipc.service';
import { BffService } from './mdb-api.service';

/**
 * Service for user service per media id.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaUserDataService {

  constructor(
    private bffService: BffService,
    private ipcService: IpcService,
    private dataService: DataService
  ) { }

  /**
   *
   * @param tmdbId
   * @param currentUserOnly
   */
  getMediaUserData(tmdbId: number, currentUserOnly: boolean = true) {
    return this.dataService.getHandle(this.bffService.getMediaUserData(tmdbId), this.ipcService.userDataNew({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      { tmdbId: tmdbId }));
  }

  getReviews(mediaId: string) {

  }

  getProgress(mediaId: string) {

  }
}
