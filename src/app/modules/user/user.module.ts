import { UsernameExistValidatorDirective } from '@directives/username-exist.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { UserRoutingModule } from './user.routing.module';
import { RepeatPasswordValidatorDirective } from '@directives/repeat-password.directive';
import { CredentialsDirective } from '@directives/credentials.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component'
import { MatTabsModule } from '@angular/material/tabs'
import { SharedModule } from '@shared/shared.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    SigninComponent,
    ResetPasswordComponent,
    RegisterComponent,
    RepeatPasswordValidatorDirective,
    UsernameExistValidatorDirective,
    CredentialsDirective,
    ProfileComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    SharedModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ]
})
export class UserModule { }
