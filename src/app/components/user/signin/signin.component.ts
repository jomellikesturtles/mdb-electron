import { UsernameExistValidator, UsernameExistingValidator } from '../../../directives/username-exist.directive';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms'
import { repeatPasswordValidator } from '../../../directives/repeat-password.directive';
import { CredentialsValidator } from '../../../directives/credentials.directive';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth'
// import {  } from '@angular/fire/angularfire2'
import { IpcService } from '../../../services/ipc.service';
import { FirebaseService, CollectionName } from '../../../services/firebase.service';
import { UtilsService } from '../../../services/utils.service';
import { repeat, debounceTime, take, map } from 'rxjs/operators';

export class CustomValidator {
  static usernameValidate(afs: AngularFirestore) {
    return (control: AbstractControl) => {

      const username = control.value.toLowerCase();
      console.log('control username ', username)
      return afs.collection('user', ref => ref.where('username', '==', username))

        .valueChanges().pipe(
          debounceTime(500),
          take(1),
          map(arr => arr.length ? { usernameAvailable: false } : null),
        )
    }
  }
}

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
  isSignIn = false
  isOAuthValid = false
  generalError = ''

  constructor(
    private credentialValidator: CredentialsValidator,
    private auth: AngularFireAuth,
    private authModule: AngularFireAuthModule,
    private firebaseService: FirebaseService,
    private ipcService: IpcService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private usernameExistValidator: UsernameExistValidator,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    const env = this.utilsService.getEnvironment()
    if (env === 'web') {
      this.isOAuthValid = true
    }

    this.signUpForm = this.formBuilder.group({
      username: [this.userSignUp.username, [Validators.required, Validators.minLength(4)], UsernameExistingValidator.validateUsername(this.afs)
      ],
      emailAddress: [this.userSignUp.emailAddress, [Validators.required, Validators.minLength(4), Validators.email]],

      password: [this.userSignUp.password, [Validators.required, Validators.minLength(6)]],

      repeatPassword: [this.userSignUp.repeatPassword, [Validators.required, Validators.minLength(6)]],
    }, { validators: repeatPasswordValidator }
    )

    this.signInForm = new FormGroup({
      usernameEmail: new FormControl(this.userSignIn.usernameEmail, [Validators.required]),
      password: new FormControl(this.userSignIn.password, [Validators.required])
    },
    )
  }

  get username() { return this.signUpForm.get('username'); }
  get emailAddress() { return this.signUpForm.get('emailAddress'); }
  get password() { return this.signUpForm.get('password'); }
  get repeatPassword() { return this.signUpForm.get('repeatPassword'); }

  onSignUp() {
    console.log('submit');
    const username = this.signUpForm.get('username').value
    const emailAddress = this.signUpForm.get('emailAddress').value
    const password = this.signUpForm.get('password').value
    this.firebaseService.signUp(emailAddress, password).then(e => {
      console.log(e)
      // this.firebaseService.insertIntoFirestore(CollectionName.User, { username, emailAddress })
    }).catch(e => {
      this.generalError = e
      // this.signUpForm.
      // console.log(this.signUpForm.value('username'))
      this.signUpForm.setErrors({ generalError: e })
    })
  }

  // onSignUpFromLogin() {
  //   console.log('submit');
  //   const emailUsername = this.signInForm.get('usernameEmail').value
  //   const password = this.signInForm.get('password').value
  //   this.firebaseService.signUp(emailUsername, password)
  // }

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

  emailDomainValidator(control: FormControl) {
    const email = control.value;
    if (email && email.indexOf("@") != -1) {
      let [_, domain] = email.split('@');
      if (domain !== 'codecraft.tv') {
        const emailDomain = {
          parsedDomain: domain
        }
        console.log(emailDomain)
        return {
          emailDomain
        }
      }
    }
    return null;
  }

}


export interface SignIn {
  username: string,
  emailAddress: string,
  age: number,
  gender: string,
  authType: string,
}
