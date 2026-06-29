import { Injectable } from "@angular/core";
import { DataService } from "@services/data.service";
import { BaseBookmarkService, IBookmark } from "@services/media/base-bookmark.service";
import { BookmarkResponse } from "@services/media/bookmark.service";
import { delay, Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockBookmarkService extends BaseBookmarkService {

  constructor(
    dataService: DataService
  ) {
    super(dataService);
  }

  save(tmdbId: number | string): Observable<BookmarkResponse> {
    return of<BookmarkResponse>({
      status: 'SAVED',
      isBookmark: true,
      mediaId: tmdbId.toString()
    }).pipe(delay(300));
    // return of({ _id: 'abcd', tmdbId: 122 }).pipe(delay(300));
  }
  remove(id: string | number): Observable<BookmarkResponse> {
    return of<BookmarkResponse>({
      status: 'DELETED',
      isBookmark: false,
      mediaId: id.toString()
    }).pipe(delay(300));
  }
  saveBookmarkMulti(data: object[]): Observable<any> {
    return of([{ _id: 'abcd', tmdbId: 122 }]);
  }

}
