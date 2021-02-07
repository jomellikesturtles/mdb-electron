import {
  Component, OnInit,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
// import { Observable } from 'rxjs';
// import { UserState } from '../../../app.state';
// import { Select } from '@ngxs/store';
// import { FirebaseService } from 'src/app/services/firebase.service';
import { UserDataService } from '@services/user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // @Select(UserState) user$: Observable<any>
  // moviesList = TMDB_SEARCH_RESULTS.results
  moviesList = []
  userProfile: IProfile = {
    username: 'peterparker123',
    emailAddress: 'peterparker123@gmail.com',
    watchedCount: 90,
    bookmarkedCount: 9,
    bio: 'movies... I like'
  }
  photoUrl = ''
  userStats: {
    filmsNumber: 54
  }
  defaultUserProfile
  firebaseUser$
  moviesWatchedList = {
    count: 0,
    data: []
  }
  moviesBookmarksList = {
    count: 0,
    data: []
  }
  background: ThemePalette = undefined
  constructor(
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    // this.countBookmarks()
    this.getUser()
    this.treatAll()
    this.getUserData()
  }

  ngAfterViewInit(): void {
    this.background = this.background ? undefined : 'primary'
  }
  treatAll() {
    // this.firebaseService.getEmpty()
  }

  getUser() {
    // this.firebaseService.getUser().then(e => {
    //   console.log('fbuser', this.firebaseUser$);
    //   this.firebaseUser$ = e
    //   this.defaultUserProfile = e
    //   this.cdr.detectChanges()
    // })
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
    // const count = await this.firebaseService.countAll('bookmark')
    // console.log('count: ', count)
  }

  uploadFile(data) {
    console.log(data)
    // this.firebaseService.uploadToStorage(data.item(0))
  }

  exportUserData() {

  }

  getUserData() {
    this.userDataService.getUserDataFirstPage('watched').then(e => {
      console.log('getuserdata watched', e)
      this.moviesWatchedList.count = e.totalResults
      this.moviesWatchedList.data = e.results
    })
    this.userDataService.getUserDataFirstPage('bookmark').then(e => {
      console.log('getuserdata bookmark', e)
      this.moviesBookmarksList.count = e.totalResults
      this.moviesBookmarksList.data = e.results
    })
  }
}

export interface IProfile {
  username: string,
  watchedCount: number | 0,
  bookmarkedCount: number | 0,
  emailAddress: string,
  bio: string
}
