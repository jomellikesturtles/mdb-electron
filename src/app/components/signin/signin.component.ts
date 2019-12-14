import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth'
// import {  } from '@angular/fire/angularfire2'
import * as firebase from 'firebase/app';
import { IpcService } from '../../services/ipc.service';
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
  userSignIn: SignIn = {
    username: '',
    emailAddress: '',
    age: 0,
    gender: '',
    authType: '',

  }

  constructor(private db: AngularFirestore,
    private auth: AngularFireAuth,
    private authModule: AngularFireAuthModule,
    private ipcService: IpcService) {
    // const items = this.db.collection('').get
    // db
    // this.authModule
  }

  ngOnInit() {
    // this.authModule(
  }

  onSubmit() {
    console.log('submit');
  }
  onSignIn() {
    // this.db.
    console.log('onsignin');
    // this.auth.auth.signInWithCredential()
    // console.log(googleUser.getAuthResponse().id_token)
    const myAuth = this.auth.auth.createUserWithEmailAndPassword(this.user.emailAddress, this.user.password).then((e) => {
      console.log(e.additionalUserInfo);
      console.log(e.credential);
      console.log(e.operationType);
      console.log(e.user);

    }).catch(function (e) {
      {
        console.log('in catch', e);
      }
    })
    // myAuth.
  }
  onSignInGoogle() {
    const provider = firebase.auth.GoogleAuthProvider.credential('')
    // provider.addScope(
    // this.auth.auth.goo
    // this.ipcService.sendProvider(provider)
    this.auth.auth.signInWithRedirect(provider)
    firebase.auth().getRedirectResult().then((e) => {
      console.log(e.additionalUserInfo);
      console.log(e.credential);
      console.log(e.operationType);
      console.log(e.user);
    }).catch(function (e) {
      {
        console.log('in catch', e.message);
      }
    })
    // firebase.auth().createUserWithEmailAndPassword
  }
}

export interface SignIn {
  username: string,
  emailAddress: string,
  age: number,
  gender: string,
  authType: string,
}
