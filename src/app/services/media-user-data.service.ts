import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';
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
    private ipcService: IpcService
  ) { }

  /**
   * 
   * @param mediaId 
   * @param currentUserOnly 
   */
  getMediaUserData(mediaId: string, currentUserOnly: boolean = true) {
    // this.bffService.
  }

  getReviews(mediaId: string) {

  }

  getProgress(mediaId: string) {

  }
}
