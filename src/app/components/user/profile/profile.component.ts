import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
// import { UserState } from '../../../app.state';
import { Select } from '@ngxs/store';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // @Select(UserState) user$: Observable<any>

  userProfile: IProfile = {
    username: 'peterparker123',
    emailAddress: 'peterparker123@gmail.com',
    watchedCount: 90,
    bookmarkedCount: 9
  }
  defaultUserProfile
  firebaseUser$

  constructor(
    private cdr: ChangeDetectorRef,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    // this.countBookmarks()
    this.getUser()
    this.treatAll()
  }

  treatAll() {
    this.firebaseService.getEmpty()
  }

  getUser() {
    this.firebaseService.getUser().then(e => {
      console.log('fbuser', this.firebaseUser$);
      this.firebaseUser$ = e
      this.defaultUserProfile = e
      this.cdr.detectChanges()
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

  async countBookmarks() {
    const count = await this.firebaseService.countAll('bookmark')
    console.log('count: ', count)
  }

  uploadFile(data) {
    console.log(data)
    this.firebaseService.uploadToStorage(data.item(0))
  }
}

export interface IProfile {
  username: string,
  watchedCount: number | 0,
  bookmarkedCount: number | 0,
  emailAddress: string,
}
