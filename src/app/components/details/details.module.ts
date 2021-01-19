import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRoutingModule } from './details.routing.module';
import { CreditsComponent } from './credits/credits.component';
import { DetailsComponent } from './view/details.component';
import { RuntimeDisplayPipe } from '../../mdb-pipes.pipe';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    DetailsComponent,
    CreditsComponent,
    RuntimeDisplayPipe,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    DetailsRoutingModule,
    SharedModule,
  ],
  entryComponents: [
    DetailsComponent,
    CreditsComponent,
  ]
})
export class DetailsModule { }
