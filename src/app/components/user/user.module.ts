import { UsernameExistValidatorDirective } from '../../directives/username-exist.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component'
import { UserRoutingModule } from './user.routing.module';
import { RepeatPasswordValidatorDirective } from '../../directives/repeat-password.directive';
import { CredentialsDirective } from '../../directives/credentials.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component'

@NgModule({
  declarations: [
    SigninComponent,
    RepeatPasswordValidatorDirective,
    UsernameExistValidatorDirective,
    CredentialsDirective,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SigninComponent,
    ProfileComponent
  ]
})
export class UserModule { }
