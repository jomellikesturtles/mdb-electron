/**
 * This module will be shared with results, dashboard, bookmarks, watched, library components
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedListComponent } from './selected-list/selected-list.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { CardListComponent } from './card-list/card-list.component';
import { ReleaseYearPipe } from 'src/app/mdb-pipes.pipe';
import { VideoPlayerComponent } from '../video-player/video-player/video-player.component';

@NgModule({
  declarations: [
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
    VideoPlayerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
    VideoPlayerComponent
  ]
})
export class SharedModule { }
