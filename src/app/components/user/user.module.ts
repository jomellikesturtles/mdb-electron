import { UsernameExistValidatorDirective } from '../../directives/username-exist.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component'
import { UserRoutingModule } from './user.routing.module';
import { RepeatPasswordValidatorDirective } from '../../directives/repeat-password.directive';
import { CredentialsDirective } from '../../directives/credentials.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component'
import { MatTabsModule } from '@angular/material/tabs'
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SigninComponent,
    RepeatPasswordValidatorDirective,
    UsernameExistValidatorDirective,
    CredentialsDirective,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    SharedModule
  ],
  entryComponents: [
    SigninComponent,
    ProfileComponent
  ]
})
export class UserModule { }
