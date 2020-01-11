import { Directive, forwardRef, Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms'
import { catchError, map } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
// import { UniqueAlterEgoValidator } from './alter-ego.directive';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CredentialsValidator implements AsyncValidator {
  constructor() { }
  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {

    // return this.myValidate(ctrl.value).pipe(map(isCredentialsValid => (isCredentialsValid ? { credentialsValid: true } : null)), catchError(() => null)
    return null
  }
  // myValidate(): Observable<boolean> {
  myValidate(ctrl: string): Observable<boolean> {
    return of(true).pipe(delay(400));
  }
}

@Directive({
  selector: '[appCredentials]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => CredentialsValidator),
    multi: true
  }]
})
export class CredentialsDirective {

  constructor(private validator: CredentialsValidator) {
  }

  validate(control: AbstractControl) {
    this.validator.validate(control)
  }

}
