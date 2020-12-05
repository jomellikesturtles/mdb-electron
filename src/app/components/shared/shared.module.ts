/**
 * This module will be shared with results, dashboard, bookmarks, watched, library components
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedListComponent } from './selected-list/selected-list.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { CardListComponent } from './card-list/card-list.component';
import { ReleaseYearPipe } from 'src/app/mdb-pipes.pipe';
import { HHMMSSPipe, VideoPlayerComponent } from '../video-player/video-player/video-player.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HorizontalCardListComponent } from './horizontal-card-list/horizontal-card-list.component';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
    VideoPlayerComponent,
    HHMMSSPipe,
    HorizontalCardListComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    MatTooltipModule,
    MatDividerModule
  ],
  exports: [
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
    VideoPlayerComponent,
    HorizontalCardListComponent,
    MatDividerModule
  ]
})
export class SharedModule { }
