import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() streamLink: string
  constructor(private movieService: MovieService,
    private ipcService: IpcService) { }

  ngOnInit() {
    // this.streamLink = 'http://localhost:3001/0'
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.ipcService.stopStream()
  }
}
