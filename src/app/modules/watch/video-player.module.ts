import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { VideoPlayerComponent } from './video-player.component';
import { VideoPlayerControlsComponent } from './video-player-controls/video-player-controls.component';
// import { MatFormFieldModule, MatInputModule, MatSidenavModule, MatSelectModule, MatCheckboxModule, MatTabsModule, MatDialogModule, MatAutocompleteModule, MatSliderModule, MatDividerModule, MatProgressSpinnerModule, MatTooltipModule, MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { VideoPlayerStatsComponent } from './video-player-stats/video-player-stats.component';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

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
