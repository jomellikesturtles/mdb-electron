import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  imagePath

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.imagePath = 'https://image.tmdb.org/t/p/original' + data['imagePath']
  }

  ngOnInit() {
  }
  download() {
    var url = this.imagePath
    window.open(url);
  }

  // <a href=" http://localhost/projectName/uploads/3/1535352341_download.png" class="btn clss"
  // target="_self" download>Download</a>

}
