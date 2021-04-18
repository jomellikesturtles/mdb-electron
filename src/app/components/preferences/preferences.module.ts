import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesRoutingModule } from './preferences.routing.module';
import { PreferencesComponent } from './preferences.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    FormsModule,
    CommonModule,
    PreferencesRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
  ],
  entryComponents: [
    PreferencesComponent,
  ]
})
export class PreferencesModule { }
