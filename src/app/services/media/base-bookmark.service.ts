import { IUserSavedData } from '@models/interfaces';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BaseBookmarkService {

  constructor(
    protected dataService: DataService,
  ) { }

  protected abstract saveBookmark(tmdbId: number): Observable<any>;

  /**
   * Removes bookmark.
   * @param id watched id/_id/tmdbId to remove.
   */
  protected abstract removeBookmark(type: 'id' | 'tmdbId', id: string | number): Observable<any>;

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
