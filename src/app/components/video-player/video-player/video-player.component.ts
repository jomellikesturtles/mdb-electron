import { Component, OnInit, Input, OnDestroy, AfterViewInit, ElementRef, OnChanges, SimpleChanges, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { Subject } from 'rxjs';
import { IpcService } from '@services/ipc.service';
import { MovieService } from '@services/movie.service';
import { WatchedService } from '@services/watched.service';
import SubtitlesUtil from '@utils/subtitles.utils';
import { Subtitle } from '@models/subtitle.model';
import { UserIdleService } from "angular-user-idle";
import chardet from "chardet";
import jschardet from "jschardet";
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { IPlaybackPreferences, ISubtitlePreferences } from '@models/preferences.model';
import { COLOR_LIST, FONT_SIZE_LIST } from '@shared/constants';
import GeneralUtil from '@utils/general.util';
import { PreferencesService } from '@services/preferences.service';

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

  @ViewChild('videoPlayer1', { static: true }) videoPlayer1: ElementRef
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
  subtitleMap = new Map<number, Subtitle>();

  currentDisplay1 = 'Subtitles look like this.';
  currentDisplay2 = '';
  isUserInactive = false;
  subtitleDisplaySettings: ISubtitlePreferences = this.preferencesService.getPreferences().subtitle
  playbackSettings: IPlaybackPreferences = this.preferencesService.getPreferences().playBack
  fontColorsList = COLOR_LIST
  subtitleSpanElementsList: any;
  fontSizeList = FONT_SIZE_LIST
  player = {
    currentTime: 0
  }
  currentTime
  canPlay = false
  isMetadataLoaded = false
  seekTooltip = ''
  private ngUnsubscribe = new Subject();

  constructor(
    private ipcService: IpcService,
    private watchedService: WatchedService,
    private movieService: MovieService,
    private elementRef: ElementRef,
    private userIdleService: UserIdleService,
    private preferencesService: PreferencesService
  ) { console.log('VIDEOPLAYER CONSTRUCTOR') }

  onNotIdle() {
    this.userIdleService.resetTimer()
    this.isUserInactive = false;
  }

  ngOnInit() {
    // this.streamLink = 'https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4' // 320p sample
    // this.streamLink = 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4' // 1080p sample
    // this.streamLink = '../../../../assets/sample movie/Ratatouille (2007) [1080p]/Ratatouille.2007.1080p.BrRip.x264.YIFY.mp4'
    this.userIdleService.startWatching()
    this.userIdleService.onTimerStart().pipe(takeUntil(this.ngUnsubscribe)).subscribe((_count) => { console.log('start! ', _count) });
    this.userIdleService.onIdleStatusChanged().pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      console.log("changed!", e)
    })
    this.isMetadataLoaded = true
    this.userIdleService.onTimeout().pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      console.log("TIMEOUT!OUT!", e)
      this.isUserInactive = true;
    })
    console.log('VIDEOPLAYER ngOnInit')
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

    this.videoPlayerElement = this.elementRef.nativeElement.querySelectorAll('#videoPlayer')
    // this.videoPlayerElement = this.videoPlayer1.nativeElement as HTMLVideoElement

    console.log(this.videoPlayerElement)
    this.videoPlayerElement = this.videoPlayerElement[0]
    // console.log(this.videoPlayer1)
    this.togglePlay();

    //   // Mute/Unmute
    //   // this.videoPlayerElement.muted = true
    this.videoPlayerElement.addEventListener('canplay', (e) => {
      console.log('canplay', e)
      this.canPlay = true
      this.videoTime.duration = this.videoPlayerElement.duration
      this.isSeeking = false
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
      // console.log('progress', e)
    })
    this.videoPlayerElement.addEventListener('seeked', (e) => {
      console.log('seeked', e)
      this.updateProgressBar()
      this.isSeeking = false
    })
    this.videoPlayerElement.addEventListener('seeking', (e) => {
      console.log('seeking', e)
      this.isSeeking = true
    })
    this.videoPlayerElement.addEventListener('stalled', (e) => {
      console.log('stalled', e)
      this.isSeeking = true
    })
    this.videoPlayerElement.addEventListener('suspend', (e) => {
      // console.log('onSuspend', e)
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
      this.isMetadataLoaded = true
      this.statsForNerds.resolution = this.videoPlayerElement.videoWidth + 'x' + this.videoPlayerElement.videoHeight
    })
    const root = this
    setInterval((e) => {
      if (root.isPlaying) {
        root.updateProgressBar()
        // this.updateWatchedStatus(e)
      }
    }, 500)
  }

  isSeeking = false
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
    const isPlaying = this.videoPlayerElement.currentTime > 0 && !this.videoPlayerElement.paused && !this.videoPlayerElement.ended
      && this.videoPlayerElement.readyState > 2;
    // safely autoplay
    if (!isPlaying) {
      this.videoPlayerElement.play();
    } else {
      this.videoPlayerElement.pause();
    }
  }

  /**
   * Toggles fullscreen for #videoPlayerOuter.
   * TODO: exit fullscreen functionality.
   */
  toggleFullScreen() {

    const playerOuter = this.elementRef.nativeElement.querySelector('#videoPlayerOuter')
    // if (playerOuter.fullscreenElement) {
    if (document['webkitIsFullScreen']) {
      document.exitFullscreen();
      // }
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

  toSeek: number = 0
  /**
   * Event for video player scrubber tooltip
   */
  mouseMove(e) {
    this.seekTooltip = GeneralUtil.convertToHHMMSS(this.calculateSeekSeconds(e))
  }

  seek() {
    this.videoPlayerElement.currentTime = this.toSeek
  }

  private calculateSeekSeconds(val) {
    const totalWidth = val.currentTarget.offsetWidth
    const offsetX = val.offsetX
    const percentage = this.watchedService.getPercentage(offsetX, totalWidth)
    this.toSeek = (percentage / 100) * this.videoPlayerElement.duration
    return this.toSeek
  }

  /**
   * Open file selector from electron side and return fullfilepath.
   */
  async changeCc() {

    // let filePath = 'Aliens.Directors.Cut.1986.1080p.BRrip.x264.GAZ.YIFY.srt'
    let filePath = 'Cinema Paradiso-English.srt'
    // filePath = await this.ipcService.changeSubtitle()
    filePath = '../../../../assets/tmp/' + filePath
    // filePath = 'tmp/' + filePath
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
    const PLAYER1_BUFFERED = this.videoPlayerElement.buffered

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

  savePreferences() {
    this.preferencesService.preferences['subtitle'] = this.subtitleDisplaySettings
    this.preferencesService.preferences['playBack'] = this.playbackSettings
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
    return GeneralUtil.convertToHHMMSS(value);
  }
}
