import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { VideoPlayerComponent } from './video-player.component';
import { VideoPlayerControlsComponent } from './video-player-controls/video-player-controls.component';
import { MatFormFieldModule, MatInputModule, MatSidenavModule, MatSelectModule, MatCheckboxModule, MatTabsModule, MatDialogModule, MatAutocompleteModule, MatSliderModule, MatDividerModule, MatProgressSpinnerModule, MatTooltipModule, MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { VideoPlayerStatsComponent } from './video-player-stats/video-player-stats.component';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    VideoPlayerComponent,
    VideoPlayerControlsComponent,
    // HHMMSSPipe,
    VideoPlayerStatsComponent
  ],
  imports: [
    CommonModule,
    // VideoPlayerRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    SharedModule,
    MatSliderModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [
    VideoPlayerControlsComponent,
    VideoPlayerComponent
    // DetailsComponent,
    // CreditsComponent,
  ], exports: [VideoPlayerComponent],
  providers: [{provide: OverlayContainer, useClass: FullscreenOverlayContainer}],
})
export class VideoPlayerModule { }
