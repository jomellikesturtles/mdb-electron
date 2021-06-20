
import { STRING_REGEX_YEAR_ONLY, STRING_REGEX_OMDB_RELEASE_DATE, STRING_REGEX_TMDB_RELEASE_DATE } from '../shared/constants';

export default class GeneralUtil {

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD or 15 October 1999
   * @returns string value of year with `YYYY` format
   */
  static getYear(releaseDate: string) {
    const REGEX_OMDB_RELEASE_DATE = new RegExp(STRING_REGEX_OMDB_RELEASE_DATE, `gi`);
    const REGEX_TMDB_RELEASE_DATE = new RegExp(STRING_REGEX_TMDB_RELEASE_DATE, `gi`);
    const REGEX_YEAR_ONLY = new RegExp(STRING_REGEX_YEAR_ONLY, `gi`)
    const result1 = REGEX_OMDB_RELEASE_DATE.exec(releaseDate)
    const result2 = REGEX_TMDB_RELEASE_DATE.exec(releaseDate)
    const result3 = REGEX_YEAR_ONLY.exec(releaseDate)
    let toReturn = ''
    if (result1) {
      toReturn = releaseDate.substr(releaseDate.lastIndexOf(' ') + 1);
    } else if (result2) {
      toReturn = releaseDate.substring(0, releaseDate.indexOf('-'))
    } else if (result3) {
      toReturn = releaseDate
    }
    return toReturn
  }

  /**
   * Converts seconds to HH:mm:ss format.
   */
  static convertToHHMMSS(value): string {
    if (!value) return '00:00'
    const minSec = new Date(value * 1000).toISOString().substr(14, 5)
    if (value < 3600) {
      return minSec
    }
    const hour = (value / 3600)
    return Math.floor(hour) + ':' + minSec
  }
}
