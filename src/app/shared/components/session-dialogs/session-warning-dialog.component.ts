import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-warning-dialog',
  template: `
    <div class="session-dialog-container p-4 text-center">
      <h2 mat-dialog-title class="text-warning mb-3">Session Timeout</h2>
      <mat-dialog-content class="mb-4">
        <p>Your session will expire in 1 minute. Would you like to stay signed in?</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center" class="d-flex flex-column gap-2">
        <button mat-flat-button color="warn" (click)="confirm(true)" style="width: 100%; padding: 12px; font-weight: 600;">
          Stay Signed In
        </button>
        <button mat-button (click)="confirm(false)" style="width: 100%; color: #ccc;">
          No, Sign Out
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .session-dialog-container {
      background-color: #1a1a1a;
      color: white;
      max-width: 400px;
    }
    h2 { margin-top: 0; font-weight: 600; }
    p { font-size: 1.1rem; line-height: 1.5; color: #ccc; }
  `]
})
export class SessionWarningDialogComponent {
  constructor(public dialogRef: MatDialogRef<SessionWarningDialogComponent>) {}

  confirm(stay: boolean): void {
    this.dialogRef.close(stay);
  }
}
