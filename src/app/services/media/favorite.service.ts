import { Injectable } from '@angular/core';
import { IpcOperations, IpcService, IUserDataPaginated, SubChannel } from '../ipc.service';
import { MDBApiService as MDBApiService } from '../mdb-api.service';
import GeneralUtil from '@utils/general.util';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private ipcService: IpcService,
    private bffService: MDBApiService,
    private dataService: DataService
  ) { }

  async toggleFavorite(movie) {
    let fDocId;
    if (!movie.favorite || !movie.favorite.id) {
      const rDate = movie.release_date ? movie.release_date : movie.releaseDate;
      const releaseYear = parseInt(GeneralUtil.getYear(rDate), 10);
      const data = {
        title: movie.title,
        tmdbId: movie.id ? movie.id : movie.tmdbId,
        imdbId: movie.imdbId ? movie.imdbId : '',
        year: releaseYear ? releaseYear : 0,
      };
      fDocId = await this.saveFavorite(data);
      movie.favorite = fDocId;
    } else {
      const type = movie.favorite && movie.favorite.id ? 'id' : 'tmdbId';
      const id = type === 'id' ? movie.favorite.id : movie.tmdbId;
      fDocId = await this.removeFavorite(type, id);
      movie.favorite.id = '';
    }
    return fDocId;
  }

  saveFavorite(data: any): Observable<any> {
    return this.dataService.postHandle(this.bffService.saveMediaList(data), this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.SAVE },
      data, null));
  }

  /**
   * Removes watched.
   * @param type
   * @param id watched id/_id/tmdbId to remove.
   */
  removeFavorite(type: 'id' | 'tmdbId', id: string | number) {

    // return this.dataService.postHandle(this.bffService.deleteFavorite(data), this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.SAVE },
    //   data));
    return this.ipcService.userData({ subChannel: SubChannel.FAVORITE, operation: IpcOperations.REMOVE },
      null, { tmdbId: id });
  }


}
