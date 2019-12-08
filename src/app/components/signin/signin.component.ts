import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  ageList = []
  userSignIn: SignIn = {
    username: '',
    emailAddress: '',
    age: 0,
    gender: '',
    authType: '',

  }

  constructor() { }

  ngOnInit() {
    for (let index = 0; index < 100; index++) {
      this.ageList.push(index)
    }
  }

  onSubmit() {
    console.log('submit');
  }

}

export interface SignIn {
  username: string,
  emailAddress: string,
  age: number,
  gender: string,
  authType: string,
}
