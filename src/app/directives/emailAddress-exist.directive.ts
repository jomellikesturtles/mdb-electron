import { CollectionName, FirebaseOperator, FieldName } from './../services/firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl } from '@angular/forms';
import { map, debounceTime, take } from 'rxjs/operators';

export class EmailAddressExistValidator {
  static validateEmailAddress(afs: AngularFirestore) {
    console.log('EmailAddressExistValidator')
    return (control: AbstractControl) => {

      const emailAddress = control.value.toLowerCase();
      console.log('control emailAddress: ', emailAddress)
      return afs.collection(CollectionName.User, ref => ref.where(FieldName.EmailAddress, FirebaseOperator.Equal, emailAddress))
        .valueChanges().pipe(
          debounceTime(500),
          take(1),
          map(arr =>
            arr.length ? { emailAddressUnavailable: true } : null
          ),
        )
    }
  }
}
