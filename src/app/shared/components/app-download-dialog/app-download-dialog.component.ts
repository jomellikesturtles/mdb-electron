import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-app-download-dialog',
  template: `
    <div class="session-dialog-container p-4 text-center">
      <h2 mat-dialog-title class="text-danger mb-3">Download App</h2>
      <mat-dialog-content class="mb-4">
        <p>The MDB Desktop App is currently only available for MAC OS.</p>
        <p>Windows and Linux versions are coming soon!</p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-flat-button color="warn" (click)="close()" style="width: 100%; padding: 12px; font-weight: 600;">
          Close
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
export class AppDownloadDialogComponent {
  constructor(public dialogRef: MatDialogRef<AppDownloadDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
