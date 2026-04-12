import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { interval, Subject, Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public sessionExpired$ = new Subject<void>();
  public sessionWarning$ = new Subject<void>();
  
  private monitoringSub: Subscription;
  private readonly CHECK_INTERVAL_MS = 10000; // 10 seconds
  private readonly WARNING_THRESHOLD_MS = 60000; // 1 minute

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.initListeners();
    this.initAuthSync();
  }

  /**
   * Automatically starts or stops monitoring based on the authentication state.
   */
  private initAuthSync(): void {
    toObservable(this.authService.isAuthenticated).subscribe(isAuth => {
      if (isAuth) {
        this.startMonitoring();
      } else {
        this.stopMonitoring();
      }
    });
  }

  /**
   * Starts the background monitoring of the session expiration.
   */
  startMonitoring(): void {
    this.stopMonitoring();
    
    // Use NgZone.runOutsideAngular to prevent unnecessary change detection cycles
    this.ngZone.runOutsideAngular(() => {
      this.monitoringSub = interval(this.CHECK_INTERVAL_MS).subscribe(() => {
        this.checkSession();
      });
    });
  }

  /**
   * Stops the background monitoring.
   */
  stopMonitoring(): void {
    if (this.monitoringSub) {
      this.monitoringSub.unsubscribe();
      this.monitoringSub = null;
    }
  }

  /**
   * Performs the actual logic to check if the session is near expiry or expired.
   */
  private checkSession(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) {
      return;
    }

    const now = Date.now();
    const expiryTime = Number(expiry);
    const timeLeft = expiryTime - now;

    if (timeLeft <= 0) {
      this.ngZone.run(() => {
        this.sessionExpired$.next();
      });
    } else if (timeLeft <= this.WARNING_THRESHOLD_MS) {
      this.ngZone.run(() => {
        this.sessionWarning$.next();
      });
    }
  }

  /**
   * Initializes global event listeners for cross-window sync and sleep/wake recovery.
   */
  private initListeners(): void {
    // Immediate re-check when window is focused (handles wake from sleep)
    window.addEventListener('focus', () => {
      this.checkSession();
    });

    // Synchronize logout/expiry across multiple Electron windows
    window.addEventListener('storage', (event) => {
      if (event.key === 'token_expiry') {
        if (!event.newValue) {
          // Expiry cleared, likely a logout in another window
          this.ngZone.run(() => {
            this.authService.clearSession();
            this.sessionExpired$.next();
          });
        } else {
          // Expiry updated, perform a check
          this.checkSession();
        }
      }
    });
  }
}
