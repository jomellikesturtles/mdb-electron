import { Injectable } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { DataService } from "@services/data.service";
import { BaseMediaUserDataService } from "@services/media/base-media-user-data.service";
import { delay, Observable, of } from "rxjs";


@Injectable({ providedIn: "root" })
export class MockMediaUserDataService extends BaseMediaUserDataService {


  constructor(
    dataService: DataService,
    private loggerService: LoggerService
  ) {
    super(dataService);
  }

  //  IProfileData
  getMediaUserData(tmdbId: string): Observable<IMediaUserData> {
    this.loggerService.info('MockUserDataService getMediaUserData');

    return of(
      {
        mediaId: "550",
        isFavorite: false,
        isBookmark: false,

        isPlayed: false,
        progress: {
          isCompleted: false,
          percentage: 20.0
        }
        // "listLinkMedia": {
        //   "listId": "Bl8zwPAwNhvby8Hq", "tmdbId": "122", "createdAt": "2023- 01 - 28T09: 44: 31.269Z", "updatedAt": "2023 - 01 - 28T09: 44: 31.269Z"
        // },
        // "progress": { "tmdbId": "122", "current": 3022, "total": 2000, "_id": "aYSSr: 14.115Z", "updatedAt": "2023 - 01 - 27T16: 11: 06.114Z" }
        // }
      }).pipe(delay(4000));
  }
  getMediaUserDataMultiple(idList: any[]): Observable<IMediaUserData[]> {
    this.loggerService.info('MockUserDataService getMediaUserDataMultiple');
    return of(
      [
        {
          mediaId: "550",
          isFavorite: false,
          isBookmark: false,
          isPlayed: false,
          progress: {
            isCompleted: false,
            percentage: 20.0
          }
          // "listLinkMedia": {
          //   "listId": "Bl8zwPAwNhvby8Hq", "tmdbId": "122", "createdAt": "2023- 01 - 28T09: 44: 31.269Z", "updatedAt": "2023 - 01 - 28T09: 44: 31.269Z"
          // },
          // "progress": { "tmdbId": "122", "current": 3022, "total": 2000, "_id": "aYSSr: 14.115Z", "updatedAt": "2023 - 01 - 27T16: 11: 06.114Z" }
        }

      ]
    );
  }
  getMediaDataPaginated(type: "id" | "tmdbId", id: string | number): Observable<any> {
    return of({});
  }


}



export interface IMediaUserData {
  isFavorite: boolean,
  isBookmark: boolean,
  isPlayed: boolean,
  progress: {
    isCompleted: boolean,
    percentage: number;
  };
  mediaId: string;
  // [x: string]: {
  //   favorite: {
  //     tmdbId: string;
  //     createdAt: string;
  //     updatedAt: string;
  //   };
  //   listLinkMedia: {
  //     listId: string;
  //     tmdbId: string;
  //     createdAt: string;
  //     updatedAt: string;
  //   };
  //   progress: {
  //     tmdbId: string;
  //     current: number;
  //     total: number;
  //     _id: string;
  //     updatedAt: string;
  //   };
  // };
}
