import { AbstractControl } from '@angular/forms';
import { map, debounceTime, take } from 'rxjs/operators';

export class EmailAddressExistValidator {
  static validateEmailAddress() {
    return false;
  }
}
