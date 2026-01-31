import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '@services/profile/profile.service';
import { IUserProfile } from '@models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: IUserProfile;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private snackBar: MatSnackBar
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
    this.profileService.getProfile().subscribe(
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
        this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
        this.loading = false;
        return;
      }
      updateData.password = formValue.password;
    }

    this.profileService.updateProfile(updateData).subscribe(
      () => {
        this.loading = false;
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/user/profile']);
      },
      error => {
        this.loading = false;
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
        console.error(error);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/user/profile']);
  }
}
