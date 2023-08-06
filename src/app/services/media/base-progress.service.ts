import { IUserSavedData } from '@models/interfaces';
import { IMediaProgress } from '@models/media-progress';
import { IUserDataPaginated } from '@services/ipc.service';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BaseProgressService {

  constructor(
    protected dataService: DataService,
  ) { }

  protected abstract postProgress(progressBody: IMediaProgress): Observable<IMediaProgress>;

  protected abstract getProgressesMultiple(limit: number, offset: number, sortBy: string, type: string): Observable<IUserDataPaginated>;
  protected abstract deleteProgress(listId: string): any;


}

export interface IBookmark extends IUserSavedData {
  id?: string,
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  cr8Ts?: number,
}
