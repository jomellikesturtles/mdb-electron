import { Injectable } from '@angular/core';
import { IpcOperations, IpcService, IUserDataPaginated, SubChannel } from '../ipc.service';
import { MDBApiService as MDBApiService } from '../mdb-api.service';
import GeneralUtil from '@utils/general.util';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { FeatureToggleService } from '@core/services/feature-toggle.service';
import { HttpBaseService } from '@services/http-base.service';
import { ENDPOINT } from '@shared/endpoint.const';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private ipcService: IpcService,
    private bffService: MDBApiService,
    private dataService: DataService,
    private featureToggleService: FeatureToggleService,
  ) { }

  save(data: any): Observable<FavoriteResponse> {
    return this.bffService.saveFavorite(data);
    // if (!this.featureToggleService.isEnabled('springMode')) {
    //   return this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.SAVE },
    //     data, null);
    // }
    // return this.dataService.postHandle(this.bffService.saveMediaList(data), this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.SAVE },
    //   data, null));
  }

  /**
   * Removes watched.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
  */
  remove(type: 'id' | 'tmdbId', id: string | number): Observable<FavoriteResponse> {
    return this.bffService.deleteFavorite(id);
    // if (!this.featureToggleService.isEnabled('springMode')) {
    //   return this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.REMOVE },
    //     null, { tmdbId: id });
    // }
    // // return this.dataService.postHandle(this.bffService.deleteFavorite(data), this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.SAVE },
    // //   data));
    // return this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.REMOVE },
    //   null, { tmdbId: id });
  }

}

export interface FavoriteResponse {
  status: 'SAVED' | 'DELETED',
  isFavorite: boolean,
  mediaId: string;
}
