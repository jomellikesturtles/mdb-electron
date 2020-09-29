import { IUserSavedData } from '../interfaces';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';
import { FirebaseService, CollectionName, FieldName, FirebaseOperator } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class LibraryService {

  constructor(
    private ipcService: IpcService,
    private firebaseService: FirebaseService,
  ) {

  }

  /**
   * Opens a video stream to watch.
   * @param id library id to open stream
   * @returns stream link/url
   */
  async openVideoStream(id) {
    // this.ipcService.playOfflineVideo(id) // commented to make way for torrent-play
    return this.ipcService.playOfflineVideo(id)
    // return new Promise((resolve, reject) => {
    //   if (environment.runConfig.firebaseMode) {
    //     this.firebaseService.getFromFirestore(CollectionName.Video, FieldName.TmdbId, FirebaseOperator.Equal, id).then(e => {
    //       console.log('BOOKMARK: ', e)
    //       resolve(e)
    //     }).catch(e => {
    //       reject(e)
    //     })
    //     // })
    //   } else {
    //     this.ipcService.videoFile.toPromise().then(e => {
    //       resolve(e)
    //     })
    //   }
    // })
  }

  /**
   * Gets movie video.
   * !TODO: change to open movie./streamlink
   * @param id - tmdbId or imdbId
   */
  getMovieFromLibrary(id: number | string): Promise<any> {
    this.ipcService.call(this.ipcService.IPCCommand.OpenVideo) // commented to make way for torrent-play
    return new Promise((resolve, reject) => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestore(CollectionName.Video, FieldName.TmdbId, FirebaseOperator.Equal, id).then(e => {
          console.log('BOOKMARK: ', e)
          resolve(e)
        }).catch(e => {
          reject(e)
        })
      } else {
        this.ipcService.getMovieFromLibrary(id).then((e: IRawLibrary) => {
          resolve(e)
        })
      }
    })
  }

  /**
   * Gets multiple videos using list. Movie(s) eventually becomes available in status.
   * @param idList
   */
  getMoviesFromLibraryInList(idList: number[]): Promise<any> {
    console.log('getting multiplevideos...', idList);
    return new Promise((resolve, reject) => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestoreMultiple(CollectionName.Video, FieldName.TmdbId, idList).then(value => {
          resolve(value)
        }).catch(err => {
          reject(err)
        })
      } else {
        this.ipcService.getMoviesFromLibraryInList(idList).then(value => {
          resolve(value)
        }).catch(err => {
          reject(err)
        })
      }
    })
  }

  /**
   * Gets multiple videos. Movie(s) eventually becomes available in status.
   */
  getVideos(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Video, FieldName.TmdbId, 20).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Gets first page of list.
   */
  getVideoPaginatedFirstPage(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ipcService.getMultiplePaginatedFirst(CollectionName.Video, FieldName.TmdbId, 20).then(value => {
        // this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Video, FieldName.TmdbId, 20).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Gets multiple watched.
   * @param lastVal the last value to start with.
   */
  getVideoPaginated(lastVal: string | number): Promise<any> {
    console.log('getVideoPaginated...', lastVal);
    return new Promise((resolve, reject) => {
      this.ipcService.getMultiplePaginated(CollectionName.Video, FieldName.TmdbId, 20, lastVal).then(value => {
        // this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Video, FieldName.TmdbId, 20, lastVal).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
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
  _id: string
}

interface Library {
  type: 'movie' | 'video' | 'audio' | 'music' | 'podcast' | 'videogame',
  source: 'local' | 'online',
  id: string,
  title: string
}
