import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputContainerComponent } from './input-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PreferencesRoutingModule } from 'app/modules/settings/preferences/preferences.routing.module';
import { SharedModule } from '@shared/shared.module';
import { InputContComponent } from '../input-cont/input-cont.component';



@NgModule({

  declarations: [
    InputContainerComponent,
    InputContComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // PreferencesRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  exports:[InputContainerComponent,InputContComponent],
  providers: [
    {
      provide: 'formState',
      useValue: null
    },
    {
      provide: 'validatorOrOpts',
      useValue: null
    },
    {
      provide: 'asyncValidator',
      useValue: null
    },
  ]
})
export class InputContainerModule {

  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: InputContainerModule
  //   }
  // }

}
