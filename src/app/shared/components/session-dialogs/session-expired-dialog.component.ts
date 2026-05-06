import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-expired-dialog',
  template: `
    <div class="session-dialog-container p-4 text-center">
      <h2 mat-dialog-title class="text-danger mb-3">Session Expired</h2>
      <mat-dialog-content class="mb-4">
        <p>Your session has lasted more than 15 minutes and has now expired. Please sign in again to continue.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-flat-button color="warn" (click)="close()" style="width: 100%; padding: 12px; font-weight: 600;">
          Sign In
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
export class SessionExpiredDialogComponent {
  constructor(public dialogRef: MatDialogRef<SessionExpiredDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
