import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details.routing.module';
import { CreditsComponent } from './credits/credits.component';
import { DetailsComponent } from './view/details.component';
import { VideoComponent } from './video/video.component';
import { ReleaseYearPipe, RuntimeDisplayPipe } from '../../mdb-pipes.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DetailsComponent,
    CreditsComponent,
    VideoComponent,
    // ReleaseYearPipe,
    RuntimeDisplayPipe
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    DetailsComponent,
    CreditsComponent,
    VideoComponent,
  ]
})
export class DetailsModule { }
