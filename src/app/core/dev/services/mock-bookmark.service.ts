import { Injectable } from "@angular/core";
import { DataService } from "@services/data.service";
import { BaseBookmarkService, IBookmark } from "@services/media/base-bookmark.service";
import { BookmarkResponse } from "@services/media/bookmark.service";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockBookmarkService extends BaseBookmarkService {

  constructor(
    dataService: DataService
  ) {
    super(dataService);
  }

  save(tmdbId: number | string): Observable<BookmarkResponse> {
    return of({
      status: 'SAVED',
      isBookmark: true,
      mediaId: tmdbId.toString()
    });
    // return of({ _id: 'abcd', tmdbId: 122 });
  }
  remove(type: "id" | "tmdbId", id: string | number): Observable<BookmarkResponse> {
    return of({
      status: 'DELETED',
      isBookmark: false,
      mediaId: id.toString()
    });
  }
  saveBookmarkMulti(data: object[]): Observable<any> {
    return of([{ _id: 'abcd', tmdbId: 122 }]);
  }

}
