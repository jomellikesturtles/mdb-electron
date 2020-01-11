import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';
// import { Observable } from 'rxjs';


// @Injectable({ providedIn: 'root' })
// export class RepeatPasswordValidator implements AsyncValidator {
//   constructor() {

//   }
//   validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
//     return
//   }
// }



export const repeatPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password')
  const repeatPassword = control.get('repeatPassword')
  return password && repeatPassword && password.value !== repeatPassword.value ? { 'isRepeatPassword': true } : null
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





  // validate(control: AbstractControl): { [key: string]: any } | null {
  //   return this.forbiddenName ? repeatPasswordValidator(new RegExp(this.forbiddenName, 'i'))(control)
  //     : null;
  // }
}



/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
