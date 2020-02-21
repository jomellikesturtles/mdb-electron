import { Injectable } from '@angular/core';
import { IpcService, IpcCommand, Channel } from './ipc.service';
import { FirebaseService, CollectionName, FieldName } from './firebase.service';

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
  getVideo() {
    this.ipcService.call(IpcCommand.OpenVideo)
    this.ipcService.listen(Channel.VideoSuccess)
  }


  /**
   * Gets multiple videos. Movie(s) eventually becomes available in status.
   */
  getVideosMultiple(idList: number[]): Promise<any> {
    console.log('getting multiplebookmarks...', idList);
    return new Promise((resolve, reject) => {
      this.firebaseService.getFromFirestoreMultiple(CollectionName.Video, FieldName.TmdbId, idList).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export interface IVideo {
  tmdbId?: number,
  videoDocId?: string,
  imdbId?: string,
  title?: string,
  year?: number,
  id?: string,
  videoUrl: string,
  cre8Ts?: number, // create timestamp
  timestamp?: number,
  // percentage?: string,
}
