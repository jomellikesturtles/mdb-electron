import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details.routing.module';
import { CreditsComponent } from './credits/credits.component';
import { DetailsComponent } from './view/details.component';
import { SharedModule } from '../shared/shared.module';
import { VideoPlayerModule } from '@components/video-player/video-player.module';
import { MatTabsModule } from '@angular/material';

@NgModule({
  declarations: [
    DetailsComponent,
    CreditsComponent,
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    SharedModule,
    VideoPlayerModule,MatTabsModule
  ],
  entryComponents: [
    DetailsComponent,
    CreditsComponent,
  ]
})
export class DetailsModule { }
