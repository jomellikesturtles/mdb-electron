/**
 * This module will be shared with results, dashboard, bookmarks, watched, library components
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedListComponent } from './selected-list/selected-list.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { CardListComponent } from './card-list/card-list.component';
import { ReleaseYearPipe, RuntimeDisplayPipe } from 'app/mdb-pipes.pipe';
import { HHMMSSPipe, VideoPlayerComponent } from '../video-player/video-player/video-player.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HorizontalCardListComponent } from './horizontal-card-list/horizontal-card-list.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { UserIdleModule } from 'angular-user-idle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MdbExperimentVideoPlayerComponent } from '@components/experiment/mdb-experiment-video-player/mdb-experiment-video-player.component';


@NgModule({
  declarations: [
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
    VideoPlayerComponent,
    MdbExperimentVideoPlayerComponent,
    HHMMSSPipe,
    HorizontalCardListComponent,
    RuntimeDisplayPipe
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatMenuModule, MatButtonModule, MatIconModule,
    UserIdleModule.forRoot({ idle: 5, timeout: 2, ping: 5 })
  ],
  exports: [
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
    VideoPlayerComponent,
    MdbExperimentVideoPlayerComponent,
    HorizontalCardListComponent,
    MatDividerModule,
    MatProgressSpinnerModule, MatButtonModule, MatIconModule,
    RuntimeDisplayPipe
  ]
})
export class SharedModule { }
