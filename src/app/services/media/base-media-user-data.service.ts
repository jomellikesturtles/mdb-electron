import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BaseMediaUserDataService {

  constructor(
    protected dataService: DataService,
  ) { }

  protected abstract getMediaUserData(tmdbId: string): Observable<any>;

  /**
   *
   * @param idList separated by comma
   */
  protected abstract getMediaUserDataMultiple(idList: string): Observable<any>;


  protected abstract getMediaDataPaginated(type: 'id' | 'tmdbId', id: string | number): Observable<any>;

  commonSetter(val: number | Object | boolean): boolean {
    if (typeof val === 'boolean') {
      return val;
    }
    if (typeof val === 'number' && val >= 1) {
      return false;
    }
    if (val && (val['_id'] || val['id'])) {
      return true;
    }
    return false;
  }


}
