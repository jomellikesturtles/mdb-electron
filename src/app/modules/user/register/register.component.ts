import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { repeatPasswordValidator } from '@directives/repeat-password.directive';
import { UsernameExistValidator } from '@directives/username-exist.directive';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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
  generalError = '';

  constructor(
    private formBuilder: FormBuilder,
    private usernameExistValidator: UsernameExistValidator,
    private authService: AuthenticationService,
    private router: Router,
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

  onSignUp() {
    console.log('submit');
    if (this.signUpForm.valid) {
      const username = this.signUpForm.get('username').value;
      const emailAddress = this.signUpForm.get('emailAddress').value;
      const password = this.signUpForm.get('password').value;
      this.authService.register({ email: emailAddress, username, password }).subscribe(response => {
        console.log('Registering user:', { username, emailAddress });

        // TODO: show popup
        this.router.navigate(['/user/signin']);

      });
    }
  }
}
