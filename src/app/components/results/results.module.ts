import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './view/results.component';
import { SharedModule } from '../shared/shared.module';
import { ResultsRoutingModule } from './results.routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ResultsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ResultsRoutingModule,
    FormsModule
  ],
  entryComponents: [
    ResultsComponent
  ]
})
export class ResultsModule { }
