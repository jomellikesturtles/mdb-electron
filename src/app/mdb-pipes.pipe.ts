import { Pipe, PipeTransform } from '@angular/core';

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
  transform(value: string): string {
    console.log(value.substr(value.lastIndexOf(' ') + 1));
    return value.substr(value.lastIndexOf(' ') + 1);
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
      const runtimeHour = parseInt((value / 60).toFixed(), 10)
      if (runtimeHour >= 1) {
        toReturn += `${runtimeHour} hours`
      }
      toReturn += ` ${value % 60} minutes`
    } else if (typeof value === 'string') {
      const tmdbRuntimeRegex = new RegExp(`([\\d,]+)(\\s)(min)`, `gi`);
      const regexResults = tmdbRuntimeRegex.exec(value)
      if (value !== 'N/A') {
        if (regexResults != null) {
          const runtimeHour = parseInt((parseInt(value, 10) / 60).toFixed(), 10)
          if (runtimeHour >= 1) {
            toReturn += `${runtimeHour} hours`
          }
          toReturn += ` ${parseInt(value, 10) % 60} minutes`
        }
      }
    }

    return toReturn
  }
}
