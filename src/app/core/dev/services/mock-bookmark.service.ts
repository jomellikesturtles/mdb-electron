import { Injectable } from "@angular/core";
import { DataService } from "@services/data.service";
import { BaseBookmarkService, IBookmark } from "@services/media/base-bookmark.service";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockBookmarkService extends BaseBookmarkService {

  constructor(
    dataService: DataService
  ) {
    super(dataService);
  }

  saveBookmark(tmdbId: number): Observable<any> {
    return of({ _id: 'abcd', tmdbId: 122 });
  }
  removeBookmark(type: "id" | "tmdbId", id: string | number): Observable<any> {
    return of(1);
  }
  saveBookmarkMulti(data: object[]): Observable<any> {
    return of([{ _id: 'abcd', tmdbId: 122 }]);
  }

}
