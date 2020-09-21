import { IUserSavedData } from './../interfaces';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';
import { FirebaseService, CollectionName, FieldName, FirebaseOperator } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(
    private ipcService: IpcService,
    private firebaseService: FirebaseService,
  ) {

  }

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
   * @param id - tmdbId or imdbId
   */
  getVideo(id): Promise<any> {
    this.ipcService.call(this.ipcService.IPCCommand.OpenVideo) // commented to make way for torrent-play
    this.ipcService.playOfflineVideo(id) // commented to make way for torrent-play
    return new Promise((resolve, reject) => {
      if (environment.runConfig.firebaseMode) {
        this.firebaseService.getFromFirestore(CollectionName.Video, FieldName.TmdbId, FirebaseOperator.Equal, id).then(e => {
          console.log('BOOKMARK: ', e)
          resolve(e)
        }).catch(e => {
          reject(e)
        })
        // })
      } else {
        // return new Promise((resolve, reject) => {
        this.ipcService.videoFile.toPromise().then(e => {
          resolve(e)
        })
        // this.ipcService.listen(this.ipcService.IPCChannel.VideoSuccess) // TODO: might remove. all IPC calls and listens must be in IPC SERVICE
      }
    })

  }

  /**
   * Gets multiple videos. Movie(s) eventually becomes available in status.
   */
  getVideosMultiple(idList: number[]): Promise<any> {
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
      this.firebaseService.getFromFirestoreMultiplePaginatedFirst(CollectionName.Video, FieldName.TmdbId, 20).then(value => {
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
      this.firebaseService.getFromFirestoreMultiplePaginated(CollectionName.Video, FieldName.TmdbId, 20, lastVal).then(value => {
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
