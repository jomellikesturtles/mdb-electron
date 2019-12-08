import { Pipe, PipeTransform } from '@angular/core';
import { REGEX_TMDB_RUNTIME } from './constants';
import { UtilsService } from './services/utils.service';

@Pipe({
  name: 'mdbPipes'
})
export class MdbPipesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}

/**
 * Gets the release year from string with format `00 Month 0000`.
 * @param value date string with format `00 Month 0000`
 * @returns year with `YYYY` format
 */
@Pipe({ name: 'releaseYear' })
export class ReleaseYearPipe implements PipeTransform {
  constructor(
    private utilsService: UtilsService) { }
  transform(value: string): string {
    return this.utilsService.getYear(value)
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
      const runtimeHour = Math.floor(value / 60)
      const valueRemainder = (value % 60)
      if (runtimeHour === 1) {
        toReturn += `${runtimeHour} hour`
      } else if (runtimeHour >= 2) {
        toReturn += `${runtimeHour} hours`
      }
      if (valueRemainder !== 0) {
        if (valueRemainder === 1) {
          toReturn += ` ${valueRemainder} minutes`
        } else {
          toReturn += ` ${valueRemainder} minutes`
        }
      }
    } else if (typeof value === 'string') {
      const regexResults = REGEX_TMDB_RUNTIME.exec(value)
      if (value !== 'N/A') {
        if (regexResults != null) {
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
