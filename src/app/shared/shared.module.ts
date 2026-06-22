/**
 * This module will be shared with results, dashboard, bookmarks, watched, library components
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedListComponent } from './components/selected-list/selected-list.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { CommaSpacePipe, GenrePipe, HHMMSSPipe, MagnetPipe, ReleaseYearPipe, RuntimeDisplayPipe, SimplifySizePipe } from '@shared/pipes/mdb-pipes.pipe';
import { HorizontalCardListComponent } from './components/horizontal-card-list/horizontal-card-list.component';
import { MaterialModule } from './material.module';
import { UiModule } from './ui/ui.module';

import { MovieCardSkeletonComponent } from './components/movie-card-skeleton/movie-card-skeleton.component';
import { SessionExpiredDialogComponent } from './components/session-dialogs/session-expired-dialog.component';
import { SessionWarningDialogComponent } from './components/session-dialogs/session-warning-dialog.component';
import { NewListDialogComponent } from './components/list-dialogs/new-list-dialog.component';
import { AppDownloadDialogComponent } from './components/app-download-dialog/app-download-dialog.component';
import { ExternalLinkDialogComponent } from './components/external-link-dialog/external-link-dialog.component';
import { AboutDialogComponent } from './components/info-dialogs/about-dialog.component';
import { HelpDialogComponent } from './components/info-dialogs/help-dialog.component';
import { FeedbackDialogComponent } from './components/info-dialogs/feedback-dialog.component';
import { MediaGridComponent } from '@components/media-grid/media-grid.component';

@NgModule({
  declarations: [
    SelectedListComponent,
    MovieCardComponent,
    MovieCardSkeletonComponent,
    CardListComponent,
    ReleaseYearPipe,
    HHMMSSPipe,
    HorizontalCardListComponent,
    RuntimeDisplayPipe,
    CommaSpacePipe,
    SimplifySizePipe,
    MagnetPipe,
    GenrePipe,
    SessionExpiredDialogComponent,
    SessionWarningDialogComponent,
    NewListDialogComponent,
    AppDownloadDialogComponent,
    ExternalLinkDialogComponent,
    AboutDialogComponent,
    HelpDialogComponent,
    FeedbackDialogComponent,
    MediaGridComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UiModule
  ],
  exports: [
    MediaGridComponent,
    SelectedListComponent,
    MovieCardComponent,
    CardListComponent,
    ReleaseYearPipe,
    HHMMSSPipe,
    HorizontalCardListComponent,
    MaterialModule,
    RuntimeDisplayPipe,
    CommaSpacePipe,
    SimplifySizePipe,
    MagnetPipe,
    GenrePipe,
    UiModule,
    MovieCardSkeletonComponent,
    SessionExpiredDialogComponent,
    SessionWarningDialogComponent,
    NewListDialogComponent,
    AppDownloadDialogComponent,
    ExternalLinkDialogComponent,
    AboutDialogComponent,
    HelpDialogComponent,
    FeedbackDialogComponent
  ]
})
export class SharedModule { }

