import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userProfile: IProfile = {
    username: 'peterparker123',
    emailAddress: 'peterparker123@gmail.com',
    watchedCount: 90,
    bookmarkedCount: 9
  }
  defaultUserProfile = this.userProfile

  constructor() { }

  ngOnInit() {
  }

  changePassword() {

  }
  changeEmailAddress() {

  }

  onSave() {

  }
  onReset() {
    this.userProfile = this.defaultUserProfile
  }
  onSignOut() {

  }

}

export interface IProfile {
  username: string,
  watchedCount: number | 0,
  bookmarkedCount: number | 0,
  emailAddress: string,
}
