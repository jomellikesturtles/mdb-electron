import { IUserSavedData } from '@models/interfaces';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { BookmarkResponse } from './bookmark.service';

export abstract class BaseBookmarkService {

  constructor(
    protected dataService: DataService,
  ) { }

  protected abstract save(tmdbId: string): Observable<BookmarkResponse>;

  /**
   * Removes bookmark.
   * @param id watched id/_id/tmdbId to remove.
   */
  protected abstract remove(id: string): Observable<BookmarkResponse>;

  protected abstract saveBookmarkMulti(data: object[]): Observable<any>;

}

export interface IBookmark extends IUserSavedData {
  id?: string,
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  cr8Ts?: number,
}
