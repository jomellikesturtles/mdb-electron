import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @Input() streamLink: string
  constructor() { }

  ngOnInit() {
    this.streamLink = 'http://localhost:3001/0'
  }

}
