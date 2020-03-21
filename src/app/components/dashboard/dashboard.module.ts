import { PreviewComponent } from './../preview/preview/preview.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './view/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { ReleaseYearPipe } from 'src/app/mdb-pipes.pipe';

@NgModule({
  declarations: [
    DashboardComponent, 
    // PreviewComponent,
    // ReleaseYearPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    // ReleaseYearPipe
  ],
  entryComponents: [
    DashboardComponent
  ]
})
export class DashboardModule { }
