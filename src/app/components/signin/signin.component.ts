import { Component, OnInit } from '@angular/core';
import { NG_ASYNC_VALIDATORS, FormGroup, FormControl, Validators } from '@angular/forms'
import { repeatPasswordValidator } from '../../directives/repeat-password.directive';
import { CredentialsValidator } from '../../directives/credentials.directive';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth'
// import {  } from '@angular/fire/angularfire2'
import { IpcService } from '../../services/ipc.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  ageList = []
  user = {
    emailAddress: '',
    password: ''
  }
  userSignUp = {
    username: '',
    emailAddress: '',
    age: 0,
    gender: '',
    authType: '',
    password: '',
    repeatPassword: ''
  }
  userSignIn = {
    usernameEmail: '',
    password: ''
  }
  signUpForm: FormGroup
  signInForm: FormGroup
  isSignIn = true
  isOAuthValid = false

  constructor(
    private credentialValidator: CredentialsValidator,
    private auth: AngularFireAuth,
    private authModule: AngularFireAuthModule,
    private firebaseService: FirebaseService,
    private ipcService: IpcService
  ) { }

  ngOnInit() {
    const protocol = window.location.protocol
    if (protocol === 'http:' || protocol === 'https:') {
      this.isOAuthValid = true
    }

    this.signUpForm = new FormGroup({
      username: new FormControl(this.userSignUp.username, [Validators.required, Validators.minLength(4)]),
      emailAddress: new FormControl(this.userSignUp.emailAddress, [Validators.required, Validators.minLength(4), Validators.email]),
      password: new FormControl(this.userSignUp.password, [Validators.required, Validators.minLength(4)]),
      repeatPassword: new FormControl(this.userSignUp.repeatPassword,
        [Validators.required, Validators.minLength(4)]
      ),
    },
      { validators: repeatPasswordValidator })
    this.signInForm = new FormGroup({
      usernameEmail: new FormControl(this.userSignIn.usernameEmail, [Validators.required]),
      password: new FormControl(this.userSignIn.password, [Validators.required])
    },
      // { validators: repeatPasswordValidator, asyncValidators: [this.credentialValidator.validate.bind(this.credentialValidator)] }
    )
  }

  get username() { return this.signUpForm.get('username'); }
  get emailAddress() { return this.signUpForm.get('emailAddress'); }
  get password() { return this.signUpForm.get('password'); }
  get repeatPassword() { return this.signUpForm.get('repeatPassword'); }

  onSignUp() {
    console.log('submit');
    const emailUsername = this.signInForm.get('usernameEmail').value
    const password = this.signInForm.get('password').value
    this.firebaseService.signUp(emailUsername, password)
  }

  onSignIn() {
    console.log('onsignin');
    const emailUsername = this.signInForm.get('usernameEmail').value
    const password = this.signInForm.get('password').value
    this.firebaseService.signIn(emailUsername, password)
  }

  onSignInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    // this.auth.auth.signInWithRedirect(provider)
    // firebase.auth().getRedirectResult().then((e) => {
    this.firebaseService.signInWithGoogle(provider)
  }

}

export interface SignIn {
  username: string,
  emailAddress: string,
  age: number,
  gender: string,
  authType: string,
}
