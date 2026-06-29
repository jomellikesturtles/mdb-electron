import { IUserProfile } from '@models/user.model';
import { LibraryService } from '../library.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PlayedService, IPlayed } from '../media/played.service';
import { IUserDataPaginated, IpcOperations, IpcService, SubChannel } from '../ipc.service';

import { DataService } from '@services/data.service';
import { HttpUrlProviderService } from '@services/http-url.provider.service';
import { ENDPOINT } from '@shared/endpoint.const';
import { FeatureToggleService } from '@core/services/feature-toggle.service';
import { HttpBaseService } from '@services/http-base.service';
import { IBookmark } from '@services/media';

/**
 * User data only. no media.
 */
@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private dataService: DataService,
    private ipcService: IpcService,
    private httpUrlProvider: HttpUrlProviderService,
    private featureToggleService: FeatureToggleService,
    private httpBaseService: HttpBaseService
  ) { }

  getUser(username: string): Observable<IUserProfile> {
    if (!this.featureToggleService.isEnabled('springMode')) {
      return this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
        null, { tmdbId: username });
    }
    return this.dataService.getHandle(
      this.httpBaseService.get<IUserProfile>(
        this.httpUrlProvider.getBffAPI(ENDPOINT.USER_ID, username)),
      this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
        null, { tmdbId: username }) as Observable<IUserProfile>);
  }

  updateUser(username: string, payload: IUserProfile): Observable<IUserProfile> {
    if (!this.featureToggleService.isEnabled('springMode')) {
      return this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
        null, { tmdbId: username });
    }
    return this.dataService.postHandle(
      this.httpBaseService.post<IUserProfile>(
        this.httpUrlProvider.getBffAPI(ENDPOINT.USER_ID, username),
        payload),
      this.ipcService.userData({ subChannel: SubChannel.ALL, operation: IpcOperations.FIND_ONE },
        null, { tmdbId: username }));
  }


  /**
   * Sets the user data object to the
   * @param dataType the data types: bookmark, watched, video, etc.
   * @param dataDoc
   */
  private setDataObject(dataType: string, dataDoc) {
    let userData = null;
    const docData = dataDoc;
    const docDataId = dataDoc.id ? dataDoc.id : dataDoc._id;
    switch (dataType) {
      case 'bookmark':
        const bm: IBookmark = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        };
        userData = bm;
        break;
      case 'watched':
        const w: IPlayed = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        };
        w.percentage = docData.percentage ? docData.percentage : 100;
        userData = w;
        break;
      case 'library':
        const v = {
          id: docDataId,
          title: docData.title,
          year: docData.year,
          tmdbId: docData.tmdbId,
        };
        userData = v;
        break;
    }
    return userData;
  }
}

