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
  protected abstract getMediaUserDataMultiple(idList: any[]): Observable<any>;


  protected abstract getMediaDataPaginated(type: 'id' | 'tmdbId', id: string | number): Observable<any>;

}
