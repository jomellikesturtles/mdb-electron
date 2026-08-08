import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { repeatPasswordValidator } from '@directives/repeat-password.directive';
import { NotificationService } from '@core/services/notification.service';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  newPasswordForm: FormGroup;
  submitted = false;
  otpSent = false;
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.newPasswordForm = this.formBuilder.group({
      otp: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: repeatPasswordValidator });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  get f() { return this.resetPasswordForm.controls; }
  get n() { return this.newPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const email = this.resetPasswordForm.value.email;
    this.authService.sendOtp({ username: email, channel: 'EMAIL' }).subscribe({
      next: () => {
        this.otpSent = true;
        this.submitted = false;
        this.notificationService.showSuccess('Verification code sent to your email');
      },
      error: (err) => {
        this.notificationService.showError('Failed to send verification code');
        console.error(err);
      }
    });
  }

  onNewPasswordSubmit() {
    this.submitted = true;

    if (this.newPasswordForm.invalid) {
      return;
    }

    const email = this.resetPasswordForm.value.email;
    const otp = this.newPasswordForm.value.otp;
    const password = this.newPasswordForm.value.password;

    this.authService.verifyOtp({ username: email, otp }).subscribe({
      next: (response) => {
        const signature = response.signature || '';
        this.authService.resetPassword(email, signature, password).subscribe({
          next: () => {
            this.notificationService.showSuccess('Password reset successfully');
            this.router.navigate(['/user/signin']);
          },
          error: (err) => {
            this.notificationService.showError('Failed to reset password');
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.notificationService.showError('Invalid verification code');
        console.error(err);
      }
    });
  }
}
