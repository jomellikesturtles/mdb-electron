import { Injectable } from "@angular/core";
import { FeatureToggleService } from "@core/services/feature-toggle.service";
import { IMediaList } from "@models/media-list.model";
import { DataService } from "@services/data.service";
import { IpcService, IUserDataPaginated } from "@services/ipc.service";
import { MDBApiService } from "@services/mdb-api.service";
import { BaseFavoriteService } from "@services/media/base-favorite.service";
import { FavoriteResponse, FavoriteService } from "@services/media/favorite.service";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockFavoriteService extends FavoriteService {
  constructor(
    ipcService: IpcService,
    bffService: MDBApiService,
    dataService: DataService,
    featureToggleService: FeatureToggleService,
  ) {
    super(ipcService,
      bffService,
      dataService,
      featureToggleService);
  }

  // toggleFavorite(movie: any) {
  //   throw new Error("Method not implemented.");
  // }
  save(data: any): Observable<FavoriteResponse> {
    return of({
      status: 'SAVED',
      isFavorite: true,
      mediaId: data.tmdbId.toString()
    });
  }

  remove(id: string | number): Observable<FavoriteResponse> {
    return of({
      status: 'DELETED',
      isFavorite: false,
      mediaId: id.toString()
    });
  }


}
