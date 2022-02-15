import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mdb-experiment-video-player',
  templateUrl: './mdb-experiment-video-player.component.html',
  styleUrls: ['./mdb-experiment-video-player.component.scss']
})
export class MdbExperimentVideoPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() streamLink: string
  private ngUnsubscribe = new Subject();
  canPlay = false
  constructor(
    // private ipcService: IpcService,
    // private elementRef: ElementRef,
    // private userIdleService: UserIdleService,
    ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
  ngOnDestroy(): void {
    console.log('ondestroy')
    this.canPlay = false
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
    // this.ipcService.stopStream()
    console.log('DESTROYED')
  }
}
