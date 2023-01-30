import { Injectable } from "@angular/core";
import { IMediaList } from "@models/media-list.model";
import { DataService } from "@services/data.service";
import { IUserDataPaginated } from "@services/ipc.service";
import { BaseListService } from "@services/media/base-list.service";
import { Observable, of } from "rxjs";

const MOCK_LIST = { title: "paborito kong pelikula 2", description: "deskriptsyon", _id: "q6chZmoVQmhuJJ9k", createdAt: 1674882091460, updatedAt: 1674882091460 };
@Injectable({ providedIn: "root" })
export class MockListService extends BaseListService {

  constructor(
    dataService: DataService
  ) {
    super(dataService);
  }
  createList(listObject: IMediaList): Observable<IMediaList> {
    return of(MOCK_LIST);
  };
  getList(listId: string | number): Observable<any> {
    return of(MOCK_LIST);
  };
  getLists(limit: number, offset: number, sortBy: string, type: string): Observable<IUserDataPaginated> {
    // return of([MOCK_LIST])
    return null;
  };
  deleteList(listId: string): Observable<number> {
    return of(1);
  };
  editListById(id: string, listObject: IMediaList): Observable<any> {
    return of(MOCK_LIST);
  }

}
