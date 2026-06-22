import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './browse.routing.module';
import { SharedModule } from '@shared/shared.module';
import { VideoPlayerModule } from '@modules/watch/video-player.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { BrowseComponent } from './browse.component';

@NgModule({
  declarations: [
    BrowseComponent
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    MatTabsModule,
    MatMenuModule,
    SharedModule
  ],
})
export class BrowseModule { }
