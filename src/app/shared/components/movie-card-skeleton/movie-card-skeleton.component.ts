import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movie-card-skeleton',
  templateUrl: './movie-card-skeleton.component.html',
  styleUrls: ['./movie-card-skeleton.component.scss']
})
export class MovieCardSkeletonComponent {
  @Input() cardWidth = '130px';
}
