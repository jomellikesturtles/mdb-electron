import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BasePlayedService {

  constructor(
    protected dataService: DataService,
  ) { }

  protected abstract setPlayed(mediaId: number): Observable<any>;
  protected abstract save(mediaId: number): Observable<any>;
  protected abstract remove(mediaId: number): Observable<any>;

  /**
   *
   * @param idList separated by comma
   */
  protected abstract setPlayedMultiple(idList: string): Observable<any>;



}
