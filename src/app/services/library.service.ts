import { IUserSavedData } from '@models/interfaces';
import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';
import { BaseLibraryService, IRawLibrary } from './base-library.service';
import { CollectionName, FieldName } from '@shared/constants';

@Injectable({ providedIn: 'root' })
export class LibraryService extends BaseLibraryService {

  constructor(
    private ipcService: IpcService,
  ) {
    super();
  }

  // returns link
  async openVideoStream(id): Promise<string> {
    return this.ipcService.playOfflineVideo(id);
  }

  getMovieFromLibrary(id: number | string): Promise<IRawLibrary[]> {
    return this.ipcService.getMovieFromLibrary(id);
  }

  getMoviesFromLibraryInList(idList: number[]): Promise<IRawLibrary[]> {
    console.log('getting multiplevideos...', idList);
    return this.ipcService.getMoviesFromLibraryInList(idList);
  }

  getLibraryPaginated(lastVal: string | number): Promise<any> {
    console.log('getVideoPaginated...', lastVal);
    return this.ipcService.getMultiplePaginated(CollectionName.Library, FieldName.TmdbId, 20, lastVal);
  }

}

export interface IVideo extends IUserSavedData {
  tmdbId: number,
  imdbId?: string,
  title: string,
  year: number,
  id: string,
  videoUrl: string,
  filePath?: string,
  cre8Ts?: number, // create timestamp
  timestamp?: number,
}

