import {
  Component, OnInit,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProfileService } from '@services/profile/profile.service';
import { UserDataService } from '@services/user-data/user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // @Select(UserState) user$: Observable<any>
  // moviesList = TMDB_SEARCH_RESULTS.results
  moviesList = [];
  userProfile: IProfile;
  photoUrl = '';
  userStats: {
    filmsNumber: 54;
  };
  defaultUserProfile;
  firebaseUser$;
  moviesWatchedList = {
    count: 0,
    data: []
  };
  moviesBookmarksList = {
    count: 0,
    data: []
  };
  background: ThemePalette = undefined;
  constructor(
    private userDataService: UserDataService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    // this.countBookmarks()
    this.getUser();
    this.getUserData();
  }

  ngAfterViewInit(): void {
    this.background = this.background ? undefined : 'primary';
  }

  getUser() {
    this.profileService.getProfile().subscribe(e => {
      this.userProfile = e;
    });
  }

  changePassword() {

  }

  changeEmailAddress() {

  }

  onSave() {

  }

  onReset() {
    this.userProfile = this.defaultUserProfile;
  }

  onSignOut() {

  }

  async countBookmarks() {
    // const count = await this.firebaseService.countAll('bookmark')
    // console.log('count: ', count)
  }

  uploadFile(data) {
    console.log(data);
    // this.firebaseService.uploadToStorage(data.item(0))
  }

  exportUserData() {

  }

  getUserData() {
    this.userDataService.getUserDataFirstPage('watched').then(e => {
      console.log('getuserdata watched', e);
      this.moviesWatchedList.count = e.totalResults;
      this.moviesWatchedList.data = e.results;
    });
    this.userDataService.getUserDataFirstPage('bookmark').then(e => {
      console.log('getuserdata bookmark', e);
      this.moviesBookmarksList.count = e.totalResults;
      this.moviesBookmarksList.data = e.results;
    });
  }
}

export interface IProfile {
  username: string,
  watchedCount: number | 0,
  bookmarkedCount: number | 0,
  emailAddress: string,
  bio: string;
}
