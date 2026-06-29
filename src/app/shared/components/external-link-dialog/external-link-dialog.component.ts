import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-external-link-dialog',
  templateUrl: './external-link-dialog.component.html'
})
export class ExternalLinkDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) {}
}
