import { Injectable } from "@angular/core";
import { DataService } from "@services/data.service";
import { BasePlayedService } from "@services/media/base-played.service";
import { Observable, of, } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockPlayedService extends BasePlayedService {
  protected get(mediaId: number): Observable<any> {
    throw new Error("Method not implemented.");
  }
  constructor(
    dataService: DataService
  ) {
    super(dataService);
  }
  protected setPlayed(tmdbId: number): Observable<any> {
    throw new Error("Method not implemented.");
  }
  protected save(tmdbId: string | number): Observable<PlayedResponse> {
    return of({
      status: 'SAVED',
      isBookmark: true,
      mediaId: tmdbId.toString()
    });
  }
  protected remove(tmdbId: string | number): Observable<PlayedResponse> {
    return of({
      status: 'SAVED',
      isBookmark: true,
      mediaId: tmdbId.toString()
    });
  }
  protected setPlayedMultiple(idList: string): Observable<any> {
    throw new Error("Method not implemented.");
  }
  protected getMediaDataPaginated(type: "id" | "tmdbId", id: string | number): Observable<any> {
    throw new Error("Method not implemented.");
  }

}
export interface PlayedResponse {
  status: 'SAVED' | 'DELETED',
  isBookmark: boolean,
  mediaId: string;
}
