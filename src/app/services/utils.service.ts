import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   * @returns string value of year with YYYY format
   */
  getYear(releaseDate: string) {
    return releaseDate.substring(0, releaseDate.indexOf('-'))
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
