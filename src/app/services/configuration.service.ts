import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '@core/logger.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }
  getConfiguration(): Observable<any> {
    const BFF_URL = '';
    const url = `${BFF_URL}/config`;
    return this.http.get<any>(url).pipe(tap(_ => this.logger.info(`getConfiguration`)),
      catchError(this.handleError<any>('getConfiguration')));
  }

  /**
   * Error handler.
   * @param operation the operation
   * @param result result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logger.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
