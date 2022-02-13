/**
 * This module will be shared with results, dashboard, bookmarks, watched, library components
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedListComponent } from './components/selected-list/selected-list.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { HHMMSSPipe, ReleaseYearPipe, RuntimeDisplayPipe } from '@shared/pipes/mdb-pipes.pipe';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HorizontalCardListComponent } from './components/horizontal-card-list/horizontal-card-list.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { UserIdleModule } from 'angular-user-idle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
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
    UserIdleModule.forRoot({ idle: 1, timeout: 1, ping: 1 })
    // UserIdleModule.forRoot({ idle: 3, timeout: 1, ping: 3 })
  ],
  exports: [
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
    HHMMSSPipe,
    HorizontalCardListComponent,
    MatDividerModule,
    MatProgressSpinnerModule, MatButtonModule, MatIconModule,
    RuntimeDisplayPipe
  ]
})
export class SharedModule { }
