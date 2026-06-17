import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BaseFavoriteService {

  constructor(
    protected dataService: DataService,
  ) { }

  protected abstract save(data: any): Observable<any>;

  /**
   * Removes watched.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  protected abstract remove(type: 'id' | 'tmdbId', id: string | number);

}

