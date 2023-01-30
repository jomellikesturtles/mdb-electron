import { Observable } from 'rxjs';
import { DataService } from '../data.service';

export abstract class BaseFavoriteService {

  constructor(
    protected dataService: DataService,
  ) { }

  // TO BE UNUSED
  protected abstract toggleFavorite(movie);

  protected abstract saveFavorite(data: any): Observable<any>;

  /**
   * Removes watched.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  protected abstract removeFavorite(type: 'id' | 'tmdbId', id: string | number);


  /**
   * Gets paginated favorite.
   * @param lastVal the last value to start with.
   */
  protected abstract getFavoritePaginated(page: number): Promise<any>;
}

