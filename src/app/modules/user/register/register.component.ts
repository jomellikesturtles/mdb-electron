import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { repeatPasswordValidator } from '@directives/repeat-password.directive';
import { UsernameExistValidator } from '@directives/username-exist.directive';
import { AuthenticationService } from '@services/authentication.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  userSignUp = {
    username: '',
    emailAddress: '',
    age: 0,
    gender: '',
    authType: '',
    password: '',
    repeatPassword: ''
  };
  signUpForm: FormGroup;
  formError = '';

  constructor(
    private formBuilder: FormBuilder,
    private usernameExistValidator: UsernameExistValidator,
    private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      username: [this.userSignUp.username, [Validators.required, Validators.minLength(4)],
        // UsernameExistingValidator.validateUsername(this.afs)
      ],
      emailAddress: [this.userSignUp.emailAddress, [Validators.required, Validators.minLength(4), Validators.email]],

      password: [this.userSignUp.password, [Validators.required, Validators.minLength(6)]],

      repeatPassword: [this.userSignUp.repeatPassword, [Validators.required, Validators.minLength(6)]],
    }, { validators: repeatPasswordValidator }
    );
  }

  get username() { return this.signUpForm.get('username'); }
  get emailAddress() { return this.signUpForm.get('emailAddress'); }
  get password() { return this.signUpForm.get('password'); }
  get repeatPassword() { return this.signUpForm.get('repeatPassword'); }

  ngAfterViewInit(): void {
    this.signUpForm;
  }

  onSignUp() {
    console.log('submit');
    if (this.signUpForm.valid) {
      const userName = this.signUpForm.get('username').value;
      const emailAddress = this.signUpForm.get('emailAddress').value;
      const password = this.signUpForm.get('password').value;
      this.authService.register({ email: emailAddress, userName, password }).pipe(

        // catchError((err) => {
        //   // 1. Log the error for diagnostics
        //   console.error('Pipeline error:', err);

        //   // 2. Either return a friendly fallback observable:
        //   // return of([]);

        //   // Or rethrow it so your component still knows it failed:
        //   return throwError(() => new Error('Service failure'));
        // }

        // )
      ).subscribe(
        {
          next: (data) => {
            console.log('Registering user:', { userName, emailAddress });
            this.notificationService.showSuccess('Registration successful');
            this.router.navigate(['/user/signin']);
          },
          error: (err) => {
            if (err?.status == 409) {
              this.formError = "User already registered.";
            }
            alert('error:' + err);
          }
        }
        // response => {
        // }
      );
    }
  }
}
