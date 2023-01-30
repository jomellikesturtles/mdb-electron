import { IUserSavedData } from '@models/interfaces';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';
import { FirebaseService, CollectionName, FieldName, FirebaseOperator } from './firebase.service';
import { BaseLibraryService } from './base-library.service';

@Injectable({ providedIn: 'root' })
export class LibraryService extends BaseLibraryService {

  constructor(
    private ipcService: IpcService,
    private firebaseService: FirebaseService,
  ) {
    super();
  }

  async openVideoStream(id): Promise<any> {
    // this.ipcService.playOfflineVideo(id) // commented to make way for torrent-play
    return this.ipcService.playOfflineVideo(id);
    // return new Promise((resolve, reject) => {
    //   if (environment.runConfig.firebaseMode) {
    //     this.firebaseService.getFromFirestore(CollectionName.Library, FieldName.TmdbId, FirebaseOperator.Equal, id).then(e => {
    //       resolve(e)
    //     }).catch(e => {
    //       reject(e)
    //     })
    //     // })
    //   } else {
    //     this.ipcService.LibraryFile.toPromise().then(e => {
    //       resolve(e)
    //     })
    //   }
    // })
  }

  getMovieFromLibrary(id: number | string): Promise<any> {
    const myFunction = environment.runConfig.firebaseMode ?
      this.firebaseService.getFromFirestore(CollectionName.Library, FieldName.TmdbId, FirebaseOperator.Equal, id) :
      this.ipcService.getMovieFromLibrary(id);
    return myFunction;
  }

  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    console.log('getting multiplevideos...', idList);
    const myFunction = environment.runConfig.firebaseMode ?
      this.firebaseService.getFromFirestoreMultiple(CollectionName.Library, FieldName.TmdbId, idList) :
      this.ipcService.getMoviesFromLibraryInList(idList);
    return myFunction;
  }

  getLibraryPaginatedFirstPage(): Promise<any> {
    const myFunction = environment.runConfig.firebaseMode ? null : this.ipcService.getMultiplePaginatedFirst(CollectionName.Library, FieldName.TmdbId, 20);
    // this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Library, FieldName.TmdbId, 20)
    return myFunction;
  }

  getLibraryPaginated(lastVal: string | number): Promise<any> {
    console.log('getVideoPaginated...', lastVal);
    const myFunction = environment.runConfig.firebaseMode ?
      this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Library, FieldName.TmdbId, 20, lastVal) :
      this.ipcService.getMultiplePaginated(CollectionName.Library, FieldName.TmdbId, 20, lastVal);
    return myFunction;
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
