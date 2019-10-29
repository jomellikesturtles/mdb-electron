import { Injectable } from '@angular/core';
import { TmdbResultObject, Result } from '../subject';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD
   */
  getYear(releaseDate: string) {
    return releaseDate.substring(0, releaseDate.indexOf('-'))
  }

}
