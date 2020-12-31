import { Component, OnInit, Input, OnDestroy, AfterViewInit, ElementRef, OnChanges, SimpleChanges, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { Subject } from 'rxjs';
import { IpcService } from 'src/app/services/ipc.service';
import { MovieService } from 'src/app/services/movie.service';
import { WatchedService } from 'src/app/services/watched.service';
import SubtitlesUtil from 'src/app/utils/subtitles.utils';
import { Subtitle } from 'src/app/models/subtitle.model';
import { UserIdleService } from "angular-user-idle";
import chardet from "chardet";
import jschardet from "jschardet";
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';

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
  isShowStatus = false
  statsForNerds: Stats = {
    bufferhealth: '',
    connectionSpeed: '',
    downloadedPieces: 0,
    downSpeed: '',
    upSpeed: '',
    ratio: '',
    // codec
    id: '',
    source: '',
    size: '',
    resolution: ''
  }
  played = '0%'
  buffered = '0%'
  videoTime = {
    elapsed: 0,
    duration: 0,
    remaining: 0
  }
  caption: {
    language: 'EN',
    src: 'src/assets/sample-subtitles.vtt'
    color: 'blue'
  }
  className = 'cue-red'
  subtitleMap = new Map<number, Subtitle>();

  currentDisplay1 = 'Subtitles look like this.';
  currentDisplay2 = '';
  isUserInactive = false;
  subtitleDisplaySettings = {
    fontColor: 'white',
    backgroundColor: 'black',
    fontSize: 'black',
    textShadow: '3px 3px 5px black'
  }
  fontColorsList = ['white', 'black', 'red', 'blue', 'green', 'gray']
  subtitleSpanElementsList: any;
  fontSizeList = [
    { value: '1em', label: 'Juts' },
    { value: '1.5em', label: 'Medium' },
    { value: '2em', label: 'Daks' },
  ]
  player = {
    currentTime: 0
  }
  currentTime
  private ngUnsubscribe = new Subject();

  constructor(
    private ipcService: IpcService,
    private watchedService: WatchedService,
    private movieService: MovieService,
    private elementRef: ElementRef,
    private userIdleService: UserIdleService
  ) { }

  onNotIdle() {
    this.userIdleService.resetTimer()
    this.isUserInactive = false;
  }

  ngOnInit() {
    // this.streamLink = 'https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4' // 320p sample
    // this.streamLink = 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4' // 1080p sample
    this.userIdleService.startWatching()
    this.userIdleService.onTimerStart().pipe(takeUntil(this.ngUnsubscribe)).subscribe((_count) => { console.log('start! ', _count) });
    this.userIdleService.onIdleStatusChanged().pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      console.log("changed!", e)
    })
    this.userIdleService.onTimeout().pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      console.log("TIMEOUT!OUT!", e)
      this.isUserInactive = true;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cs = changes.streamLink
    if (cs && !cs.firstChange) {
      this.statsForNerds.source = this.streamLink;
    }
  }

  ngOnDestroy(): void {
    this.ipcService.stopStream()
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  ngAfterViewInit(): void {
    this.subtitleSpanElementsList = this.elementRef.nativeElement.querySelectorAll('.subtitle-span')

    if (environment.runConfig.electron) {
      this.ipcService.statsForNerdsSubscribable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(stats => {
        console.log(stats)
        if (stats) {
          this.statsForNerds.downSpeed = stats.downSpeed
          this.statsForNerds.upSpeed = stats.upSpeed
          this.statsForNerds.downloadedPieces = stats.downloadedPieces
          this.statsForNerds.ratio = stats.ratio
        }
      })
    }

    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.

    this.videoPlayerElement = this.elementRef.nativeElement.querySelector('#videoPlayer')

    this.togglePlay();

    // Mute/Unmute
    // this.videoPlayerElement.muted = true
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
      // this.watchedService.saveWatched({
      //   id: '',
      //   tmdbId: this.tmdbId,
      //   imdbId: this.imdbId,
      //   title: '',
      //   percentage: 100,
      //   year: 0});
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
      this.player.currentTime = this.videoPlayerElement.currentTime
      this.currentTime = this.player.currentTime
      for (let entry of this.subtitleMap.entries()) {
        if (this.player.currentTime >= this.convertToSeconds(entry[1].startTime) && this.player.currentTime <= this.convertToSeconds(entry[1].endTime)) {
          this.updateDisplaySubtitle(entry[1].captionText1, entry[1].captionText2)
          break;
        } else {
          this.updateDisplaySubtitle('', '')
          // this.updateDisplaySubtitle('\uD83D\uDE00', '\uD83D\uDE00') // emoji test
        }
      }
    })
    this.videoPlayerElement.addEventListener('loadedmetadata', (e) => {
      this.statsForNerds.resolution = this.videoPlayerElement.videoWidth + 'x' + this.videoPlayerElement.videoHeight

      // this.videoPlayer1.nativeElement.play()
    })
    const root = this
    setInterval((e) => {
      root.updateProgressBar()
      if (root.isPlaying) {
        // this.updateWatchedStatus(e)
      }
    }, 500)
  }

  onKeyPress(val: KeyboardEvent) {
    const key = val.key.toLowerCase()
    console.log(key)
    if (!val.shiftKey && !val.altKey && !val.ctrlKey && !val.metaKey) {

      switch (key) {
        case 'm':
          // toggle mute
          this.toggleMute()
          break;
        case 'f':
          this.toggleFullScreen()
          break;
        case 'k':
          // toggle pause/play
          this.togglePlay()
          break;
        case 'arrowup':
          // TODO: add maxvolume limit
          this.videoPlayerElement.volume += .2
          // keyCode: 38
          break;
        case 'arrowdown':
          // TODO: add min volume limit
          this.videoPlayerElement.volume -= .2
          // keyCode: 40
          break;
        case 'arrowleft':
          // TODO: add limiter for min allowable timestamp
          // this.videoPlayerElement.currentTime = '10'
          // keyCode: 37
          // toggl2e fullscreen
          break;
        case 'arrowright':
          // TODO: add limiter for max allowable timestamp
          // this.videoPlayerElement.currentTime = '20'
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
          // duration selector, 1 for 10% of duration, 2 20%, etc.
          this.videoPlayerElement.currentTime = parseFloat('.' + key) * this.videoPlayerElement.duration
          break;
        case '0':
        case 'home':
          // start of the video
          this.videoPlayerElement.currentTime = '0'
          break;
        case 'end':
          // end of the video
          this.videoPlayerElement.currentTime = this.videoPlayerElement.duration
          break;
        default:
          console.log('no hotkey')
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
    const isPlaying = this.videoPlayer1.nativeElement.currentTime > 0 && !this.videoPlayer1.nativeElement.paused && !this.videoPlayer1.nativeElement.ended
      && this.videoPlayer1.nativeElement.readyState > 2;
    // safely autoplay
    if (!isPlaying) {
      this.videoPlayer1.nativeElement.play();
    } else {
      this.videoPlayer1.nativeElement.pause();
    }
    // this.videoPlayer1.nativeElement.paused ? this.videoPlayer1.nativeElement.play() : this.videoPlayer1.nativeElement.pause()
  }

  /**
   * Toggles fullscreen for #videoPlayerOuter.
   * TODO: exit fullscreen functionality.
   */
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

  /**
   * Event for video player scrubber tooltip
   */
  mouseMove(e) {
    // console.log(e.offsetX)
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

  /**
   * Open file selector from electron side and return fullfilepath.
   */
  async changeCc() {

    // let filePath = 'Aliens.Directors.Cut.1986.1080p.BRrip.x264.GAZ.YIFY.srt'
    let filePath = 'Cinema Paradiso-English.srt'
    filePath = await this.ipcService.changeSubtitle()
    filePath = 'tmp/' + filePath
    console.log('filePath', filePath)

    const fileStr = await this.movieService.getSubtitleFileString(filePath).toPromise()
    let encodingStr = 'UTF-8'
    try {
      encodingStr = jschardet.detect(fileStr, { minimumThreshold: 0 }).encoding // errors with subs with `ó`
    } catch {
      const encodingAlt = chardet.analyse(fileStr)
      console.log(encodingAlt)
      if (encodingAlt.length > 1) {
        encodingStr = encodingAlt[1].name
      } else if (encodingAlt.length === 1) {
        encodingStr = encodingAlt[0].name
      }
    }
    const file = await this.movieService.getSubtitleFile(filePath).toPromise()

    let resultFileStr
    const fileReader = new FileReader()

    fileReader.readAsText(file, encodingStr);
    const root = this
    fileReader.onloadend = function (x) {
      resultFileStr = fileReader.result
      console.log(resultFileStr)
      resultFileStr = resultFileStr.replace(/[\r]+/g, '')
      root.subtitleMap = SubtitlesUtil.mapSubtitle(resultFileStr)
      console.log("subtitleMap!", root.subtitleMap)
    };
  }

  volumeChange(source: number) {
    this.volume = source
    this.videoPlayerElement.volume = this.volume * 0.01
  }

  toggleMute() {
    this.videoPlayerElement.muted = !this.videoPlayerElement.muted
  }

  updateProgressBar() {
    const DURATION = this.videoPlayerElement.duration
    const PLAYER1_BUFFERED = this.videoPlayer1.nativeElement.buffered

    this.played = this.watchedService.getPercentage(this.videoPlayerElement.currentTime, DURATION) + '%'

    if (PLAYER1_BUFFERED.length > 0) {
      PLAYER1_BUFFERED
      this.buffered = this.watchedService.getPercentage(PLAYER1_BUFFERED.end(0), DURATION) + '%'
      let currentBufferHealth = 0
      for (let index = 0; index < PLAYER1_BUFFERED.length; index++) {
        const bufferStart = PLAYER1_BUFFERED.start(index);
        const bufferEnd = PLAYER1_BUFFERED.end(index);
        currentBufferHealth += bufferEnd - bufferStart;
      }
      this.statsForNerds.bufferhealth = currentBufferHealth + 's | ' +
        this.watchedService.getPercentage(currentBufferHealth, DURATION) + '%'
    }
  }

  updateDisplaySubtitle(val1: string, val2: string) {
    this.currentDisplay1 = val1
    this.currentDisplay2 = val2
  }

  /**
   * converts HH:mm:ss format to seconds float.
   * @param hms time in HH:mm:ss format
   * @returns seconds equivalent
   */
  convertToSeconds(hms: string) {
    hms = hms.replace(',', '.');
    const a = hms.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds
  }

  changeFontSize(size: string) {
    this.setProperties('font-size', size)
    this.subtitleDisplaySettings.fontSize = size
  }
  changeFontColor(color: string) {
    this.setProperties('color', color)
    this.subtitleDisplaySettings.fontColor = color
  }
  changeBackgroundColor(color: string) {
    this.setProperties('background-color', color)
    this.subtitleDisplaySettings.backgroundColor = color
  }

  private setProperties(propName: string, propValue: string) {
    this.subtitleSpanElementsList.forEach(element => {
      element.style.setProperty(propName, propValue)
    });
  }
}

interface Stats {
  bufferhealth: string // in seconds
  connectionSpeed: string // might remove
  downloadedPieces: number // (pieces have.)
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
 * Convert seconds to HH:MM:SS format
 * @param value seconds
 */
@Pipe({ name: 'toHHMMSS' })
export class HHMMSSPipe implements PipeTransform {
  constructor() { }
  transform(value: number): string {
    if (!value) return '00:00'
    const minSec = new Date(value * 1000).toISOString().substr(14, 5)
    if (value < 3600) {
      return minSec
    }
    const hour = (value / 3600)
    return hour.toFixed(0) + ':' + minSec
  }
}
