import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { STRING_REGEX_YEAR_ONLY, STRING_REGEX_OMDB_RELEASE_DATE, STRING_REGEX_TMDB_RELEASE_DATE } from '../shared/constants';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Hides the snackbar.
   * @param root instance method.
   */
  hideSnackbar(root) {
    setTimeout(function () {
      root.displayMessage = ''
      root.displaySnackbar = false
    }, 3000);
  }

  /**
   * !UNUSED
   * Gets browser environment
   * @returns toReturn desktop or web
   */
  getEnvironment(): string {
    let toReturn = 'desktop'
    const environment = location.protocol
    if (environment === 'http:' || environment === 'https:') {
      toReturn = 'web'
    } else if (environment === 'file:') {
      toReturn = 'desktop'
    }
    return toReturn
  }

}
