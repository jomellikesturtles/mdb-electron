import { Injectable } from '@angular/core';
import { IMediaProgress } from '@models/media-progress';
import { IReview } from '@models/review.model';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { IpcOperations, IpcService, SubChannel } from '../ipc.service';
import { BffService } from '../mdb-api.service';
import { BaseMediaUserDataService } from './base-media-user-data.service';

/**
 * Service for user service per media id.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaUserDataService extends BaseMediaUserDataService {

  constructor(
    dataService: DataService,
    private bffService: BffService,
    private ipcService: IpcService,
  ) {
    super(
      dataService,
    );
  }

  /**
   *
   * @param tmdbId
   * @param currentUserOnly
   */
  getMediaUserData(tmdbId: number, currentUserOnly: boolean = true) {
    return this.dataService.getHandle(this.bffService.getMediaUserData(tmdbId), this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      null, { tmdbId: tmdbId }));
  }
  getMediaUserDataMultiple(idList: string): Observable<any> {
    return this.dataService.getHandle(this.bffService.getMediaUserDataInList([123]), this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      null, { idList: idList }));
  }
  getMediaDataPaginated(type: string) {
    return null;
  }
  getMediaProgress(mediaId: number, currentUserOnly: boolean = true) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.PROGRESS, operation: IpcOperations.FIND_ONE },
      null, { tmdbId: mediaId }));
  }

  getMediaReviews(mediaId: string, currentUserOnly: boolean = true) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.REVIEW, operation: IpcOperations.FIND_ONE },
      null, { mediaId }));
  }

  putMediaProgress(progressBody: IMediaProgress) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.PROGRESS, operation: IpcOperations.SAVE },
      progressBody, null));
  }

  putMediaReview(tmdbId: number, reviewBody: IReview) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.REVIEW, operation: IpcOperations.SAVE },
      reviewBody, { tmdbId }));
  }

  putMediaFavorite(favoriteBody) {
    return this.dataService.getHandle(null, this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.SAVE },
      favoriteBody, null));
  }


}
