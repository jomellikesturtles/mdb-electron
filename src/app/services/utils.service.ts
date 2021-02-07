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


  // Human readable bytes util
  prettyBytes(num: number): string {
    let exponent,
      unit,
      neg = num < 0,
      units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    if (neg) num = -num;
    if (num < 1) return (neg ? "-" : "") + num + " B";
    exponent = Math.min(
      Math.floor(Math.log(num) / Math.log(1000)),
      units.length - 1
    );
    num = Number((num / Math.pow(1000, exponent)).toFixed(2));
    unit = units[exponent];
    return (neg ? "-" : "") + num + " " + unit;
  }
}
