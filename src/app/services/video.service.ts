import { IUserSavedData } from './../interfaces';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { IpcService, IpcCommand, Channel } from './ipc.service';
import { FirebaseService, CollectionName, FieldName, FirebaseOperator } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(
    private ipcService: IpcService,
    private firebaseService: FirebaseService
  ) { }


  /**
   * Gets movie video.
   */
  getVideo(id): Promise<any> {
    this.ipcService.call(IpcCommand.OpenVideo)
    this.ipcService.listen(Channel.VideoSuccess)
    if (environment.runConfig.firebaseMode) {
      return new Promise((resolve, reject) => {
        this.firebaseService.getFromFirestore(CollectionName.Video, FieldName.TmdbId, FirebaseOperator.Equal, id).then(e => {
          console.log('BOOKMARK: ', e)
          resolve(e)
        }).catch(e => {
          reject(e)
        })
      })
    } else {

    }

  }

  /**
   * Gets multiple videos. Movie(s) eventually becomes available in status.
   */
  getVideosMultiple(idList: number[]): Promise<any> {
    console.log('getting multiplevideos...', idList);
    return new Promise((resolve, reject) => {
      this.firebaseService.getFromFirestoreMultiple(CollectionName.Video, FieldName.TmdbId, idList).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
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
    // return new Promise((resolve, reject) => {
    //   this.firebaseService.getFromFirestoreMultiple(CollectionName.Video, FieldName.TmdbId, idList).then(value => {
    //     resolve(value)
    //   }).catch(err => {
    //     reject(err)
    //   })
    // })
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
