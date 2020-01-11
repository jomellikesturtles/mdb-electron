import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserState } from '../../app.state';
import { Select } from '@ngxs/store';
import { FirebaseService } from '../../services/firebase.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Select(UserState) user$: Observable<any>

  userProfile: IProfile = {
    username: 'peterparker123',
    emailAddress: 'peterparker123@gmail.com',
    watchedCount: 90,
    bookmarkedCount: 9
  }
  defaultUserProfile = this.userProfile
  firebaseUser$
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {

    this.getUser()
  }

  getUser() {
    this.firebaseService.getUser().then(e => {
      console.log('fbuser', this.firebaseUser$);
      this.firebaseUser$ = e
    })
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
