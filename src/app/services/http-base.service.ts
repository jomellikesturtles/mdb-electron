import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerService } from '@core/logger.service';
import GeneralUtil from '@utils/general.util';

@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {

  constructor(
    protected http: HttpClient,
    protected logger: LoggerService
  ) { }

  get(url: string, optionsOrOperation?: any, operation: string = 'GET'): Observable<any> {
    let options = {};
    let op = operation;
    if (typeof optionsOrOperation === 'string') {
      op = optionsOrOperation;
    } else if (optionsOrOperation) {
      options = optionsOrOperation;
    }

    return this.http.get<any>(url, options).pipe(
      tap(_ => this.logger.info(`GET url=${url}`)),
      catchError(this.handleError<any>(op))
    );
  }

  post(url: string, payload: any, operation = 'POST'): Observable<any> {
    return this.http.post<any>(url, payload).pipe(
      tap(_ => this.logger.info(`POST url=${url}`)),
      catchError(this.handleError<any>(operation))
    );
  }

  patch(url: string, payload: any, operation = 'PATCH'): Observable<any> {
    return this.http.patch<any>(url, payload).pipe(
      tap(_ => this.logger.info(`PATCH url=${url}`)),
      catchError(this.handleError<any>(operation))
    );
  }

  put(url: string, payload: any, operation = 'PUT'): Observable<any> {
    return this.http.put<any>(url, payload).pipe(
      tap(_ => this.logger.info(`PUT url=${url}`)),
      catchError(this.handleError<any>(operation))
    );
  }

  delete(url: string, payload: any, operation = 'DELETE'): Observable<any> {
    return this.http.delete<any>(url, payload).pipe(
      tap(_ => this.logger.info(`DELETE url=${url}`)),
      catchError(this.handleError<any>(operation))
    );
  }

  /**
   * Error handler.
   * @param operation the operation
   * @param result the result
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      GeneralUtil.DEBUG.error(error); // log to console instead
      this.logger.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
