import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { REGEX_OMDB_RELEASE_DATE, REGEX_TMDB_RELEASE_DATE, REGEX_YEAR_ONLY } from '../constants';

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

    const result1 = REGEX_OMDB_RELEASE_DATE.exec(releaseDate)
    const result2 = REGEX_TMDB_RELEASE_DATE.exec(releaseDate)
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

}
