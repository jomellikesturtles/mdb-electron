import { Injectable } from '@angular/core';
import { IpcService, IpcCommand, Channel } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private ipcService: IpcService) { }


  /**
   * Gets movie video.
   */
  getVideo() {
    this.ipcService.call(IpcCommand.OpenVideo)
    this.ipcService.listen(Channel.VideoSuccess)
  }
}
