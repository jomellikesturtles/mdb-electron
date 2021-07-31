import { Injectable } from '@angular/core';
import { FirebaseService, CollectionName, FieldName } from './firebase.service';
import { environment } from '@enviroments/environment';
import { IpcService, IUserDataPaginated } from './ipc.service';
import { MdbApiService } from './mdb-api.service';
import GeneralUtil from '@utils/general.util';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private ipcService: IpcService,
    private mdbApiService: MdbApiService) { }

  async toggleFavorite(movie) {
    let fDocId
    if (!movie.favorite || !movie.favorite.id) {
      const rDate = movie.release_date ? movie.release_date : movie.releaseDate
      const releaseYear = parseInt(GeneralUtil.getYear(rDate), 10)
      const data = {
        title: movie.title,
        tmdbId: movie.id ? movie.id : movie.tmdbId,
        imdbId: movie.imdbId ? movie.imdbId : '',
        year: releaseYear ? releaseYear : 0,
      }
      fDocId = await this.saveFavorite(data)
      movie.favorite = fDocId
    } else {
      const type = movie.favorite && movie.favorite.id ? 'id' : 'tmdbId'
      const id = type === 'id' ? movie.favorite.id : movie.tmdbId
      fDocId = await this.removeFavorite(type, id)
      movie.favorite.id = ''
    }
    return fDocId;
  }

  saveFavorite(data: any): Promise<any> {
    if (environment.runConfig.springMode) {
      return this.mdbApiService.saveFavorite(data).toPromise()
    }
    else {
      return this.ipcService.saveFavorite(data)
    }
  }

  /**
   * Removes watched.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  removeFavorite(type: 'id' | 'tmdbId', id: string | number) {
    if (environment.runConfig.springMode) {
      return this.mdbApiService.deleteFavorite(id).toPromise()
    }
    else {
      return this.ipcService.removeWatched(type, id)
    }
  }


  /**
   * Gets paginated favorite.
   * @param lastVal the last value to start with.
   */
  getFavoritePaginated(page: number): Promise<any> {
    console.log('getting multiplewatched page...', page);

    if (environment.runConfig.firebaseMode) {
    } else {
      return this.ipcService.getMultiplePaginatedFirst(CollectionName.Watched, FieldName.TmdbId, 20)
    }
    return null
  }

}
