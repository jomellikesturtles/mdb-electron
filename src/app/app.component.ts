import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { WebSocketSubject, webSocket } from "rxjs/webSocket";
import { Subscription } from "rxjs";
import { WebSocketService } from "@services/socket.service";
import { ConfigurationService } from "@services/configuration.service";
import { AuthenticationService } from "@services/authentication.service";
import { SessionService } from "@services/session.service";
import { StorageSyncService } from "@services/storage-sync.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { FeatureToggleService } from "@core/services/feature-toggle.service";
import { SessionWarningDialogComponent } from "@shared/components/session-dialogs/session-warning-dialog.component";
import { SessionExpiredDialogComponent } from "@shared/components/session-dialogs/session-expired-dialog.component";
import { IpcService } from "@services/ipc.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = "mdb-electron";
  isAttractMode = false;
  ambientVideoUrl = '';

  @ViewChild('ambientVideo') ambientVideoRef!: ElementRef<HTMLVideoElement>;

  private inactivityTimer: any;
  // private readonly INACTIVITY_LIMIT = 180000; // 3 minutes
  private readonly INACTIVITY_LIMIT = 3000; // 3 minutes
  private boundResetFn = this.resetInactivityTimer.bind(this);

  constructor(
    private webSocketService: WebSocketService,
    private configService: ConfigurationService,
    private authService: AuthenticationService,
    private sessionService: SessionService,
    private storageSyncService: StorageSyncService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private featureToggle: FeatureToggleService,
    private ipcService: IpcService
  ) { }
  messageSubscription: Subscription;
  ngOnInit() {
    this.configService.getConfiguration().subscribe((e) => {
      console.log(e);
    });
    // this.messageSubscription = this.webSocketService.get.subscribe(msg => {
    //   console.log("Response from websocket: " + msg);
    // });

    // this.getCurrentUser()
    this.syncTime();
    this.initSessionMonitoring();
    this.storageSyncService.initSync();
    this.initErrorMonitoring();
    if (this.featureToggle.isEnabled('ambientCanvas')) {
      this.initAmbientProfile();
      this.setupInactivityListeners();
    }
  }

  private initErrorMonitoring(): void {
    this.ipcService.appErrors.subscribe(error => {
      if (error) {
        this.snackBar.open(`[${error.source}] ${error.message}`, 'Close', {
          duration: 7000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  private initSessionMonitoring(): void {
    this.sessionService.sessionWarning$.subscribe(() => {
      if (this.featureToggle.isEnabled('sessionWarning')) {
        this.showSessionWarning();
      }
    });

    this.sessionService.sessionExpired$.subscribe(() => {
      this.showSessionExpired();
    });

    // Start monitoring if already authenticated
    if (this.authService.isAuthenticated()) {
      this.sessionService.startMonitoring();
    }
  }

  private showSessionWarning(): void {
    // Logic to prevent multiple warning dialogs
    if (this.dialog.openDialogs.some(d => d.componentInstance instanceof SessionWarningDialogComponent)) {
      return;
    }

    const dialogRef = this.dialog.open(SessionWarningDialogComponent, {
      disableClose: true,
      panelClass: 'session-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(stay => {
      if (stay) {
        this.authService.refreshToken().subscribe();
      } else {
        this.logout();
      }
    });
  }

  private showSessionExpired(): void {
    // Close any other dialogs
    this.dialog.closeAll();

    const dialogRef = this.dialog.open(SessionExpiredDialogComponent, {
      disableClose: true,
      panelClass: 'session-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.logout();
    });
  }

  private logout(): void {
    this.authService.clearSession();
    this.sessionService.stopMonitoring();
    this.router.navigate(['/user/signin']);
  }

  getCurrentUser() {
    // this.firebaseService.getUser().then(e => {
    //   this.store.dispatch(new SetUser(e))
    // })
  }

  syncTime() { }

  initAmbientProfile() {
    const profileId = localStorage.getItem('active_profile_id') || 'john_smith';
    switch (profileId) {
      case 'nolan':
        this.ambientVideoUrl = '../assets/backdrops/YTDown_YouTube_The-most-beautiful-shots-in-film-history_Media_c8rCgrGPQwM_001_1080p.mp4';
        break;
      case 'tarantino':
        this.ambientVideoUrl = '../assets/backdrops/YTDown_YouTube_The-most-beautiful-shots-in-film-history_Media_c8rCgrGPQwM_001_1080p.mp4';
        break;
      case 'scarlett':
        this.ambientVideoUrl = '../assets/backdrops/YTDown_YouTube_The-most-beautiful-shots-in-film-history_Media_c8rCgrGPQwM_001_1080p.mp4';
        break;
      default:
        this.ambientVideoUrl = '../assets/backdrops/YTDown_YouTube_The-most-beautiful-shots-in-film-history_Media_c8rCgrGPQwM_001_1080p.mp4';
        break;
    }
  }

  setupInactivityListeners() {
    window.addEventListener('mousemove', this.boundResetFn);
    window.addEventListener('keydown', this.boundResetFn);
    window.addEventListener('click', this.boundResetFn);
    window.addEventListener('scroll', this.boundResetFn);
    window.addEventListener('touchstart', this.boundResetFn);

    // Initial timer start
    this.resetInactivityTimer();
  }

  resetInactivityTimer() {
    if (this.isAttractMode) {
      this.isAttractMode = false;
      if (this.ambientVideoRef?.nativeElement) {
        this.ambientVideoRef.nativeElement.pause();
      }
    }
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.triggerAttractMode(), this.INACTIVITY_LIMIT);
  }

  triggerAttractMode() {
    // Check if any video player (excluding our ambient canvas video) is currently playing
    const videos = Array.from(document.querySelectorAll('video')).filter(
      v => v !== this.ambientVideoRef?.nativeElement
    );
    const isMoviePlaying = videos.some(v => !v.paused && !v.ended && v.readyState > 2);

    if (isMoviePlaying) {
      // Re-schedule check if movie is playing
      this.inactivityTimer = setTimeout(() => this.triggerAttractMode(), this.INACTIVITY_LIMIT);
      return;
    }

    this.isAttractMode = true;
    if (this.ambientVideoRef?.nativeElement) {
      this.ambientVideoRef.nativeElement.play().catch(err => {
        console.warn('Failed to auto-play ambient video:', err);
      });
    }
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.boundResetFn);
    window.removeEventListener('keydown', this.boundResetFn);
    window.removeEventListener('click', this.boundResetFn);
    window.removeEventListener('scroll', this.boundResetFn);
    window.removeEventListener('touchstart', this.boundResetFn);
    clearTimeout(this.inactivityTimer);
  }
}
