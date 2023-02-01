import { IUserSavedData } from '@models/interfaces';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BaseMediaUserDataService {

  constructor(
    protected dataService: DataService,
  ) { }

  protected abstract getMediaUserData(tmdbId: number): Observable<any>;

  /**
   *
   * @param idList separated by comma
   */
  protected abstract getMediaUserDataMultiple(idList: string): Observable<any>;


  protected abstract getMediaDataPaginated(type: 'id' | 'tmdbId', id: string | number): Observable<any>;

  commonSetter(val: number | Object): boolean {
    if (val >= 1) {
      return false;
    }
    if (val && val['_id']) {
      return true;
    }
  }

}

export interface IBookmark extends IUserSavedData {
  id?: string,
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  cr8Ts?: number,
}
