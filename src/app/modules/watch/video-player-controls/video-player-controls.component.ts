import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IpcService } from '@services/ipc.service';
import { COLOR_LIST, FONT_SIZE_LIST, PERCENTAGE_LIST, RGB_COLOR_LIST } from '@shared/constants';
import GeneralUtil from '@utils/general.util';
import { environment } from 'environments/environment';

@Component({
  selector: 'mdb-video-player-controls',
  templateUrl: './video-player-controls.component.html',
  styleUrls: ['./video-player-controls.component.scss']
})
export class VideoPlayerControlsComponent implements OnInit {

  @Input() isMuted: boolean
  @Input() isPlaying: boolean
  @Input() isShowSubtitles: boolean = false
  @Input() canPlay: boolean
  @Input() videoPlayerElement: any
  @Input() volume: number
  // @Input() videoPlayer1: any // tocheck
  @Input() videoTime: IVideoTime
  @Input() progressBar: IProgressBar

  @Output() onTogglePlay = new EventEmitter<any>();
  @Output() onToggleMute = new EventEmitter<any>();
  @Output() onToggleFullScreen = new EventEmitter<any>();
  @Output() onToggleSubtitles = new EventEmitter<boolean>();
  @Output() onSeekValue = new EventEmitter<any>();
  @Output() onChangeVolume = new EventEmitter<any>();
  @Output() onChangeSubtitleFile = new EventEmitter<any>();
  @Output() onChangeFontColor = new EventEmitter<any>();
  @Output() onChangeFontSize = new EventEmitter<any>();
  @Output() onChangeBackgroundColor = new EventEmitter<any>();
  @Output() onChangeBackgroundOpacity = new EventEmitter<any>();
  @Output() onAdjustFontSize = new EventEmitter<number>();

  fontColorsList = RGB_COLOR_LIST
  // fontColorsList = COLOR_LIST
  fontSizeList = FONT_SIZE_LIST
  percentageList = PERCENTAGE_LIST;
  seekTooltip: any
  toSeek: number = 0
  // isPlaying: boolean = false
  isPaused: false;
  isShowStatus = false;
  constructor(
    private ipcService: IpcService) { }

  ngOnInit() {
  }

  updateProgressBar() {
  }
  /**
   * Event for video player scrubber tooltip
   */
  mouseMove(e) {
    this.seekTooltip = GeneralUtil.convertToHHMMSS(this.calculateSeekSeconds(e))
  }

  onSeek() {
    this.onSeekValue.emit(this.toSeek);
  }

  togglePlay() {
    this.onTogglePlay.emit()
  }
  toggleMute() {
    this.onToggleMute.emit()
  }
  toggleFullScreen() {
    this.onToggleFullScreen.emit()
  }
  volumeChange(val) {
    this.onChangeVolume.emit(val);
  }

  toggleSubtitles(val: boolean) {
    this.onToggleSubtitles.emit(val)
  }

  async changeCc() {
    if (environment.runConfig.electron) {
      const filePath = await this.ipcService.changeSubtitle()
      GeneralUtil.DEBUG.log('filePath', filePath)
      this.onChangeSubtitleFile.emit(filePath);
    } else {
      const fileInput = document.getElementById('subFileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.onChangeSubtitleFile.emit(file);
    }
  }


  changeFontColor(color: string) {
    this.onChangeFontColor.emit(color);
  }
  changeFontSize(size: string) {
    this.onChangeFontSize.emit(size);
  }
  adjustFontSize(amount: number) {
    this.onAdjustFontSize.emit(amount);
  }
  changeBackgroundColor(color: string) {
    this.onChangeBackgroundColor.emit(color);
  }
  changeBackgroundOpacity(percentage: string) {
    this.onChangeBackgroundOpacity.emit(percentage);
  }


  private calculateSeekSeconds(val) {
    const totalWidth = val.currentTarget.offsetWidth
    const offsetX = val.offsetX
    const percentage = GeneralUtil.getPercentage(offsetX, totalWidth)
    this.toSeek = (percentage / 100) * this.videoTime.duration
    return this.toSeek
  }
}

interface IVideoTime {
  elapsed: number,
  duration: number,
  remaining: number
}

export interface IProgressBar {
  buffered: string,
  played: string,
}
