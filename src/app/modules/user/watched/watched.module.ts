import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchedComponent } from './watched.component';
import { SharedModule } from '@shared/shared.module';
import { WatchedRoutingModule } from './watched.routing.module';

@NgModule({
  declarations: [
    WatchedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WatchedRoutingModule
  ],
  entryComponents: [
    WatchedComponent
  ]
})
export class WatchedModule { }
