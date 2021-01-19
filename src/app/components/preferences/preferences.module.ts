import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesRoutingModule } from './preferences.routing.module';
import { PreferencesComponent } from './preferences.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    FormsModule,
    CommonModule,
    PreferencesRoutingModule,
    SharedModule
  ],
  entryComponents: [
    PreferencesComponent,
  ]
})
export class PreferencesModule { }
