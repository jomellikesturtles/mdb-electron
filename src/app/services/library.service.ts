import { IUserSavedData } from '@models/interfaces';
import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';
import { BaseLibraryService } from './base-library.service';
import { CollectionName, FieldName } from '@shared/constants';

@Injectable({ providedIn: 'root' })
export class LibraryService extends BaseLibraryService {

  constructor(
    private ipcService: IpcService,
  ) {
    super();
  }

  async openVideoStream(id): Promise<any> {
    return this.ipcService.playOfflineVideo(id);
  }

  getMovieFromLibrary(id: number | string): Promise<any> {
    return this.ipcService.getMovieFromLibrary(id);
  }

  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    console.log('getting multiplevideos...', idList);
    return this.ipcService.getMoviesFromLibraryInList(idList);
  }

  getLibraryPaginatedFirstPage(): Promise<any> {
    return this.ipcService.getMultiplePaginatedFirst(CollectionName.Library, FieldName.TmdbId, 20);
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

export interface IRawLibrary {
  fullFilePath: string,
  title: string,
  year: number,
  tmdbId: number,
  _id: string;
}

interface Library {
  type: 'movie' | 'video' | 'audio' | 'music' | 'podcast' | 'videogame',
  source: 'local' | 'online',
  id: string,
  title: string;
}
