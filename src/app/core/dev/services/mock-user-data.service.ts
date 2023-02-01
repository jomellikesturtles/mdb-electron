import { Injectable } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { IProfileData } from "@models/profile-data.model";
import { DataService } from "@services/data.service";
import { BaseMediaUserDataService } from "@services/media/base-media-user-data.service";
import { Observable, of } from "rxjs";


@Injectable({ providedIn: "root" })
export class MockUserDataService extends BaseMediaUserDataService {


  constructor(
    dataService: DataService,
    private loggerService: LoggerService
  ) {
    super(dataService);
  }

  getMediaUserData(tmdbId: number): Observable<any | IMediaUserData | IProfileData> {
    this.loggerService.info('MockUserDataService getMediaUserData');
    return of(
      {
        // "122":
        // {
        "favorite":
          { "tmdbId": 122, "createdAt": "2023-01-27T16:36:28.703Z", "updatedAt": "2023-01-27T16:36:54.892Z" },
        "listLinkMedia": {
          "listId": "Bl8zwPAwNhvby8Hq", "tmdbId": 122, "createdAt": "2023- 01 - 28T09: 44: 31.269Z", "updatedAt": "2023 - 01 - 28T09: 44: 31.269Z"
        },
        "progress": { "tmdbId": 122, "current": 3022, "total": 2000, "_id": "aYSSr: 14.115Z", "updatedAt": "2023 - 01 - 27T16: 11: 06.114Z" }
        // }
      });
  }
  getMediaUserDataMultiple(idList: string): Observable<IMediaUserData[]> {
    this.loggerService.info('MockUserDataService getMediaUserDataMultiple');
    return of([
      {
        "122":
        {
          "favorite":
            { "tmdbId": 122, "createdAt": "2023-01-27T16:36:28.703Z", "updatedAt": "2023-01-27T16:36:54.892Z" },
          "listLinkMedia": {
            "listId": "Bl8zwPAwNhvby8Hq", "tmdbId": 122, "createdAt": "2023- 01 - 28T09: 44: 31.269Z", "updatedAt": "2023 - 01 - 28T09: 44: 31.269Z"
          },
          "progress": { "tmdbId": 122, "current": 3022, "total": 2000, "_id": "aYSSr: 14.115Z", "updatedAt": "2023 - 01 - 27T16: 11: 06.114Z" }
        }
      }]
    );
  }
  getMediaDataPaginated(type: "id" | "tmdbId", id: string | number): Observable<any> {
    return of({});
  }


};


interface IMediaUserData {
  [x: string]: {
    favorite: {
      tmdbId: number;
      createdAt: string;
      updatedAt: string;
    };
    listLinkMedia: {
      listId: string;
      tmdbId: number;
      createdAt: string;
      updatedAt: string;
    };
    progress: {
      tmdbId: number;
      current: number;
      total: number;
      _id: string;
      updatedAt: string;
    };
  };
}
