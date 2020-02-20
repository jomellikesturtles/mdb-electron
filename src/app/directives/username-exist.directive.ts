import { CollectionName, FirebaseOperator, FieldName } from './../services/firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Directive, forwardRef, Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, NG_VALIDATORS, Validator, ValidatorFn, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map, catchError, debounceTime, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsernameExistValidator implements AsyncValidator {
  constructor(private afs: AngularFirestore) { }
  validate(control: AbstractControl) {

    console.log('CONTROL VALUE2:', control.value)
    const source = of(1).pipe(delay(400))
    return of(false).pipe(delay(400),
      map(isExisting => (isExisting ? { usernameExist: false } : null)),
      catchError(() => of(null))
    );
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

export class UsernameExistValidatorDirective {

  constructor(private validator: UsernameExistValidator) { }
  validate(control: AbstractControl) {
    console.log('CONTROL VALUE1:', control.value)
    this.validator.validate(control)
  }
}

export class UsernameExistingValidator {
  static validateUsername(afs: AngularFirestore) {
    console.log('UsernameExistingValidator')
    return (control: AbstractControl) => {

      const username = control.value.toLowerCase();
      console.log('control username: ', username)
      return afs.collection(CollectionName.User, ref => ref.where(FieldName.Username, FirebaseOperator.Equal, username))
        .valueChanges().pipe(
          debounceTime(500),
          take(1),
          map(arr =>
            arr.length ? { usernameUnavailable: true } : null
          ),
        )
    }
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
