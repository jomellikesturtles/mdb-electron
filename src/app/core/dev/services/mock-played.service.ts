import { Injectable } from "@angular/core";
import { DataService } from "@services/data.service";
import { BasePlayedService } from "@services/media/base-played.service";
import { Observable, } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockPlayedService extends BasePlayedService {
  constructor(
    dataService: DataService
  ) {
    super(dataService);
  }
  protected setPlayed(tmdbId: number): Observable<any> {
    throw new Error("Method not implemented.");
  }
  protected setPlayedMultiple(idList: string): Observable<any> {
    throw new Error("Method not implemented.");
  }
  protected getMediaDataPaginated(type: "id" | "tmdbId", id: string | number): Observable<any> {
    throw new Error("Method not implemented.");
  }

}
