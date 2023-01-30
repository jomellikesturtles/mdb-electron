import { IUserSavedData } from '@models/interfaces';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BasePlayedService {

  constructor(
    protected dataService: DataService,
  ) { }

  protected abstract setPlayed(tmdbId: number): Observable<any>;

  /**
   *
   * @param idList separated by comma
   */
  protected abstract setPlayedMultiple(idList: string): Observable<any>;

  protected abstract getMediaDataPaginated(type: 'id' | 'tmdbId', id: string | number): Observable<any>;


}

export interface IBookmark extends IUserSavedData {
  id?: string,
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  cr8Ts?: number,
}
