import { Injectable } from "@angular/core";
import { DataService } from "@services/data.service";
import { IpcService } from "@services/ipc.service";
import { MDBApiService } from "@services/mdb-api.service";
import { FavoriteResponse, FavoriteService } from "@services/media/favorite.service";
import { delay, Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockFavoriteService extends FavoriteService {
  constructor(
    ipcService: IpcService,
    bffService: MDBApiService,
    dataService: DataService,
  ) {
    super(ipcService,
      bffService,
      dataService);
  }

  // toggleFavorite(movie: any) {
  //   throw new Error("Method not implemented.");
  // }
  save(mediaId: string): Observable<FavoriteResponse> {
    return of<FavoriteResponse>({
      status: 'SAVED',
      isFavorite: true,
      mediaId: mediaId.toString()
    }).pipe(delay(300));
  }

  remove(mediaId: string | number): Observable<FavoriteResponse> {
    return of<FavoriteResponse>({
      status: 'DELETED',
      isFavorite: false,
      mediaId: mediaId.toString()
    }).pipe(delay(300));
  }


}
