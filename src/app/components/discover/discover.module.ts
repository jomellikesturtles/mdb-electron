import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscoverComponent } from './view/discover.component';
import { SharedModule } from '../shared/shared.module';
import { DiscoverRoutingModule } from './discover.routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DiscoverComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DiscoverRoutingModule,
    FormsModule
  ],
  entryComponents: [
    DiscoverComponent
  ]
})
export class DiscoverModule { }
