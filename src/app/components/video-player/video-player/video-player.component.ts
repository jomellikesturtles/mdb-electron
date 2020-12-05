import { Component, OnInit, Input, OnDestroy, AfterViewInit, ElementRef, OnChanges, SimpleChanges, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { IpcService } from 'src/app/services/ipc.service';
import { WatchedService } from 'src/app/services/watched.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() streamLink: string
  @Input() id: string
  @Input() tmdbId: number
  @Input() imdbId: string
  @ViewChild('videoPlayer1', { static: false }) videoPlayer1: ElementRef
  @ViewChild('progressBar', { static: false }) progressBar: ElementRef
  @ViewChild('tooltipSpan', { static: false }) tooltipSpan: ElementRef
  DEFAULT_VOLUME = 50
  isPlaying = false
  isMuted = false
  volume = this.DEFAULT_VOLUME
  previousVolumeValue = 0
  videoPlayerElement;
  statsForNerds: Stats
  subtitles
  played = '0%'
  buffered = '0%'
  videoTime = {
    elapsed: 0,
    duration: 0,
    remaining: 0
  }
  afterView: boolean;
  constructor(
    private ipcService: IpcService,
    private watchedService: WatchedService,
    private elementRef: ElementRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    const cs = changes.streamLink
    if (cs && !cs.firstChange) {
      this.statsForNerds.source = this.streamLink;
    }
  }

  ngOnInit() {
    // this.streamLink = 'http://localhost:3001/0'
    // this.streamLink.s

  }

  ngOnDestroy(): void {
    this.ipcService.stopStream()
  }

  ngAfterViewInit(): void {
    this.afterView = true

    this.ipcService.statsForNerdsSubscribable.subscribe(stats => {
      console.log(stats)
      if (stats) {
        // this.statsForNerds.downSpeed = stats.downSpeed
        // this.statsForNerds.upSpeed = stats.upSpeed
        // this.statsForNerds.downloadedPieces= stats.downloadedPieces
        // this.statsForNerds.ratio = stats.ratio
      }
    })

    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.

    this.videoPlayerElement = this.elementRef.nativeElement.querySelector('#videoPlayer')
    this.videoPlayerElement.muted = true
    this.videoPlayerElement.addEventListener('canplay', (e) => {
      console.log('canplay', e)
      this.videoTime.duration = this.videoPlayerElement.duration
    })
    this.videoPlayerElement.addEventListener('durationchange', (e) => {
      console.log('durationchange', e)
    })
    this.videoPlayerElement.addEventListener('ended', (e) => {
      this.isPlaying = false
      console.log('ended', e)
    })
    this.videoPlayerElement.addEventListener('error', (e) => {
      console.log('error', e)
    })
    this.videoPlayerElement.addEventListener('pause', (e) => {
      this.isPlaying = false
      console.log('pause', e)
    })
    this.videoPlayerElement.addEventListener('play', (e) => {
      this.isPlaying = true
      console.log('play', e)
    })
    this.videoPlayerElement.addEventListener('playing', (e) => {
      this.isPlaying = true
      console.log('playing', e)
    })
    this.videoPlayerElement.addEventListener('progress', (e) => {
      console.log('progress', e)
    })
    this.videoPlayerElement.addEventListener('seeked', (e) => {
      console.log('seeked', e)
      this.updateProgressBar()
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
    setInterval((e) => {
      this.updateProgressBar()
      if (this.isPlaying) {
        // this.updateWatchedStatus(e)
      }
    }, 500)
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
          this.toggleFullScreen()
          // toggle fullscreen
          break;
        case 'k':
          // toggle pause/play
          // this.togglePlay()
          this.isPlaying ? this.videoPlayer1.nativeElement.play() : this.videoPlayer1.nativeElement.pause()
          // this.isPlaying ? this.videoPlayerElement.playVideo() : this.videoPlayerElement.pauseVideo()
          // this.isPlaying = !this.isPlaying
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
      id: '',
      tmdbId: this.tmdbId,
      imdbId: this.imdbId,
      title: '',
      percentage: this.videoPlayerElement.currentTime,
      year: 0
      // percentage: Math.floor(this.videoPlayerElement.currentTime / this.videoPlayerElement.duration * 100)
    }
    console.log('updating watched', watchedObj);
    this.watchedService.saveWatched(watchedObj);
  }

  togglePlay() {
    this.videoPlayer1.nativeElement.paused ? this.videoPlayer1.nativeElement.play() : this.videoPlayer1.nativeElement.pause()
  }
  toggleFullScreen() {

    const playerOuter = this.elementRef.nativeElement.querySelector('#videoPlayerOuter')
    if (playerOuter.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (playerOuter.requestFullscreen) {
        playerOuter.requestFullscreen();
      } else if (playerOuter.mozRequestFullScreen) {
        playerOuter.mozRequestFullScreen();
      }
      else if (playerOuter.msRequestFullscreen) {
        playerOuter.msRequestFullscreen();
      }
    }
  }
  mouseMove(e) {
    console.log(e.offsetX)
    var x = e.clientX
      this.tooltipSpan.nativeElement.style.top = (-100) + 'px';
      this.tooltipSpan.nativeElement.style.left = (x + 20) + 'px';

  }
  seek(val) {
    const totalWidth = val.currentTarget.offsetWidth
    const offsetX = val.offsetX
    const percentage = this.watchedService.getPercentage(offsetX, totalWidth)
    this.videoPlayerElement.currentTime = parseFloat('.' + percentage) * this.videoPlayerElement.duration
  }
  changeCc() {
    this.ipcService.changeSubtitle().then(e => {
      e = this.subtitles
    })
  }
  volumeChange(source: number) {
    this.volume = source
    this.videoPlayerElement.volume = this.volume * 0.01
    // this.volume
  }
  toggleMute() {
    this.videoPlayerElement.muted = !this.videoPlayerElement.muted
    // this.videoPlayerElement.muted ? this.volume:
    // this.previousVolumeValue = this.videoPlayerElement.volume
  }
  updateProgressBar() {
    const duration = this.videoPlayerElement.duration
    this.played = this.watchedService.getPercentage(this.videoPlayerElement.currentTime, duration) + '%'
    this.buffered = this.watchedService.getPercentage(this.videoPlayer1.nativeElement.buffered.end(0), duration) + '%'
  }
}

interface Stats {
  bufferhealth: string // in seconds
  connectionSpeed: string
  downloadedPieces: string // (pieces have.)
  downSpeed: string // leech speed
  upSpeed: string // seed speed
  ratio: string // downloaded/uploaded ratio
  // codec
  id: string // hash/id
  source: string; // stream link
  size: string;
  resolution: string
}

/**
 * !TODO: fix for 24hours<= movies. currently returns 00:00:00
 * !TODO: cut return for < 1 hour. currently returns 00:23:00, must be 23:00
 */
@Pipe({ name: 'toHHMMSS' })
export class HHMMSSPipe implements PipeTransform {
  constructor() { }
  transform(value: number): string {
    return new Date(value * 1000).toISOString().substr(11, 8)
  }
}
