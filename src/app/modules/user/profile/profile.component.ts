import {
  Component, OnInit,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProfileService } from '@services/profile/profile.service';
import { UserDataService } from '@services/user-data/user-data.service';
import { IUserProfile } from '@models/user.model';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  moviesList = [];
  userProfile: IUserProfile;
  photoUrl = '';
  userStats = {
    watched: 0,
    bookmarked: 0,
    reviews: 0,
    favorites: 0
  };
  defaultUserProfile;
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
    // private userDataService: User,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUser();
    this.getUserData();
  }

  ngAfterViewInit(): void {
    this.background = this.background ? undefined : 'primary';
  }

  getUser() {
    const username = localStorage.getItem("user");
    this.profileService.getProfile(username?.toString(), true).subscribe(e => {
      this.userProfile = e;
      // Update stats if available in profile directly
      if (e) {
        this.userStats.favorites = e.favorites.total || 0;
        this.userStats.watched = e.played.total || 0;
        this.userStats.bookmarked = e.bookmarks.total || 0;
      }
    });
  }

  onEditProfile() {
    this.router.navigate(['/user/edit-profile']);
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
      this.userStats.watched = e.totalResults;
    });
    this.userDataService.getUserDataFirstPage('bookmark').then(e => {
      console.log('getuserdata bookmark', e);
      this.moviesBookmarksList.count = e.totalResults;
      this.moviesBookmarksList.data = e.results;
      this.userStats.bookmarked = e.totalResults;
    });
    // Add calls for favorites/reviews if available
  }
}
