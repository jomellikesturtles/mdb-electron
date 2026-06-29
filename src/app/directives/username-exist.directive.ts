import { Directive, forwardRef, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsernameExistValidator implements AsyncValidator {
  constructor() { }
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(null);
  }
}

@Directive({
  selector: '[appUsernameExist]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => UsernameExistValidatorDirective),
    multi: true
  }]
})

export class UsernameExistValidatorDirective implements AsyncValidator {

  constructor(private validator: UsernameExistValidator) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    console.log('CONTROL VALUE1:', control.value);
    return this.validator.validate(control);
  }
}

export class UsernameExistingValidator {
  static validateUsername() {
    console.log('UsernameExistingValidator');
    return (control: AbstractControl) => {
      const username = control.value.toLowerCase();
      console.log('control username: ', username);
    };
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
