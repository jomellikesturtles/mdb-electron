
import { ITPBTorrent, MDBTorrent, TmdbParameters, TmdbSearchMovieParameters } from '@models/interfaces';
import { STRING_REGEX_YEAR_ONLY, STRING_REGEX_OMDB_RELEASE_DATE, STRING_REGEX_TMDB_RELEASE_DATE } from '../shared/constants';
import { YTSTorrent } from '@models/yts-torrent.model';
import { HttpParams } from '@angular/common/http';

export default class GeneralUtil {

  /**
   * Gets the year.
   * @param releaseDate release date with format YYYY-MM-DD or 15 October 1999
   * @returns string value of year with `YYYY` format
   */
  static getYear(releaseDate: string) {
    const REGEX_OMDB_RELEASE_DATE = new RegExp(STRING_REGEX_OMDB_RELEASE_DATE, `gi`);
    const REGEX_TMDB_RELEASE_DATE = new RegExp(STRING_REGEX_TMDB_RELEASE_DATE, `gi`);
    const REGEX_YEAR_ONLY = new RegExp(STRING_REGEX_YEAR_ONLY, `gi`);
    const result1 = REGEX_OMDB_RELEASE_DATE.exec(releaseDate);
    const result2 = REGEX_TMDB_RELEASE_DATE.exec(releaseDate);
    const result3 = REGEX_YEAR_ONLY.exec(releaseDate);
    let toReturn = '';
    if (result1) {
      toReturn = releaseDate.substr(releaseDate.lastIndexOf(' ') + 1);
    } else if (result2) {
      toReturn = releaseDate.substring(0, releaseDate.indexOf('-'));
    } else if (result3) {
      toReturn = releaseDate;
    }
    return toReturn;
  }

  /**
   * Converts seconds to HH:mm:ss format.
   */
  static convertToHHMMSS(value): string {
    if (!value) return '00:00';
    const minSec = new Date(value * 1000).toISOString().substr(14, 5);
    if (value < 3600) {
      return minSec;
    }
    const hour = (value / 3600);
    return Math.floor(hour) + ':' + minSec;
  }

  /**
   * Gets the percentage.
   * @param timestamp timestamp in seconds
   * @param length movie length in seconds
   * @returns percentage
   */
  static getPercentage(timestamp: number, length: number): number {
    return (timestamp / length) * 100;
  }

  /**
   * Gets the timestamp.
   * @param percentage
   * @param length movie length in seconds
   * @returns timestamp in seconds
   */
  static getTimestamp(percentage: number, length: number): number {
    return (percentage / 100) * length;
  }
  /**
   * Console log with date time.
   */
  static DEBUG = (() => {
    let timestamp = () => { };
    timestamp.toString = () => {
      return "[DEBUG " + new Date().toLocaleString() + "]";
    };
    let timestamp2 = () => { };
    timestamp2.toString = () => {
      return new Date().toLocaleString();
    };
    return {
      log: console.log.bind(console, "%c [LOG " + timestamp2 + "]", "background:gray; color:#fff; padding:3px; font-size:12px"),
      warn: console.log.bind(console, "%c [WARN " + timestamp2 + "]", "background:yellow; color:#fff; padding:3px; font-size:12px"),
      error: console.log.bind(console, "%c [ERROR " + timestamp2 + "]", "background:red; color:#fff; padding:3px; font-size:12px")
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

  /**
   * Converts trrents to MDB torrent regardless of source. ie thepiratebay, yts
   */
  static mapTorrent(rawTorrent: ITPBTorrent | YTSTorrent): MDBTorrent {
    let newTorrent = new MDBTorrent();
    // check yts properties first
    newTorrent.hash = rawTorrent.hash;
    newTorrent.sizeBytes = rawTorrent.hasOwnProperty('size_bytes') ? rawTorrent['size_bytes'] : rawTorrent['sizeBytes'];
    newTorrent.size = rawTorrent.hasOwnProperty('size') ? rawTorrent['size'] :
      GeneralUtil.prettyBytes(rawTorrent['sizeBytes']);
    newTorrent.name = rawTorrent.hasOwnProperty('name') ? rawTorrent['name'] : null;
    newTorrent.dateUploaded = rawTorrent.hasOwnProperty('date_uploaded') ? rawTorrent['date_uploaded'] : rawTorrent['added'];
    newTorrent.dateUploadedUnix = rawTorrent.hasOwnProperty('date_uploaded_unix') ? rawTorrent['date_uploaded_unix'] : (new Date(rawTorrent['added']).getTime() / 1000);
    newTorrent.magnetLink = this.getMagnetLinkWithProperHash(rawTorrent.hash);
    newTorrent.isYts = rawTorrent.hasOwnProperty('url') ? true : false;
    newTorrent.url = rawTorrent.hasOwnProperty('url') ? rawTorrent['url'] : this.getMagnetLinkWithProperHash(rawTorrent.hash);
    newTorrent.quality = rawTorrent.hasOwnProperty('quality') ? rawTorrent['quality'] : 'unknown';
    newTorrent.seeds = rawTorrent.hasOwnProperty('seeds') ? rawTorrent['seeds'] : null;
    newTorrent.peers = rawTorrent.hasOwnProperty('peers') ? rawTorrent['peers'] : null;
    return newTorrent;
  }

  static getMagnetLinkWithProperHash(hash: string) {
    const base = `magnet:?xt=urn:btih:${hash}`;
    return base;
  }

  /**
   * Copies link to clipboard
   * @param magnetLink link top copy
   */
  static copyToClipboard(magnetLink: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = magnetLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /**
   * Appends parameters list into http param object.
   * @param paramMap parameters key-value pair list
   * @param myHttpParam http param to append to
   */
  static appendMappedParameters(paramMap: Map<TmdbParameters | TmdbSearchMovieParameters, any>, myHttpParam: HttpParams) {
    for (let entry of paramMap.entries()) {
      myHttpParam = myHttpParam.append(entry[0], entry[1]);
    }
    return myHttpParam;
  }

}
