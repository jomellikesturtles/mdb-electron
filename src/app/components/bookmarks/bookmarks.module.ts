import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksComponent } from './view/bookmarks.component';
import { SharedModule } from '../shared/shared.module';
import { BookmarksRoutingModule } from './bookmarks.routing.module';

@NgModule({
  declarations: [
    BookmarksComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BookmarksRoutingModule
  ],
  entryComponents: [
    BookmarksComponent
  ]
})
export class BookmarksModule { }
