// TODO: replacement for angular-user-idle

import { Component, OnInit, Input, OnDestroy, AfterViewInit, ElementRef, OnChanges, SimpleChanges, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { Subject } from 'rxjs';
import { IpcService } from '@services/ipc.service';
import { MovieService } from '@services/movie/movie.service';
import { PlayedService } from '@services/media/played.service';
import SubtitlesUtil from '@utils/subtitles.utils';
import { Subtitle } from '@models/subtitle.model';
import chardet from "chardet";
import jschardet from "jschardet";
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { IPlaybackPreferences, ISubtitlePreferences } from '@models/preferences.model';
import { COLOR_LIST, FONT_SIZE_LIST } from '@shared/constants';
import GeneralUtil from '@utils/general.util';
import { PreferencesService } from '@services/preferences.service';
import { IProgressBar, VideoPlayerControlsComponent } from './video-player-controls/video-player-controls.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() streamLink: SafeUrl;
  @Input() id: string;
  @Input() tmdbId: number;
  @Input() imdbId: string;
  @Input() title: string;

  @ViewChild('videoPlayer1', { static: true }) videoPlayer1: ElementRef;
  @ViewChild(VideoPlayerControlsComponent, { static: true }) child;
  @ViewChild('tooltipSpan', { static: false }) tooltipSpan: ElementRef;

  DEFAULT_VOLUME = 50;
  isPlaying = false;
  isMuted = false;
  volume = this.DEFAULT_VOLUME;
  videoPlayerElement;
  isShowStatus = false;
  isShowSubtitles = true;
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
  };
  videoTime = {
    elapsed: 0,
    duration: 0,
    remaining: 0
  };
  progressBar: IProgressBar = {
    buffered: '0%',
    played: '0%',
  };
  subtitleMap = new Map<number, Subtitle>();

  subtitleLine1 = this.sanitizeSubtitle('<i>Subtitle line 1 look like this.</i>');
  subtitleLine2 = this.sanitizeSubtitle('<span style="cursor:pointer; color:red"><b cursor="pointer">Luke,</b></span> I am your father <button>hey</button>');
  // subtitleLine2 = '<b><i><font face="Tempus Sans ITC" color="#ffff80" size="30">"Spice Girls : Viva Forever"</font></i></b>';
  // subtitleLine1 = 'Subtitle line 1 look like this.';
  // subtitleLine2 = 'Subtitle line 2 look like this.';
  isUserInactive = false;
  subtitleDisplaySettings: ISubtitlePreferences = this.preferencesService.getPreferences().subtitle;
  playbackSettings: IPlaybackPreferences = this.preferencesService.getPreferences().playBack;
  fontColorsList = COLOR_LIST;
  subtitleSpanElementsList: any[];
  fontSizeList = FONT_SIZE_LIST;
  canPlay = false;
  isMetadataLoaded = false;
  isSeeking = false;
  toSeek: number = 0;
  private ngUnsubscribe = new Subject();

  constructor(
    private ipcService: IpcService,
    private playedService: PlayedService,
    private movieService: MovieService,
    private elementRef: ElementRef,
    // private userIdleService: UserIdleService,
    private preferencesService: PreferencesService,
    private sanitizer: DomSanitizer
  ) { GeneralUtil.DEBUG.log('VIDEOPLAYER CONSTRUCTOR'); }

  onNotIdle() {
    // this.userIdleService.resetTimer();
    this.isUserInactive = false;
  }

  ngOnInit() {


    // this.streamLink = this.sanitizer.bypassSecurityTrustUrl(rawUrl);

    // this.streamLink = 'https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4' // 320p sample
    // this.streamLink = 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4' // 1080p sample
    // this.streamLink = '../../../../assets/sample movie/Ratatouille (2007) [1080p]/Ratatouille.2007.1080p.BrRip.x264.YIFY.mp4'
    // this.userIdleService.startWatching();
    // this.userIdleService.onTimerStart().pipe(takeUntil(this.ngUnsubscribe)).subscribe((_count) => { GeneralUtil.DEBUG.log('start! ', _count); });
    // this.userIdleService.onIdleStatusChanged().pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
    //   GeneralUtil.DEBUG.log("changed!", e);
    // });
    // this.userIdleService.onTimeout().pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
    //   GeneralUtil.DEBUG.log("TIMEOUT!OUT!", e);
    //   // this.isUserInactive = true;
    // });

    const prefs = this.preferencesService.getPreferences();
    if (prefs) {
      this.subtitleDisplaySettings = { ...prefs.subtitle };
      this.playbackSettings = { ...prefs.playBack };
    }
    // setTimeout(() => {
    //   root.isShowSubtitles = false;
    // }, 5000);

    GeneralUtil.DEBUG.log('1. VIDEOPLAYER ngOnInit');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cs = changes.streamLink;
    if (cs) {
      GeneralUtil.DEBUG.log('2. cs:', cs);
      GeneralUtil.DEBUG.log('this.streamLink:', this.streamLink);
      // if (cs && !cs.firstChange) {
      this.statsForNerds.source = this.streamLink.toString();
      this.isMetadataLoaded = true;
      GeneralUtil.DEBUG.log('isMetadataLoaded true');

      const root = this;
      let checkExist = setInterval(function () {
        root.videoPlayerElement = root.elementRef.nativeElement.querySelectorAll('#videoPlayer');
        if (root.videoPlayerElement.length > 0) {
          root.canPlay = true;
          GeneralUtil.DEBUG.log("3. videoPlayer Exists!");
          root.videoPlayerEvents();
          clearInterval(checkExist);
        }
      }, 100); // check every 100ms

    }
  }

  ngAfterViewInit(): void {

    if (environment.runConfig.electron) {
      this.ipcService.statsForNerdsSubscribable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(stats => {
        GeneralUtil.DEBUG.log(stats);
        if (stats) {
          this.statsForNerds.downSpeed = stats.downSpeed;
          this.statsForNerds.upSpeed = stats.upSpeed;
          this.statsForNerds.downloadedPieces = stats.downloadedPieces;
          this.statsForNerds.ratio = stats.ratio;
        }
      });
    }
  }

  ngOnDestroy(): void {
    GeneralUtil.DEBUG.log('ondestroy');
    this.canPlay = false;
    // this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ipcService.stopStream();
    GeneralUtil.DEBUG.log('DESTROYED');
  }

  videoPlayerEvents() {

    // this.videoPlayerElement = this.videoPlayer1.nativeElement as HTMLVideoElement
    GeneralUtil.DEBUG.log('4. videoPlayerEvents, videoPlayerElement: ', this.videoPlayerElement);
    this.videoPlayerElement = this.videoPlayerElement[0];
    // GeneralUtil.DEBUG.log(this.videoPlayer1)


    //   // Mute/Unmute
    //   // this.videoPlayerElement.muted = true
    this.videoPlayerElement.addEventListener('canplay', (e) => {
      this.subtitleSpanElementsList = this.elementRef.nativeElement.querySelectorAll('.subtitle-span');
      GeneralUtil.DEBUG.log('EVENT: canplay', e);
      this.canPlay = true;
      this.videoTime.duration = this.videoPlayerElement.duration;
      // this.togglePlay();
      this.isSeeking = false;
    });
    this.videoPlayerElement.addEventListener('durationchange', (e) => {
      GeneralUtil.DEBUG.log('EVENT: durationchange', e);
    });
    this.videoPlayerElement.addEventListener('ended', (e) => {
      this.isPlaying = false;
      GeneralUtil.DEBUG.log('EVENT: ended', e);
      // this.playedService.saveWatched({
      //   id: '',
      //   tmdbId: this.tmdbId,
      //   imdbId: this.imdbId,
      //   title: '',
      //   percentage: 100,
      //   year: 0});
    });
    this.videoPlayerElement.addEventListener('error', (e) => {
      GeneralUtil.DEBUG.log('EVENT: error', e);
    });
    this.videoPlayerElement.addEventListener('pause', (e) => {
      this.isPlaying = false;
      GeneralUtil.DEBUG.log('EVENT: pause', e);
    });
    this.videoPlayerElement.addEventListener('play', (e) => {
      this.isPlaying = true;
      GeneralUtil.DEBUG.log('EVENT: play', e);
    });
    this.videoPlayerElement.addEventListener('playing', (e) => {
      this.isPlaying = true;
      GeneralUtil.DEBUG.log('EVENT: playing', e);
    });
    this.videoPlayerElement.addEventListener('progress', (e) => {
      // GeneralUtil.DEBUG.log('progress', e)
    });
    this.videoPlayerElement.addEventListener('seeked', (e) => {
      GeneralUtil.DEBUG.log('EVENT: seeked', e);
      this.updateProgressBar();
      this.isSeeking = false;
    });
    this.videoPlayerElement.addEventListener('seeking', (e) => {
      GeneralUtil.DEBUG.log('EVENT: seeking', e);
      this.isSeeking = true;
    });
    this.videoPlayerElement.addEventListener('stalled', (e) => {
      GeneralUtil.DEBUG.log('EVENT: stalled', e);
      this.isSeeking = true;
    });
    this.videoPlayerElement.addEventListener('suspend', (e) => {
      // GeneralUtil.DEBUG.log('onSuspend', e)
    });
    this.videoPlayerElement.addEventListener('timeupdate', (e) => {
      this.videoTime.elapsed = this.videoPlayerElement.currentTime;
      let matched = false;
      for (let entry of this.subtitleMap.values()) {
        if (this.videoTime.elapsed >= this.convertToSeconds(entry.startTime) && this.videoTime.elapsed <= this.convertToSeconds(entry.endTime)) {
          this.updateDisplaySubtitle(entry.captionText1, entry.captionText2);
          matched = true;
          break;
        }
      }
      if (!matched) {
        this.updateDisplaySubtitle('', '');
      }
    });
    this.videoPlayerElement.addEventListener('loadedmetadata', (e) => {
      GeneralUtil.DEBUG.log('EVENT: loadedmetadata', e);
      this.isMetadataLoaded = true;
      this.statsForNerds.resolution = this.videoPlayerElement.videoWidth + 'x' + this.videoPlayerElement.videoHeight;
    });

    // MIGRATED
    const root = this;
    setInterval((e) => {
      if (root.isPlaying) {
        root.updateProgressBar();
        // this.updateWatchedStatus(e)
      }
    }, 500);
    // END OF MIGRATED
  }

  onKeyPress(val: KeyboardEvent) {
    const key = val.key.toLowerCase();
    GeneralUtil.DEBUG.log(val);
    if (!val.shiftKey && !val.altKey && !val.ctrlKey && !val.metaKey) {

      switch (key) {
        case 'm':
          // toggle mute
          this.toggleMute();
          break;
        case 'f':
          this.toggleFullScreen();
          break;
        case 'k':
        case ' ':
          // toggle pause/play
          this.togglePlay();
          break;
        case 'arrowup':
          try {
            this.videoPlayerElement.volume += .2;
          } catch (e) {
            this.videoPlayerElement.volume = 1;
          }
          // keyCode: 38
          break;
        case 'arrowdown':
          try {
            this.videoPlayerElement.volume -= .2;
          } catch (e) {
            this.videoPlayerElement.volume = 0;
          }
          // keyCode: 40
          break;
        case 'arrowleft':
          try {
            this.videoPlayerElement.currentTime -= 10;
          } catch (e) {
            this.videoPlayerElement.currentTime = 0;
          }

          // keyCode: 37
          // toggl2e fullscreen
          break;
        case 'arrowright':
          try {
            this.videoPlayerElement.currentTime += 10;
          } catch (e) {
            this.videoPlayerElement.currentTime = this.videoPlayerElement.duration;
          }
          // keyCode: 39
          break;
        case 'pageup':
          this.videoPlayerElement.volume = '1';
          break;
        case 'pagedown':
          this.videoPlayerElement.volume = '0';
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
          this.videoPlayerElement.currentTime = parseFloat('.' + key) * this.videoPlayerElement.duration;
          break;
        case '0':
        case 'home':
          // start of the video
          this.videoPlayerElement.currentTime = '0';
          break;
        case 'end':
          // end of the video
          this.videoPlayerElement.currentTime = this.videoPlayerElement.duration;
          break;
        default:
          GeneralUtil.DEBUG.log('no hotkey');
          break;
      }
    }
  }

  updateWatchedStatus(val: any) {

  }

  togglePlay() {
    const isPlaying = this.videoPlayerElement.currentTime > 0 && !this.videoPlayerElement.paused && !this.videoPlayerElement.ended
      && this.videoPlayerElement.readyState > 2;
    GeneralUtil.DEBUG.log('5. togglePlay, isPlaying: ', isPlaying);
    // safely autoplay
    if (!isPlaying && this.canPlay) {
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

    const playerOuter = this.elementRef.nativeElement.querySelector('#videoPlayerOuter');
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

  onSeek(seekValue: number) {
    this.videoPlayerElement.currentTime = seekValue;
  }

  /**
   * Open file selector from electron side and return fullfilepath.
   */
  async onChangeCc(fileOrPath: any) {
    if (environment.runConfig.electron && typeof fileOrPath === 'string') {
      try {
        let resultFileStr = (window as any).electron.readSubtitleFile(fileOrPath);
        resultFileStr = resultFileStr.replace(/[\r]+/g, '');
        this.subtitleMap = SubtitlesUtil.mapSubtitle(resultFileStr);
        GeneralUtil.DEBUG.log("subtitleMap loaded via preload:", this.subtitleMap);
        return;
      } catch (err) {
        GeneralUtil.DEBUG.error("Failed to read subtitle via preload, falling back:", err);
      }
    }

    let resultFileStr = '';
    if (fileOrPath instanceof File) {
      const fileReader = new FileReader();
      const readAsBinaryPromise = (f: File) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsBinaryString(f);
      });
      const readAsTextPromise = (f: File, enc: string) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsText(f, enc);
      });

      const binaryStr = await readAsBinaryPromise(fileOrPath);
      let encodingStr = 'UTF-8';
      try {
        encodingStr = jschardet.detect(binaryStr, { minimumThreshold: 0 }).encoding || 'UTF-8';
      } catch {
        const encoder = new TextEncoder();
        const encodingAlt = chardet.analyse(encoder.encode(binaryStr));
        if (encodingAlt.length > 0) {
          encodingStr = encodingAlt[0].name;
        }
      }

      resultFileStr = await readAsTextPromise(fileOrPath, encodingStr);
    } else if (typeof fileOrPath === 'string') {
      const fileStr = await this.movieService.getSubtitleFileString(fileOrPath).toPromise();
      let encodingStr = 'UTF-8';
      try {
        encodingStr = jschardet.detect(fileStr, { minimumThreshold: 0 }).encoding;
      } catch {
        const encoder = new TextEncoder();
        const encodingAlt = chardet.analyse(encoder.encode(fileStr));
        if (encodingAlt.length > 1) {
          encodingStr = encodingAlt[0].name;
        }
      }
      const file = await this.movieService.getSubtitleFile(fileOrPath).toPromise();
      const fileReader = new FileReader();
      const readPromise = new Promise<string>((resolve) => {
        fileReader.onload = () => resolve(fileReader.result as string);
      });
      fileReader.readAsText(file, encodingStr);
      resultFileStr = await readPromise;
    }

    if (resultFileStr) {
      resultFileStr = resultFileStr.replace(/[\r]+/g, '');
      this.subtitleMap = SubtitlesUtil.mapSubtitle(resultFileStr);
      GeneralUtil.DEBUG.log("subtitleMap loaded from HTTP/File:", this.subtitleMap);
    }
  }

  changeVolume(source: number) {
    this.volume = source;
    this.videoPlayerElement.volume = this.volume * 0.01;
  }

  toggleMute() {
    this.videoPlayerElement.muted = !this.videoPlayerElement.muted;
  }

  updateProgressBar() {
    const DURATION = this.videoPlayerElement.duration;
    const BUFFERED = this.videoPlayerElement.buffered;

    this.progressBar.played = GeneralUtil.getPercentage(this.videoPlayerElement.currentTime, DURATION) + '%';
    if (BUFFERED.length > 0) {
      this.progressBar.buffered = GeneralUtil.getPercentage(BUFFERED.end(0), DURATION) + '%';
      let currentBufferHealth = 0;
      for (let index = 0; index < BUFFERED.length; index++) {
        const bufferStart = BUFFERED.start(index);
        const bufferEnd = BUFFERED.end(index);
        currentBufferHealth += bufferEnd - bufferStart;
      }
      this.statsForNerds.bufferhealth = currentBufferHealth + 's | ' +
        GeneralUtil.getPercentage(currentBufferHealth, DURATION) + '%';
    }
  }

  updateDisplaySubtitle(val1: string, val2: string) {
    this.subtitleLine1 = this.sanitizeSubtitle(val1);
    this.subtitleLine2 = this.sanitizeSubtitle(val2);
  }

  private sanitizeSubtitle(value: string) {
    value.includes('Luke');
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  // referenceWords
  referenceWords = ['Luke'];
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
    return seconds;
  }

  savePreferences() {
    this.preferencesService.preferences['subtitle'] = this.subtitleDisplaySettings;
    this.preferencesService.preferences['playBack'] = this.playbackSettings;
  }

  changeFontSize(size: string) {
    this.setProperties('font-size', size);
    this.subtitleDisplaySettings.fontSize = size;
  }
  changeFontColor(color: string) {
    this.setProperties('color', 'rgba(' + color + ',1)');
    this.subtitleDisplaySettings.fontColor = color;
  }
  // font outline, shadow, family,
  changeBackgroundColor(color: string) {
    this.setProperties('background-color', 'rgba(' + color + ',' + this.subtitleDisplaySettings.backgroundOpacity + ')');
    this.subtitleDisplaySettings.backgroundColor = color;
  }
  changeBackgroundOpacity(percentage: string) {
    this.setProperties('background-color', 'rgba(' + this.subtitleDisplaySettings.backgroundColor + ',' + percentage + ')');
    this.subtitleDisplaySettings.backgroundOpacity = percentage;
  }
  // background outline
  // window
  private setProperties(propName: string, propValue: string) {
    this.subtitleSpanElementsList.forEach(element => {
      element.style.setProperty(propName, propValue);
    });
  }
}

interface Stats {
  bufferhealth: string; // in seconds
  connectionSpeed: string; // might remove
  downloadedPieces: number; // (pieces have.)
  downSpeed: string; // leech speed
  upSpeed: string; // seed speed
  ratio: string; // downloaded/uploaded ratio
  // codec
  id: string; // hash/id
  source: string; // stream link
  size: string;
  resolution: string;
}

