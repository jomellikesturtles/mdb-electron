/**
 * This module will be shared with results, dashboard, bookmarks, watched, library components
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedListComponent } from './selected-list/selected-list.component';
import { MovieCardComponent } from './movie-card/movie-card.component';

@NgModule({
  declarations: [SelectedListComponent, MovieCardComponent],
  imports: [
    CommonModule
  ],
  exports: [SelectedListComponent, MovieCardComponent]
})
export class SharedModule { }
