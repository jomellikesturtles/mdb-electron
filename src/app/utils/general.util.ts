
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

  /**
   * Gets the percentage.
   * @param timestamp timestamp in seconds
   * @param length movie length in seconds
   * @returns percentage
   */
  static getPercentage(timestamp: number, length: number): number {
    return (timestamp / length) * 100
  }

  /**
   * Gets the timestamp.
   * @param percentage
   * @param length movie length in seconds
   * @returns timestamp in seconds
   */
  static getTimestamp(percentage: number, length: number): number {
    return (percentage / 100) * length
  }
  /**
   * Console log with date time.
   */
  static DEBUG = (() => {
    let timestamp = () => { };
    timestamp.toString = () => {
      return "[DEBUG " + new Date().toLocaleString() + "]";
    };
    return {
      log: console.log.bind(console, "%s", timestamp),
    };
  })();

  // Human readable bytes util
  static prettyBytes(num: number): string {
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
