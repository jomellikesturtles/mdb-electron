import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details.routing.module';
import { CreditsComponent } from '../credits/credits.component';
import { DetailsComponent } from './details.component';
import { SharedModule } from '@shared/shared.module';
import { VideoPlayerModule } from '@modules/watch/video-player.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MovieDetailsGuard } from './details.guard';

@NgModule({
  declarations: [
    DetailsComponent,
    CreditsComponent,
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    SharedModule,
    VideoPlayerModule, MatTabsModule
  ],
  entryComponents: [
    DetailsComponent,
    CreditsComponent,
  ],
  providers: [
    MovieDetailsGuard
  ]
})
export class DetailsModule { }
