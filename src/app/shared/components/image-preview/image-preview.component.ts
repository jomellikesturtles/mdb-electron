import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ExternalLinkDialogComponent } from '../external-link-dialog/external-link-dialog.component';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  imagePath

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.imagePath = 'https://image.tmdb.org/t/p/original' + data['imagePath']
  }

  ngOnInit() {
  }
  download() {
    var url = this.imagePath
    const dialogRef = this.dialog.open(ExternalLinkDialogComponent, {
      width: '400px',
      data: { url }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        window.open(url, '_blank');
      }
    });
  }

  // <a href=" http://localhost/projectName/uploads/3/1535352341_download.png" class="btn clss"
  // target="_self" download>Download</a>

}
