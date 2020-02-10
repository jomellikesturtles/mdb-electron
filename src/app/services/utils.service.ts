import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { REGEX_OMDB_RELEASE_DATE, REGEX_TMDB_RELEASE_DATE, REGEX_YEAR_ONLY, STRING_REGEX_OMDB_RELEASE_DATE, STRING_REGEX_TMDB_RELEASE_DATE } from '../constants';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD or 15 October 1999
   * @returns string value of year with YYYY format
   */
  getYear(releaseDate: string) {
    // change to test

    const REGEX_OMDB_RELEASE_DATE_LOCAL = new RegExp(STRING_REGEX_OMDB_RELEASE_DATE, `gi`);
    const REGEX_TMDB_RELEASE_DATE_LOCAL = new RegExp(STRING_REGEX_TMDB_RELEASE_DATE, `gi`);
    const result1 = REGEX_OMDB_RELEASE_DATE_LOCAL.exec(releaseDate)
    const result2 = REGEX_TMDB_RELEASE_DATE_LOCAL.exec(releaseDate)
    let toReturn = ''
    if (result1) {
      toReturn = releaseDate.substr(releaseDate.lastIndexOf(' ') + 1);
    } else if (result2) {
      toReturn = releaseDate.substring(0, releaseDate.indexOf('-'))
    } else if (REGEX_YEAR_ONLY.exec(releaseDate)) {
      toReturn = releaseDate
    }
    return toReturn
  }

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
