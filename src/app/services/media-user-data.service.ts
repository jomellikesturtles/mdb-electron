import { Injectable } from '@angular/core';
import { MediaProgress } from '@models/media-progress';
import { IReview } from '@models/review.model';
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
    return this.dataService.getHandle(this.bffService.getMediaUserData(tmdbId), this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      { tmdbId: tmdbId }));
  }

  getMediaProgress(mediaId: number, currentUserOnly: boolean = true) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.PROGRESS, operation: IpcOperations.FIND_ONE },
      { tmdbId: mediaId }));
  }

  getMediaReviews(mediaId: string, currentUserOnly: boolean = true) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.REVIEW, operation: IpcOperations.FIND_ONE },
      null, { mediaId }));
  }

  putMediaProgress(progressBody: MediaProgress) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.PROGRESS, operation: IpcOperations.SAVE },
      progressBody));
  }

  putMediaReview(tmdbId: number, reviewBody: IReview) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.REVIEW, operation: IpcOperations.SAVE },
      reviewBody, { tmdbId }));
  }

  putMediaFavorite(favoriteBody) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.SAVE },
      favoriteBody));
  }
}
