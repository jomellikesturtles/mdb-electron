import { Injectable } from '@angular/core';
import { IMediaProgress } from '@models/media-progress';
import { IReview } from '@models/review.model';
import { Observable, of } from 'rxjs';
import { DataService } from '../data.service';
import { IpcOperations, IpcService, SubChannel } from '../ipc.service';
import { MDBApiService } from '../mdb-api.service';
import { BaseMediaUserDataService } from './base-media-user-data.service';
import { FeatureToggleService } from '@core/services/feature-toggle.service';
import { IMediaUserData } from '@core/dev/services/mock-user-data.service';
import { AuthenticationService } from '@services/authentication.service';
import { HttpBaseService } from '@services/http-base.service';
import { HttpUrlProviderService } from '@services/http-url.provider.service';
import { ENDPOINT } from '@shared/endpoint.const';

/**
 * Service for user service per media id.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaUserDataService extends BaseMediaUserDataService {

  constructor(
    dataService: DataService,
    private bffService: MDBApiService,
    private ipcService: IpcService,
    private featureToggleService: FeatureToggleService,
    private httpBaseService: HttpBaseService,
    private httpUrlProvider: HttpUrlProviderService,
    private authenticationService: AuthenticationService
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
  getMediaUserData(tmdbId: string, currentUserOnly: boolean = true): Observable<any> {
    if (!this.featureToggleService.isEnabled('springMode')) {
      return this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
        null, { tmdbId: tmdbId });
    }
    return this.dataService.getHandle(this.bffService.getMediaUserData(tmdbId), this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      null, { tmdbId: tmdbId }));
  }

  /**
   *
   * @param idList tmdbIdList
   * @returns
   */
  getMediaUserDataMultiple(idList: any[]): Observable<IMediaUserData[]> {
    if (!this.featureToggleService.isEnabled('springMode')) {
      return this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
        null, { idList: idList });
    }
    // let tmdbIdList = idList.join
    return this.dataService.getHandle(this.bffService.getMediaUserDataInList(idList), this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
      null, { idList: idList }));
  }

  getMediaDataPaginated(type: string) {
    return null;
  }

  getMediaDataPaginatedByType(
    type: string,
    offset = '0',
    limit = '20',
    orderBy = 'dateAdded',
    sortBy = 'desc'
  ) {

    const username = localStorage.getItem("user");
    if (!this.featureToggleService.isEnabled('springMode')) {
      return of([]);
    }

    const params = { offset, limit, orderBy, sortBy };
    return this.httpBaseService.get(this.httpUrlProvider.getBffAPI(ENDPOINT.USER_SPACE_TYPE, username, type), { params });

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
