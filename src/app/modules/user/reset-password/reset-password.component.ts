import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { repeatPasswordValidator } from '@directives/repeat-password.directive';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  newPasswordForm: FormGroup;
  submitted = false;
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.newPasswordForm = this.formBuilder.group({
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

    console.log('Reset Password Request for:', this.resetPasswordForm.value.email);
    // TODO: Call service to handle password reset request
  }

  onNewPasswordSubmit() {
    this.submitted = true;

    if (this.newPasswordForm.invalid) {
      return;
    }

    console.log('Setting new password with token:', this.token);
    // TODO: Call service to set new password
  }
}
