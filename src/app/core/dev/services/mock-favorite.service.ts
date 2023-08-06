import { Injectable } from "@angular/core";
import { IMediaList } from "@models/media-list.model";
import { DataService } from "@services/data.service";
import { IUserDataPaginated } from "@services/ipc.service";
import { BaseFavoriteService } from "@services/media/base-favorite.service";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockFavoriteService extends BaseFavoriteService {
  constructor(
    dataService: DataService
  ) {
    super(dataService);
  }

  toggleFavorite(movie: any) {
    throw new Error("Method not implemented.");
  }
  saveFavorite(data: any): Observable<any> {
    return of({
      tmdbId: 122,
      _id: 'paKlRcGMsh2scFUR',
      createdAt: '2023 - 01 - 29T04: 27: 33.127Z',
      updatedAt: '2023 - 01 - 29T04: 27: 33.127Z'
    });
  }
  removeFavorite(type: "id" | "tmdbId", id: string | number) {
    return of(1);
  }


}
