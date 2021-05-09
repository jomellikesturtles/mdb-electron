import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesRoutingModule } from './preferences.routing.module';
import { PreferencesComponent } from './preferences.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputContainerModule } from '@components/shared/input-container/input-container.module';

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    CommonModule,
    InputContainerModule,
    FormsModule,
    ReactiveFormsModule,
    PreferencesRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  entryComponents: [
    PreferencesComponent,
  ]
})
export class PreferencesModule { }
