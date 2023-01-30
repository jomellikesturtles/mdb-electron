import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IMediaList } from "@models/media-list.model";
import { BaseLibraryService } from "@services/base-library.service";
import { DataService } from "@services/data.service";
import { IUserDataPaginated } from "@services/ipc.service";
import { BaseListService } from "@services/media/base-list.service";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockLibraryService extends BaseLibraryService {

  constructor(
    private http: HttpClient
  ) {
    super();
  }
  openVideoStream(id: any) {
    return of('https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4').toPromise();
  }
  getMovieFromLibrary(id: string | number): Promise<any> {
    return of(
      [
        {
          fullFilePath: 'https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4',
          title: 'Titanic',
          year: '1997',
          tmdbId: 3897,
          _id: 'asdasd'
        }
      ]
    ).toPromise();
  }
  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getLibraryPaginatedFirstPage(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getLibraryPaginated(lastVal: string | number): Promise<any> {
    throw new Error("Method not implemented.");
  }


}
