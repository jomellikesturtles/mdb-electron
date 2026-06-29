import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly DEFAULT_DURATION = 3000;
  private readonly ERROR_PANEL_CLASS = 'error-snackbar';

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: this.DEFAULT_DURATION,
    });
  }

  showError(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: this.DEFAULT_DURATION,
      panelClass: [this.ERROR_PANEL_CLASS]
    });
  }
}
