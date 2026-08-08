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
  changePasswordForm: FormGroup;
  userProfile: IUserProfile;
  loading = false;
  changePasswordLoading = false;
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
      bio: ['']
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
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

    const updateData: any = {
      username: formValue.username,
      name: formValue.name,
      emailAddress: formValue.emailAddress,
      bio: formValue.bio
    };

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

  onChangePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.notificationService.showError('Passwords do not match');
      return;
    }

    this.changePasswordLoading = true;
    this.authService.changePassword(currentPassword, newPassword, confirmPassword).subscribe({
      next: () => {
        this.changePasswordLoading = false;
        this.notificationService.showSuccess('Password updated successfully');
        this.changePasswordForm.reset();
      },
      error: (err) => {
        this.changePasswordLoading = false;
        this.notificationService.showError('Failed to change password');
        console.error(err);
      }
    });
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
