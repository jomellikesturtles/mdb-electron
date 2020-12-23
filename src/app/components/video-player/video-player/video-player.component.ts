import { Component, OnInit, Input, OnDestroy, AfterViewInit, ElementRef, OnChanges, SimpleChanges, ViewChild, PipeTransform, Pipe, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { IpcService } from 'src/app/services/ipc.service';
import { MovieService } from 'src/app/services/movie.service';
import { WatchedService } from 'src/app/services/watched.service';
import SubtitlesUtil from 'src/app/utils/subtitles.utils';
import { Subtitle } from 'src/app/models/subtitle.model';
import { UserIdleService } from "angular-user-idle";
import chardet from "chardet";
import jschardet from "jschardet";
import { environment } from 'src/environments/environment';

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
  src: 'src/assets/sample-subtitles.vtt'
  caption: {
    language: 'EN',
    // src: './assets/sample-subtitles.vtt'
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
  fontColorsList = ['White', 'Black', 'Red', '"blue"', '"green"', '"gray"']
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
  constructor(
    private ipcService: IpcService,
    private watchedService: WatchedService,
    private movieService: MovieService,
    private ngZone: NgZone,
    private elementRef: ElementRef,
    private userIdleService: UserIdleService
  ) { }

  onNotIdle() {
    this.userIdleService.resetTimer()
    this.isUserInactive = false;
  }

  ngOnInit() {
    this.userIdleService.startWatching()
    this.userIdleService.onTimerStart().subscribe((_count) => { console.log('start! ', _count) });
    this.userIdleService.onIdleStatusChanged().subscribe(e => {
      console.log("changed!", e)
    })
    this.userIdleService.onTimeout().subscribe(e => {
      console.log("TIMEOUT!OUT!", e)
      this.isUserInactive = true;
    })

    // var buf = new TextEncoder().encode('Hello world').buffer;
    // console.log(buf);
    // create a dataView
    // var view = new DataView(buf);
    // console.log(view.getUint8(0));
    // // now you can iterate and modify your arrayBuffer from this view.
    // view.setUint8(0, 23);
    // console.log(new Uint8Array(buf)[0]);

    // chardet.detectFile('assets/Cinema Paradiso-English.srt').then(encoding => { console.log('encoding'.toUpperCase(), encoding) });

    // ------------------------------------------
    // this.movieService.getSubtitleFileString('assets/Cinema Paradiso-English.srt').subscribe((resultFileStr) => {

    //   console.log(jschardet.detect(resultFileStr, { minimumThreshold: 0 }))

    //   resultFileStr = resultFileStr.replace(/[\r]+/g, '')
    //   console.log(jschardet.detect(resultFileStr))
    //   console.log('match: ', chardet.analyse(Buffer.from(resultFileStr)))

    //   // chardet.detectFile('file:///C:\\Users\\jomme\\Downloads\\Cinema Paradiso (1988) [BluRay] [1080p] [YTS.AM]\\cinema-paradiso-1988-english-yify-131744\\Cinema Paradiso-English.srt').then(encoding => console.log('encoding', encoding));
    // })
    // this.movieService.getSubtitleFile('assets/Cinema Paradiso-English.srt').subscribe((resultFile) => {
    //   let resultFileStr
    //   const fileReader = new FileReader()
    //   const encoding = jschardet.detect(resultFileStr, { minimumThreshold: 0 }).encoding
    //   fileReader.readAsText(resultFile, encoding);
    //   const root = this
    //   fileReader.onloadend = function (x) {
    //     resultFileStr = fileReader.result
    //     console.log(resultFileStr)
    //     resultFileStr = resultFileStr.replace(/[\r]+/g, '')
    //     root.subtitleMap = SubtitlesUtil.mapSubtitle(resultFileStr)
    //     console.log("subtitleMap!", root.subtitleMap)
    //   };
    //   // resultFile = resultFile.replace(/[\r]+/g, '')
    //   // const buf = Buffer.from(resultFile, 'ucs2')
    //   // const buf = Buffer.from(resultFileStr, 'iso88592')
    //   //  * Valid string encodings in Node 0.12: 'ascii'|'utf8'|'utf16le'|'ucs2'(alias of 'utf16le')|'base64'|'binary'(deprecated)|'hex'
    //   // console.log('BUF', buf)
    // }
    // )
    // ------------------------------------------
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cs = changes.streamLink
    if (cs && !cs.firstChange) {
      this.statsForNerds.source = this.streamLink;
    }
  }

  ngOnDestroy(): void {
    // this.ipcService.stopStream()
  }

  ngAfterViewInit(): void {
    this.afterView = true
    this.subtitleSpanElementsList = this.elementRef.nativeElement.querySelectorAll('.subtitle-span')
    if (environment.runConfig.electron) {
      // this.ipcService.statsForNerdsSubscribable.subscribe(stats => {
      //   console.log(stats)
      //   if (stats) {
      //     // this.statsForNerds.downSpeed = stats.downSpeed
      //     // this.statsForNerds.upSpeed = stats.upSpeed
      //     // this.statsForNerds.downloadedPieces= stats.downloadedPieces
      //     // this.statsForNerds.ratio = stats.ratio
      //   }
      // })
    }

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
          // this.updateDisplaySubtitle('\uD83D\uDE00', '\uD83D\uDE00')
        }
      }
    })
    this.videoPlayerElement.addEventListener('loadedmetadata', (e) => {
      console.log('loadedmetadata')
      this.subtitleMap.forEach(e => {
        // this.videoPlayerElement.addCue(new VTTCue(e.))
        // e.
      })
      // const a = new
    })
    // this.ngZone.runOutsideAngular(() => {
    const root = this
    setInterval((e) => {
      root.updateProgressBar()
      if (root.isPlaying) {
        // this.updateWatchedStatus(e)
      }
    }, 500)
    // })
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
          // toggl2e fullscreen
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
   *
   */
  async changeCc() {

    console.log('=======================================')

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
    if (this.videoPlayer1.nativeElement.buffered.length > 0) {
      this.buffered = this.watchedService.getPercentage(this.videoPlayer1.nativeElement.buffered.end(0), duration) + '%'
    }
  }

  updateDisplaySubtitle(val1: string, val2: string) {
    this.currentDisplay1 = val1
    this.currentDisplay2 = val2
  }

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
