// TODO: replacement for angular-user-idle

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ElementRef, OnChanges, SimpleChanges, ViewChild, PipeTransform, Pipe, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { IpcService } from '@services/ipc.service';
import { MovieService } from '@services/movie/movie.service';
import { PlayedService } from '@services/media/played.service';
import { ProgressService } from '@services/progress.service';
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
import { FeatureName, FeatureToggleService } from '@core/services/feature-toggle.service';

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
  @Output() onClose = new EventEmitter<void>();

  @ViewChild('videoPlayer1', { static: true }) videoPlayer1: ElementRef;
  @ViewChild(VideoPlayerControlsComponent, { static: true }) child;
  @ViewChild('tooltipSpan', { static: false }) tooltipSpan: ElementRef;
  @ViewChild('chatScrollContainer', { static: false }) chatScrollContainer: ElementRef;

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
  canPlay = true;
  isMetadataLoaded = false;
  showAiChat = false;
  aiMessages: Array<{ sender: 'user' | 'ai', text: string }> = [];
  aiInput = '';
  isAiTyping = false;
  isSeeking = false;
  toSeek: number = 0;
  private lastSavedTime = 0;
  private isSavedAsPlayed = false;
  private ngUnsubscribe = new Subject();

  actionOverlayText = '';
  actionOverlayIcon = '';
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private sourceNode: MediaElementAudioSourceNode;

  private overlayTimeoutHandle: any;
  private idleTimeout: any;
  private onFullscreenChangeFn: any;

  constructor(
    private ipcService: IpcService,
    private playedService: PlayedService,
    private movieService: MovieService,
    private elementRef: ElementRef,
    private preferencesService: PreferencesService,
    private sanitizer: DomSanitizer,
    private featureToggleService: FeatureToggleService,
    private cdr: ChangeDetectorRef,
    private progressService: ProgressService
  ) { GeneralUtil.DEBUG.log('VIDEOPLAYER CONSTRUCTOR'); }

  goBack(): void {
    if (this.onClose.observers.length > 0) {
      this.onClose.emit();
    } else {
      window.history.back();
    }
  }

  isFeatureEnabled(featureName: FeatureName): boolean {
    return this.featureToggleService.isEnabled(featureName);
  }

  toggleAiChat() {
    this.showAiChat = !this.showAiChat;
    if (this.showAiChat && this.aiMessages.length === 0) {
      this.aiMessages.push({
        sender: 'ai',
        text: `Hi! I'm your MDB AI Assistant. Ask me anything about "${this.title || 'this movie'}"!`
      });
    }
    this.scrollToBottom();
  }

  sendAiMessage() {
    if (!this.aiInput.trim()) return;
    const userMsg = this.aiInput;
    this.aiMessages.push({ sender: 'user', text: userMsg });
    this.aiInput = '';
    this.isAiTyping = true;
    this.scrollToBottom();

    setTimeout(() => {
      this.isAiTyping = false;
      this.aiMessages.push({
        sender: 'ai',
        text: this.getMockAiResponse(userMsg)
      });
      this.scrollToBottom();
    }, 1200);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatScrollContainer) {
        const element = this.chatScrollContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  getMockAiResponse(query: string): string {
    const q = query.toLowerCase();
    const title = this.title ? this.title.toLowerCase() : 'this movie';

    if (q.includes('cast') || q.includes('actor') || q.includes('who stars')) {
      if (title.includes('jungle') || title.includes('welcome')) {
        return `"${this.title}" features a star-studded ensemble cast including Akshay Kumar, Suniel Shetty, Arshad Warsi, Jacqueline Fernandez, Disha Patani, and Raveena Tandon.`;
      }
      return `This movie features a cast including the primary actors listed in the cast tab of the details page.`;
    }

    if (q.includes('director') || q.includes('directed')) {
      if (title.includes('jungle') || title.includes('welcome')) {
        return `"${this.title}" is directed by Ahmed Khan, with a screenplay written by Farhad Samji.`;
      }
      return `You can find the director listed on the movie details screen.`;
    }

    if (q.includes('plot') || q.includes('story') || q.includes('what is it about')) {
      if (title.includes('jungle') || title.includes('welcome')) {
        return `"${this.title}" is about a group of quirky characters who get stuck in a dangerous jungle during a chaotic mission. Filled with confusion, criminals, and hilarious situations, they must work together to survive and find their way out.`;
      }
      return `This movie is an exciting title on our MDB platform. Check the details page for a full plot description!`;
    }

    const defaults = [
      `That's an interesting question about "${this.title || 'this movie'}". Based on TMDB data, it was released in ${title.includes('jungle') ? '2026' : 'the year specified in the details page'} and is highly anticipated by fans of the genre!`,
      `I'm currently running in offline mock mode, but "${this.title || 'this movie'}" seems like an amazing watch! Let me know if you want to know about the cast or directors!`,
      `Fun fact: "${this.title || 'this movie'}" features great cinematography and a compelling score. Is there a specific scene or plot point you're curious about?`
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  onNotIdle() {
    this.isUserInactive = false;
    this.cdr.detectChanges();
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    this.idleTimeout = setTimeout(() => {
      this.isUserInactive = true;
      this.cdr.detectChanges();
    }, 5000);
  }

  showActionOverlay(icon: string, text: string) {
    this.actionOverlayIcon = '';
    this.actionOverlayText = '';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.actionOverlayIcon = icon;
      this.actionOverlayText = text;
      this.cdr.detectChanges();

      if (this.overlayTimeoutHandle) {
        clearTimeout(this.overlayTimeoutHandle);
      }
      this.overlayTimeoutHandle = setTimeout(() => {
        this.actionOverlayIcon = '';
        this.actionOverlayText = '';
        this.cdr.detectChanges();
      }, 800);
    });
  }

  ngOnInit() {
    this.onNotIdle();


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

    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    if (this.overlayTimeoutHandle) {
      clearTimeout(this.overlayTimeoutHandle);
    }
    if (this.onFullscreenChangeFn) {
      document.removeEventListener('fullscreenchange', this.onFullscreenChangeFn);
      document.removeEventListener('webkitfullscreenchange', this.onFullscreenChangeFn);
      document.removeEventListener('mozfullscreenchange', this.onFullscreenChangeFn);
      document.removeEventListener('MSFullscreenChange', this.onFullscreenChangeFn);
    }
    if (this.audioContext) {
      this.audioContext.close().catch(err => GeneralUtil.DEBUG.error(err));
    }
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
      this.showActionOverlay('pause', 'Pause');
    });
    this.videoPlayerElement.addEventListener('play', (e) => {
      this.isPlaying = true;
      GeneralUtil.DEBUG.log('EVENT: play', e);
      this.showActionOverlay('play_arrow', 'Play');
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

    this.videoPlayerElement.addEventListener('volumechange', (e) => {
      if (this.volume > 100 && this.videoPlayerElement.volume === 1.0 && !this.videoPlayerElement.muted) {
        return;
      }
      this.volume = Math.round(this.videoPlayerElement.volume * 100);
      if (this.videoPlayerElement.muted || this.videoPlayerElement.volume === 0) {
        this.showActionOverlay('volume_off', 'Muted');
      } else {
        const icon = this.volume < 50 ? 'volume_down' : 'volume_up';
        this.showActionOverlay(icon, `${this.volume}%`);
      }
      this.cdr.detectChanges();
    });

    this.onFullscreenChangeFn = () => {
      if (document.fullscreenElement || document['webkitFullscreenElement'] || document['mozFullScreenElement'] || document['msFullscreenElement']) {
        this.showActionOverlay('fullscreen', 'Fullscreen');
      } else {
        this.showActionOverlay('fullscreen_exit', 'Exit Fullscreen');
      }
    };
    document.addEventListener('fullscreenchange', this.onFullscreenChangeFn);
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChangeFn);
    document.addEventListener('mozfullscreenchange', this.onFullscreenChangeFn);
    document.addEventListener('MSFullscreenChange', this.onFullscreenChangeFn);

    // MIGRATED
    const root = this;
    setInterval((e) => {
      if (root.isPlaying) {
        root.updateProgressBar();
        root.updateWatchedStatus(e);
      }
    }, 500);
    // END OF MIGRATED
  }

  onKeyPress(val: KeyboardEvent) {
    this.onNotIdle();
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
        case 'c':
          this.isShowSubtitles = !this.isShowSubtitles;
          this.showActionOverlay(this.isShowSubtitles ? 'subtitles' : 'subtitles_off', this.isShowSubtitles ? 'Subtitles On' : 'Subtitles Off');
          break;
        case 'arrowup':
          this.changeVolume(Math.min(200, this.volume + 5));
          break;
        case 'arrowdown':
          this.changeVolume(Math.max(0, this.volume - 5));
          break;
        case 'arrowleft':
          try {
            this.videoPlayerElement.currentTime = Math.max(0, this.videoPlayerElement.currentTime - 5);
            this.showActionOverlay('fast_rewind', '-5s');
          } catch (e) {
            this.videoPlayerElement.currentTime = 0;
          }

          // keyCode: 37
          // toggl2e fullscreen
          break;
        case 'arrowright':
          try {
            this.videoPlayerElement.currentTime = Math.min(this.videoPlayerElement.duration, this.videoPlayerElement.currentTime + 5);
            this.showActionOverlay('fast_forward', '+5s');
          } catch (e) {
            this.videoPlayerElement.currentTime = this.videoPlayerElement.duration;
          }
          // keyCode: 39
          break;
        case 'pageup':
          this.changeVolume(100);
          break;
        case 'pagedown':
          this.changeVolume(0);
          break;
        // percentage of duration
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          try {
            const targetTime = parseFloat('.' + key) * this.videoPlayerElement.duration;
            this.videoPlayerElement.currentTime = targetTime;
            this.showActionOverlay('schedule', GeneralUtil.convertToHHMMSS(targetTime));
          } catch (e) {
            console.error(e);
          }
          break;
        case '0':
        case 'home':
          try {
            this.videoPlayerElement.currentTime = 0;
            this.showActionOverlay('schedule', '00:00:00');
          } catch (e) {
            console.error(e);
          }
          break;
        case 'end':
          try {
            this.videoPlayerElement.currentTime = this.videoPlayerElement.duration;
          } catch (e) {
            console.error(e);
          }
          break;
        case ']':
        case '=':
          this.adjustSubtitleSize(0.2);
          break;
        case '[':
        case '-':
          this.adjustSubtitleSize(-0.2);
          break;
        default:
          GeneralUtil.DEBUG.log('no hotkey');
          break;
      }
    }
  }

  updateWatchedStatus(val?: any) {
    if (!this.videoPlayerElement) return;

    const current = Math.round(this.videoPlayerElement.currentTime);
    const total = Math.round(this.videoPlayerElement.duration);
    if (!total) return;

    const percentage = Math.round((current / total) * 100);

    // Send update if 10 seconds elapsed since last saved time
    if (Math.abs(current - this.lastSavedTime) >= 10) {
      this.sendProgress(current, total, percentage);
    }

    // Auto-promote to watched/played if >= 90% and not already marked
    if (percentage >= 90 && !this.isSavedAsPlayed) {
      this.markAsFullyWatched();
    }
  }

  private sendProgress(current: number, total: number, percentage: number) {
    this.lastSavedTime = current;
    this.progressService.postProgress({
      id: this.tmdbId,
      current,
      total,
      percentage
    }).subscribe({
      next: () => GeneralUtil.DEBUG.log(`Progress updated: ${current}s / ${total}s (${percentage}%)`),
      error: (err) => GeneralUtil.DEBUG.error('Error posting progress:', err)
    });
  }

  private markAsFullyWatched() {
    this.isSavedAsPlayed = true;
    this.playedService.save(this.tmdbId.toString()).subscribe({
      next: () => GeneralUtil.DEBUG.log(`Movie marked as fully watched (tmdbId=${this.tmdbId})`),
      error: (err) => GeneralUtil.DEBUG.error('Error saving played status:', err)
    });
  }

  togglePlay() {
    const isPlaying = this.videoPlayerElement.currentTime > 0 && !this.videoPlayerElement.paused && !this.videoPlayerElement.ended
      && this.videoPlayerElement.readyState > 2;
    GeneralUtil.DEBUG.log('5. togglePlay, isPlaying: ', isPlaying);

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

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

  private setupWebAudio() {
    if (this.gainNode) return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.sourceNode = this.audioContext.createMediaElementSource(this.videoPlayerElement);
      this.gainNode = this.audioContext.createGain();
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
    } catch (e) {
      GeneralUtil.DEBUG.error('Failed to setup Web Audio API:', e);
    }
  }

  changeVolume(source: number) {
    this.volume = source;

    if (this.volume > 100) {
      this.setupWebAudio();
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    }

    if (this.gainNode) {
      if (this.volume > 100) {
        this.videoPlayerElement.volume = 1.0;
        this.gainNode.gain.value = this.volume * 0.01;
      } else {
        this.videoPlayerElement.volume = this.volume * 0.01;
        this.gainNode.gain.value = 1.0;
      }
    } else {
      this.videoPlayerElement.volume = Math.min(100, this.volume) * 0.01;
    }
  }

  toggleMute() {
    this.videoPlayerElement.muted = !this.videoPlayerElement.muted;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.srt')) {
        this.onChangeCc(file);
        this.showActionOverlay('subtitles', 'Subtitle Dropped');
      }
    }
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
    this.subtitleDisplaySettings.fontSize = size;
    this.savePreferences();
  }
  changeFontColor(color: string) {
    this.subtitleDisplaySettings.fontColor = color;
    this.savePreferences();
  }
  // font outline, shadow, family,
  changeBackgroundColor(color: string) {
    this.subtitleDisplaySettings.backgroundColor = color;
    this.savePreferences();
  }
  changeBackgroundOpacity(percentage: string) {
    this.subtitleDisplaySettings.backgroundOpacity = percentage;
    this.savePreferences();
  }

  adjustSubtitleSize(amount: number) {
    let sizeStr = this.subtitleDisplaySettings.fontSize || '2.5vh';
    let numericValue = 2.5;
    let unit = 'vh';
    if (sizeStr.endsWith('vh')) {
      numericValue = parseFloat(sizeStr.replace('vh', ''));
      unit = 'vh';
    } else if (sizeStr.endsWith('px')) {
      numericValue = parseFloat(sizeStr.replace('px', ''));
      unit = 'px';
    } else if (sizeStr.endsWith('%')) {
      numericValue = parseFloat(sizeStr.replace('%', ''));
      unit = '%';
    }

    numericValue = Math.min(8.0, Math.max(1.0, numericValue + amount));
    this.subtitleDisplaySettings.fontSize = `${numericValue.toFixed(1)}${unit}`;
    this.savePreferences();
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

