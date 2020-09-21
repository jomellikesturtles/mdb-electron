import { Component, OnInit, Input, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() streamLink: string
  @Input() id: string
  @Input() tmdbId: number
  @Input() imdbId: string
  DEFAULT_VOLUME = 1
  isPlaying = false
  volume = this.DEFAULT_VOLUME
  videoPlayerElement;
  constructor(
    private movieService: MovieService,
    private ipcService: IpcService,
    private elementRef: ElementRef) { }

  ngOnInit() {
    // this.streamLink = 'http://localhost:3001/0'
  }
  ngOnDestroy(): void {
    this.ipcService.stopStream()
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.

    this.videoPlayerElement = this.elementRef.nativeElement.querySelector('#videoPlayer')
    this.videoPlayerElement.addEventListener('canplay', (e) => {
      console.log('canplay', e)
    })
    this.videoPlayerElement.addEventListener('durationchange', (e) => {
      console.log('durationchange', e)
    })
    this.videoPlayerElement.addEventListener('ended', (e) => {
      console.log('ended', e)
    })
    this.videoPlayerElement.addEventListener('error', (e) => {
      console.log('error', e)
    })
    this.videoPlayerElement.addEventListener('pause', (e) => {
      console.log('pause', e)
    })
    this.videoPlayerElement.addEventListener('play', (e) => {
      console.log('play', e)
    })
    this.videoPlayerElement.addEventListener('playing', (e) => {
      console.log('playing', e)
    })
    this.videoPlayerElement.addEventListener('progress', (e) => {
      console.log('progress', e)
    })
    this.videoPlayerElement.addEventListener('seeked', (e) => {
      console.log('seeked', e)
    })
    this.videoPlayerElement.addEventListener('seeking', (e) => {
      console.log('seeking', e)
    })
    this.videoPlayerElement.addEventListener('stalled', (e) => {
      console.log('stalled', e)
    })
    this.videoPlayerElement.addEventListener('suspend', (e) => {
      console.log('onSuspend', e)
    })
    this.videoPlayerElement.addEventListener('timeupdate', (e) => {
      // console.log('timeupdate', e)
    })
    setInterval((e) => this.updateWatchedStatus(e), 10000)
  }

  onKeyPress(val: KeyboardEvent) {
    // videoHeight: 360
    // videoWidth: 640
    const key = val.key.toLowerCase()
    console.log(key)
    if (!val.shiftKey && !val.altKey && !val.ctrlKey && !val.metaKey) {

      // const REGEX_OMDB_RELEASE_DATE = new RegExp('^[0-9]$', `gi`);

      // if ((new RegExp('^[0-9]$', `gi`)).test(key)) {

      //   if (key == '1') { this.videoPlayerElement.currentTime = '0' }
      //   if (key == '0') { this.videoPlayerElement.currentTime = this.videoPlayerElement.duration }

      // }

      switch (key) {
        case 'm':
          this.videoPlayerElement.muted = !this.videoPlayerElement.muted
          // toggle mute
          break;
        case 'f':
          if (this.videoPlayerElement.webkitSupportsFullscreen &&
            !this.videoPlayerElement.webkitDisplayingFullscreen) {
            if (this.videoPlayerElement.requestFullscreen) {
              this.videoPlayerElement.requestFullscreen();
            } else if (this.videoPlayerElement.mozRequestFullScreen) { /* Firefox */
              this.videoPlayerElement.mozRequestFullScreen();
            } else if (this.videoPlayerElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
              this.videoPlayerElement.webkitRequestFullscreen();
            } else if (this.videoPlayerElement.msRequestFullscreen) { /* IE/Edge */
              this.videoPlayerElement.msRequestFullscreen();
            }
          } else if (this.videoPlayerElement.webkitDisplayingFullscreen) {

            if (this.videoPlayerElement.exitFullscreen) {
              this.videoPlayerElement.exitFullscreen();
            } else if (this.videoPlayerElement.mozCancelFullScreen) { /* Firefox */
              this.videoPlayerElement.mozCancelFullScreen();
            } else if (this.videoPlayerElement.webkitExitFullscreen) { /* Chrome, Safari and Opera */
              this.videoPlayerElement.webkitExitFullscreen();
            } else if (this.videoPlayerElement.msExitFullscreen) { /* IE/Edge */
              this.videoPlayerElement.msExitFullscreen();
            }

          }
          // toggle fullscreen
          break;
        case 'k':
          // toggle pause/play
          this.isPlaying ? this.videoPlayerElement.play() : this.videoPlayerElement.pause()
          this.isPlaying = !this.isPlaying
          break;
        case 'arrowup':
          // if (this.volume >= 1) return
          // this.volume += .2
          this.videoPlayerElement.volume += .2
          // keyCode: 38
          break;
        case 'arrowdown':
          // if (this.volume <= 0) return
          // this.volume -= .2
          // this.videoPlayerElement.volume = this.volume
          this.videoPlayerElement.volume -= .2
          // keyCode: 40
          break;
        case 'arrowleft':
          this.videoPlayerElement.currentTime = '10'
          // keyCode: 37
          // toggle fullscreen
          break;
        case 'arrowright':
          this.videoPlayerElement.currentTime = '20'
          // keyCode: 39
          break;
        case 'pageup':
          this.videoPlayerElement.volume = '1'
          break;
        case 'pagedown':
          this.videoPlayerElement.volume = '0'
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.videoPlayerElement.currentTime = parseFloat('.' + key) * this.videoPlayerElement.duration
          break;
        case '0':
        case 'home':
          this.videoPlayerElement.currentTime = '0'
          break;
        case 'end':
          this.videoPlayerElement.currentTime = this.videoPlayerElement.duration
          break;
        default:
          break;
      }
    }
  }

  updateWatchedStatus(val: any) {

    // id: string // also use in Doc Id
    // tmdbId: number,
    // imdbId?: string,
    // title: string,
    // year: number,
    // // id?: string,
    // cre8Ts?: number, // create timestamp
    // timestamp?: number,
    // percentage: string,
    let watchedObj = {
      id: this.id,
      tmdbId: this.tmdbId,
      imdbId: this.imdbId,
      percentage: Math.floor(this.videoPlayerElement.currentTime / this.videoPlayerElement.duration * 100)
    }
    this.ipcService.updateWatchedStatus(watchedObj)
  }

  addCaption() {
    // this.videoPlayerElement.addTextTrack()
  }
}
