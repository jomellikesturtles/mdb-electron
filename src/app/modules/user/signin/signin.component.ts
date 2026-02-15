import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialsValidator } from '@directives/credentials.directive';
import { AuthenticationService } from '@services/authentication.service';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  userSignIn = {
    usernameEmail: '',
    password: ''
  };
  signInForm: FormGroup;
  isOAuthValid = false;
  generalError = '';

  constructor(
    private credentialValidator: CredentialsValidator,
    private utilsService: UtilsService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.signInForm = new FormGroup({
      usernameEmail: new FormControl(this.userSignIn.usernameEmail, [Validators.required]),
      password: new FormControl(this.userSignIn.password, [Validators.required])
    },
    );
    this.usernameEmail.setValue('myusername2');
    this.password.setValue('Password!123');
  }

  get usernameEmail() { return this.signInForm.get('usernameEmail'); }
  get password() { return this.signInForm.get('password'); }

  onSignIn() {
    console.log('onsignin');
    if (this.signInForm.valid) {
      const emailUsername = this.signInForm.get('usernameEmail').value;
      const password = this.signInForm.get('password').value;
      this.generalError = ''; // Clear previous errors

      this.authenticationService.login({ email: "", username: emailUsername, password: password }).subscribe({
        next: (e) => {
          console.log(e);
          this.router.navigate(["/dashboard"]);
        },
        error: (err) => {
          console.error('Login error', err);
          if (err.status === 401 || err.status === 403) {
            this.generalError = 'Invalid username/email or password.';
          } else {
            this.generalError = err.error?.message || 'An error occurred during sign in. Please try again.';
          }
        }
      });
    }
  }

  onSignInGoogle() {
    // const provider = new firebase.auth.GoogleAuthProvider()
    // this.auth.auth.signInWithRedirect(provider)
    // firebase.auth().getRedirectResult().then((e) => {
    // this.firebaseService.signInWithGoogle(provider)
  }

}

export interface SignIn {
  username: string;
  emailAddress: string;
  age: number;
  gender: string;
  authType: string;
}
