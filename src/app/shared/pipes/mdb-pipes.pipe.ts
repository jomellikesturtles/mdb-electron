import { Pipe, PipeTransform } from '@angular/core';
import { STRING_REGEX_TMDB_RUNTIME } from '../constants';
import GeneralUtil from '@utils/general.util';
import { GenreCodes } from '@models/interfaces';

/**
 * Gets the release year from string with format `00 Month 0000`.
 * @param value date string with format `00 Month 0000`
 * @returns year with `YYYY` format
 */
@Pipe({ name: 'releaseYear' })
export class ReleaseYearPipe implements PipeTransform {
  constructor() { }
  transform(value: string): string {
    return GeneralUtil.getYear(value)
  }
}

/**
 * Separates array items with comma and space.
 * @param value list of value
 * @returns string representation of the original value separated with comma and space
 */
@Pipe({ name: 'commaSpace' })
export class CommaSpacePipe implements PipeTransform {
  transform(value: string[]): string {
    return value.join(', ')
  }
}

/**
 * Displays the runtime into readable understandable display.
 * @param value original value. `000` or `000 min` format`
 * @returns `00 hours 00 minutes` format
 */
@Pipe({ name: 'runtimeDisplay' })
export class RuntimeDisplayPipe implements PipeTransform {
  transform(value: string | number): string {
    let toReturn = ''
    if (typeof value === 'number') {
      const RUNTIME_HOUR = Math.floor(value / 60)
      const VALUE_REMAINDER = (value % 60)
      if (RUNTIME_HOUR === 1) {
        toReturn += `${RUNTIME_HOUR} hour`
      } else if (RUNTIME_HOUR >= 2) {
        toReturn += `${RUNTIME_HOUR} hours`
      }
      if (VALUE_REMAINDER !== 0) {
        if (VALUE_REMAINDER === 1) {
          toReturn += ` ${VALUE_REMAINDER} minutes`
        } else {
          toReturn += ` ${VALUE_REMAINDER} minutes`
        }
      }
    } else if (typeof value === 'string') {
      const REGEX_TMDB_RUNTIME = new RegExp(STRING_REGEX_TMDB_RUNTIME, `gi`)
      const REGEX_RESULTS = REGEX_TMDB_RUNTIME.exec(value)
      if (value !== 'N/A') {
        if (REGEX_RESULTS != null) {
          const runtimeHour = Math.floor(parseInt(value, 10) / 60)
          const integerValue = parseInt(value, 10)
          const valueRemainder = integerValue % 60
          if (runtimeHour === 1) {
            toReturn += `${runtimeHour} hour`
          } else if (runtimeHour >= 2) {
            toReturn += `${runtimeHour} hours`
          }
          if (valueRemainder !== 0) {
            if (valueRemainder === 1) {
              toReturn += ` ${valueRemainder} minutes`
            } else {
              toReturn += ` ${valueRemainder} minute`
            }
          }
        }
      }
    }

    return toReturn
  }
}

/**
 * Convert seconds to HH:MM:SS format
 * @param value seconds
 */
@Pipe({ name: 'toHHMMSS' })
export class HHMMSSPipe implements PipeTransform {
  constructor() { }
  transform(value: number): string {
    return GeneralUtil.convertToHHMMSS(value);
  }
}

/**
 * Converts genre code into its genre name equivalent.
 * @param genreCode genre code origin
 * @returns genre name
 */
@Pipe({ name: 'genre' })
export class GenrePipe implements PipeTransform {
  constructor() { }
  transform(genreCode: number): string {
    return GenreCodes[genreCode]
  }
}

@Pipe({ name: 'simplifySize' })
export class SimplifySizePipe implements PipeTransform {
  transform(value: number): string {
    console.log('topipe value: ', value)
    let output = '';
    if (value < 1000) {
      output = value.toFixed(2).toString() + 'bytes';
    } else if (value >= 1000 && value < 1000000) {
      value = value / 1000;
      output = value.toFixed(2).toString() + 'kB';
    } else if (value >= 1000000 && value < 1000000000) {
      value = value / 1000000;
      output = value.toFixed(2).toString() + 'MB';
    } else if (value >= 100000000) {
      value = value / 1000000000;
      output = value.toFixed(2).toString() + 'GB';
    }
    return output;
  }
}

// magnet:?xt=urn:btih:TORRENT_HASH&dn=Url+Encoded+Movie+Name&tr=http://track.one:1234/announce&tr=udp://track.two:80
// BE046ED20B048C4FB86E15838DD69DADB27C5E8A
// 13-2010
// &tr=http://track.one:1234/announce&tr=udp://track.two:80
// magnet:?xt=urn:btih:BE046ED20B048C4FB86E15838DD69DADB27C5E8A&dn=13-2010&tr=http://track.one:1234/announce&tr=udp://track.two:80
@Pipe({ name: 'magnet' })
export class MagnetPipe implements PipeTransform {
  transform(value: string): string {
    let output = '';
    // let output = 'magnet';
    // let client = '?xt=urn:btih';
    let hash = value;
    let fileName = '&dn=';
    output += hash;

    return output;
  }
}
