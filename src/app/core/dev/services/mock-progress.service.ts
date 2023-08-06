import { Injectable } from "@angular/core";
import { IMediaProgress } from "@models/media-progress";
import { DataService } from "@services/data.service";
import { IUserDataPaginated } from "@services/ipc.service";
import { BaseBookmarkService, IBookmark } from "@services/media/base-bookmark.service";
import { BaseProgressService } from "@services/media/base-progress.service";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockProgressService extends BaseProgressService {
  constructor(
    dataService: DataService
  ) {
    super(dataService);
  }
  postProgress(progressBody: IMediaProgress): Observable<IMediaProgress> {
    throw new Error("Method not implemented.");
  }
  getProgressesMultiple(limit: number, offset: number, sortBy: string, type: string): Observable<IUserDataPaginated> {
    throw new Error("Method not implemented.");
  }
  deleteProgress(listId: string) {
    throw new Error("Method not implemented.");
  }




}
