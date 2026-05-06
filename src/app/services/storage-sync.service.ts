import { Injectable, NgZone } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StorageSyncService {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  /**
   * Initializes listeners to synchronize state across multiple windows.
   */
  initSync(): void {
    window.addEventListener('storage', (event: StorageEvent) => {
      this.ngZone.run(() => {
        this.handleStorageChange(event);
      });
    });
  }

  private handleStorageChange(event: StorageEvent): void {
    // 1. Synchronize Auth Status
    if (event.key === 'user') {
      if (event.newValue === null) {
        // Logged out in another window
        this.authService.clearSession();
        this.router.navigate(['/user/signin']);
      } else {
        // Logged in in another window
        // Optionally refresh state or reload
        window.location.reload();
      }
    }

    // 2. Synchronize Search History
    if (event.key === 'mdb_search_history') {
      // Components observing this state will react 
      // if they use a service to manage history.
      // Nothing extra needed here if components re-read localStorage on focus.
    }
  }
}
