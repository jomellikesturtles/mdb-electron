import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '@services/profile/profile.service';
import { IUserProfile } from '@models/user.model';
import { NotificationService } from '@core/services/notification.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: IUserProfile;
  loading = false;
  uploadingAvatar = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      name: [''],
      emailAddress: ['', [Validators.required, Validators.email]],
      bio: [''],
      password: [''], // Optional change
      confirmPassword: ['']
    });

    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    const username = localStorage.getItem('user');
    if (!username) {
      this.loading = false;
      console.error('No username found in localStorage');
      return;
    }

    this.profileService.getProfile(username).subscribe(
      (profile: any) => { // Type 'any' for now as service might return partial
        this.userProfile = profile;
        this.profileForm.patchValue({
          username: profile.username,
          name: profile.name,
          emailAddress: profile.emailAddress,
          bio: profile.bio
        });
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.error('Failed to load profile', error);
      }
    );
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.profileForm.value;

    // Construct update object - remove empty passwords if not changing
    const updateData: any = {
      username: formValue.username,
      name: formValue.name,
      emailAddress: formValue.emailAddress,
      bio: formValue.bio
    };

    if (formValue.password) {
      if (formValue.password !== formValue.confirmPassword) {
        this.notificationService.showError('Passwords do not match');
        this.loading = false;
        return;
      }
      updateData.password = formValue.password;
    }

    this.profileService.updateProfile(updateData).subscribe(
      () => {
        this.loading = false;
        this.notificationService.showSuccess('Profile updated successfully');
        this.router.navigate(['/user/profile']);
      },
      error => {
        this.loading = false;
        this.notificationService.showError('Failed to update profile');
        console.error(error);
      }
    );
  }

  onTriggerAvatarUpload(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onAvatarSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.notificationService.showError('User not authenticated');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.notificationService.showError('Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed.');
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      this.notificationService.showError('File is too large. Maximum size is 2MB.');
      return;
    }

    this.uploadingAvatar = true;
    const username = this.userProfile?.username || localStorage.getItem('user');

    if (!username) {
      this.notificationService.showError('No user identity found.');
      this.uploadingAvatar = false;
      return;
    }

    this.profileService.uploadAvatar(username, file).subscribe(
      (response: any) => {
        this.uploadingAvatar = false;
        this.notificationService.showSuccess('Avatar updated successfully');
        if (response && response.photoUrl) {
          this.userProfile.photoUrl = response.photoUrl;
        } else {
          this.loadProfile();
        }
      },
      error => {
        this.uploadingAvatar = false;
        this.notificationService.showError('Failed to upload avatar');
        console.error(error);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/user/profile']);
  }
}
