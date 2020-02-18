import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './view/signin.component'
import { SignInRoutingModule } from './signin.routing.module';
import { RepeatPasswordValidatorDirective } from '../../directives/repeat-password.directive';
import { CredentialsDirective } from '../../directives/credentials.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SigninComponent,
    RepeatPasswordValidatorDirective,
    CredentialsDirective,
  ],
  imports: [
    CommonModule,
    SignInRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SigninComponent
  ]
})
export class SignInModule { }
