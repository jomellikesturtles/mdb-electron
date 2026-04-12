import { Component, OnInit } from "@angular/core";
import { WebSocketSubject, webSocket } from "rxjs/webSocket";
import { Subscription } from "rxjs";
import { WebSocketService } from "@services/socket.service";
import { ConfigurationService } from "@services/configuration.service";
import { AuthenticationService } from "@services/authentication.service";
import { SessionService } from "@services/session.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FeatureToggleService } from "@core/services/feature-toggle.service";
import { SessionWarningDialogComponent } from "@shared/components/session-dialogs/session-warning-dialog.component";
import { SessionExpiredDialogComponent } from "@shared/components/session-dialogs/session-expired-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "mdb-electron";
  constructor(
    private webSocketService: WebSocketService,
    private configService: ConfigurationService,
    private authService: AuthenticationService,
    private sessionService: SessionService,
    private dialog: MatDialog,
    private router: Router,
    private featureToggle: FeatureToggleService
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
}
