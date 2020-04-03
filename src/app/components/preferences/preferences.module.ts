import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesRoutingModule } from './preferences.routing.module';
import { PreferencesComponent } from './preferences.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    FormsModule,
    CommonModule,
    PreferencesRoutingModule
  ],
  entryComponents: [
    PreferencesComponent,
  ]
})
export class PreferencesModule { }
