import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '@services/profile/profile.service';
// import { IUserProfile } from '@models/user.model';

interface IUserProfile {
  username: string;
  name: string;
  avatar: string;
  isMain: boolean;
}
@Component({
  selector: 'app-profile-switcher-dialog',
  templateUrl: './profile-switcher-dialog.component.html',
  styleUrls: ['./profile-switcher-dialog.component.scss']
})
export class ProfileSwitcherDialogComponent implements OnInit {
  profiles: IUserProfile[] = [];
  activeProfileId = '';
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<ProfileSwitcherDialogComponent>,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.activeProfileId = localStorage.getItem('active_profile_id') || 'john_smith';
    // this.profileService.getProfiles().subscribe({
    //   next: (data) => {
    //     this.profiles = data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Failed to load profiles', err);
    //     this.loading = false;
    //   }
    // });

    this.profiles = [
      {
        username: 'john_smith',
        name: 'John Smith',
        avatar: '',
        isMain: true
      },
      {
        username: 'nolan',
        name: 'Christopher Nolan',
        avatar: 'https://image.tmdb.org/t/p/w185/jDss6H9Pq44449vHl476zFW1nli.jpg',
        isMain: false
      },
      {
        username: 'tarantino',
        name: 'Quentin Tarantino',
        avatar: 'https://image.tmdb.org/t/p/w185/19Y1pD7xGgHlXoU0Fj1J7Ea5WIP.jpg',
        isMain: false
      },
      {
        username: 'scarlett',
        name: 'Scarlett Johansson',
        avatar: 'https://image.tmdb.org/t/p/w185/kbWd7V057Rk58564h9q0466w72a.jpg',
        isMain: false
      }
    ];
    this.loading = false;

  }

  selectProfile(username: string): void {
    this.profileService.switchProfile(username);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
