import { IUserSavedData } from '@models/interfaces';
import { IMediaList } from '@models/media-list.model';
import { IUserDataPaginated } from '@services/ipc.service';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BaseListService {

  constructor(
    protected dataService: DataService,
  ) { }

  /**
   *
   * @param listObject list object to create
   */
  protected abstract createList(listObject: IMediaList): Observable<IMediaList>;


  /**
   * Gets movie details by imdb id
   * @param val imdb id
   */
  protected abstract getList(listId: number | string): Observable<IMediaList>;


  protected abstract getLists(limit: number, offset: number, sortBy: string, type: string): Observable<IUserDataPaginated>;

  /**
   *
   * @param listId id to delete
   * @returns number of deleted item
   */
  protected abstract deleteList(listId: string): Observable<number>;
  protected abstract editListById(id: string, listObject: IMediaList): Observable<any>;
}

export interface IBookmark extends IUserSavedData {
  id?: string,
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  cr8Ts?: number,
}
