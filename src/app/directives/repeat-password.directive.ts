import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';
// import { Observable } from 'rxjs';


/**
 * Validator for repeat password. It sets false if password and repeat password are not equal.
 */
export const repeatPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password')
  const repeatPassword = control.get('repeatPassword')
  const toReturn = password.value && repeatPassword.value && password.value !== repeatPassword.value ? { isRepeatPassword: true } : null
  return toReturn
}

@Directive({
  selector: '[appRepeatPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RepeatPasswordValidatorDirective, multi: true }]
})
export class RepeatPasswordValidatorDirective implements Validator {
  // @Input('appRepeatPassword') forbiddenName: string;

  validate(control: AbstractControl): ValidationErrors {
    return repeatPasswordValidator(control)
  }

}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
